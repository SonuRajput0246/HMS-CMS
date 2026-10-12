import jwt
from functools import wraps
from sqlalchemy import select
from flask import request, current_app, g
from src.api.models.common.user_model import User
from src.api.models.common.token_model import Token
from src.database.session import db_session
from src.api.utils.errors import UnauthorizedError


def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        ## 1. Extract Token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise UnauthorizedError("Authorization token missing")

        token = auth_header.split(" ", 1)[1]

        try:
            ## 2. Decode Token
            payload = jwt.decode(
                token,
                current_app.config["JWT_SECRET_KEY"],
                algorithms=[current_app.config["JWT_ALGORITHM"]],
            )

            user_id = payload.get("user_id")
            if not user_id:
                raise UnauthorizedError("Invalid token payload")

            ## 3 Fetch User (SQLAlchemy 2.0 Syntax)
            stmt = select(User).filter_by(is_deleted=False, id=user_id)
            user = db_session.execute(stmt).scalar_one_or_none()
            if not user:
                raise UnauthorizedError("User not found or account deleted")

            if not user.is_active:
                raise UnauthorizedError("User account is deactivated")

            ## 3b. Enforce revocation.
            ##
            ## A decoded JWT used to be enough to get in, so
            ## AuthService.logout -- which sets Token.is_revoked on the user's
            ## live tokens -- had no effect: the same bearer token kept working
            ## until it expired by itself. Deactivating or deleting an account
            ## likewise left its issued tokens valid for the rest of their
            ## fifteen-minute life. The Token table and its ix_active_token
            ## (user_id, is_revoked) index existed for exactly this check, and
            ## nothing read them.
            ##
            ## Skipped for scoped tokens. The mfa_pending temp token minted at
            ## login is deliberately never persisted to `tokens`; the service
            ## checks it against /login/verify-totp, which is not jwt_required.
            ## Demanding a row for it would break MFA for no gain.
            if not payload.get("scope"):
                live = db_session.execute(
                    select(Token.id).filter(
                        Token.user_id == user_id,
                        Token.access_token == token,
                        Token.is_revoked == False,
                    ).limit(1)
                ).first()
                if live is None:
                    raise UnauthorizedError("Token has been revoked")

            ## 4. Store in Global context
            g.current_user = user

        except jwt.ExpiredSignatureError:
            raise UnauthorizedError("Token has expired")
        except jwt.InvalidTokenError:
            raise UnauthorizedError("Invalid token")
        except Exception as e:
            raise UnauthorizedError(f"Authorization failed: {str(e)}")

        return f(*args, **kwargs)

    return decorated
