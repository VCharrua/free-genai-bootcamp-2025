# Translation Application

Language Translation is the communication of the meaning of a source-language text by means of an equivalent target-language text.

Translation architecture shows below:

![architecture](./ui-images/translation_architecture.png "Source: OPEA GitHub Examples Repository (https://github.com/opea-project/GenAIExamples/blob/main/Translation/README.md)")


The Translation example is implemented using the component-level microservices defined in [GenAIComps](https://github.com/opea-project/GenAIComps). The flow chart below shows the information flow between different microservices for this example.

```mermaid
---
config:
  flowchart:
    nodeSpacing: 100
    curve: linear
  themeVariables:
    fontSize: 20px
---
flowchart LR
    %% Colors %%
    classDef blue fill:#ADD8E6,stroke:#ADD8E6,stroke-width:2px,fill-opacity:0.5
    classDef orange fill:#FBAA60,stroke:#ADD8E6,stroke-width:2px,fill-opacity:0.5
    classDef orchid fill:#C26DBC,stroke:#ADD8E6,stroke-width:2px,fill-opacity:0.5
    classDef invisible fill:transparent,stroke:transparent;
    style Translation-MegaService stroke:#000000

    %% Subgraphs %%
    subgraph Translation-MegaService[" Translation MegaService "]
        direction LR
        LLM([LLM MicroService]):::blue
    end
    subgraph UserInterface[" User Interface "]
        direction LR
        a([User Input Query]):::orchid
        UI([UI server<br>]):::orchid
    end


    LLM_gen{{LLM Service <br>}}
    GW([*Translation GateWay*<br>]):::orange
    NG([Nginx MicroService]):::blue


    %% Questions interaction
    direction LR
    a[User Input Query] --> UI
    a[User Input Query] --> |Need Proxy Server|NG
    NG --> UI
    UI --> GW
    GW <==> Translation-MegaService


    %% Embedding service flow
    direction LR
    LLM <-.-> LLM_gen

```

This Translation use case performs Language Translation Inference across multiple platforms. Currently, we provide the example for [Intel Gaudi2](https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi-overview.html) and [Intel Xeon Scalable Processors](https://www.intel.com/content/www/us/en/products/details/processors/xeon.html), and we invite contributions from other hardware vendors to expand OPEA ecosystem.

## Deploy Translation Service

The Translation service can be effortlessly deployed on either Intel Gaudi2 or Intel Xeon Scalable Processors.

### Deploy Translation

Refer to the [Xeon Guide](./docker_compose/README.md) for instructions on deploying Translation on Xeon.


## Source

The source for this document can be found [here](https://github.com/opea-project/GenAIExamples/blob/main/Translation/README.md).


## License

- Apache 2.0 License
- Copyright (C) 2024 Intel Corporation