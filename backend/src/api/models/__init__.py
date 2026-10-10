### Importing all the Models
from .role_model import Role
from .user_model import User
from .token_model import Token
from .email_otp_model import EmailOTP
from .module_model import Module
from .inventory_category_model import InventoryCategory
from .inventory_model import Inventory
from .account_deletions_model import AccountDeletions
from .login_sliders_model import LoginSliders
from .inventory_units_model import InventoryUnits
from .room_type_model import RoomType
from .room_amenity_model import RoomAmenity
from .room_type_amenity_model import RoomTypeAmenity
from .room_model import Room
from .room_blocks_model import RoomBlocks
from .prefixes_model import Prefixes
from .reservation_sequence_model import ReservationSequence
from .reservation_model import Reservation
from .country_model import Country
from .state_model import State
from .city_model import City
from .guest_model import Guest
from .additional_guest_model import AdditionalGuest
from .reservation_primary_guest_model import ReservationPrimaryGuest
from .reservation_additional_guest_model import ReservationAdditionalGuest
# from .folio_model import Folio
# from .folio_charges_model import FolioCharge
# from .invoice_model import Invoice
# from .invoice_items_model import InvoiceItem
# from .services_model import Service
from .payment_model import Payment
# from .tax_config_model import TaxConfig
# from .refund_model import Refund
from .currency_model import Currency
from .system_setting_model import SystemSetting
# from .room_type_pricing_model import RoomTypePricing
from .template_model import Template
from .enum_definitions_model import EnumDefinition
from .enum_options_model import EnumOption
from .role_module_access_model import RoleModuleAccess

### CMS Models (Cafe Management System)
# NOTE: import order matters. Parents first so children's relationship()
# targets are already in the registry.
from .table_zone_model import TableZone
from .table_model import Table
from .customer_model import Customer
from .recipe_category_model import RecipeCategory
from .recipe_model import Recipe
from .recipe_ingredient_model import RecipeIngredient
from .document_sequence_model import DocumentSequence
from .cms.order_model import (
    CMSOrder,
    CMSOrderItem,
    CMSPayment,
    OrderStatusEnum,
    OrderTypeEnum,
    PaymentStatusEnum,
    PaymentMethodEnum,
)

### Attach the CMS timestamp / soft-delete listeners.
#
# Imported here, at the very bottom, so that ANY entry point which touches the
# models -- app.py, an alembic env, a seeder, a management command, a test --
# gets them. Registering them only from app.py made created_at a NOT NULL
# violation waiting for the first non-Flask caller.
#
# The bottom placement is what keeps this acyclic: cms_events imports the model
# modules directly, and by this line they are all fully resolved.
#
# event.listen dedupes on (target, identifier, fn), so app.py also importing
# this module is harmless.
from src.api.events import cms_events  # noqa: E402,F401  (imported for side effect)