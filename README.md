# Cybox - Sistema de Gestão Patrimonial

Cybox é um sistema moderno de gestão patrimonial desenvolvido em Next.js 14, permitindo que organizações gerenciem seus departamentos, categorias e patrimônios de forma eficiente e organizada.

## 🎨 Paleta de Cores

- **Cor Primária**: `#F6CF45` (Amarelo dourado)
- **Background Principal**: `#000000` (Preto)
- **Background Secundário**: `#0F0F0F` (Quase preto)
- **Background Terciário**: `#1F1F1F` (Cinza escuro)
- **Background Cards**: `#2C2C2C` (Cinza médio)
- **Texto Principal**: `#FFFFFF` (Branco)
- **Texto Secundário**: `#B4B4B4` (Cinza claro)
- **Texto Desabilitado**: `#8C8888` (Cinza médio)
- **Bordas**: `#333333` (Cinza escuro)

## 🏗️ Arquitetura

### Frontend
- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Animações**: Framer Motion
- **Ícones**: React Icons (Lucide React, Font Awesome)
- **Componentes UI**: Radix UI
- **Notificações**: Sonner

### Backend
- **API**: Next.js Server Actions
- **Autenticação**: NextAuth v5 (Beta)
- **Banco de Dados**: MySQL com mysql2
- **Email**: Nodemailer
- **Criptografia**: bcryptjs
- **Validação**: TypeScript nativo

### Ferramentas de Desenvolvimento
- **Build**: Next.js Build System
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment**: Configuração pronta para Vercel

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

1. **users**
   - `id` (VARCHAR(36) - UUID)
   - `nome` (VARCHAR(255))
   - `email` (VARCHAR(255) - UNIQUE)
   - `senha` (VARCHAR(255) - Hash bcrypt)
   - `google_id` (VARCHAR(255) - UNIQUE)
   - `avatar_url` (VARCHAR(500))
   - `status` (ENUM: 'ativo', 'inativo', 'suspenso', 'deletado')
   - `ultimo_login` (TIMESTAMP)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **departamentos**
   - `id_departamentos` (INT - AUTO_INCREMENT)
   - `titulo` (VARCHAR(255))
   - `descricao` (TEXT)
   - `convite` (VARCHAR(255))
   - `codigo_convite` (VARCHAR(255) - UNIQUE)
   - `localizacao` (VARCHAR(255))
   - `fotoDepartamento` (VARCHAR(255))
   - `status` (ENUM: 'ativo', 'inativo', 'deletado')
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **categorias**
   - `id` (INT - AUTO_INCREMENT)
   - `id_departamento` (INT - FK)
   - `nome` (VARCHAR)
   - `descricao` (TEXT)
   - `padrao_depreciacao_id` (INT - FK)
   - `status` (ENUM: 'ativo', 'inativo')

4. **patrimonios**
   - `id` (INT - AUTO_INCREMENT)
   - `id_categoria` (INT - FK)
   - `nome` (VARCHAR)
   - `descricao` (TEXT)
   - `codigo_patrimonio` (VARCHAR - UNIQUE)
   - `localizacao` (VARCHAR)
   - `valor_inicial` (DECIMAL)
   - `valor_atual` (DECIMAL)
   - `data_aquisicao` (DATE)
   - `tempo_depreciacao` (INT - meses)
   - `status` (ENUM: 'ativo', 'inativo', 'vendido', 'descartado')

5. **users_departamentos**
   - `id_users` (VARCHAR - FK)
   - `id_departamentos` (INT - FK)
   - `role` (ENUM: 'owner', 'admin', 'member')
   - `status` (ENUM: 'ativo', 'inativo')

6. **convites**
   - `id` (INT - AUTO_INCREMENT)
   - `id_departamentos` (INT - FK)
   - `id_remetente` (VARCHAR - FK)
   - `id_destinatario` (VARCHAR - FK)
   - `codigo_convite` (VARCHAR - UNIQUE)
   - `status` (ENUM: 'pendente', 'aceito', 'recusado')

7. **convites_externos**
   - `id` (INT - AUTO_INCREMENT)
   - `id_departamentos` (INT - FK)
   - `id_remetente` (VARCHAR - FK)
   - `email_destinatario` (VARCHAR)
   - `codigo_convite` (VARCHAR - UNIQUE)
   - `data_expiracao` (DATETIME)
   - `status` (ENUM: 'pendente', 'aceito', 'recusado', 'expirado')

8. **padroes_depreciacao**
   - `id` (INT - AUTO_INCREMENT)
   - `categoria` (VARCHAR)
   - `vida_util_meses` (INT)
   - `taxa_depreciacao_anual` (DECIMAL)

