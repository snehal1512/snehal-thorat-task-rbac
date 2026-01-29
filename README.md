TASK MANAGEMENT SYSTEM

A full-stack Task Management application built with Angular and NestJS using an NX monorepo.
Implements JWT authentication, Role-Based Access Control (RBAC), and organization-scoped authorization.

FEATURES
- JWT authentication
- Roles: OWNER, ADMIN, VIEWER
- Organization-based access control
- Kanban board with drag & drop
- Category and status filtering
- Audit logging
- NX monorepo architecture

TECH STACK
Frontend:
- Angular
- Angular CDK Drag & Drop
- TailwindCSS
- RxJS

Backend:
- NestJS
- TypeORM
- SQLite (development)
- JWT authentication

MONOREPO STRUCTURE
api/        -> NestJS backend
dashboard/ -> Angular frontend

SETUP INSTRUCTIONS

1. Install dependencies
npm install

2. Backend setup
Create api/.env with:
JWT_SECRET=super-secret-key
DB_PATH=./db.sqlite

Run backend:
npx nx serve api

Backend runs on http://localhost:3000

3. Frontend setup
Run frontend:
npx nx serve dashboard

Frontend runs on http://localhost:4200

DATA MODELS

User:
- id
- email
- role
- organization

Organization:
- id
- name
- parentOrganization (optional)
- users
- tasks

Task:
- id
- title
- status (TODO, IN_PROGRESS, COMPLETED)
- category (Work, Personal)
- organization
- createdBy

ROLES AND PERMISSIONS

OWNER:
- Full access

ADMIN:
- Create, update, delete, move tasks

VIEWER:
- Read-only access

AUTHENTICATION FLOW
- User logs in
- JWT issued with role and organization
- Guards validate JWT and role
- Services enforce org-level access

API ENDPOINTS

POST   /api/auth/login
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

AUDIT LOGGING
Basic console logging for:
- Task creation
- Task updates
- Task deletion
- Task viewing

TESTING STRATEGY

Backend:
- Jest unit tests for auth, guards, controllers
Run:
npx nx test api

Frontend:
- Jest/Karma tests for components and services
Run:
npx nx test dashboard

FUTURE IMPROVEMENTS
- Refresh tokens
- Advanced permission delegation
- RBAC caching
- Production database
- WebSocket updates
- CI/CD pipeline
