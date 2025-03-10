import json
import pytest

def test_health_endpoint(client):
    """Test the health check endpoint returns 200 OK."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'status' in data
    assert data['status'] == 'ok'

def test_api_error_handling(client):
    """Test that invalid requests produce appropriate error responses."""
    # Test invalid JSON payload - using study_sessions endpoint which accepts POST
    response = client.post(
        '/api/study_sessions',
        data="invalid json",
        content_type='application/json'
    )
    assert response.status_code == 400
    
    # Test accessing non-existent resource
    response = client.get('/api/words/999999')
    assert response.status_code == 404
    
    # Test invalid method
    response = client.delete('/api/words')  # Words endpoint only supports GET
    assert response.status_code == 405

def test_api_response_headers(client):
    """Test that API responses include appropriate headers."""
    # Use an endpoint that actually exists
    response = client.get('/api/words')
    assert 'Content-Type' in response.headers
    assert 'application/json' in response.headers['Content-Type']
    
    # Check CORS headers if implemented
    if 'Access-Control-Allow-Origin' in response.headers:
        assert response.headers['Access-Control-Allow-Origin']
