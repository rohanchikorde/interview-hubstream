
from flask import Blueprint, request, jsonify
from app import supabase, logger
from utils.auth_middleware import token_required

notification_bp = Blueprint('notifications', __name__)

@notification_bp.route('/', methods=['GET'])
@token_required
def get_notifications(current_user):
    try:
        user_id = current_user['id']
        
        # Get notifications for the user
        response = supabase.table('notifications').select('*').eq('user_id', user_id).order('date', desc=True).execute()
        
        return jsonify({
            "status": "success",
            "data": response.data
        })
    
    except Exception as e:
        logger.error(f"Error in get_notifications: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@notification_bp.route('/', methods=['POST'])
@token_required
def create_notification(current_user):
    try:
        # Only admins and organizations can create notifications (except for themselves)
        if current_user['role'] != 'admin' and current_user['role'] != 'organization':
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({"status": "error", "message": f"Missing required field: {field}"}), 400
        
        # Create notification
        response = supabase.table('notifications').insert(data).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Failed to create notification"}), 500
        
        return jsonify({
            "status": "success",
            "message": "Notification created successfully",
            "data": response.data[0]
        }), 201
    
    except Exception as e:
        logger.error(f"Error in create_notification: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@notification_bp.route('/<notification_id>', methods=['PUT'])
@token_required
def update_notification(current_user, notification_id):
    try:
        user_id = current_user['id']
        
        # Get the notification
        notification_response = supabase.table('notifications').select('*').eq('id', notification_id).execute()
        
        if not notification_response.data:
            return jsonify({"status": "error", "message": "Notification not found"}), 404
        
        notification = notification_response.data[0]
        
        # Check if the notification belongs to the user
        if notification['user_id'] != user_id and current_user['role'] != 'admin':
            return jsonify({"status": "error", "message": "Unauthorized access"}), 403
        
        data = request.get_json()
        
        # Protect fields that shouldn't be updated
        if 'id' in data:
            del data['id']
        if 'user_id' in data:
            del data['user_id']
        if 'date' in data:
            del data['date']
        
        # Update notification
        response = supabase.table('notifications').update(data).eq('id', notification_id).execute()
        
        if not response.data:
            return jsonify({"status": "error", "message": "Failed to update notification"}), 500
        
        return jsonify({
            "status": "success",
            "message": "Notification updated successfully",
            "data": response.data[0]
        })
    
    except Exception as e:
        logger.error(f"Error in update_notification: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@notification_bp.route('/read-all', methods=['PUT'])
@token_required
def mark_all_as_read(current_user):
    try:
        user_id = current_user['id']
        
        # Mark all notifications as read
        response = supabase.table('notifications').update({'status': 'read'}).eq('user_id', user_id).eq('status', 'unread').execute()
        
        return jsonify({
            "status": "success",
            "message": "All notifications marked as read",
            "count": len(response.data) if response.data else 0
        })
    
    except Exception as e:
        logger.error(f"Error in mark_all_as_read: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
