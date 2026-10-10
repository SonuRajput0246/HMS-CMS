from src.config import get_config

## Load the configuration based on the environment
config = get_config()

from src.database.seeders.additional_guest_seeder import seed_additional_guests
from src.database.seeders.amenity_seeder import seed_room_amenities
from src.database.seeders.currencies_seeder import seed_currencies
from src.database.seeders.enum_seeder import seed_enums
from src.database.seeders.prefixes_seeder import seed_prefixes
from src.database.seeders.reservation_sequence_seeder import seed_reservation_sequences
from src.database.seeders.countries_states_cities_seeder import seed_countries_states_cities
from src.database.seeders.guest_seeder import seed_guest
from src.database.seeders.inventory_category_seeder import seed_inventory_categories
from src.database.seeders.inventory_seeder import seed_inventories
from src.database.seeders.inventory_units_seeder import seed_inventory_units
from src.database.seeders.login_slider_seeder import seed_login_sliders
from src.database.seeders.module_seeder_hms import seed_modules_hms
from src.database.seeders.module_seeder_cms import seed_modules_cms
from src.database.seeders.reservation_additional_guest_seeder import seed_reservation_additional_guests
from src.database.seeders.reservation_primary_guest_seeder import seed_reservation_primary_guest
from src.database.seeders.reservation_seeder import seed_reservations
from src.database.seeders.role_seeder import seed_roles
from src.database.seeders.room_blocks_seeder import seed_room_blocks
from src.database.seeders.room_seeder import seed_rooms
from src.database.seeders.room_type_amenity_seeder import seed_room_type_amenities
from src.database.seeders.room_type_seeder import seed_room_types
from src.database.seeders.super_admin_seeder import seed_super_admin
from src.database.seeders.system_setting_seeder import seed_system_settings
from src.database.seeders.template_seeder import seed_templates


def run_base_seeders():
    instance_type = config.INSTANCE_TYPE
    print(f"Seeding for instance: {instance_type}")

    seed_login_sliders()
    seed_enums()
    if instance_type == "HMS":
        print(">>>>> Seeding for HMS")
        seed_modules_hms()
    elif instance_type == "CMS":
        print(">>>>> Seeding for CMS")
        seed_modules_cms()
    else:
        raise ValueError(f"Unknown instance type: {instance_type}")
    seed_templates()
    seed_roles()
    seed_super_admin()
    seed_inventory_units()
    seed_inventory_categories()
    seed_inventories()
    seed_room_amenities()
    seed_room_types()
    seed_room_type_amenities()
    seed_rooms()
    seed_room_blocks()      ## Contain Dummy Data
    seed_currencies("src/database/sql/currencies.sql")
    seed_countries_states_cities("src/database/sql/countries_states_cities.sql")
    seed_prefixes()
    seed_reservation_sequences()
    seed_reservations()    ## Contain Dummy Data
    seed_guest()
    seed_additional_guests()
    seed_reservation_primary_guest()
    seed_reservation_additional_guests()
    seed_system_settings()
    print("***** Base seeders executed successfully. *****")


if __name__ == "__main__":
    run_base_seeders()