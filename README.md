# Cybox

**Know what you own. Know what it's worth.**

Cybox is an asset management app organized by department. Each department gets a **room**; rooms hold **categories** (each with its own annual depreciation rate) and categories hold **assets**. Cybox recalculates every asset's value monthly with straight-line depreciation, so you always know what everything is worth today.

Built by the **Adapto Software House Inc.** team in Vancouver, BC. · [adapto-sh.com](https://www.adapto-sh.com)

---

## Features

- **Rooms per department**: create a room, or join one with an invite code or email invite.
- **Roles**: owner, admin and member, enforced on the server for every action.
- **Categories with depreciation presets**: standard annual rates per asset type.
- **Assets**: purchase price, date, location and specs, with value today, value lost and a value-over-time chart.
- **Room overview**: total value today, number of assets and % of value left.
- **Notifications**: pending room invites, with accept / decline.
- **Accounts**: email + password or Google sign-in, email confirmation, password reset, login lockout after repeated failures.
- **Demo mode**: explore the whole app with sample data, without an account (see below).

## Demo mode

Visitors can click **Try the demo** (landing page hero and navbar) or **Explore the demo** (log in / sign up) to open the app with sample data, with no account needed.

How it works:

- The demo is a normal NextAuth session from a `demo` credentials provider (`src/auth.ts`). It needs **no database**.
- Every server action checks `isDemoSession()` first and answers from the sample data in `src/lib/demo.ts`.
- Demo mode is **read-only**: every write is refused on the server, and the UI shows a friendly notice with a "Create account" button (`src/app/components/demo/DemoContext.tsx`).

## Tech stack

- **Next.js 14** (App Router, Server Actions) + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **NextAuth v5** (credentials, Google, demo)
- **MySQL** via `mysql2`
- **Nodemailer** for transactional email
- **Recharts** for charts

## Brand

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `#F6CF45` | Gold: main actions, highlights |
| `amber` | `#FFAE3F` | The orange slash from the logo, accents |
| `page` / `ink` | `#050505` | Background |
| `surface` | `#0e0e0e` / `#181818` / `#242424` | Cards, inputs, hover |
| Display font | Unbounded | Headings |
| Mono font | JetBrains Mono | Labels, codes |
| Body font | Inter | Text |

Trimmed logos live in `public/brand/` (`cybox-wordmark.png`, `cybox-mark.png`).

## Getting started

```bash
cp .env.exemple .env.local   # then fill in the values
npm install
npm run seed:improved        # first run only: creates all tables + sample data
npm run dev
```

Open http://localhost:3000.

### Environment variables

```env
# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=cybox

# NextAuth
AUTH_SECRET=generate_with_npx_auth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Cybox <noreply@cybox.com>"
```

`NEXTAUTH_URL` is also used to build links in emails and the social share image URL.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run seed:improved` | Creates every table from scratch and adds sample data |
| `npm run db:migrate` | Brings an existing database up to date (safe to run many times), including renaming the depreciation presets to English |
| `npm run db:reset` | Drops everything and recreates the schema |
| `npm run db:show-tables` | Lists the tables |
| `npm run db:table <name>` | Shows a table's structure |
| `npm run db:fix-google-passwords` | Lists Google accounts with the old fixed password (`--apply` to fix) |

## Database

Main tables: `users`, `departamentos` (rooms), `users_departamentos` (membership + role), `categorias`, `patrimonios` (assets), `padroes_depreciacao` (depreciation presets), `convites` / `convites_externos` (invites), `gastos` (expenses) and `notificacoes`.

`patrimonios.tempo_depreciacao` stores the **annual depreciation rate in %** (straight-line). The current value is always derived from it (`src/lib/depreciacao-calculo.ts`, mirrored in SQL by `sqlValorAtual` in `src/lib/depreciacao.ts`).

Deleting a room, category or asset marks it as `deletado` (soft delete).

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/login`, `/cadastro` | Log in, sign up |
| `/esqueci-senha`, `/redefinir-senha/[token]` | Forgot / reset password |
| `/verificar-email/[token]` | Email confirmation |
| `/convite/[codigo]` | Join a room from an invite |
| `/departamentos` | Your rooms (signed-in area) |
| `/departamentos/[id]` | A room: categories and assets |
| `/privacy`, `/terms` | Privacy Policy, Terms of Use |

Only `/departamentos` is protected by the middleware (`src/auth.config.ts`); those pages also check the session themselves, and every server action checks access.

## Project structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/           # Landing page (hero box, tour, playground, pricing…)
│   │   ├── auth/           # AuthShell, login and sign-up forms, demo button
│   │   ├── demo/           # Demo context (read-only notices)
│   │   ├── modals/         # Room, category, asset, members, invites, settings…
│   │   ├── Navigation/     # App sidebar, room sidebar, mobile drawer, navbar
│   │   └── legal/          # Privacy / Terms layout
│   ├── departamentos/      # Rooms and room pages
│   ├── services/           # Server actions (demo-aware)
│   └── …                   # Auth, invite, legal and error pages
├── lib/
│   ├── demo.ts             # Demo data + isDemoSession()
│   ├── format.ts           # Money / date formatting (USD, en-US)
│   ├── depreciacao*.ts     # Depreciation math
│   ├── authz.ts            # Role checks
│   ├── email.ts            # Email templates
│   └── mysql.ts            # Database connection
└── script/                 # Seed script
```

## Contributing

1. Keep TypeScript strict (no `any`).
2. Use the design tokens above instead of hard-coded colors where possible.
3. Every new server action must check access **and** handle demo sessions (`isDemoSession()`).
4. Test on mobile and desktop before committing.

Project board: https://trello.com/b/TeG64eaK/cybox