9. **gastos**
   - `id` (INT - AUTO_INCREMENT)
   - `patrimonio_id` (INT - FK)
   - `tipo` (ENUM: 'manutencao', 'reparo', 'upgrade', 'seguro', 'licenca', 'outros')
   - `descricao` (TEXT)
   - `valor` (DECIMAL(10,2))
   - `data_gasto` (DATE)
   - `fornecedor` (VARCHAR(255))
   - `numero_nota_fiscal` (VARCHAR(100))
   - `observacoes` (TEXT)
   - `comprovante_url` (VARCHAR(500))
   - `usuario_id` (VARCHAR(36) - FK)
   - `status` (ENUM: 'pendente', 'aprovado', 'pago', 'cancelado')
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

10. **notificacoes**
    - `id` (INT - AUTO_INCREMENT)
    - `usuario_id` (VARCHAR(36) - FK)
    - `titulo` (VARCHAR(255))
    - `mensagem` (TEXT)
    - `tipo` (ENUM: 'info', 'warning', 'success', 'error', 'depreciacao', 'manutencao', 'vencimento', 'convite')
    - `lida` (TINYINT(1) - Default: 0)
    - `acao_url` (VARCHAR(500))
    - `acao_texto` (VARCHAR(100))
    - `data_expiracao` (TIMESTAMP)
    - `metadados` (JSON)
    - `created_at` (TIMESTAMP)

## 🛠️ Padrões de Desenvolvimento

### Código Limpo
- **❌ Nunca usar console.log em produção**
- **❌ Nunca adicionar comentários desnecessários**
- **✅ Usar TypeScript strict (sem tipos `any`)**
- **✅ Remover imports não utilizados**
- **✅ Seguir padrões de nomenclatura consistentes**

### Componentes React
```typescript
// Estrutura padrão de componente
"use client"

import { ComponentProps } from "@/lib/types/types";
import { motion } from "framer-motion";

interface Props {
    // Props tipadas
}

export function ComponentName({ ...props }: Props) {
    return (
        <motion.div className="...">
            {/* JSX limpo e semântico */}
        </motion.div>
    );
}
```

### Estilização
- **Framework**: Tailwind CSS
- **Animações**: Framer Motion para transições
- **Responsividade**: Mobile-first approach
- **Foco**: Sistema customizado sem outline padrão do browser
- **Scrollbar**: Customizada com cor primária `#F6CF45`

### Server Actions
```typescript
// src/app/services/exemplo.ts
"use server"

import { connectToDatabase } from "@/lib/mysql";
import { auth } from "@/auth";

export async function exemploAction(data: ExemploType) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Não autorizado");
    }

    const connection = await connectToDatabase();
    // Lógica do servidor
    await connection.end();
}
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Linting
npm run lint

# Banco de dados
npm run seed:improved     # ⭐ CRIA TABELAS PELA PRIMEIRA VEZ + dados
npm run db:show-tables    # Mostrar tabelas
npm run db:table          # Visualizar estrutura de tabela
npm run db:reset          # Resetar banco de dados (dropa tudo)
```

### 🗃️ Criação do Banco de Dados

**Para criar o banco pela primeira vez:**
```bash
npm run seed:improved
```

**Scripts de banco explicados:**
- **`seed:improved`** - Cria TODAS as 10 tabelas do zero + popula com dados
- **`db:reset`** - Remove tudo e recria estrutura completa
- **`db:show-tables`** - Lista todas as tabelas do banco  
- **`db:table <nome>`** - Mostra estrutura detalhada de uma tabela

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente
```env
# Database
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=cybox

# NextAuth
NEXTAUTH_SECRET=sua_chave_secreta
NEXTAUTH_URL=http://localhost:3000

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
```

## 🚀 Funcionalidades

- **Gestão de Departamentos**: Criação, edição e visualização
- **Sistema de Categorias**: Organização de patrimônios por categoria
- **Controle Patrimonial**: Cadastro completo com depreciação automática
- **Sistema de Convites**: Convites internos e externos por email
- **Autenticação**: Login seguro com NextAuth
- **Responsivo**: Interface adaptável para mobile e desktop
- **Animações**: Transições fluidas com Framer Motion

## 📋 Gestão do Projeto

**Trello Board**: https://trello.com/b/TeG64eaK/cybox

## 🤝 Contribuição

1. Seguir os padrões de código estabelecidos
2. Não adicionar logs ou comentários desnecessários
3. Testar funcionalidades antes de commits
4. Usar TypeScript strict
5. Manter consistência visual com a paleta de cores

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── cadastro/           # Páginas de cadastro
│   ├── components/         # Componentes reutilizáveis
│   ├── convite/           # Sistema de convites
│   ├── departamentos/     # Gestão de departamentos
│   ├── login/             # Autenticação
│   └── services/          # Server actions
├── lib/
│   ├── types/             # Definições TypeScript
│   ├── email.ts           # Configuração de email
│   └── mysql.ts           # Conexão com banco
└── script/                # Scripts utilitários
```

---