from flask import jsonify
from marshmallow import ValidationError as MarshmallowError
from src.api.utils.errors import APIError
import logging

def register_error_handlers(app):
    @app.errorhandler(MarshmallowError)
    def handle_marshmallow_validation(err):
        """Catches Marshmallow validation errors globally"""
        ## err.message is a dict of fields and their error lists
        ## We take the first error message found
        first_error_field = next(iter(err.messages))
        first_error_message = err.messages[first_error_field][0]
        print("fem", first_error_message)
        return jsonify({
            "status": False,
            "message": first_error_message
        }), 400

    @app.errorhandler(APIError)
    def handle_api_error(error):
        """Catches all our custom errors"""
        response = {
            "status": False,
            "message": error.message
        }
        if error.payload:
            response["data"] = error.payload
        return jsonify(response), error.status_code

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        """Catches standard Python error (like ZeroDivisionError or Database down)"""
        ## Log the actual error for the developers
        logging.error(f"Unhandled Server Error: {str(error)}", exc_info=True)
        return jsonify({
            "status": False,
            "message": "An internal server error occured. Please try again later."
        }), 500