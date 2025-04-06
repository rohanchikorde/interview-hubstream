
from flask import Blueprint, request, jsonify
import jwt
import bcrypt
import os
from datetime import datetime, timedelta
from supabase.client import ClientClass

from app import supabase

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
        
        # Check if required fields are present
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Field {field} is required'
                }), 400
        
        # Check if email already exists
        email = data['email'].lower()
        response = supabase.table('users').select('*').eq('email', email).execute()
        
        if response.data and len(response.data) > 0:
            return jsonify({
                'status': 'error',
                'message': 'Email already exists'
            }), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        user_data = {
            'name': data['name'],
            'email': email,
            'password_hash': password_hash,
            'role': data['role']
        }
        
        response = supabase.table('users').insert(user_data).execute()
        
        if not response.data or len(response.data) == 0:
            return jsonify({
                'status': 'error',
                'message': 'Error creating user'
            }), 500
        
        user = response.data[0]
        
        # Create record in role-specific table
        role = data['role']
        if role == 'admin':
            supabase.table('admins').insert({'user_id': user['id']}).execute()
        elif role == 'organization':
            org_data = {
                'user_id': user['id'],
                'name': data.get('organization_name', data['name'] + "'s Organization")
            }
            supabase.table('organizations').insert(org_data).execute()
        elif role == 'interviewer':
            interviewer_data = {'user_id': user['id']}
            supabase.table('interviewers').insert(interviewer_data).execute()
        elif role == 'interviewee':
            interviewee_data = {'user_id': user['id']}
            supabase.table('interviewees').insert(interviewee_data).execute()
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(days=1)
        }, os.getenv('FLASK_SECRET_KEY'), algorithm='HS256')
        
        return jsonify({
            'status': 'success',
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
        
        # Check if required fields are present
        if 'email' not in data or 'password' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Email and password are required'
            }), 400
        
        # Get user by email
        email = data['email'].lower()
        response = supabase.table('users').select('*').eq('email', email).execute()
        
        if not response.data or len(response.data) == 0:
            return jsonify({
                'status': 'error',
                'message': 'Invalid credentials'
            }), 401
        
        user = response.data[0]
        
        # Check password
        if not bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({
                'status': 'error',
                'message': 'Invalid credentials'
            }), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(days=1)
        }, os.getenv('FLASK_SECRET_KEY'), algorithm='HS256')
        
        return jsonify({
            'status': 'success',
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
