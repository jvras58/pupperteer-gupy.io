
# Gupy Job Search Bot V0.1.0(BETA)

Este projeto consiste em um bot que realiza buscas por vagas de emprego no Gupy utilizando palavras-chave específicas como "Junior", "Python" e "Remoto". Os resultados são enviados para um canal do Discord. A pesquisa pode ser executada manualmente via uma rota HTTP ou automaticamente, definida pelo cron diariamente às 9h.

## Requisitos

- Node.js v18 ou superior
- Conta no Discord com um servidor configurado
- Bot do Discord configurado com permissões adequadas

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/gupy-job-search-bot.git
    cd gupy-job-search-bot
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
http://localhost:3000/pesquisar
```

ou, especificando um termo de pesquisa:

```http
http://localhost:3000/pesquisar?term=javascript
```

### Execução Automática

A pesquisa será realizada automaticamente todos os dias às 9h, enviando os resultados para o canal do Discord configurado.

## Estrutura do Projeto

- [`index.js`] Configura o servidor Express e as rotas.
- [`search.js`]Contém o script Puppeteer que realiza a busca.
- [`discordBot.js`] Configura o bot do Discord e envia as mensagens.


