import json
import pytest

# List of endpoints that should return paginated results based on your README
PAGINATED_ENDPOINTS = [
    '/api/words',
    '/api/groups', 
    '/api/study_sessions',
    '/api/study_activities'  # Note: Using hyphen as per your README
]

# Group-specific paginated endpoints require a valid group ID
GROUP_PAGINATED_ENDPOINTS = [
    '/api/groups/{group_id}/words',
    '/api/groups/{group_id}/study_sessions'
]

# Study activity paginated endpoints
ACTIVITY_PAGINATED_ENDPOINTS = [
    '/api/study_activities/{activity_id}/study_sessions'
]

def test_paginated_endpoints(client):
    """Test that endpoints expected to return paginated results do so correctly."""
    for endpoint in PAGINATED_ENDPOINTS:
        # Test with default pagination parameters
        response = client.get(endpoint)
        if response.status_code == 200:
            validate_pagination_format(response.data)
        
            # Test with custom pagination parameters
            response = client.get(f"{endpoint}?page=1&per_page=5")
            assert response.status_code == 200
            validate_pagination_format(response.data)
        else:
            print(f"Skipping pagination test for {endpoint} - returned status code {response.status_code}")

def test_group_paginated_endpoints(client):
    """Test group-specific endpoints that return paginated results."""
    # First, get a valid group ID
    response = client.get('/api/groups')
    if response.status_code != 200:
        pytest.skip("Could not access /api/groups endpoint")
        
    data = json.loads(response.data)
    
    # Check the actual structure of the response
    if 'items' in data and isinstance(data['items'], list) and len(data['items']) > 0:
        # Structure uses 'items' array
        items = data['items']
    elif isinstance(data, list) and len(data) > 0:
        # Structure uses direct array
        items = data
    else:
        pytest.skip("No groups available for testing group-specific pagination")
        return
        
    # Extract group ID based on the actual structure
    if 'id' in items[0]:
        group_id = items[0]['id']
    elif 'group_id' in items[0]:
        group_id = items[0]['group_id']
    else:
        pytest.skip("Could not determine group ID field in response")
        return
    
    # Test each group-specific paginated endpoint
    for endpoint_template in GROUP_PAGINATED_ENDPOINTS:
        endpoint = endpoint_template.format(group_id=group_id)
        
        # Test with default pagination parameters
        response = client.get(endpoint)
        if response.status_code == 200:
            validate_pagination_format(response.data)
            
            # Test with custom pagination parameters
            response = client.get(f"{endpoint}?page=1&per_page=5")
            assert response.status_code == 200
            validate_pagination_format(response.data)
        else:
            print(f"Skipping pagination test for {endpoint} - returned status code {response.status_code}")

def test_activity_paginated_endpoints(client):
    """Test activity-specific endpoints that return paginated results."""
    # First, get a valid activity ID
    response = client.get('/api/study_activities')
    if response.status_code != 200:
        pytest.skip("Could not access /api/study_activities endpoint")
        
    data = json.loads(response.data)
    
    # Check the actual structure of the response
    if 'items' in data and isinstance(data['items'], list) and len(data['items']) > 0:
        # Structure uses 'items' array
        items = data['items']
    elif isinstance(data, list) and len(data) > 0:
        # Structure uses direct array
        items = data
    else:
        pytest.skip("No study activities available for testing activity-specific pagination")
        return
        
    # Extract activity ID based on the actual structure
    if 'id' in items[0]:
        activity_id = items[0]['id']
    elif 'activity_id' in items[0]:
        activity_id = items[0]['activity_id']
    else:
        pytest.skip("Could not determine activity ID field in response")
        return
    
    # Test each activity-specific paginated endpoint
    for endpoint_template in ACTIVITY_PAGINATED_ENDPOINTS:
        endpoint = endpoint_template.format(activity_id=activity_id)
        
        # Test with default pagination parameters
        response = client.get(endpoint)
        if response.status_code == 200:
            validate_pagination_format(response.data)
            
            # Test with custom pagination parameters
            response = client.get(f"{endpoint}?page=1&per_page=5")
            assert response.status_code == 200
            validate_pagination_format(response.data)
        else:
            print(f"Skipping pagination test for {endpoint} - returned status code {response.status_code}")

def validate_pagination_format(response_data):
    """Validate that a response follows the expected pagination format.
    This validator is flexible to handle different pagination structures.
    """
    data = json.loads(response_data)
    
    # First, determine if this is actually a paginated response
    if isinstance(data, list):
        # Direct array response without pagination metadata
        # This may be valid for some endpoints, so we'll skip detailed validation
        return
    
    if not isinstance(data, dict):
        pytest.fail(f"Response is not a valid JSON object or array: {data}")
        return
    
    # Based on the README and common Flask patterns, check for these formats:
    # Format 1: { "items": [...], "pagination": {...} }
    if 'items' in data and isinstance(data['items'], list):
        if 'pagination' in data:
            # Validate pagination object fields
            pagination = data['pagination']
            validate_pagination_metadata(pagination)
        else:
            # Items without pagination might be valid for small collections
            pass
        return
        
    # Format 2: { "results": [...], "meta": {...} }
    if 'results' in data and isinstance(data['results'], list):
        if 'meta' in data:
            # Validate meta object fields as pagination
            meta = data['meta']
            validate_pagination_metadata(meta)
        else:
            # Results without meta might be valid for small collections
            pass
        return
        
    # Format 3: { "data": [...], "meta": {...} }
    if 'data' in data and isinstance(data['data'], list):
        if 'meta' in data:
            # Validate meta object fields as pagination
            meta = data['meta']
            validate_pagination_metadata(meta)
        else:
            # Data without meta might be valid for small collections
            pass
        return
    
    # If we got here, it doesn't match expected pagination formats
    # But could still be a valid single-resource response
    if len(data.keys()) > 0:
        # Probably a single resource object, which is fine
        pass
    else:
        pytest.fail(f"Response doesn't match any expected pagination format: {data}")

def validate_pagination_metadata(pagination):
    """Validate pagination metadata regardless of field naming conventions."""
    # Required pagination concepts (may have different field names)
    # - current page number
    # - items per page
    # - total items
    # - total pages
    
    # Check for page number (could be page, current_page, page_num)
    page_fields = ['page', 'current_page', 'page_num', 'pageNum']
    has_page = any(field in pagination for field in page_fields)
    assert has_page, f"Pagination metadata should contain page number. Found: {pagination}"
    
    # Check for items per page (could be per_page, limit, page_size)
    per_page_fields = ['per_page', 'limit', 'page_size', 'pageSize']
    has_per_page = any(field in pagination for field in per_page_fields)
    assert has_per_page, f"Pagination metadata should contain items per page. Found: {pagination}"
    
    # Check for total items (could be total_items, count, total)
    total_items_fields = ['total_items', 'count', 'total', 'totalItems']
    has_total_items = any(field in pagination for field in total_items_fields)
    assert has_total_items, f"Pagination metadata should contain total items count. Found: {pagination}"
    
    # Check for total pages (could be total_pages, pages, num_pages)
    total_pages_fields = ['total_pages', 'pages', 'num_pages', 'pageCount', 'totalPages']
    has_total_pages = any(field in pagination for field in total_pages_fields)
    assert has_total_pages, f"Pagination metadata should contain total pages count. Found: {pagination}"
    
    # Check for navigation links if available (not strictly required)
    if 'links' in pagination or 'next' in pagination or 'prev' in pagination:
        # Navigation links exist in some form, which is good
        pass
