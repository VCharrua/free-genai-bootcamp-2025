#!/usr/bin/env bash

# Copyright (C) 2024 Intel Corporation
# SPDX-License-Identifier: Apache-2.0
pushd "../../" > /dev/null
source .set_env.sh
popd > /dev/null

# export host_ip=<your External Public IP>
export host_ip=$(hostname -I | awk '{print $1}')

export NETW_NAME="opea_lang_network"
export NETW_PREFIX="10.5.0"
export OPEA_NETW_SUBNET=${NETW_PREFIX}.0/16
export OPEA_NETW_GATEWAY=${NETW_PREFIX}.1
export LLM_HOST_IP=${NETW_PREFIX}.2
export LLM_SERVICE_HOST_IP=${NETW_PREFIX}.3
export MEGA_SERVICE_HOST_IP=${NETW_PREFIX}.4
export FRONTEND_SERVICE_IP=${NETW_PREFIX}.5
export FRONTEND_NGINX_IP=${NETW_PREFIX}.6
export BACKEND_SERVICE_IP=${MEGA_SERVICE_HOST_IP}

export MODEL_CACHE=${MODEL_CACHE:-ollama-data}
export LLM_COMPONENT_NAME="OpeaTextGenService"
export LLM_MODEL_ID="llama3.1"
export LLM_ENDPOINT_PORT="8008"
export LLM_ENDPOINT_EXT_PORT="11434"
export LLM_ENDPOINT="http://${LLM_HOST_IP}:${LLM_ENDPOINT_EXT_PORT}"
export TGI_LLM_ENDPOINT=${LLM_ENDPOINT}
export HUGGINGFACEHUB_API_TOKEN=${hf_token}

export BACKEND_SERVICE_ENDPOINT="http://${host_ip}:8888/v1/translation"
export NGINX_PORT=8080
export FRONTEND_SERVICE_PORT=5173
export BACKEND_SERVICE_NAME=translation
export BACKEND_SERVICE_PORT=8888