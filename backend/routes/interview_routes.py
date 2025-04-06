
from flask import Blueprint, request, jsonify
from app import supabase, logger
from utils.auth_middleware import token_required

interview_bp = Blueprint('interviews', __name__)

@interview_bp.route('/', methods=['GET'])
@token_required
def get_interviews(current_user):
    try:
        # Filter interviews based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        if user_role == 'admin':
            # Admins can see all interviews
            response = supabase.table('interviews').select('*').execute()
        elif user_role == 'organization':
            # Organizations can see their own interviews
            org_response = supabase.table('organizations').select('id').eq('user_id', user_id).execute()
            if not org_response.data:
                return jsonify({"status": "error", "message": "Organization not found"}), 404
            
            org_id = org_response.data[0]['id']
            response = supabase.table('interviews').select('*').eq('organization_id', org_id).execute()
        elif user_role == 'interviewer':
            # Interviewers can see interviews assigned to them
            interviewer_response = supabase.table('interviewers').select('id').eq('user_id', user_id).execute()
            if not interviewer_response.data:
                return jsonify({"status": "error", "message": "Interviewer not found"}), 404
            
            interviewer_id = interviewer_response.data[0]['id']
            response = supabase.table('interviews').select('*').eq('interviewer_id', interviewer_id).execute()
        elif user_role == 'interviewee':
            # Interviewees can see interviews where they are the candidate
            interviewee_response = supabase.table('interviewees').select('id').eq('user_id', user_id).execute()
            if not interviewee_response.data:
                return jsonify({"status": "error", "message": "Interviewee not found"}), 404
            
            interviewee_id = interviewee_response.data[0]['id']
            response = supabase.table('interviews').select('*').eq('interviewee_id', interviewee_id).execute()
        else:
            return jsonify({"status": "error", "message": "Invalid user role"}), 400
        
        return jsonify({
            "status": "success",
            "data": response.data
        })
    
    except Exception as e:
        logger.error(f"Error in get_interviews: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@interview_bp.route('/<interview_id>', methods=['GET'])
@token_required
def get_interview(current_user, interview_id):
    try:
        # Get the interview
        response = supabase.table('interviews').select('*').eq('id', interview_id).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Interview not found"}), 404
        
        interview = response.data[0]
        
        # Check authorization based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        authorized = False
        if user_role == 'admin':
            authorized = True
        elif user_role == 'organization':
            org_response = supabase.table('organizations').select('id').eq('user_id', user_id).execute()
            if org_response.data and org_response.data[0]['id'] == interview['organization_id']:
                authorized = True
        elif user_role == 'interviewer':
            interviewer_response = supabase.table('interviewers').select('id').eq('user_id', user_id).execute()
            if interviewer_response.data and interviewer_response.data[0]['id'] == interview['interviewer_id']:
                authorized = True
        elif user_role == 'interviewee':
            interviewee_response = supabase.table('interviewees').select('id').eq('user_id', user_id).execute()
            if interviewee_response.data and interviewee_response.data[0]['id'] == interview['interviewee_id']:
                authorized = True
        
        if not authorized:
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        # Get additional information
        organization_response = supabase.table('organizations').select('name').eq('id', interview['organization_id']).execute()
        organization_name = organization_response.data[0]['name'] if organization_response.data else None
        
        if interview['interviewer_id']:
            interviewer_info = None
            interviewer_response = supabase.table('interviewers').select('user_id').eq('id', interview['interviewer_id']).execute()
            if interviewer_response.data:
                user_response = supabase.table('users').select('name').eq('id', interviewer_response.data[0]['user_id']).execute()
                interviewer_info = user_response.data[0] if user_response.data else None
        else:
            interviewer_info = None
        
        # Get interviewee name
        interviewee_response = supabase.table('interviewees').select('user_id').eq('id', interview['interviewee_id']).execute()
        interviewee_info = None
        if interviewee_response.data:
            user_response = supabase.table('users').select('name').eq('id', interviewee_response.data[0]['user_id']).execute()
            interviewee_info = user_response.data[0] if user_response.data else None
        
        interview_details = {
            **interview,
            'organization_name': organization_name,
            'interviewer_name': interviewer_info['name'] if interviewer_info else None,
            'interviewee_name': interviewee_info['name'] if interviewee_info else None
        }
        
        return jsonify({
            "status": "success",
            "data": interview_details
        })
    
    except Exception as e:
        logger.error(f"Error in get_interview: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@interview_bp.route('/', methods=['POST'])
@token_required
def create_interview(current_user):
    try:
        # Only admins and organizations can create interviews
        if current_user['role'] != 'admin' and current_user['role'] != 'organization':
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['organization_id', 'interviewee_id', 'candidate_name', 'date_time']
        for field in required_fields:
            if field not in data:
                return jsonify({"status": "error", "message": f"Missing required field: {field}"}), 400
        
        # If organization user, ensure they only create for their organization
        if current_user['role'] == 'organization':
            org_response = supabase.table('organizations').select('id').eq('user_id', current_user['id']).execute()
            if not org_response.data or org_response.data[0]['id'] != data['organization_id']:
                return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        # Create interview
        response = supabase.table('interviews').insert(data).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Failed to create interview"}), 500
        
        # Update interviewee upcoming_interviews count
        supabase.table('interviewees').select('*').eq('id', data['interviewee_id']).execute().data[0]
        interviewee = supabase.table('interviewees').select('*').eq('id', data['interviewee_id']).execute().data[0]
        supabase.table('interviewees').update({'upcoming_interviews': interviewee['upcoming_interviews'] + 1}).eq('id', data['interviewee_id']).execute()
        
        # Update interviewer upcoming_interviews count if interviewer is assigned
        if 'interviewer_id' in data and data['interviewer_id']:
            interviewer = supabase.table('interviewers').select('*').eq('id', data['interviewer_id']).execute().data[0]
            supabase.table('interviewers').update({'upcoming_interviews': interviewer['upcoming_interviews'] + 1}).eq('id', data['interviewer_id']).execute()
        
        return jsonify({
            "status": "success",
            "message": "Interview created successfully",
            "data": response.data[0]
        }), 201
    
    except Exception as e:
        logger.error(f"Error in create_interview: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@interview_bp.route('/<interview_id>', methods=['PUT'])
@token_required
def update_interview(current_user, interview_id):
    try:
        # Get the interview
        interview_response = supabase.table('interviews').select('*').eq('id', interview_id).execute()
        
        if not interview_response.data:
            return jsonify({"status": "error", "message": "Interview not found"}), 404
        
        interview = interview_response.data[0]
        
        # Check authorization based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        authorized = False
        if user_role == 'admin':
            authorized = True
        elif user_role == 'organization':
            org_response = supabase.table('organizations').select('id').eq('user_id', user_id).execute()
            if org_response.data and org_response.data[0]['id'] == interview['organization_id']:
                authorized = True
        elif user_role == 'interviewer':
            interviewer_response = supabase.table('interviewers').select('id').eq('user_id', user_id).execute()
            if interviewer_response.data and interviewer_response.data[0]['id'] == interview['interviewer_id']:
                # Interviewers can only update the feedback and status
                authorized = True
                data = request.get_json()
                allowed_fields = ['feedback', 'status']
                data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if not authorized:
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        data = request.get_json()
        
        # Protect fields that shouldn't be updated
        if 'id' in data:
            del data['id']
        
        # Update interview
        response = supabase.table('interviews').update(data).eq('id', interview_id).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Failed to update interview"}), 500
        
        # If status is changed to 'completed', update interviewer and interviewee stats
        if 'status' in data and data['status'] == 'completed' and interview['status'] != 'completed':
            # Update interviewee stats
            interviewee = supabase.table('interviewees').select('*').eq('id', interview['interviewee_id']).execute().data[0]
            supabase.table('interviewees').update({
                'upcoming_interviews': max(0, interviewee['upcoming_interviews'] - 1),
                'completed_interviews': interviewee['completed_interviews'] + 1
            }).eq('id', interview['interviewee_id']).execute()
            
            # Update interviewer stats if interviewer was assigned
            if interview['interviewer_id']:
                interviewer = supabase.table('interviewers').select('*').eq('id', interview['interviewer_id']).execute().data[0]
                supabase.table('interviewers').update({
                    'upcoming_interviews': max(0, interviewer['upcoming_interviews'] - 1),
                    'total_interviews': interviewer['total_interviews'] + 1
                }).eq('id', interview['interviewer_id']).execute()
        
        return jsonify({
            "status": "success",
            "message": "Interview updated successfully",
            "data": response.data[0]
        })
    
    except Exception as e:
        logger.error(f"Error in update_interview: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
