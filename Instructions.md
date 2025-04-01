# Popcorn Palace - Movie Ticket Booking System

<p>
  A NestJS-based backend service for managing movie listings, showtimes, and ticket bookings.
</p>

## Overview

Popcorn Palace is a comprehensive backend service built with NestJS that provides RESTful APIs for:

- **Movie Management**: Add, update, retrieve, and delete movie listings
- **Showtime Management**: Schedule and manage movie showtimes across theaters
- **Booking System**: Handle ticket reservations and purchases

### Database Entities

The application uses TypeORM with the following entities:

1. **Movie**: Stores movie information including title, genre, duration, rating, and release year
2. **Showtime**: Represents scheduled movie showings with theater, start/end times, and pricing
3. **Booking**: Manages ticket reservations with references to showtimes, seats, and user information

## API Endpoints

### Movies API

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| GET    | `/movies/all`                 | Retrieve all available movies |
| POST   | `/movies`                     | Add a new movie               |
| POST   | `/movies/update/{movieTitle}` | Update an existing movie      |
| DELETE | `/movies/{movieTitle}`        | Remove a movie                |

### Showtimes API

| Method | Endpoint                         | Description                |
| ------ | -------------------------------- | -------------------------- |
| GET    | `/showtimes/{showtimeId}`        | Get showtime details by ID |
| POST   | `/showtimes`                     | Create a new showtime      |
| POST   | `/showtimes/update/{showtimeId}` | Update showtime details    |
| DELETE | `/showtimes/{showtimeId}`        | Remove a showtime          |

### Bookings API

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| POST   | `/bookings` | Book a movie ticket |

## Development Setup

### Prerequisites

- Node.js
- PostgreSQL
- npm or yarn
- Docker and Docker Compose (optional, for containerized setup)

### Installation

```bash
# Install dependencies
npm install
```

### Database initialization:

```bash
# Start PostgreSQL container
docker-compose up -d
```

### Running the Application

```bash
# Development mode with auto-reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000` by default.

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests for a specific module
npm run test -- movies
```

### End-to-End Tests

```bash
# Start database
docker-compose up -d

# Run E2E tests
npm run test:e2e
```
