from sqlalchemy import text
from src.database.session import db_session


def seed_currencies(file_path):
    statement = ""

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            for line in file:
                line = line.strip()

                # Skip empty lines and comments
                if not line or line.startswith("--"):
                    continue

                statement += line + " "

                # Execute when statement ends with ;
                if line.endswith(";"):
                    db_session.execute(text(statement))
                    statement = ""

        db_session.commit()
        print("--- Currencies seeded successfully! ---")

    except Exception as e:
        db_session.rollback()
        print("Error while seeding:", e)




if __name__ == "__main__":
    seed_currencies("src/database/sql/currencies.sql")