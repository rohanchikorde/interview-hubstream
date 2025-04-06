
from flask import Blueprint, request, jsonify
from app import supabase, logger
from utils.auth_middleware import token_required

mock_interview_bp = Blueprint('mock_interviews', __name__)

@mock_interview_bp.route('/', methods=['GET'])
@token_required
def get_mock_interviews(current_user):
    try:
        # Filter mock interviews based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        if user_role == 'admin':
            # Admins can see all mock interviews
            response = supabase.table('mock_interviews').select('*').execute()
        elif user_role == 'interviewee':
            # Interviewees can see their own mock interviews
            interviewee_response = supabase.table('interviewees').select('id').eq('user_id', user_id).execute()
            if not interviewee_response.data:
                return jsonify({"status": "error", "message": "Interviewee not found"}), 404
            
            interviewee_id = interviewee_response.data[0]['id']
            response = supabase.table('mock_interviews').select('*').eq('interviewee_id', interviewee_id).execute()
        else:
            # Other roles cannot access mock interviews
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        return jsonify({
            "status": "success",
            "data": response.data
        })
    
    except Exception as e:
        logger.error(f"Error in get_mock_interviews: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@mock_interview_bp.route('/<mock_interview_id>', methods=['GET'])
@token_required
def get_mock_interview(current_user, mock_interview_id):
    try:
        # Get the mock interview
        response = supabase.table('mock_interviews').select('*').eq('id', mock_interview_id).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Mock interview not found"}), 404
        
        mock_interview = response.data[0]
        
        # Check authorization based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        authorized = False
        if user_role == 'admin':
            authorized = True
        elif user_role == 'interviewee':
            interviewee_response = supabase.table('interviewees').select('id').eq('user_id', user_id).execute()
            if interviewee_response.data and interviewee_response.data[0]['id'] == mock_interview['interviewee_id']:
                authorized = True
        
        if not authorized:
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        # Get interviewee name
        interviewee_response = supabase.table('interviewees').select('user_id').eq('id', mock_interview['interviewee_id']).execute()
        interviewee_info = None
        if interviewee_response.data:
            user_response = supabase.table('users').select('name').eq('id', interviewee_response.data[0]['user_id']).execute()
            interviewee_info = user_response.data[0] if user_response.data else None
        
        mock_interview_details = {
            **mock_interview,
            'interviewee_name': interviewee_info['name'] if interviewee_info else None
        }
        
        return jsonify({
            "status": "success",
            "data": mock_interview_details
        })
    
    except Exception as e:
        logger.error(f"Error in get_mock_interview: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@mock_interview_bp.route('/', methods=['POST'])
@token_required
def create_mock_interview(current_user):
    try:
        # Only interviewees can schedule mock interviews
        if current_user['role'] != 'interviewee' and current_user['role'] != 'admin':
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['interviewee_id', 'technology', 'duration', 'date_time']
        for field in required_fields:
            if field not in data:
                return jsonify({"status": "error", "message": f"Missing required field: {field}"}), 400
        
        # If interviewee user, ensure they only schedule for themselves
        if current_user['role'] == 'interviewee':
            interviewee_response = supabase.table('interviewees').select('id').eq('user_id', current_user['id']).execute()
            if not interviewee_response.data or interviewee_response.data[0]['id'] != data['interviewee_id']:
                return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        # Create mock interview
        response = supabase.table('mock_interviews').insert(data).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Failed to create mock interview"}), 500
        
        # Update interviewee scheduled_mock_interviews count
        interviewee = supabase.table('interviewees').select('*').eq('id', data['interviewee_id']).execute().data[0]
        supabase.table('interviewees').update({'scheduled_mock_interviews': interviewee['scheduled_mock_interviews'] + 1}).eq('id', data['interviewee_id']).execute()
        
        return jsonify({
            "status": "success",
            "message": "Mock interview created successfully",
            "data": response.data[0]
        }), 201
    
    except Exception as e:
        logger.error(f"Error in create_mock_interview: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@mock_interview_bp.route('/<mock_interview_id>', methods=['PUT'])
@token_required
def update_mock_interview(current_user, mock_interview_id):
    try:
        # Get the mock interview
        mock_interview_response = supabase.table('mock_interviews').select('*').eq('id', mock_interview_id).execute()
        
        if not mock_interview_response.data:
            return jsonify({"status": "error", "message": "Mock interview not found"}), 404
        
        mock_interview = mock_interview_response.data[0]
        
        # Check authorization based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        authorized = False
        if user_role == 'admin':
            authorized = True
        elif user_role == 'interviewee':
            interviewee_response = supabase.table('interviewees').select('id').eq('user_id', user_id).execute()
            if interviewee_response.data and interviewee_response.data[0]['id'] == mock_interview['interviewee_id']:
                authorized = True
        
        if not authorized:
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        data = request.get_json()
        
        # Protect fields that shouldn't be updated
        if 'id' in data:
            del data['id']
        if 'interviewee_id' in data:
            del data['interviewee_id']
        
        # Update mock interview
        response = supabase.table('mock_interviews').update(data).eq('id', mock_interview_id).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Failed to update mock interview"}), 500
        
        # Update interviewee stats if status is changed to 'completed'
        if 'status' in data and data['status'] == 'completed' and mock_interview['status'] != 'completed':
            interviewee = supabase.table('interviewees').select('*').eq('id', mock_interview['interviewee_id']).execute().data[0]
            supabase.table('interviewees').update({
                'scheduled_mock_interviews': max(0, interviewee['scheduled_mock_interviews'] - 1)
            }).eq('id', mock_interview['interviewee_id']).execute()
        
        return jsonify({
            "status": "success",
            "message": "Mock interview updated successfully",
            "data": response.data[0]
        })
    
    except Exception as e:
        logger.error(f"Error in update_mock_interview: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
