from flask import Blueprint, request, jsonify

from src.api.middlewares.auth_middleware import jwt_required
from src.api.services.payment_service import PaymentService
from src.database.session import db_session

payment_bp = Blueprint('payment', __name__)

class PaymentRoute:
    def __init__(self, payment_service):
        self.payment_service = payment_service

    # def insert_advance_payment_details(self):
    #     payload = request.get_json() or {}
    #     result, status_code = self.payment_service.insert_payment_details(payload)
    #     return jsonify(result), status_code



payment_service_instance = PaymentService(db=db_session)
payment_route = PaymentRoute(payment_service=payment_service_instance)
# payment_bp.add_url_rule('/insert-details', view_func=jwt_required(payment_route.insert_advance_payment_details), methods=['POST'])