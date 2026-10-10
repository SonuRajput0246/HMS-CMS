from datetime import date
from marshmallow import fields, validate
from src.api.schemas.common.id_schema import id_schema_factory
from src.api.schemas.common.pagination_schema import PaginationSchema
from src.api.schemas.fields.text import text_field
from src.api.schemas.mixins.email_mixin import EmailFieldMixin
from src.api.schemas.mixins.name_mixin import NameFieldsMixin
from src.api.schemas.mixins.phone_mixin import PhoneNumberFieldMixin


class GetAllGuestsSchema(PaginationSchema):
    pass

GetGuestByIdSchema = id_schema_factory("id", "Guest Id")

UpsertGuestIdSchema = id_schema_factory("id","Guest Id", min_value=0)

class UpsertGuestSchema(UpsertGuestIdSchema, NameFieldsMixin, EmailFieldMixin, PhoneNumberFieldMixin):
    gender = fields.String(
        required=True,
        ## Allowed values are NOT listed here. They come from the `gender`
        ## enum definition (enum_seeder.py), validated in guest_service, so an
        ## admin adding an option does not also need a backend deploy. A
        ## hardcoded OneOf silently rejects the new option at this layer.
        validate=validate.Length(
            min=1, max=50, error="Gender is required"
        ),
        error_messages={
            "required": "Gender is required",
        }
    )
    date_of_birth = fields.Date(
        required=True,
        ## Validates that the date is between Year 1900 and Today
        validate=validate.Range(
            min=date(1900, 1, 1),
            max=date.today(),
            error="Date of birth cannot be in the future"
        ),
        error_messages={
            "required": "Date of Birth is required",
            "invalid": "Please provide a valid date format (YYYY-MM-DD)"
        }
    )
    address = text_field(
        max_len=255,
        min_len=0,
        regex=None,
        required=False,
        allow_none=True,
        label="Address"
    )
    city = text_field(
        max_len=100,
        min_len=0,
        regex=r"^[A-Za-z '-]+$",
        required=False,
        allow_none=True,
        label="City"
    )
    country = text_field(
        max_len=100,
        min_len=0,
        regex=r"^[A-Za-z '-]+$",
        required=False,
        allow_none=True,
        label="Country"
    )
    id_type = fields.String(
        required=True,
        ## Allowed values come from the `guests_id_type` enum definition
        ## (enum_seeder.py), validated in guest_service. This list used to be
        ## ["passport", "aadhar", "driving_license", "pancard"] while the seeder
        ## and the Angular form both used "pan_card", so selecting PAN Card was
        ## rejected by the API. Do not reintroduce a hardcoded list here.
        validate=validate.Length(
            min=1, max=50, error="Id type is required"
        ),
        error_messages={
            "required": "Id type is required",
        }
    )
    id_number = text_field(
        max_len=50,
        min_len=1,
        regex=r"^[A-Za-z0-9 '-]+$",
        required=True,
        allow_none=False,
        label="Id number"
    )
    nationality = text_field(
        max_len=2,
        min_len=2,
        regex=r"^[A-Za-z]+$",
        required=True,
        allow_none=False,
        label="Nationality"
    )
    vip_status = fields.Boolean(required=True)
    blacklist_status = fields.Boolean(required=True)
    notes = text_field(
        max_len=255,
        min_len=0,
        regex=None,
        required=False,
        allow_none=True,
        label="Notes"
    )
    is_active = fields.Boolean(required=True)
    is_deleted = fields.Boolean(required=True)