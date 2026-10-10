from datetime import date
from sqlalchemy import select
from datetime import datetime, timezone
from src.database.session import db_session
from src.api.models.hms.guest_model import Guest


guests_data = [
    {
        "first_name": "Rahul",
        "last_name": "Sharma",
        "gender": "male",
        "date_of_birth": date(1992, 5, 14),
        "email": "rahulsharma@example.com",
        "phone_number": "9876543210",
        "address": "MG Road",
        "city_id": 2715,
        "state_id": 22,
        "country_id": 101,
        "id_type": "aadhar",
        "id_number": "123412341234",
        "nationality_id": 42,
        "vip_status": False,
        "blacklist_status": False,
        "notes": "Regular guest",
        "is_active": True
    },
    {
        "first_name": "Priya",
        "last_name": "Verma",
        "gender": "female",
        "date_of_birth": date(1995, 8, 22),
        "email": "priya.verma@example.com",
        "phone_number": "9988776655",
        "address": "Thane East",
        "city_id": 2836,
        "state_id": 22,
        "country_id": 101,
        "id_type": "passport",
        "id_number": "P9876543",
        "nationality_id": 101,
        "vip_status": True,
        "blacklist_status": False,
        "notes": "VIP Guest",
        "is_active": True
    }
]


def seed_guest():
    try:
        for guest in guests_data:

            # Check if guest already exists by email
            stmt = select(Guest).filter_by(
                email=guest["email"],
                is_deleted=False
            )
            exists = db_session().execute(stmt).scalar_one_or_none()

            if not exists:
                new_guest = Guest(**guest, created_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
                db_session.add(new_guest)

        db_session.commit()
        print("--- Guest seeded successfully. ---")

    except Exception as e:
        db_session.rollback()
        print("!!! Error seeding guest:", str(e))

    finally:
        db_session.remove()


if __name__ == "__main__":
    seed_guest()