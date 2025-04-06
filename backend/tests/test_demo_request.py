
import unittest
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TestDemoRequest(unittest.TestCase):
  def setUp(self):
    self.api_url = os.getenv('API_URL', 'http://localhost:5000')
    self.demo_data = {
      "name": "Test User",
      "email": "test@example.com",
      "company_name": "Test Company",
      "message": "This is a test message",
      "additional_info": json.dumps({
        "phone": "1234567890",
        "job_title": "Test Manager",
        "team_size": "1-10",
        "hear_about": "Test"
      })
    }

  def test_create_demo_request(self):
    """Test creating a demo request."""
    response = requests.post(
      f"{self.api_url}/api/demo-requests",
      json=self.demo_data,
      headers={"Content-Type": "application/json"}
    )
    
    print(f"Status code: {response.status_code}")
    print(f"Response content: {response.content}")
    
    # Check if the request was successful
    self.assertEqual(response.status_code, 201)
    
    # Check if the response is valid JSON
    response_data = response.json()
    self.assertEqual(response_data["status"], "success")
    self.assertIn("data", response_data)

if __name__ == "__main__":
  unittest.main()
