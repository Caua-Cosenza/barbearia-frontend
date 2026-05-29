# 💈 Barbearia — Frontend

Interface web para sistema de agendamento online de barbearia, desenvolvido como projeto de portfólio durante o curso de Análise e Desenvolvimento de Software.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 📋 Sobre o Projeto

Interface responsiva com dois fluxos principais: **tela pública** onde o cliente escolhe serviço, profissional e horário para agendar, e **painel administrativo** protegido onde o barbeiro visualiza e gerencia os agendamentos do dia.

> 🟢 **Em produção desde 26/05/2026** — atendendo uma barbearia real com cerca de **300 clientes/mês**.
> O cliente (Jhonatan) relatou que o sistema **superou as expectativas**, tanto em funcionalidade quanto na interface.
> Antes do sistema, o controle de agendamentos era feito manualmente via WhatsApp, sem organização centralizada.

**Destaques:**
- Clientes não precisam criar conta — apenas nome, telefone e e-mail
- Link de cancelamento enviado via WhatsApp após o agendamento
- Painel admin com autenticação segura (cookie HttpOnly)
- PWA com suporte a notificações push para o barbeiro

---

## ⚙️ Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | React 18 |
| Build tool | Vite 5 |
| Estilização | Tailwind CSS 3.4 |
| Roteamento | React Router DOM v6 |
| HTTP Client | Axios (credentials: include) |
| Validação | Zod |
| Deploy | Cloudflare Pages |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- Backend rodando (veja [barbearia-backend](https://github.com/cauacosenza88-jpg/barbearia-backend))

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/cauacosenza88-jpg/barbearia-frontend.git
cd barbearia-frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL do backend local

# 4. Iniciar em desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`.

---

## 🔑 Variáveis de Ambiente

```env
VITE_API_URL=     # URL do backend (ex: http://localhost:3333)
```

> ⚠️ **Nunca commite o arquivo `.env.production`** — ele está no `.gitignore`.

---

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── api/             # Cliente axios e interceptors
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas (agendamento, admin, cancelamento)
│   ├── hooks/           # Custom hooks
│   ├── types/           # Tipos TypeScript
│   └── main.tsx         # Entry point
├── public/
├── .env.example
└── package.json
```

---

## 📱 Funcionalidades

**Área pública (cliente):**
- Seleção de múltiplos serviços (preço e duração somados automaticamente)
- Escolha de profissional e horário disponível
- Confirmação com link de cancelamento via WhatsApp
- Página `/cancelar/:token` — cancelamento até 1h antes do horário

**Painel administrativo:**
- Login seguro (cookie HttpOnly, sem token em localStorage)
- Listagem de agendamentos do dia
- Gerenciamento de serviços e profissionais
- Notificações push (PWA) para novos agendamentos e cancelamentos

---

## 🔒 Segurança

- Tokens JWT armazenados em **HttpOnly cookies** (nunca em localStorage)
- Interceptor de 401 que redireciona para login quando a sessão expira
- Todas as requisições feitas com `credentials: 'include'`
- Validação de formulários com **Zod** antes de qualquer chamada à API
- Botões de envio bloqueados durante requisição (sem spam de requests)

---

## 🌐 Deploy

O frontend é hospedado no **Cloudflare Pages** com deploy automático a cada push na branch `main`.

Regras de segurança adicionais (rate limiting, bot protection) são gerenciadas pelo repositório [barbearia-cloudflare](https://github.com/cauacosenza88-jpg).

---

## 📄 Licença

MIT

---

> Projeto desenvolvido por **Cauã Cosenza de Carvalho** como portfólio — 2º semestre de Análise e Desenvolvimento de Software.
