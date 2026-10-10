import jwt
from functools import wraps
from sqlalchemy import select
from flask import request, current_app, g
from src.api.models.common.user_model import User
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
