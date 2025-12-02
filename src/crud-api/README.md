# CRUD API

Simple CRUD API using in-memory database with horizontal scaling support.

## Features

- ✅ RESTful API for user management
- ✅ In-memory database
- ✅ UUID validation
- ✅ Error handling (400, 404, 500)
- ✅ Development and Production modes
- ✅ Horizontal scaling with Node.js Cluster API
- ✅ Load balancing (Round-robin algorithm)
- ✅ Database synchronization across workers via IPC
- ✅ Integration tests

## Tech Stack

- Node.js 24.x
- TypeScript
- Native HTTP module (no Express)
- Jest + Supertest for testing
- esbuild for bundling

## Installation

```bash
npm install
```

## Environment Variables

Create `.env` file in the project root:

```env
PORT=4000
```

## Available Scripts

### Development Mode

```bash
npm run dev:crud
```

Starts development server with hot reload on `http://localhost:4000`

### Production Mode

```bash
npm run start:prod
```

Builds and starts production server

### Multi-Instance Mode (Horizontal Scaling)

```bash
npm run start:multi
```

Starts multiple worker instances with load balancer:
- Load Balancer: `http://localhost:4000`
- Workers: `http://localhost:4001`, `4002`, `4003`, etc.
- Number of workers: `availableParallelism - 1`

### Testing

```bash
npm test -- src/crud-api
```

Runs integration tests

## API Endpoints

### User Object Structure

```typescript
{
  id: string;        // UUID v4
  username: string;  // required
  age: number;       // required
  hobbies: string[]; // required
}
```

### GET /a``````pi/users

Get all users

**Response:** `200 OK`
```json
[
  {
    "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "username": "John Doe",
    "age": 30,
    "hobbies": ["coding", "gaming"]
  }
]
```

### GET /api/users/{userId}

Get user by ID

**Response:** `200 OK`
```json
{
  "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "username": "John Doe",
  "age": 30,
  "hobbies": ["coding", "gaming"]
}
```

**Error responses:**
- `400 Bad Request` - Invalid UUID format
- `404 Not Found` - User doesn't exist

### POST /api/users

Create new user

**Request body:**
```json
{
  "username": "John Doe",
  "age": 30,
  "hobbies": ["coding", "gaming"]
}
```

**Response:** `201 Created`
```json
{
  "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "username": "John Doe",
  "age": 30,
  "hobbies": ["coding", "gaming"]
}
```

**Error responses:**
- `400 Bad Request` - Missing required fields or invalid data

### PUT /api/users/{userId}

Update existing user

**Request body:**
```json
{
  "username": "John Updated",
  "age": 31,
  "hobbies": ["coding", "gaming", "reading"]
}
```

**Response:** `200 OK`
```json
{
  "id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "username": "John Updated",
  "age": 31,
  "hobbies": ["coding", "gaming", "reading"]
}
```

**Error responses:**
- `400 Bad Request` - Invalid UUID or invalid data
- `404 Not Found` - User doesn't exist

### DELETE /api/users/{userId}

Delete user

**Response:** `204 No Content`

**Error responses:**
- `400 Bad Request` - Invalid UUID format
- `404 Not Found` - User doesn't exist

## Testing Examples

### Basic CRUD Operations

```bash
# 1. Get all users (empty array initially)
curl http://localhost:4000/api/users

# 2. Create a new user
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"Alice","age":25,"hobbies":["reading","yoga"]}'

# Response: {"id":"abc-123-def-456",...}
# Save the returned ID for next steps

# 3. Get user by ID
curl http://localhost:4000/api/users/abc-123-def-456

# 4. Update user
curl -X PUT http://localhost:4000/api/users/abc-123-def-456 \
  -H "Content-Type: application/json" \
  -d '{"username":"Alice Smith","age":26,"hobbies":["reading","yoga","cooking"]}'

# 5. Delete user
curl -X DELETE http://localhost:4000/api/users/abc-123-def-456

# 6. Verify deletion (should return 404)
curl http://localhost:4000/api/users/abc-123-def-456
```

### Testing Horizontal Scaling

Start multi-instance mode:
```bash
npm run start:multi
```

