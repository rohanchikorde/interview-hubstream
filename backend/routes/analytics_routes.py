
from flask import Blueprint, request, jsonify
from app import supabase, logger
from utils.auth_middleware import token_required

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/', methods=['GET'])
@token_required
def get_analytics(current_user):
    try:
        # Filter analytics based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        if user_role == 'admin':
            # Admins can see all analytics
            response = supabase.table('analytics').select('*').execute()
        elif user_role == 'organization':
            # Organizations can see their own analytics
            org_response = supabase.table('organizations').select('id').eq('user_id', user_id).execute()
            if not org_response.data:
                return jsonify({"status": "error", "message": "Organization not found"}), 404
            
            org_id = org_response.data[0]['id']
            response = supabase.table('analytics').select('*').eq('organization_id', org_id).execute()
        else:
            # Other roles cannot access analytics
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        return jsonify({
            "status": "success",
            "data": response.data
        })
    
    except Exception as e:
        logger.error(f"Error in get_analytics: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@analytics_bp.route('/<organization_id>', methods=['GET'])
@token_required
def get_organization_analytics(current_user, organization_id):
    try:
        # Check authorization based on user role
        user_role = current_user['role']
        user_id = current_user['id']
        
        authorized = False
        if user_role == 'admin':
            authorized = True
        elif user_role == 'organization':
            org_response = supabase.table('organizations').select('id').eq('user_id', user_id).execute()
            if org_response.data and org_response.data[0]['id'] == organization_id:
                authorized = True
        
        if not authorized:
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        # Get analytics for the organization
        response = supabase.table('analytics').select('*').eq('organization_id', organization_id).execute()
        
        if not response.data:
            # If no analytics record exists, create one with default values
            default_analytics = {
                'organization_id': organization_id,
                'interview_trends': [],
                'interviewer_performance': [],
                'candidate_status': [],
                'metrics': {}
            }
            
            create_response = supabase.table('analytics').insert(default_analytics).execute()
            data = create_response.data[0] if create_response.data else default_analytics
        else:
            data = response.data[0]
        
        # Get additional information
        org_response = supabase.table('organizations').select('name').eq('id', organization_id).execute()
        org_name = org_response.data[0]['name'] if org_response.data else None
        
        # Count interviews
        interviews_response = supabase.table('interviews').select('id, status').eq('organization_id', organization_id).execute()
        interviews = interviews_response.data if interviews_response.data else []
        
        total_interviews = len(interviews)
        completed_interviews = sum(1 for interview in interviews if interview['status'] == 'completed')
        scheduled_interviews = sum(1 for interview in interviews if interview['status'] == 'scheduled')
        cancelled_interviews = sum(1 for interview in interviews if interview['status'] == 'cancelled')
        
        analytics_details = {
            **data,
            'organization_name': org_name,
            'stats': {
                'total_interviews': total_interviews,
                'completed_interviews': completed_interviews,
                'scheduled_interviews': scheduled_interviews,
                'cancelled_interviews': cancelled_interviews
            }
        }
        
        return jsonify({
            "status": "success",
            "data": analytics_details
        })
    
    except Exception as e:
        logger.error(f"Error in get_organization_analytics: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
