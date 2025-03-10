#!/bin/bash

# Change to the directory containing this script
cd "$(dirname "$0")"

# Check if pytest-cov is installed
echo "Checking for pytest-cov..."
if ! python -c "import pytest_cov" 2>/dev/null; then
    echo "pytest-cov not found. Attempting to install..."
    pip install pytest-cov
    
    # Check if installation was successful
    if ! python -c "import pytest_cov" 2>/dev/null; then
        echo "Failed to install pytest-cov. Running tests without coverage reporting."
        python -m pytest tests/ -v
    else
        echo "pytest-cov installed successfully. Running tests with coverage reporting..."
        python -m pytest tests/ -v --cov=app/routes --cov-report=term-missing
    fi
else
    echo "pytest-cov found. Running tests with coverage reporting..."
    python -m pytest tests/ -v --cov=app/routes --cov-report=term-missing
fi

echo "Tests completed!"
