from marshmallow import fields, validate, validates_schema, ValidationError
from src.api.schemas.common.base import BaseSchema
from src.api.schemas.common.id_schema import id_schema_factory
from src.api.schemas.mixins.name_mixin import NameFieldsMixin

GetUserByIdSchema = id_schema_factory("id", "User Id")

UpsertUserIdSchema = id_schema_factory("id", "Role Id", min_value=0, required=True)
UpsertUserRoleIdSchema = id_schema_factory("role_id", "Role Id", min_value=1, required=True)

class UpsertUserSchema(UpsertUserIdSchema, NameFieldsMixin, UpsertUserRoleIdSchema):
    email = fields.Email(
        required=False,
        allow_none=True,
        error_messages={"invalid": "Invalid email address"}
    )
    password = fields.String(
        required=False,
        allow_none=True,
        validate=validate.Length(
            min=1,
            max=20,
            error="Password must be between 1 and 20 characters long"
        )
    )
    is_active = fields.Boolean(required=True)
    is_deleted = fields.Boolean(required=True)
    @validates_schema
    def validate_insert_update_rules(self, data, **kwargs):
        user_id = data.get("id", 0)

        # INSERT case
        if user_id == 0:
            if not data.get("email"):
                raise ValidationError(
                    {"email": ["Email is required for creating user"]}
                )
            if not data.get("password"):
                raise ValidationError(
                    {"password": ["Password is required for creating user"]}
                )

        # UPDATE case
        if user_id > 0:
            # Optional: prevent email change if your business rules require
            pass