Test database synchronization across workers:

```bash
# Step 1: Create user (request goes to Worker 1)
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"Bob","age":28,"hobbies":["gaming"]}'

# Save the returned ID, e.g., "xyz-789-abc-123"

# Step 2: Get user (request goes to Worker 2)
# Should return the same user created in Step 1
curl http://localhost:4000/api/users/xyz-789-abc-123

# Step 3: Get all users multiple times
# Each request goes to different worker, but all see the same data
curl http://localhost:4000/api/users
curl http://localhost:4000/api/users
curl http://localhost:4000/api/users

# Step 4: Delete user (request goes to Worker 3)
curl -X DELETE http://localhost:4000/api/users/xyz-789-abc-123

# Step 5: Verify deletion (request goes to Worker 4)
# Should return 404 on all workers
curl http://localhost:4000/api/users/xyz-789-abc-123
```

## Architecture

### Single Instance Mode

```
Client → HTTP Server → Controllers → In-Memory DB
```

### Multi-Instance Mode (Horizontal Scaling)

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Master Process (PID 12345)                          │  │
│  │  - Spawns workers                                    │  │
│  │  - Relays messages between workers                   │  │
│  │  - Starts Load Balancer                              │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                                                 │
│           ├─── fork() ──> Worker 1 (PID 12346) :4001       │
│           ├─── fork() ──> Worker 2 (PID 12347) :4002       │
│           └─── fork() ──> Worker 3 (PID 12348) :4003       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Load Balancer :4000                                 │  │
│  │  - Receives client requests                          │  │
│  │  - Forwards to workers (Round-robin)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↑
         │ HTTP Request
         │
    [Client/curl]
```

### How Horizontal Scaling Works

#### 1. Process Architecture

When you run `npm run start:multi`, the following happens:

```
cluster.ts starts
    ↓
if (cluster.isPrimary)  ← Master process
    ↓
    ├─ Creates N workers via cluster.fork()
    ├─ Starts Load Balancer on port 4000
    └─ Sets up IPC message relay
    
else  ← Worker processes
    ↓
    └─ Each worker starts HTTP server on unique port
```

**Key Concept: `fork()`**
- Creates a **copy** of the current process
- Each worker is a separate program with its own memory
- Workers **cannot** directly access Master's variables

#### 2. Load Balancing (Round-robin Algorithm)

```
Request #1 → Load Balancer → Worker 1 (:4001)
Request #2 → Load Balancer → Worker 2 (:4002)
Request #3 → Load Balancer → Worker 3 (:4003)
Request #4 → Load Balancer → Worker 1 (:4001)  ← Back to first!
```

**Implementation:**
```typescript
let currentWorker = 0;  // Counter

// On each request:
const targetPort = workerPorts[currentWorker];
currentWorker = (currentWorker + 1) % numWorkers;  // Cycle through workers

// Forward request to selected worker
http.request({ port: targetPort, ... })
```

**Modulo operator (`%`) magic:**
```
0 % 3 = 0  → Worker 1
1 % 3 = 1  → Worker 2
2 % 3 = 2  → Worker 3
3 % 3 = 0  → Worker 1 (cycles back!)
4 % 3 = 1  → Worker 2
```

#### 3. Database Synchronization via IPC

**The Problem:**
Each worker has its own memory space:

```
Worker 1: users = [Alice]
Worker 2: users = []        ← Doesn't see Alice!
Worker 3: users = []        ← Doesn't see Alice!
```

**The Solution: Inter-Process Communication (IPC)**

Workers communicate through message passing:

```
┌──────────────────────────────────────────────────────────────┐
│                    CREATING A USER                           │
└──────────────────────────────────────────────────────────────┘

1. Client → Load Balancer → Worker 2
   POST /api/users {"username":"Bob"}

2. Worker 2 creates user in its local DB:
   ┌──────────────┐
   │  Worker 2    │
   │  users=[Bob] │
   └──────────────┘
        │
        │ process.send({ type: 'CREATE', user: Bob })
        ↓
   ┌──────────────┐
   │   Master     │  ← Receives message
   └──────────────┘
        │
        │ Broadcasts to ALL workers (except Worker 2)
        ├────────────────┬────────────────┐
        ↓                ↓                ↓
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ Worker 1 │    │ Worker 3 │    │ Worker 4 │
   │users=[Bob]│   │users=[Bob]│   │users=[Bob]│
   └──────────┘    └──────────┘    └──────────┘

