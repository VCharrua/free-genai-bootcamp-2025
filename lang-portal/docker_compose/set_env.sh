#!/usr/bin/env bash

# Copyright (C) 2024 Intel Corporation
# SPDX-License-Identifier: Apache-2.0

export host_ip=$(hostname -I | awk '{print $1}')

# Network values
export NETW_PREFIX="10.20.0"
export LP_NETW_SUBNET=${NETW_PREFIX}.0/16
export LP_NETW_GATEWAY=${NETW_PREFIX}.1

export BACKEND_HOST_IP=${NETW_PREFIX}.2
export FRONTEND_HOST_IP=${NETW_PREFIX}.3

# API Configuration
export VITE_API_BASE_URL=http://localhost:5000