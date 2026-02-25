# InsightBoard AI - Backend (Level 1)

## Overview

This backend converts a raw meeting transcript into a structured
Dependency Graph of tasks.

It uses an LLM (Gemini) to extract tasks and then ensures:

-   The output follows a strict schema
-   All dependencies are valid
-   Circular dependencies are detected
-   Data is stored safely in PostgreSQL

Level 1 focuses on data integrity and logical consistency.

------------------------------------------------------------------------

## What This Backend Does

1.  Accepts a meeting transcript
2.  Sends it to an LLM
3.  Validates the returned JSON structure
4.  Removes invalid dependency IDs
5.  Detects circular dependencies
6.  Stores transcript + validated graph in database
7.  Returns a clean and verified task list

Even if the AI makes mistakes, the backend guarantees consistency.

------------------------------------------------------------------------

## Tech Stack

-   Node.js
-   Express
-   TypeScript
-   TypeORM
-   PostgreSQL
-   Zod (schema validation)
-   Gemini API (LLM)

------------------------------------------------------------------------

## Installation

Inside the backend folder:

    yarn install

Create a .env file in the backend root:

    PORT=4000
    DATABASE_URL=your_postgres_connection_string
    GEMINI_API_KEY=your_gemini_api_key

------------------------------------------------------------------------

## Running Locally

Development mode:

    yarn dev

Production build:

    yarn build
    yarn start

Server runs at:

    http://localhost:4000

------------------------------------------------------------------------

## API Endpoint

POST /api/tasks

Send transcript as raw text.

Example Response:

{ "success": true, "taskId": "uuid", "taskCount": 8, "hasCycle":
false, "tasks": \[...\] }

------------------------------------------------------------------------

## Validation Logic

### Strict Output Schema

I use Zod to enforce this structure:

{ id: string, description: string, priority: "low" \| "medium" \|
"high", dependencies: string\[\] }

If AI returns invalid JSON, the request fails safely.

------------------------------------------------------------------------

### Dependency Sanitization

AI may generate dependency IDs that don't exist.

Collect all valid task IDs - Remove any dependency that does not
match

This prevents broken graph references.

------------------------------------------------------------------------

### Cycle Detection

Circular dependencies are not allowed.

Example invalid case:

T1 → T2\
T2 → T1

use Depth-First Search (DFS) to detect cycles.

If a cycle is found: - Tasks are marked "Blocked/Error" - The app does
NOT crash

------------------------------------------------------------------------

### Data Persistence

We store: - Original transcript - Final validated graph - Timestamp

------------------------------------------------------------------------

## Level 1 Status

-   Strict schema validation
-   Dependency sanitization
-   Cycle detection
-   Database persistence

Level 1 complete.
