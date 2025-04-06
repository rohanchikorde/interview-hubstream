
from flask import Blueprint, request, jsonify
from utils.auth_middleware import token_required
from app import supabase

interview_bp = Blueprint('interviews', __name__)

@interview_bp.route('/', methods=['GET'])
@token_required
def get_interviews(current_user):
    try:
        # Handle query parameters
        status = request.args.get('status')
        interviewer_id = request.args.get('interviewer_id')
        
        # Start building the query
        query = supabase.table('interviews').select('*')
        
        # Apply filters if provided
        if status:
            query = query.eq('status', status)
        
        if interviewer_id:
            query = query.eq('interviewer_id', interviewer_id)
        
        # Execute the query
        response = query.execute()
        
        return jsonify({
            'status': 'success',
            'data': response.data
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@interview_bp.route('/<interview_id>', methods=['GET'])
@token_required
def get_interview(current_user, interview_id):
    try:
        response = supabase.table('interviews').select('*').eq('id', interview_id).execute()
        
        if not response.data or len(response.data) == 0:
            return jsonify({
                'status': 'error',
                'message': 'Interview not found'
            }), 404
        
        return jsonify({
            'status': 'success',
            'data': response.data[0]
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@interview_bp.route('/', methods=['POST'])
@token_required
def schedule_interview(current_user):
    try:
        data = request.json
        
        # Validate input
        required_fields = ['candidate_id', 'interviewer_id', 'requirement_id', 'scheduled_at']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Field {field} is required'
                }), 400
        
        # Set status to Scheduled by default
        data['status'] = data.get('status', 'Scheduled')
        
        # Insert into database
        response = supabase.table('interviews_schedule').insert(data).execute()
        
        return jsonify({
            'status': 'success',
            'message': 'Interview scheduled successfully',
            'data': response.data[0]
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@interview_bp.route('/<interview_id>/status', methods=['PUT'])
@token_required
def update_interview_status(current_user, interview_id):
    try:
        data = request.json
        
        if 'status' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Status is required'
            }), 400
        
        response = supabase.table('interviews_schedule').update({
            'status': data['status']
        }).eq('id', interview_id).execute()
        
        if not response.data or len(response.data) == 0:
            return jsonify({
                'status': 'error',
                'message': 'Interview not found or could not be updated'
            }), 404
        
        return jsonify({
            'status': 'success',
            'message': 'Interview status updated successfully',
            'data': response.data[0]
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@interview_bp.route('/<interview_id>/feedback', methods=['PUT'])
@token_required
def add_feedback(current_user, interview_id):
    try:
        data = request.json
        
        if 'feedback' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Feedback is required'
            }), 400
        
        update_data = {
            'feedback': data['feedback'], 
            'status': 'Completed'
        }
        
        response = supabase.table('interviews_schedule').update(update_data).eq('id', interview_id).execute()
        
        if not response.data or len(response.data) == 0:
            return jsonify({
                'status': 'error',
                'message': 'Interview not found or could not be updated'
            }), 404
        
        return jsonify({
            'status': 'success',
            'message': 'Feedback added successfully',
            'data': response.data[0]
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
