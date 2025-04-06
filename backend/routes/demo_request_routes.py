
from flask import Blueprint, request, jsonify
from app import supabase, logger
from utils.auth_middleware import token_required

demo_request_bp = Blueprint('demo_requests', __name__)

@demo_request_bp.route('/', methods=['GET'])
@token_required
def get_demo_requests(current_user):
  try:
    # Only admins can view all demo requests
    if current_user['role'] != 'admin':
      return jsonify({"status": "error", "message": "Unauthorized access"}), 403
    
    response = supabase.table('demo_requests').select('*').order('created_at', desc=True).execute()
    
    return jsonify({
      "status": "success",
      "data": response.data
    })
  
  except Exception as e:
    logger.error(f"Error in get_demo_requests: {str(e)}")
    return jsonify({"status": "error", "message": str(e)}), 500

@demo_request_bp.route('/', methods=['POST'])
def create_demo_request():
  try:
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email']
    for field in required_fields:
      if field not in data:
        return jsonify({"status": "error", "message": f"Missing required field: {field}"}), 400
    
    # Create demo request
    response = supabase.table('demo_requests').insert(data).execute()
    
    if not response.data:
      return jsonify({"status": "error", "message": "Failed to create demo request"}), 500
    
    # Create notification for admins
    admin_response = supabase.table('users').select('id').eq('role', 'admin').execute()
    for admin in admin_response.data:
      notification_data = {
        'user_id': admin['id'],
        'message': f"New demo request from {data['name']} ({data['email']})"
      }
      supabase.table('notifications').insert(notification_data).execute()
    
    return jsonify({
      "status": "success",
      "message": "Demo request submitted successfully",
      "data": response.data[0]
    }), 201
  
  except Exception as e:
    logger.error(f"Error in create_demo_request: {str(e)}")
    return jsonify({"status": "error", "message": str(e)}), 500

@demo_request_bp.route('/<demo_request_id>', methods=['PUT'])
@token_required
def update_demo_request(current_user, demo_request_id):
  try:
    # Only admins can update demo requests
    if current_user['role'] != 'admin':
      return jsonify({"status": "error", "message": "Unauthorized access"}), 403
    
    data = request.get_json()
    
    # Protect fields that shouldn't be updated
    if 'id' in data:
      del data['id']
    
    # Get the demo request
    demo_request_response = supabase.table('demo_requests').select('*').eq('id', demo_request_id).execute()
    
    if not demo_request_response.data:
      return jsonify({"status": "error", "message": "Demo request not found"}), 404
    
    demo_request = demo_request_response.data[0]
    
    # Update demo request
    response = supabase.table('demo_requests').update(data).eq('id', demo_request_id).execute()
    
    if not response.data:
      return jsonify({"status": "error", "message": "Failed to update demo request"}), 500
    
    # Create notification for the user if they have an account and status is updated
    if 'status' in data and demo_request['user_id']:
      status_message = {
        'approved': 'Your demo request has been approved.',
        'rejected': 'Your demo request has been rejected.',
        'pending': 'Your demo request status has been updated.'
      }
      
      notification_data = {
        'user_id': demo_request['user_id'],
        'message': status_message.get(data['status'], 'Your demo request status has been updated.')
      }
      
      supabase.table('notifications').insert(notification_data).execute()
    
    return jsonify({
      "status": "success",
      "message": "Demo request updated successfully",
      "data": response.data[0]
    })
  
  except Exception as e:
    logger.error(f"Error in update_demo_request: {str(e)}")
    return jsonify({"status": "error", "message": str(e)}), 500
