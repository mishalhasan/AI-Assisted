# Joke API - FastAPI Microservice

A simple FastAPI microservice that serves random jokes via HTTP API.

## Project Structure

```
microservice/
├── joke.py              # FastAPI application with joke endpoints
├── requirements.txt     # Python dependencies
├── Dockerfile          # Docker image configuration
├── docker-compose.yml  # Docker Compose configuration
├── .dockerignore       # Files to exclude from Docker build
├── .gitignore         # Files to exclude from Git
└── README.md          # This file
```

## Features

- 🎭 Random joke endpoint
- 📋 List all jokes endpoint
- ❤️ Health check endpoint
- 📚 Interactive API documentation (Swagger UI)
- 🐳 Dockerized for easy deployment
- 🔄 Auto-restart on failure

## API Endpoints

- `GET /` - Root endpoint with API information
- `GET /joke` - Get a random joke
- `GET /jokes` - Get all available jokes
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker compose up --build

# Run in detached mode
docker compose up -d --build

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

### Using Python Directly

```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python joke.py
```

The API will be available at `http://localhost:8000`

## Testing the API

```bash
# Get a random joke
curl http://localhost:8000/joke

# Get all jokes
curl http://localhost:8000/jokes

# Health check
curl http://localhost:8000/health
```

Or visit `http://localhost:8000/docs` in your browser for interactive API documentation.

## Docker

### Build Image
```bash
docker build -t joke-api .
```

### Run Container
```bash
docker run -d -p 8000:8000 --name joke-api joke-api
```

## Requirements

- Python 3.12+
- FastAPI 0.104.1+
- Uvicorn 0.24.0+
- Docker (optional, for containerized deployment)

## License

MIT

