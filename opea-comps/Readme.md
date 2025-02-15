## Running Ollama Third-Party Service

### Defining the environment variables for docker container

#### WSL Ubuntu 24.04.1 LTS

host_ip=$(hostname -I | awk '{print $1}') no_proxy=localhost LLM_ENDPOINT_PORT=8008 LLM_MODEL_ID="llama3.2:1b" docker-compose up


### Ollama APIs

[Ollama API Documentation](github.com/ollama/ollama/blob/main/docs/api.md)


#### 1. Pull the model

```sh
curl http://localhost:8008/api/pull -d '{
  "model": "llama3.2:1b"
}'
```

#### 2. Use the llama3 model

```sh
curl http://localhost:8008/api/generate -d '{
  "model": "llama3.2:1b",
  "prompt": "Why is the sky blue?"
}'
```

### Docker Desktop considerations

For the VSCode app to connect with the containers extensions, it's not only necessary install docker on WSL, but also have the docker desktop application running.
