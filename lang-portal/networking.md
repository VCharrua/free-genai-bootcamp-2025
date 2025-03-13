# Network Configuration Guide

This document provides details about the network connection requirements and how to properly connect components in the GenAI Bootcamp project.

## Architecture Overview

The project consists of multiple containers communicating via a shared network:

- **Python Backend API** (Flask): Runs on port 5000
- **Node.js Frontend** (React/Vite): Runs on port 5173

## Container Communication

### Docker Compose Network Configuration

Our Docker Compose setup creates a shared network called `genai-network` that enables inter-container communication:

```yaml
networks:
  genai-network:
    name: genai-network
```

Each service is connected to this network:

```yaml
services:
  python-api:
    # other configuration...
    networks:
      - genai-network

  node-frontend:
    # other configuration...
    networks:
      - genai-network
```

### Configuration Requirements

#### Flask Backend Requirements

Ensure your Flask application binds to all interfaces, not just localhost:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ...your routes here...

if __name__ == "__main__":
    # Important: Use host='0.0.0.0' to bind to all interfaces
    app.run(host='0.0.0.0', port=5000, debug=True)
```

#### Frontend API Connection

When connecting from the frontend to the backend API:

```javascript
// Development environment (container-to-container)
const API_URL = 'http://python-api:5000';

// Example fetch call
async function fetchData() {
  try {
    const response = await fetch(`${API_URL}/api/endpoint`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

## Connection Examples

### Curl Examples

Testing the API from Node container:

```bash
# Basic GET request
curl http://python-api:5000/api/endpoint

# POST request with data
curl -X POST http://python-api:5000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

Testing the frontend from Python container:

```bash
curl http://node-frontend:5173
```

### Python Requests Example

```python
import requests

# Making requests to the Node.js frontend
response = requests.get('http://node-frontend:5173')
print(response.status_code)

# To access another Python service
response = requests.post(
    'http://another-service:port/endpoint',
    json={"key": "value"}
)
data = response.json()
```

### Node.js Axios Example

```javascript
import axios from 'axios';

// Configuration for API requests
const apiClient = axios.create({
  baseURL: 'http://python-api:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API call
async function getData() {
  try {
    const response = await apiClient.get('/api/data');
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**:
   - Verify the service is running
   - Check that the service is binding to `0.0.0.0` not just `127.0.0.1`
   - Confirm service names match Docker Compose configuration

2. **CORS Errors**:
   - Ensure CORS is properly configured on the Flask backend
   - Verify the frontend is using the correct URL

3. **Service Name Resolution**:
   - Use the exact service name from docker-compose.yml
   - Service name is case-sensitive

### Debugging Steps

1. **Check if services are running**:
   ```bash
   docker ps
   ```

2. **Verify network configuration**:
   ```bash
   docker network inspect genai-network
   ```

3. **Test network connectivity**:
   ```bash
   # From inside a container
   apt-get update && apt-get install -y iputils-ping
   ping python-api
   ```

4. **Check service logs for errors**:
   ```bash
   docker logs container_name
   ```