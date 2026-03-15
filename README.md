# Só Gatinhos - Cat Adoption App

Este é um projeto de adoção de gatos organizado em um monorepo com front-end e back-end separados.

## Estrutura do Projeto

- `packages/backend/` - API REST em Node.js/Express
- `packages/frontend/` - Aplicação React com Vite e Tailwind CSS

## Como executar

1. Instale as dependências:
   ```bash
   npm run install-all
   ```

2. Execute o projeto:
   ```bash
   npm run dev
   ```

Isso iniciará tanto o back-end (porta 3001) quanto o front-end simultaneamente.

## Funcionalidades

- Feed público de gatos disponíveis para adoção
- Painel administrativo para gerenciar gatos
- Formulários para cadastro de gatos e adoção
- Separação clara entre front-end e back-end

## Tecnologias

- **Back-end**: Node.js, Express, CORS
- **Front-end**: React, Vite, Tailwind CSS, Lucide Icons