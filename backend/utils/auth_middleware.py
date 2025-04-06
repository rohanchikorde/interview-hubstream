
from functools import wraps
from flask import request, jsonify
import jwt
import os

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({
                'status': 'error',
                'message': 'Token is missing'
            }), 401
        
        try:
            # Decode the token
            data = jwt.decode(token, os.getenv('FLASK_SECRET_KEY'), algorithms=['HS256'])
            current_user = {
                'id': data['user_id'],
                'email': data['email'],
                'role': data['role']
            }
            
        except jwt.ExpiredSignatureError:
            return jsonify({
                'status': 'error',
                'message': 'Token has expired'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'status': 'error',
                'message': 'Invalid token'
            }), 401
        
        # Pass the current user to the route
        return f(current_user, *args, **kwargs)
    
    return decorated
