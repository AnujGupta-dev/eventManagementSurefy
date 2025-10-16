# Event Management API

A robust RESTful API for managing events, built with Node.js, Express, and PostgreSQL. This system allows for creating events, managing user registrations, and tracking event statistics.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Routes](#api-routes)
- [Sample Requests/Responses](#sample-requestsresponses)
- [License](#license)

## Features

- Create and manage events with title, date, location, and capacity
- User registration and management
- Register users for events
- Cancel event registrations
- View upcoming events
- Get event registration statistics
- Simple and intuitive RESTful API

## Installation

Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/event-management-api.git
cd event-management-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
# Run the SQL scripts in the Database Setup section

# Start the server
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=your_url
```

## Database Setup

Execute the following SQL statements to set up your database:

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location VARCHAR(200) NOT NULL,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Registrations Table

```sql
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);
```

## API Routes

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/create | Create a new user |
| GET | /api/users/:id | Get user details by ID |

### Event Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/events/create | Create a new event |
| GET | /api/events/:id | Get event details by ID |
| POST | /api/events/:id/register | Register a user for an event |
| DELETE | /api/events/:id/register | Cancel a user's registration |
| GET | /api/events/upcoming | List all upcoming events |
| GET | /api/events/:id/stats | Get registration statistics for an event |

## Sample Requests/Responses

### Create User

**Request:**
```http
POST /api/users/create
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "created_at": "2023-06-15T10:30:00.000Z"
}
```

### Create Event

**Request:**
```http
POST /api/events/create
Content-Type: application/json

{
  "title": "Tech Conference 2023",
  "date_time": "2023-08-15T09:00:00.000Z",
  "location": "Convention Center, New York",
  "capacity": 200
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Tech Conference 2023",
  "date_time": "2023-08-15T09:00:00.000Z",
  "location": "Convention Center, New York",
  "capacity": 200,
  "created_at": "2023-06-15T11:00:00.000Z"
}
```

### Register for Event

**Request:**
```http
POST /api/events/1/register
Content-Type: application/json

{
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "registration": {
    "id": 1,
    "user_id": 1,
    "event_id": 1,
    "created_at": "2023-06-15T11:30:00.000Z"
  }
}
```

### Cancel Registration

**Request:**
```http
DELETE /api/events/1/register
Content-Type: application/json

{
  "userId": 1
}
```

**Response:**
```json
{
  "success": true
}
```

### Get Event Details

**Request:**
```http
GET /api/events/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Tech Conference 2023",
  "date_time": "2023-08-15T09:00:00.000Z",
  "location": "Convention Center, New York",
  "capacity": 200,
  "created_at": "2023-06-15T11:00:00.000Z",
  "registrations": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

### List Upcoming Events

**Request:**
```http
GET /api/events/upcoming
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Tech Conference 2023",
    "date_time": "2023-08-15T09:00:00.000Z",
    "location": "Convention Center, New York",
    "capacity": 200,
    "created_at": "2023-06-15T11:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Networking Mixer",
    "date_time": "2023-07-20T18:00:00.000Z",
    "location": "Downtown Hotel, Boston",
    "capacity": 50,
    "created_at": "2023-06-16T09:00:00.000Z"
  }
]
```

### Get Event Statistics

**Request:**
```http
GET /api/events/1/stats
```

**Response:**
```json
{
  "eventId": 1,
  "title": "Tech Conference 2023",
  "capacity": 200,
  "registrationsCount": 45,
  "availableSpots": 155
}
```

## Usage Examples

### Using cURL

```bash
# Create a user
curl -X POST http://localhost:3000/api/users/create \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john.doe@example.com"}'

# Create an event
curl -X POST http://localhost:3000/api/events/create \
  -H "Content-Type: application/json" \
  -d '{"title": "Tech Conference 2023", "date_time": "2023-08-15T09:00:00.000Z", "location": "Convention Center, New York", "capacity": 200}'

# Register for an event
curl -X POST http://localhost:3000/api/events/1/register \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'

# Get upcoming events
curl -X GET http://localhost:3000/api/events/upcoming
```

### Using Postman

1. Set the request URL to the appropriate endpoint
2. Set the HTTP method (GET, POST, DELETE)
3. For POST requests, go to the "Body" tab, select "raw" and "JSON"
4. Enter the JSON request body as shown in the examples
5. Click "Send" to execute the request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.