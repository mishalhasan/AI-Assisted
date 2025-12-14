#!/usr/bin/env python3
"""
Flappy Bird - Mario Kart Edition
Main entry point for the game
"""

from game import Game

if __name__ == "__main__":
    try:
        game = Game()
        game.run()
    except KeyboardInterrupt:
        print("\nGame interrupted by user.")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

