
### Folder Structure
my-app/
├── frontend/                     # SolidStart app (client-side)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── login.tsx         # email/password login
│   │   │   ├── register.tsx      # registration form
│   │   │   ├── callback.tsx      # OAuth callback redirect page
│   │   │   ├── dashboard.tsx     # protected route (example)
│   │   │   └── logout.tsx        # optional logout route
│   │   ├── lib/
│   │   │   ├── api.ts            # OpenAPI client or axios instance
│   │   │   ├── auth.ts           # helpers for login/logout/token handling
│   │   │   └── toast.ts          # global toast notification utility
│   │   ├── store/
│   │   │   └── auth.ts           # global auth signal/context
│   │   └── components/
│   │       ├── AuthGuard.tsx     # protects routes by redirecting unauthenticated users
│   │       └── OAuthButton.tsx   # buttons like “Sign in with Google”
│   └── vite.config.ts
│
├── backend/                      # backend logic (isolated from frontend)
│   ├── db/
│   │   └── index.ts              # Prisma client wrapper
│   ├── prisma/
│   │   └── schema.prisma         # user, session, oauth tables
│   ├── services/
│   │   ├── UserService.ts        # CRUD & query logic for users
│   │   ├── AuthService.ts        # handle password login + token issue
│   │   ├── OAuthService.ts       # handle Google/GitHub OAuth flow
│   ├── controllers/
│   │   ├── AuthController.ts     # REST endpoints for auth
│   │   └── UserController.ts     # endpoints for user CRUD
│   └── utils/
│       ├── env.ts                # environment variable loader
│
├── shared/
│   ├── schemas/
│   │   ├── user.ts               # zod schema for user validation
│   │   └── auth.ts               # zod schema for login/register
│   ├── types/
│   │   ├── user.ts
│   │   └── auth.ts
│   └── constants.ts              # e.g. token names, roles
│
├── scripts/
│   ├── generate-client.ts        # runs hey-api/openapi-ts codegen
│   ├── seed.ts                   # optional: seed default users/roles
│   └── migrate.ts                # run prisma migrate programmatically
│
├── tsconfig.json                 # base shared config
├── docker-compose.yml            # optional: postgres/local dev
├── .env
└── package.json

### 🧩 API Design Decision
This branch (`internal-api`) does **not** use OpenAPI or a generated API client.

Since the frontend (SolidStart) and backend (Prisma + services) live in the same runtime,
data access is handled through **direct service calls** and **Zod validation**, not HTTP endpoints.

If we later decide to expose the backend as a standalone REST API,
OpenAPI client generation (using `@hey-api/openapi-ts`) can be restored
from the `openapi-client` branch.

## Vite Config
  You don’t need to create a custom vite.config.ts file — unless:
    - You want to add plugins (like vite-plugin-svgr, vite-tsconfig-paths, or alias setup)
    - You want to configure server proxies for backend API routes (useful if you’re testing local backend on another port)
    - You want to tweak build output or optimize SSR settings

## 🔐 Authentication Strategy
  The platform uses **cookie-based sessions** for authentication, similar to Laravel Sanctum.
  - Backend sets an `HttpOnly` session cookie after login.
  - The cookie stores only a **session ID**, not user data (unlike JWTs).
  - Session state is persisted in the database or Redis.
  - Frontend automatically includes the cookie in requests (`credentials: 'include'`).

  This improves security by:
  - Preventing client-side decoding of tokens.
  - Mitigating XSS/CSRF risks with proper `SameSite`, `Secure`, and `HttpOnly` flags.