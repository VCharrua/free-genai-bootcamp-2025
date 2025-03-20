# OPEA Mega-service Implementation

The objective of this project is to implement a microservice architecture for the OPEA project that will be integrated into the Lang-Portal.

The mega-service includes the following components:

- Translation Python Microservice
- Translation UI
- LLM Service
    - Ollama Microservice

The project is implemented using Docker Compose, which allows for easy management and deployment of the services.

In order to allow for personalization and customization of the microservices, the Translation Python and UI components will be built using Dockerfile.

This project uses environment variables to configure the services.


## LLM Text Generation Service

This service need to be implemented after some changes to the comps library were made. The changes are related with the libraries import and the correct classes location.

After the updates, the service can be implemented by building the service as a container.

### Build the Text-Generation microservice docker image

Set the `OPEA-COMPS_ROOT` environment variable to the root directory of the OPEA Comps repository by using the `docker build` command.

```bash
cd ${OPEA-COMPS_ROOT}

docker build \
  --build-arg https_proxy=$https_proxy \
  --build-arg http_proxy=$http_proxy \
  -t opea/llm-textgen:latest \
  -f comps/llms/src/text-generation/Dockerfile .
```

## Language Mega-Service

The Language Mega-Service is implemented using Docker Compose.

The language text service choosen was ollama (other possible choices were TGI or vLLM), having a docker compose file configured to run the ollama service container as a dependency for the mega-service.

With this configuration, the external volumes and network configurations are also defined in the `docker-compose.yml` file.

### Defining Environment Variables

Before composing the Docker containers, we need to define the environment variables that will be used to configure the services.

```bash
export host_ip="localhost"

export LLM_ENDPOINT_PORT=8008
export TEXTGEN_PORT=9000
export HF_TOKEN=${HF_TOKEN}
export LLM_MODEL_ID="llama3:1"
export LLM_ENDPOINT="http://${host_ip}:${LLM_ENDPOINT_PORT}"
export TGI_LLM_ENDPOINT="${LLM_ENDPOINT}"
```

In order to make the microservice work, we needed to set the LLM_ENDPOINT and TGI_LLM_ENDPOINT environment variables to the ollama (llm text generation service) container IP address and external ports directly as shown below.

```bash
export LLM_ENDPOINT="http://172.22.0.2:11434"
export TGI_LLM_ENDPOINT="http://172.22.0.2:11434"
```

For easier configuration, the `.env` file was created in the same location as the `docker-compose.yml` file to store the environment variables.

```bash
# Set default values
host_ip="${host_ip:-localhost}"

NETW_PREFIX="10.5.0"
OPEA_NETW_SUBNET=10.5.0.0/16
OPEA_NETW_GATEWAY=10.5.0.1
LLM_HOST_IP=${NETW_PREFIX}.2
LLM_SERVICE_HOST_IP=${NETW_PREFIX}.3
MEGA_SERVICE_HOST_IP=${NETW_PREFIX}.4
FRONTEND_SERVICE_IP=${NETW_PREFIX}.5
FRONTEND_NGINX_IP=${NETW_PREFIX}.6

LLM_COMPONENT_NAME="OpeaTextGenService"
LLM_MODEL_ID="llama3.1"
LLM_ENDPOINT_PORT="8008"
LLM_ENDPOINT_EXT_PORT="11434"
LLM_ENDPOINT="http://${LLM_HOST_IP}:${LLM_ENDPOINT_EXT_PORT}"
TGI_LLM_ENDPOINT=${LLM_ENDPOINT}
HUGGINGFACEHUB_API_TOKEN=${HF_TOKEN}
MEGA_SERVICE_HOST_IP=${MEGA_SERVICE_HOST_IP}
LLM_SERVICE_HOST_IP=${LLM_SERVICE_HOST_IP}
BACKEND_SERVICE_ENDPOINT="http://${host_ip}:8888/v1/translation"
NGINX_PORT=8080
FRONTEND_SERVICE_IP=${FRONTEND_SERVICE_IP}
FRONTEND_SERVICE_PORT=5173
BACKEND_SERVICE_NAME=translation
BACKEND_SERVICE_IP=${MEGA_SERVICE_HOST_IP}
BACKEND_SERVICE_PORT=8888
```

### Compose the Language Mega-Service


## Testing and Micro-service API calls



## Using the mega-service

