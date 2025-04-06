
from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import datetime
import os
from app import supabase, logger

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({"status": "error", "message": f"Missing required field: {field}"}), 400
        
        email = data['email']
        password = data['password']
        name = data['name']
        role = data['role']
        
        # Check if user already exists
        response = supabase.table('users').select('*').eq('email', email).execute()
        if response.data:
            return jsonify({"status": "error", "message": "User with this email already exists"}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        user_data = {
            'email': email,
            'password_hash': hashed_password,
            'name': name,
            'role': role
        }
        
        response = supabase.table('users').insert(user_data).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Failed to create user"}), 500
        
        user_id = response.data[0]['id']
        
        # Create role-specific record
        if role == 'admin':
            supabase.table('admins').insert({'user_id': user_id}).execute()
        elif role == 'organization':
            org_name = data.get('organization_name', name + "'s Organization")
            supabase.table('organizations').insert({'user_id': user_id, 'name': org_name}).execute()
        elif role == 'interviewer':
            supabase.table('interviewers').insert({'user_id': user_id}).execute()
        elif role == 'interviewee':
            supabase.table('interviewees').insert({'user_id': user_id}).execute()
        
        return jsonify({"status": "success", "message": "User registered successfully"}), 201
    
    except Exception as e:
        logger.error(f"Error in register: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return jsonify({"status": "error", "message": "Email and password are required"}), 400
        
        email = data['email']
        password = data['password']
        
        # Get user from database
        response = supabase.table('users').select('*').eq('email', email).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401
        
        user = response.data[0]
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401
        
        # Create JWT token
        payload = {
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        
        token = jwt.encode(payload, os.getenv('FLASK_SECRET_KEY'), algorithm='HS256')
        
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user['id'],
                "email": user['email'],
                "name": user['name'],
                "role": user['role']
            }
        })
    
    except Exception as e:
        logger.error(f"Error in login: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"status": "error", "message": "No valid authorization token provided"}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, os.getenv('FLASK_SECRET_KEY'), algorithms=['HS256'])
            
            # Get user from database to ensure they still exist
            response = supabase.table('users').select('*').eq('id', payload['user_id']).execute()
            
            if not response.data:
                return jsonify({"status": "error", "message": "User not found"}), 401
            
            user = response.data[0]
            
            return jsonify({
                "status": "success",
                "user": {
                    "id": user['id'],
                    "email": user['email'],
                    "name": user['name'],
                    "role": user['role']
                }
            })
            
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "error", "message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"status": "error", "message": "Invalid token"}), 401
    
    except Exception as e:
        logger.error(f"Error in verify_token: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
