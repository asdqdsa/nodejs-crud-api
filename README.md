## Description

A RESTful API built with Node.js and TypeScript that implements CRUD operations for user management.

### 📦 Start

```bash
pnpm i # installation
pnpm start:dev # run nodemon in development mode
pnpm start:prod # run in production mode
```

#### Example .env.development file

```bash
PORT=/
```

#### Example .env.production file

```bash
PORT=/
```

#### Example Flow

```bash
# Get all users
curl http://localhost:4000/api/users

# Create user
curl -X POST http://localhost:4000/api/users \
 -H "Content-Type: application/json" \
 -d '{"username":"Alice","age":30,"hobbies":["reading"]}'
```
