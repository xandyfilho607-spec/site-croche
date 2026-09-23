# 🧶 Mereça Crochê - Sistema Web Completo

Sistema web profissional, moderno e responsivo para a loja artesanal **Mereça Crochê**. Desenvolvido com **React + Vite + JavaScript**, backend **Node.js/Express**, banco de dados **Neon PostgreSQL** e **Firebase (Authentication e Storage)**.

---

## 🌟 Funcionalidades

### Loja Virtual (Catálogo do Cliente)
- **Design Artesanal e Sofisticado**: Tons naturais (creme, bege, verde sálvia, marrom suave e dourado discreto).
- **Catálogo Dinâmico via Neon**: Produtos e categorias carregados em tempo real do banco de dados.
- **Filtros e Busca**: Filtragem por categorias, busca textual e ordenação (destaques, menor/maior preço, nome).
- **Detalhes da Peça**: Modal com visualização ampliada, descrição dos pontos, materiais e seletor de quantidade com subtotal em tempo real.
- **Carrinho Persistente**: Salva os itens selecionados no `localStorage` durante a navegação.
- **Finalização pelo WhatsApp**: Gera mensagem padronizada com nome do cliente, itens, subtotal, observações e abre o WhatsApp da dona via `wa.me`. O pedido **não** é salvo automaticamente no banco, permitindo combinar detalhes e frete antes da confirmação.

### Painel Administrativo (`/admin`)
- **Autenticação Firebase**: Login seguro com e-mail e senha exclusivo para a proprietária.
- **Dashboard em Tempo Real**:
  - Vendas e faturamento de hoje.
  - Vendas e faturamento do mês.
  - Total de produtos no catálogo (disponíveis e esgotados).
  - Gráfico de evolução do faturamento dos últimos 7 dias.
  - Lista de últimas vendas registradas.
- **Gestão de Produtos**:
  - Cadastro, edição e exclusão de peças.
  - Upload de imagens diretamente para o **Firebase Storage** com barra de progresso.
  - Alternância rápida entre status disponível e esgotado.
  - Destaque na vitrine principal.
- **Gestão de Categorias**: CRUD completo de categorias armazenadas no Neon.
- **Registrar Venda**: Formulário para registrar manualmente vendas confirmadas no WhatsApp.
- **Histórico de Vendas**: Consulta detalhada de pedidos concluídos e exclusão individual com confirmação.
- **Configurações**: Edição do nome da loja, número do WhatsApp de atendimento, biografia e informações de contato.

---

## 🚀 Como Executar o Projeto

### 1. Instalação das Dependências

Na pasta raiz do projeto:

```bash
npm run install:all
```

*(Ou instale individualmente com `npm install` na raiz, em `server/` e em `client/`)*

### 2. Configuração das Variáveis de Ambiente

Crie o arquivo `server/.env` com a sua connection string do Neon:

```env
PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_gCbVXP7NdnH4@ep-muddy-boat-acplfmhd-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
FIREBASE_PROJECT_ID=alteticacaocrochermaressa
CORS_ORIGIN=http://localhost:5173
```

O arquivo `client/.env` já possui a configuração do Firebase SDK fornecida:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyDFV-qUtuP185gCyBLiUMeTqX_bsWRMOI
VITE_FIREBASE_AUTH_DOMAIN=alteticacaocrochermaressa.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=alteticacaocrochermaressa
VITE_FIREBASE_STORAGE_BUCKET=alteticacaocrochermaressa.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=906890491343
VITE_FIREBASE_APP_ID=1:906890491343:web:d4a62e66c7dcf05e0a8eba
VITE_FIREBASE_MEASUREMENT_ID=G-4635PD08LZ
VITE_STORE_DEFAULT_WHATSAPP=5511999999999
```

### 3. Criação das Tabelas e Dados Iniciais no Neon

Execute o script de migração automática:

```bash
npm run db:setup
```

Esse comando cria no Neon:
- Tabela `categories`
- Tabela `products`
- Tabela `sales`
- Tabela `store_settings`
- Índices otimizados
- Categorias iniciais e produtos de demonstração para o primeiro carregamento.

### 4. Executar o Projeto em Modo de Desenvolvimento

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Painel Administrativo**: `http://localhost:5173/admin`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🔒 Segurança e Boas Práticas

- As credenciais de conexão do Neon (`DATABASE_URL`) ficam exclusivamente no backend e são ignoradas pelo Git via `.gitignore`.
- O frontend nunca acessa diretamente o PostgreSQL.
- As rotas administrativas da API Node (`/api/products`, `/api/categories`, `/api/sales`, etc.) validam o token JWT do Firebase Auth emitido pelo Google.
- Imagens são mantidas no bucket seguro do Firebase Storage (`alteticacaocrochermaressa.firebasestorage.app`), salvando apenas as URLs públicas no banco Neon.
