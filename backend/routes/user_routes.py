
from flask import Blueprint, request, jsonify
from app import supabase, logger
from utils.auth_middleware import token_required

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
@token_required
def get_users(current_user):
    try:
        # Only admins can get all users
        if current_user['role'] != 'admin':
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        response = supabase.table('users').select('*').execute()
        
        return jsonify({
            "status": "success",
            "data": response.data
        })
    
    except Exception as e:
        logger.error(f"Error in get_users: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@user_bp.route('/<user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    try:
        # Users can only view their own profile unless they are an admin
        if current_user['id'] != user_id and current_user['role'] != 'admin':
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        response = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        user = response.data[0]
        
        # Get role-specific data
        role_data = None
        if user['role'] == 'admin':
            role_response = supabase.table('admins').select('*').eq('user_id', user_id).execute()
            if role_response.data:
                role_data = role_response.data[0]
        elif user['role'] == 'organization':
            role_response = supabase.table('organizations').select('*').eq('user_id', user_id).execute()
            if role_response.data:
                role_data = role_response.data[0]
        elif user['role'] == 'interviewer':
            role_response = supabase.table('interviewers').select('*').eq('user_id', user_id).execute()
            if role_response.data:
                role_data = role_response.data[0]
        elif user['role'] == 'interviewee':
            role_response = supabase.table('interviewees').select('*').eq('user_id', user_id).execute()
            if role_response.data:
                role_data = role_response.data[0]
        
        # Remove password hash from response
        del user['password_hash']
        
        return jsonify({
            "status": "success",
            "data": {
                "user": user,
                "role_data": role_data
            }
        })
    
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@user_bp.route('/<user_id>', methods=['PUT'])
@token_required
def update_user(current_user, user_id):
    try:
        # Users can only update their own profile unless they are an admin
        if current_user['id'] != user_id and current_user['role'] != 'admin':
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        data = request.get_json()
        
        # Remove fields that shouldn't be updated
        if 'id' in data:
            del data['id']
        if 'email' in data:
            del data['email']
        if 'role' in data:
            del data['role']
        if 'password_hash' in data:
            del data['password_hash']
        
        # Update user
        response = supabase.table('users').update(data).eq('id', user_id).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        return jsonify({
            "status": "success",
            "message": "User updated successfully",
            "data": response.data[0]
        })
    
    except Exception as e:
        logger.error(f"Error in update_user: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
