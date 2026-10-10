from sqlalchemy import select
from src.api.extensions import bcrypt
from src.api.models.user_model import User
from src.api.models.role_model import Role
from src.database.session import db_session
from datetime import datetime, timezone

## Configuration
# ADMIN_EMAIL = "admin@hms.com"
ADMIN_EMAIL = "sonurajput8454@gmail.com"
ADMIN_PASSWORD = "123456"


def seed_super_admin():
    try:
        ## Get Super Admin role
        role_stmt = select(Role).filter_by(role_name="Super Admin", is_deleted=False)
        super_admin_role = db_session.execute(role_stmt).scalar_one_or_none()
        if not super_admin_role:
            print("!!! ERROR: 'Super Admin' role not found in database. Please run Role seeder first.")
            return

        ## Start seeding Super Admin
        user_stmt = select(User).filter_by(email="ADMIN_EMAIL", is_deleted=False)
        existing_admin = db_session.execute(user_stmt).scalar_one_or_none()

        if not existing_admin:
            ## Create Super Admin user
            hashed_password = bcrypt.generate_password_hash(ADMIN_PASSWORD, 12).decode("utf-8")
            super_user = User(
                first_name="Super",
                last_name="Admin",
                email=ADMIN_EMAIL,
                password=hashed_password,
                role_id=super_admin_role.id,
                is_email_verified=True,
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db_session.add(super_user)
            db_session.commit()
            print("--- Super Admin user created successfully. ---")
        else:
            print(f"Super Admin ({ADMIN_EMAIL}) already exists. Skipping...")
    except Exception as e:
        db_session.rollback()
        print(f"Error while seeding Super Admin: {str(e)}")
    finally:
        db_session.remove()


if __name__ == "__main__":
    seed_super_admin()
