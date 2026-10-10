from marshmallow import fields, validate
from src.api.schemas.common.base import BaseSchema
from src.api.schemas.common.id_schema import id_schema_factory
from src.api.schemas.fields.name import name_field

GetRoleByIdSchema = id_schema_factory("id", "Role Id")
UpsertRoleIdSchema = id_schema_factory("id", "Role Id", min_value=0, required=True)

class UpsertRoleSchema(UpsertRoleIdSchema):
    role_code = name_field("Role Code")
    role_name = name_field("Role Name")
    is_active = fields.Boolean(required=True)
    is_deleted = fields.Boolean(required=True)


## Define the schema for the items INSIDE the list first
class RoleModuleAccessItemSchema(BaseSchema):
    id = fields.Int(required=True)
    is_active = fields.Bool(required=True)
    module_id = fields.Int(required=True)
    operation_name = fields.Str(required=True)
    operation_display_name = fields.Str(required=True)


UpdateRoleAccessRoleIdSchema = id_schema_factory("role_id", "Role Id", min_value=1, required=True)

class UpdateRoleAccessSchema(UpdateRoleAccessRoleIdSchema):
    ## Use fields.List with fields.Nested to handle the array of objects
    role_module_access = fields.List(
        fields.Nested(RoleModuleAccessItemSchema),
        required=True
    )
