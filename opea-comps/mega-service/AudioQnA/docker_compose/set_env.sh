#!/usr/bin/env bash

# Copyright (C) 2024 Intel Corporation
# SPDX-License-Identifier: Apache-2.0

pushd "../../" > /dev/null
source .set_env.sh
popd > /dev/null

# export host_ip=<your External Public IP>
export host_ip=$(hostname -I | awk '{print $1}')

# export NETW_NAME="opea_lang_network"
# export NETW_PREFIX="10.5.0"
# export OPEA_NETW_SUBNET=${NETW_PREFIX}.0/16
# export OPEA_NETW_GATEWAY=${NETW_PREFIX}.1
# export LLM_HOST_IP=${NETW_PREFIX}.2
# export LLM_SERVICE_HOST_IP=${NETW_PREFIX}.3
# export MEGA_SERVICE_HOST_IP=${NETW_PREFIX}.4
# export FRONTEND_SERVICE_IP=${NETW_PREFIX}.5
# export FRONTEND_NGINX_IP=${NETW_PREFIX}.6
# export BACKEND_SERVICE_IP=${MEGA_SERVICE_HOST_IP}

export HUGGINGFACEHUB_API_TOKEN=${HUGGINGFACEHUB_API_TOKEN}
# <token>

export LLM_MODEL_ID="meta-llama/Meta-Llama-3-8B-Instruct"

export MEGA_SERVICE_HOST_IP=${host_ip}
export WHISPER_SERVER_HOST_IP=${host_ip}
export SPEECHT5_SERVER_HOST_IP=${host_ip}
export LLM_SERVER_HOST_IP=${host_ip}

export WHISPER_SERVER_PORT=7066
export SPEECHT5_SERVER_PORT=7055
export LLM_SERVER_PORT=3006
export LLM_ENDPOINT_PORT=${LLM_SERVER_PORT}

export BACKEND_SERVICE_ENDPOINT=http://${host_ip}:3008/v1/audioqna

# Volumes
MODEL_CACHE=${MODEL_CACHE:-./data}
export MODEL_CACHE=ollama-data