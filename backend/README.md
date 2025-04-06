
# HireVantage Backend

This is the backend service for the HireVantage application, built with Python Flask and Supabase.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following environment variables:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     FLASK_SECRET_KEY=your_secret_key
     ```
4. Run the application:
   ```
   python app.py
   ```

## API Documentation

The HireVantage API provides the following endpoints:

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/verify` - Verify a user's token

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/<user_id>` - Get a specific user
- `PUT /api/users/<user_id>` - Update a user

### Interviews

- `GET /api/interviews` - Get interviews
- `GET /api/interviews/<interview_id>` - Get a specific interview
- `POST /api/interviews` - Create a new interview
- `PUT /api/interviews/<interview_id>` - Update an interview

### Mock Interviews

- `GET /api/mock-interviews` - Get mock interviews
- `GET /api/mock-interviews/<mock_interview_id>` - Get a specific mock interview
- `POST /api/mock-interviews` - Create a new mock interview
- `PUT /api/mock-interviews/<mock_interview_id>` - Update a mock interview

### Analytics

- `GET /api/analytics` - Get analytics
- `GET /api/analytics/<organization_id>` - Get analytics for a specific organization

### Notifications

- `GET /api/notifications` - Get notifications for the current user
- `POST /api/notifications` - Create a new notification
- `PUT /api/notifications/<notification_id>` - Update a notification
- `PUT /api/notifications/read-all` - Mark all notifications as read

### Demo Requests

- `GET /api/demo-requests` - Get all demo requests (admin only)
- `POST /api/demo-requests` - Create a new demo request
- `PUT /api/demo-requests/<demo_request_id>` - Update a demo request (admin only)

## Docker

You can also run the application using Docker:

```
docker build -t hirevantage-backend .
docker run -p 8000:8000 -e SUPABASE_URL=your_supabase_url -e SUPABASE_KEY=your_supabase_key -e FLASK_SECRET_KEY=your_secret_key hirevantage-backend
```
