#!/usr/bin/env python3
"""
A FastAPI application that serves jokes via HTTP API.
"""

import random
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from typing import List, Dict

app = FastAPI(
    title="Joke API",
    description="A simple API that serves random jokes",
    version="1.0.0"
)

def get_jokes() -> List[Dict[str, str]]:
    """Returns a list of jokes."""
    jokes = [
        {
            "setup": "Why don't scientists trust atoms?",
            "punchline": "Because they make up everything!"
        },
        {
            "setup": "Why did the scarecrow win an award?",
            "punchline": "He was outstanding in his field!"
        },
        {
            "setup": "Why don't eggs tell jokes?",
            "punchline": "They'd crack each other up!"
        },
        {
            "setup": "What do you call a fake noodle?",
            "punchline": "An impasta!"
        },
        {
            "setup": "Why did the math book look so sad?",
            "punchline": "Because it had too many problems!"
        },
        {
            "setup": "What do you call a bear with no teeth?",
            "punchline": "A gummy bear!"
        },
        {
            "setup": "Why don't programmers like nature?",
            "punchline": "It has too many bugs!"
        },
        {
            "setup": "How do you comfort a JavaScript bug?",
            "punchline": "You console it!"
        },
        {
            "setup": "Why do Python developers prefer dark mode?",
            "punchline": "Because light attracts bugs!"
        },
        {
            "setup": "What's a programmer's favorite hangout place?",
            "punchline": "Foo Bar!"
        }
    ]
    return jokes

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to the Joke API! 🎭",
        "endpoints": {
            "/joke": "Get a random joke",
            "/jokes": "Get all jokes",
            "/health": "Health check",
            "/docs": "Interactive API documentation"
        }
    }

@app.get("/joke")
async def get_random_joke():
    """Returns a random joke."""
    jokes = get_jokes()
    joke = random.choice(jokes)
    return {
        "joke": joke,
        "message": "🎭 Joke of the moment!"
    }

@app.get("/jokes")
async def get_all_jokes():
    """Returns all available jokes."""
    jokes = get_jokes()
    return {
        "total": len(jokes),
        "jokes": jokes
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Joke API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

