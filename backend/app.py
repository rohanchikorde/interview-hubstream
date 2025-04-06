
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import logging
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS to allow requests from any origin (for development)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Initialize Supabase client
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')

if not supabase_url or not supabase_key:
  logger.error("Supabase credentials not found in environment variables")
  raise ValueError("Please set SUPABASE_URL and SUPABASE_KEY environment variables")

supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/')
def home():
  return jsonify({"status": "success", "message": "HireVantage API is running"})

# Import routes after app initialization to avoid circular imports
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.interview_routes import interview_bp
from routes.mock_interview_routes import mock_interview_bp
from routes.analytics_routes import analytics_bp
from routes.notification_routes import notification_bp
from routes.demo_request_routes import demo_request_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(interview_bp, url_prefix='/api/interviews')
app.register_blueprint(mock_interview_bp, url_prefix='/api/mock-interviews')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')
app.register_blueprint(demo_request_bp, url_prefix='/api/demo-requests')

# Error handling
@app.errorhandler(404)
def not_found(e):
  return jsonify({"status": "error", "message": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(e):
  return jsonify({"status": "error", "message": "Internal server error"}), 500

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')
