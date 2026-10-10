import time
from faker import Faker
from src.api.models import Role, User
from src.database.session import db_session


fake = Faker()


def seed_data():
    print("🚀 Starting bulk insert...")
    start_time = time.time()

    # 2. Ensure we have at least one Role (Foreign Key Requirement)
    role = db_session.query(Role).first()
    if not role:
        role = Role(name="User", description="Standard User")
        db_session.add(role)
        db_session.commit()
        print("✅ Created default Role ID:", role.id)

    role_id = role.id

    # 3. Configuration
    TOTAL_RECORDS = 100000
    BATCH_SIZE = 5000  # Insert 5k at a time to save memory
    users_buffer = []

    print(f"Genrating {TOTAL_RECORDS} users...")

    for i in range(TOTAL_RECORDS):
        # Generate fake data
        profile = fake.simple_profile()
        first_name = profile['name'].split(' ')[0]
        last_name = profile['name'].split(' ')[-1]

        # Create a dictionary (NOT a User object) for speed
        user_dict = {
            "role_id": role_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": f"{first_name}.{last_name}.{i}@example.com",  # Ensure uniqueness
            "password": "hashed_password_placeholder",  # Use a dummy hash
            "is_active": True,
            "is_deleted": False,
            "is_email_verified": True,
            "created_at": fake.date_time_this_year(),
            "updated_at": fake.date_time_this_year()
        }

        users_buffer.append(user_dict)

        # 4. Flush buffer when full
        if len(users_buffer) >= BATCH_SIZE:
            db_session.bulk_insert_mappings(User, users_buffer)
            db_session.commit()
            users_buffer = []  # Clear buffer
            print(f"✅ Inserted {i + 1} records...")

    # Insert remaining records
    if users_buffer:
        db_session.bulk_insert_mappings(User, users_buffer)
        db_session.commit()

    end_time = time.time()
    print(f"🎉 DONE! Inserted {TOTAL_RECORDS} users in {end_time - start_time:.2f} seconds.")


if __name__ == "__main__":
    seed_data()