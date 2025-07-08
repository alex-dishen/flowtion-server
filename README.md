# Flowtion Server

A NestJS-based server application with multi-tenant (multi-schema) architecture, using Prisma for migrations management, Redis for caching and Kysely for database management.

## Prerequisites

- Node.js v22.14.0
- Docker and Docker Compose

<br/>

## Project Setup

1. Clone the repository

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   NODE_ENV='local'

   PORT=3001
   MIGRATE_TENANTS=false

   DATABASE_URL='postgresql://postgres:postgres@localhost:55001/flowtion'
   ACCESS_SECRET=provide your own secret, can be a random string
   COOKIE_SECRET=provide your own secret, can be a random string
   REFRESH_SECRET=provide your own secret, can be a random string
   ACCESS_TOKEN_EXPIRY_TIME=provide your own time like 2h or 30m
   REFRESH_TOKEN_EXPIRY_TIME=provide your own time like 2h or 30m
   ```

4. The project uses Docker Compose to run the required services. To start them:

   ```bash
   docker compose up -d
   ```

   This will start:

   - PostgreSQL (port 55001)
   - Redis (port 6379)

5. Generate Types <br/>
   To make sure Kysely provides proper TypeScript support, we need to generate types from Prisma schemas:

   ```bash
   # Generate types for public schema
   npm run generate:public:types

   # Generate types for tenant schema
   npm run generate:tenant:types

   # Generate both
   npm run generate:all:types
   ```

6. Starting the Application

   ```bash
   # Development mode
   npm run start:dev

   # Debug mode
   npm run start:debug
   ```

   The application will run pre-checks before starting to ensure all requirements are met.

## Database Management

The project uses a multi-schema database architecture:

- `public` schema: Manages tenant and all of the tenants shared data. This schema has a different tables from the tenant schemas such as zara, apple or adidas
- `tenant` schema: Individual tenant-specific data. The above mentioned zara, apple and adidas will have the same tables, indexes and structure

To update the database schema you first need to clarify whether it's a public or tenant schema. Those two schemas are updated (migrated) in two different ways

### Tenant schemas migration

---

There is no command to migrate a tenant as there can be 20 tenants and then the command would have to be run 20 times. This process is automated:

1. Make a change in `tenant.prisma` file

2. Create a migration file based on the changes in `tenant.prisma` file

   ```bash
   npm run create:migration-file:tenant
   ```

3. Open `.env` file and change `MIGRATE_TENANTS` field from `false` to `true`

4. Run the container if not yet running with the db

5. Start the server. It'll automatically migrate all of the tenants and start the application

   ```bash
   npm run start:dev
   -------------
   npm run start:debug
   ```

6. Open `.env` file and change `MIGRATE_TENANTS` field back to `false`

### Public schema migration

---

It's i easer to migrate public schema as the default schema Prisma executes the queries on is public

1. Make a change in `public.prisma` file

2. Create a migration file based on changes in `public.prisma` file

   ```bash
   npm run create:migration-file:public
   ```

3. Run the container if not yet running with the db

4. Migrate public schema
   ```bash
   npm run migrate:public
   ```
   <br />

## API Documentation

> 💡 API documentation is not available in production

Swagger/OpenAPI documentation can be accessed at `http://localhost:3001/api`

<br />

## Multi-Tenant Architecture

### DI Subtree Implementation

The project implements a Request-scoped Dependency Injection system for handling multi-tenant contexts.

You can read the article on [Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes) to better understand how they work in NestJS

### TL;DR:

`TenantContext` class is marked with such decorator `@Injectable({ scope: Scope.REQUEST, durable: true })`

This means, each provider that will depend on `TenantContext` will implicitly become request scoped as well. `DatabaseService` provider is dependent on `TenantContext`, and at the same time most of the application is dependent on `DatabaseService` provider. That means that most of the application is request scoped.

Each request will create new instances of all of the controllers, services and repositories to provide the correct schema for db request. To avoid creating new instances on each request `durable: true` comes into play. This field tells NestJS to create the DI-subtree only once and then reuse it whenever the request with the same `x-tenant-id` comes in.
