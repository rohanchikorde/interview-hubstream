
# HireVantage Backend

This directory contains the Flask backend for the HireVantage application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in a `.env` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Running the Application

```bash
python app.py
```

The API will be available at http://localhost:5000

## Testing

Run the tests with:

```bash
python -m unittest discover tests
```

To test the demo request endpoint specifically:

```bash
python tests/test_demo_request.py
```

## API Endpoints

### Demo Requests

- `GET /api/demo-requests` - Get all demo requests (admin only)
- `POST /api/demo-requests` - Create a new demo request
- `PUT /api/demo-requests/:id` - Update a demo request (admin only)

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a user by ID
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### For full API documentation, see the API Reference

