
# Gupy Job Search Bot V0.1.0(BETA)

Este projeto consiste em um bot que realiza buscas por vagas de emprego no Gupy utilizando palavras-chave específicas como "Junior", "Python" e "Remoto". Os resultados são enviados para um canal do Discord. A pesquisa pode ser executada manualmente via uma rota HTTP ou automaticamente (necessário ajustar o `.env`), definida pelo cron diariamente às 9h.

## Requisitos

- Node.js v18 ou superior
- Conta no Discord com um servidor configurado
- Bot do Discord configurado com permissões adequadas

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/pupperteer-gupy.io.git
    cd pupperteer-gupy.io
    ```

2. Instale as dependências na raiz do projeto:

    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente:

    - Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:

        ```env
        DISCORD_CHANNEL_ID=ID_DO_CANAL_DISCORD
        DISCORD_TOKEN=TOKEN_DO_BOT
        SEARCH="exemplo"
        ```

    - [`SEARCH`] é onde você define os critérios da pesquisa. Por exemplo, para vagas de Python, use: [`SEARCH="Python"`]

4. Inicie o servidor:

    ```bash
    node index.js
    ```

## Uso

### Rota Manual

Para executar a pesquisa manualmente, faça uma requisição GET para:

```http
http://localhost:3005/jobs/pesquisar
```

ou, especificando um termo de pesquisa:

```http
http://localhost:3005/jobs/pesquisar?term=javascript
```

### Execução Automática

A pesquisa será realizada automaticamente todos os dias às 9h, enviando os resultados para o canal do Discord configurado.

## Estrutura do Projeto

```
/
|
├── src/
│   ├── 🤖 bot/ --> Contém a lógica relacionada ao bot do Discord
│   │   ├── 🤖 discordBot.js --> Configuração do cliente Discord e funções para enviar/separar mensagens
|   |
│   ├── 👷 services/ --> Implementa a lógica de busca de vagas
│   │   ├── 🔎 jobSearchService.js -->  Extrai informações do gupy e retorna resultados formatados em json.
|   |
│   ├── 🪛 config/ --> Armazena as configurações do aplicativo
│   │   ├── ⚙️ config.js --> Centraliza todas as configurações das variaveis de ambiente .env
|   |
│   ├── 🌐 routes/ --> Define as rotas do Express para a aplicação
│   │   ├── 🌐 jobRoutes.js --> Endpoint HTTP que permitem interagir com o serviço de busca de vagas 
|   |
│   ├── ✅ index.js -->  Ponto de entrada principal da aplicação inicializa o servidor Express
│   ├── 📱app.js --> Configura a aplicação Express, incluindo middlewares e o cron
|   |
├── .env
├── package.json
└── README.md
```
