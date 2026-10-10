from sqlalchemy import select
from src.database.session import db_session
from src.api.models.common.inventory_model import Inventory
from src.api.models.common.inventory_category_model import InventoryCategory
from datetime import datetime, timezone


inventory_items = [
    ## Food
    {"name": "Rice", "category": "Food", "quantity": 100, "unit": "kg"},
    {"name": "Cooking Oil", "category": "Food", "quantity": 50, "unit": "ltr"},
    {"name": "Sugar", "category": "Food", "quantity": 40, "unit": "kg"},

    ## Beverage
    {"name": "Mineral Water Bottle", "category": "Beverage", "quantity": 200, "unit": "pcs"},
    {"name": "Soft Drinks", "category": "Beverage", "quantity": 120, "unit": "pcs"},

    ## Housekeeping
    {"name": "Soap", "category": "Housekeeping", "quantity": 300, "unit": "pcs"},
    {"name": "Shampoo Sachet", "category": "Housekeeping", "quantity": 250, "unit": "pcs"},
    {"name": "Towels", "category": "Housekeeping", "quantity": 150, "unit": "pcs"},

    ## Maintenance
    {"name": "Light Bulbs", "category": "Maintenance", "quantity": 60, "unit": "pcs"},
    {"name": "Cleaning Chemicals", "category": "Maintenance", "quantity": 25, "unit": "ltr"},

    ## Laundry
    {"name": "Detergent Powder", "category": "Laundry", "quantity": 80, "unit": "kg"},
    {"name": "Fabric Softener", "category": "Laundry", "quantity": 30, "unit": "ltr"}
]

def seed_inventories():
    try:
        ## 1. Fetch all active categories into a loopup directory { "Food": 1, "Beverage": 2 }
        cat_stmt = select(InventoryCategory).filter_by(is_deleted=False)
        category_records = db_session.execute(cat_stmt).scalars().all()

        category_map = {c.name: c.id for c in category_records}

        for item in inventory_items:
            category_id = category_map.get(item["category"])

            if not category_id:
                print(f"Skipping {item['name']}: Category {item['category']} not found.")
                continue

            ## 2. Check if the item already exists using SQLAlchemy 2.0 select
            exists_stmt = select(Inventory).filter_by(
                name=item["name"],
                category_id=category_id,
                is_deleted=False
            )
            exists = db_session.execute(exists_stmt).scalar_one_or_none()

            if not exists:
                ## BaseModel handles created_at and is_deleted automatically
                new_item = Inventory(
                    name=item["name"],
                    category_id=category_id,
                    quantity=item["quantity"],
                    unit=item["unit"],
                    is_active=True,
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc)
                )
                db_session.add(new_item)

        db_session.commit()
        print("--- Inventory items seeded successfully. ---")

    except Exception as e:
        db_session.rollback()
        print(f"!!! Error seeding inventory: {str(e)}")

    finally:
        db_session.remove()


if __name__ == "__main__":
    seed_inventories()
