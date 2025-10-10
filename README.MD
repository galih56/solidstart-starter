
### Folder Structure
```
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
│   ├── api/
│   │   ├── openapi.yaml          # OpenAPI spec (for hey-api)
│   │   └── routes/
│   │       ├── auth.ts           # route handlers (register, login, etc.)
│   │       ├── oauth.ts          # OAuth redirect + callback
│   │       └── users.ts
│   └── utils/
│       ├── env.ts                # environment variable loader
│       ├── hash.ts               # bcrypt password hashing
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
├── docker-compose.yml            # optional: postgres/local dev
├── .env
├── openapi-ts.config.ts          # config for @hey-api/openapi-ts. This tells @hey-api/openapi-ts where to find the OpenAPI spec and where to save the generated client. (optional: needed if you want to save your configuration)
└── package.json
```


#  Hey-api/openapi-ts installation
  ``` npx @hey-api/openapi-ts -i ./backend/openapi.yaml -o ./packages/api-client/src/generated ```
  I put this on CLI command. Just in case, If you want to regenerate api-cleint or use it on another project. you can checkout this README or the offical doc. 
    You already committed the generated client files (e.g. /src/client).
    The OpenAPI spec (hey-api/backend or openapi.yaml/json) doesn’t change.
    You’re reusing your SolidStart starter as a new project base.

  🔁 When you should regenerate
    You’ve modified your API (new routes, schemas, responses).
    You’ve moved or renamed the OpenAPI spec file/folder.
    You want to upgrade the client generator (new version of @hey-api/openapi-ts).

# openapi-ts.config.ts
  That file is just a saved preset, so you don’t have to retype your CLI command every time.


## NOTE: Axios is Optional
  This starterkit uses [`@hey-api/openapi-ts`](https://github.com/hey-api/openapi-ts) as the primary API client generator.  
  It creates a fully typed, `fetch`-based SDK for your backend endpoints — meaning **you already have interceptors, type safety, and request configuration built in**.  

  Axios is **optional**, not required. You only need it for specific advanced scenarios.

  ---
  ### 🧩 TL;DR Summary

  | Option | Runtime | Type Support | Interceptors | Bundle Size | Ecosystem | Ideal For |
  |--------|----------|---------------|---------------|--------------|-------------|-------------|
  | **`fetch` (via `@hey-api/fetch`)** | Native | ✅ Full TypeScript from OpenAPI | ✅ Built-in (`OpenAPI.INTERCEPTORS`) | ⚡ Very small | Modern / browser native | Typed SDKs, SSR, simple fetch |
  | **Axios** | JS library | ✅ with wrappers | ✅ Rich but custom setup | 🧱 Heavier | Mature & large | Legacy projects, Node-heavy backends |
  ---

### 🧠 When to Use Axios (Partially)
  Axios is only needed for edge cases that `fetch` doesn’t cover well:
  | Use Case | Reason |
  |-----------|--------|
  | **1️⃣ File uploads/downloads with progress** | `fetch` doesn’t expose upload/download progress events |
  | **2️⃣ External APIs (not in your OpenAPI spec)** | You might not want to extend your schema for one-off calls |
  | **3️⃣ Advanced logic (retry, cancellation, token refresh)** | Axios supports rich interceptor chains and `CancelToken` |
  | **4️⃣ Complex middleware chaining** | Easier with Axios’ global interceptor model |
  ---

### 🧰 Recommended Pattern
  Keep your generated client as the **primary source of truth** for backend endpoints,  
  and use Axios only when a feature demands it.

  ```
  packages/
    api-client/ # generated OpenAPI client (fetch-based)
    core/
    api/
    index.ts # unified API facade
    external.ts # optional Axios wrapper for special cases
  ```


### Example:
  ```ts
  // core/api/index.ts
  import { UsersService } from "@api-client/generated";
  import { axiosClient } from "./external";

  export const api = {
    users: UsersService, // typed, fetch-based
    analytics: {
      sendEvent: (data) => axiosClient.post("/analytics", data), // external via Axios
    },
  };
  ```

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
