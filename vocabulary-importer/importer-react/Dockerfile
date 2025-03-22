# Copyright (C) 2024 Intel Corporation
# SPDX-License-Identifier: Apache-2.0

# Use Node.js 22.12.0 as the base image
FROM node:22.14.0-bookworm

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port for the development server
# Default port for Next.js is 3001, but can be configured
EXPOSE 3001

# Run the development server
# The 0.0.0.0 host allows connections from outside the container
CMD ["npm", "run", "dev"]