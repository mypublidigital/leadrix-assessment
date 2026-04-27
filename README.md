# Leadrix IA — Assessment App

App web para coleta e análise das respostas do assessment dos alunos do **Curso Leadrix IA**. Desenvolvido com Next.js 14, Supabase e Tailwind CSS.

---

## Funcionalidades

- **Formulário de assessment** em 7 etapas com barra de progresso e validação por seção
- **Área administrativa** protegida com autenticação via magic link (email)
- **Dashboard** com visão geral, estatísticas e últimos cadastros
- **Página de alunos** com busca, filtros por setor e maturidade, e paginação
- **Perfil individual** de cada aluno com todas as respostas e notas internas
- **Analytics da turma** com gráficos e insights acionáveis para personalização
- **Matchmaking de networking** com algoritmo de compatibilidade e gestão de status
- **Exportação CSV** com todas as respostas
- **Row Level Security** no Supabase para segurança dos dados

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (magic link) |
| UI | Tailwind CSS |
| Formulários | react-hook-form + zod |
| Gráficos | Recharts |
| Deploy | Vercel |
| Versionamento | GitHub |

---

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [GitHub](https://github.com)

---

## Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/leadrix-assessment.git
cd leadrix-assessment
npm install
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Aguarde o projeto iniciar (~1-2 min)
3. Vá em **SQL Editor** e execute o conteúdo de `supabase/migrations/0001_initial_schema.sql`
4. **Opcional:** Para dados de exemplo, execute `supabase/seed.sql` também

### 3. Crie as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```bash
# Supabase → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# URL do app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Nunca commite** o arquivo `.env.local`. Ele está no `.gitignore`.

### 4. Configure a autenticação no Supabase

No painel do Supabase:
1. Vá em **Authentication → URL Configuration**
2. **Site URL:** `http://localhost:3000`
3. **Redirect URLs**, adicione:
   - `http://localhost:3000/auth/callback`
   - `https://SEU_APP.vercel.app/auth/callback`
   - `https://*.vercel.app/auth/callback` (para preview deploys)

### 5. Crie o primeiro usuário admin

1. Inicie o app e acesse `/auth/login`
2. Faça login com seu e-mail (você receberá um magic link)
3. No Supabase SQL Editor, execute:

```sql
SELECT make_admin('seu-email@exemplo.com');
```

### 6. Rode localmente

```bash
npm run dev
```

Acesse:
- **Formulário do aluno:** http://localhost:3000/assessment
- **Dashboard admin:** http://localhost:3000/admin

---

## Deploy na Vercel via GitHub

### 1. Crie o repositório no GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/leadrix-assessment.git
git push -u origin main
```

### 2. Importe na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → selecione seu repositório
3. Framework preset: **Next.js** (detectado automaticamente)
4. Clique em **Deploy**

### 3. Configure as variáveis de ambiente na Vercel

Na Vercel, vá em **Project → Settings → Environment Variables** e adicione:

| Variável | Onde encontrar | Ambientes |
|----------|----------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | URL do seu app na Vercel | Production |

### 4. Atualize as URLs no Supabase

Após o primeiro deploy, copie a URL da Vercel (ex: `https://leadrix-assessment.vercel.app`) e:
1. Supabase → **Authentication → URL Configuration**
2. Atualize o **Site URL** para a URL de produção
3. Adicione a URL de produção nas **Redirect URLs**

### 5. Deploy automático

A partir daí, todo `git push` para `main` dispara um deploy automático na Vercel.

---

## Estrutura do projeto

```
leadrix-assessment/
├── src/
│   ├── app/
│   │   ├── assessment/           # Formulário público (alunos)
│   │   ├── obrigado/             # Página de confirmação
│   │   ├── auth/login/           # Login admin (magic link)
│   │   ├── auth/callback/        # Callback de autenticação
│   │   ├── admin/
│   │   │   ├── dashboard/        # Visão geral
│   │   │   ├── students/         # Lista e perfil individual
│   │   │   ├── analytics/        # Gráficos e insights
│   │   │   └── networking/       # Matchmaking
│   │   └── api/admin/export/     # Exportação CSV
│   ├── components/
│   │   ├── assessment/           # Componentes do formulário
│   │   ├── admin/                # Componentes do dashboard
│   │   └── ui/                   # Componentes reutilizáveis
│   └── lib/
│       ├── supabase/             # Clientes Supabase (client/server)
│       ├── actions/              # Server Actions
│       ├── validations/          # Schemas Zod
│       ├── utils/                # CSV, matching, insights
│       └── types/                # Tipos TypeScript
├── supabase/
│   ├── migrations/               # Schema SQL
│   └── seed.sql                  # Dados de exemplo (dev)
├── middleware.ts                  # Proteção de rotas
└── .env.example                  # Template de variáveis
```

---

## Banco de dados

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Usuários admin (ligados ao auth.users) |
| `students` | Alunos respondentes do assessment |
| `assessment_responses` | Respostas completas de cada aluno |
| `networking_matches` | Sugestões de conexão entre alunos |
| `admin_notes` | Notas internas da equipe |

### Políticas de segurança (RLS)

- **students + assessment_responses:** inserção aberta (formulário público), leitura/edição apenas para autenticados
- **networking_matches + admin_notes:** somente para usuários autenticados
- **profiles:** cada usuário vê apenas o próprio perfil; admins veem todos

---

## Funcionalidades de matching e insights

### Algoritmo de networking

O sistema calcula um score (0-10) para cada par de alunos com base em:

1. **Desafios em comum** (peso 2.5)
2. **Tópicos de networking em comum** (peso 2.0)
3. **Mesmo setor** (peso 1.5)
4. **Maturidade complementar** (peso 1.5) — avançado pode mentorear iniciante
5. **Área prioritária em comum** (peso 1.5)
6. **Contribuição cruzada** (peso 1.0) — um oferece o que o outro busca

Pares com score ≥ 3.0 são sugeridos. O admin pode aprovar, ignorar ou marcar como conectado.

### Insights didáticos

O sistema analisa as respostas da turma e gera insights acionáveis como:
- Alunos que precisam de mais suporte (iniciantes com múltiplas barreiras)
- Oportunidades de mentoria entre pares
- Áreas e desafios mais recorrentes para priorizar nos exemplos
- Estilo de aprendizagem predominante para calibrar o formato das aulas

---

## Suposições e decisões de design

1. **Magic link (sem senha):** Mais seguro e simples para um time pequeno de admins. O Supabase gerencia a expiração dos links.

2. **Formulário sem conta de aluno:** Alunos não precisam criar conta — apenas preenchem o formulário. Isso reduz atrito e elimina gestão de senhas.

3. **JSONB vs colunas separadas:** Optou-se por colunas explícitas (não JSONB) para facilitar queries, índices e o CSV de exportação.

4. **Score calculado na inserção:** `ai_maturity_score` é calculado no Server Action ao salvar, não na query — mantém analytics eficientes.

5. **Matchmaking manual:** O admin clica em "Gerar Matches" quando quiser rodar o algoritmo. Isso evita matches gerados com dados incompletos.

---

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Checar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Build de produção
npm run build
```

---

## Licença

Projeto privado — uso exclusivo da equipe Leadrix IA.