Now ALL workers know about Bob!
```

#### 4. Complete Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│  1. Client sends POST /api/users                             │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  2. Load Balancer (Round-robin) → Worker 2 :4002             │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  3. Worker 2: UserController.createUser()                    │
│     → db.createUser()                                        │
│     → users.push(Bob)  // Local DB of Worker 2              │
│     → process.send({ type: 'CREATE', user: Bob })            │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  4. Master receives message from Worker 2                    │
│     → worker.on('message', ...)                              │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  5. Master broadcasts to Workers 1, 3, 4, 5...               │
│     → workers.forEach(w => w.send(msg))                      │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  6. Workers 1, 3, 4... receive message                       │
│     → process.on('message', ...)                             │
│     → handleMessage({ type: 'CREATE', user: Bob })           │
│     → users.push(Bob)  // Update their local DB              │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  7. Now ALL workers have Bob in their DB!                    │
└──────────────────────────────────────────────────────────────┘
```

#### 5. Code Walkthrough

**sharedDb.ts - Database with IPC:**

```typescript
class SharedDatabase {
    private users: User[] = [];  // Local DB for each worker

    constructor() {
        // Each worker listens for messages from Master
        if (cluster.isWorker) {
            process.on('message', (msg: DBAction) => {
                this.handleMessage(msg);  // Process incoming sync
            });
        }
    }

    private broadcast(action: DBAction) {
        // Send message to Master process
        if (cluster.isWorker && process.send) {
            process.send(action);
        }
    }

    createUser(userData: Omit<User, 'id'>): User {
        const user: User = { id: uuidv4(), ...userData };
        
        // 1. Add to OUR local DB
        this.users.push(user);

        // 2. Send message to Master → other workers
        this.broadcast({ type: 'CREATE', user });

        return user;
    }
}
```

**cluster.ts - Message Relay:**

```typescript
// Master listens to messages from each worker
worker.on('message', (msg) => {
    // Received message from Worker 2: "I created Bob"
    
    // Send to ALL OTHER workers
    workers.forEach(w => {
        if (w.id !== worker.id) {  // Don't send back to Worker 2
            w.send(msg);  // Send to Workers 1, 3, 4...
        }
    });
});
```

### Key Concepts

1. **Fork** - Creates a copy of the process (separate memory)
2. **IPC** - Processes communicate via `process.send()` and `process.on('message')`
3. **Round-robin** - Distribution algorithm: 1→2→3→1→2→3...
4. **Broadcast** - Sending a message to all workers
5. **Master** - Coordinator, doesn't handle HTTP requests
6. **Worker** - Handles HTTP requests and maintains local DB copy

## Project Structure

```
src/crud-api/
├── app.ts                  # HTTP server factory
├── server.ts               # Single instance entry point
├── cluster.ts              # Multi-instance entry point
├── worker.ts               # Worker process entry point
├── loadBalancer.ts         # Load balancer implementation
├── config/
│   └── env.ts             # Environment configuration
├── controllers/
│   └── userController.ts  # Request handlers
├── database/
│   ├── inMemoryDb.ts      # Simple in-memory database
│   └── sharedDb.ts        # Synchronized database for cluster mode
├── routes/
│   └── users.ts           # Route definitions
├── types/
│   └── user.ts            # TypeScript interfaces
├── utils/
│   ├── validation.ts      # Input validation
│   └── errorHandler.ts    # Error handling utilities
└── tests/
    └── api.test.ts        # Integration tests
```

## Error Handling

All errors return JSON response with `message` field:

```json
{
  "message": "Error description"
}
```

**Status codes:**
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (unexpected errors)

## Development Notes

- Database is in-memory only - data is lost on restart
- UUID v4 is used for user IDs
- All timestamps and additional fields are not implemented
- No authentication/authorization
- No pagination for GET /api/users
- No input sanitization beyond basic validation

## License

ISC
