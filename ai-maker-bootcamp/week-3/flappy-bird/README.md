# 🐦 Flappy Bird - Mario Kart Edition

A Mario Kart-themed Flappy Bird game built with Python and Pygame. Navigate through obstacles, collect coins and fireballs, avoid enemies, and try to achieve the highest score!

## 🎮 Features

- **Classic Flappy Bird Gameplay** - Navigate through walls by flapping
- **Mario Kart Theme** - Custom graphics and sounds inspired by Mario Kart
- **Multiple Difficulty Levels** - Easy, Medium, and Hard modes
- **Power-ups & Collectibles:**
  - 🪙 Coins - Collect for points
  - 🔥 Fireballs - Shoot enemies to clear your path
  - 👾 Enemies - Avoid or destroy them
- **High Score Tracking** - Your best score is saved automatically
- **Smooth Animations** - Fluid gameplay with responsive controls
- **Sound Effects** - Immersive audio feedback for all actions

## 🎯 Gameplay

### Controls
- **SPACE** or **UP Arrow** - Flap/Jump
- **ESC** - Pause/Resume game
- **Q** - Quit game

### Objectives
1. Navigate through gaps in walls
2. Collect coins for bonus points
3. Collect fireballs to shoot enemies
4. Avoid or destroy enemies
5. Survive as long as possible to achieve a high score

### Difficulty Levels

**Easy:**
- Slower wall and enemy speeds
- Larger gaps between walls
- More forgiving gravity

**Medium:**
- Moderate speeds and gaps
- Balanced gameplay

**Hard:**
- Fast-moving obstacles
- Smaller gaps
- Increased gravity

## 📋 Requirements

- Python 3.10 or higher
- Pygame 2.5.0 or higher

## 🚀 Installation

1. **Navigate to the project directory:**
   ```bash
   cd week-3/flappy-bird
   ```

2. **Create and activate a virtual environment (recommended):**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## 🎮 Running the Game

### Option 1: Using Python directly
```bash
python main.py
```

### Option 2: Using the run script (Linux/Mac)
```bash
chmod +x run.sh
./run.sh
```

### Option 3: Using game.py directly
```bash
python game.py
```

## 📁 Project Structure

```
flappy-bird/
├── main.py              # Entry point for the game
├── game.py              # Main game logic and classes
├── config.json          # Game configuration (difficulty levels, screen size, etc.)
├── settings.json        # User settings (high score, preferences)
├── high_score.json      # High score storage
├── requirements.txt     # Python dependencies
├── run.sh              # Convenience script to run the game
├── asssets/            # Game assets
│   ├── images/         # Sprite images
│   │   ├── player.png  # Bird/player sprite
│   │   ├── enemy.png   # Enemy sprite
│   │   ├── coin.png    # Coin sprite
│   │   ├── fireball.png # Fireball sprite
│   │   └── map.png     # Background map
│   └── sounds/        # Sound effects
│       ├── bg.wav      # Background music
│       ├── flap.wav    # Flap sound
│       ├── coin-collecting.wav
│       ├── fireball_shoot.wav
│       ├── fireball_collect.wav
│       ├── enemy.wav
│       ├── enemy_die.wav
│       └── gameover.wav
└── README.md           # This file
```

## ⚙️ Configuration

### Game Configuration (`config.json`)

The game supports three difficulty levels with customizable parameters:
- `wall_speed` - Speed of moving walls
- `enemy_speed` - Speed of enemies
- `wall_spawn_rate` - Frequency of wall spawning
- `enemy_spawn_rate` - Frequency of enemy spawning
- `wall_gap_size` - Size of gaps in walls
- `wall_spacing` - Distance between walls
- `gravity` - Gravity strength
- `flap_strength` - Jump/flap power

### Settings (`settings.json`)

User preferences and high scores are stored here. The game automatically updates this file when you achieve a new high score.

## 🎨 Customization

### Adding New Levels

Edit `config.json` to add new difficulty levels or modify existing ones. Each level can have different speeds, spawn rates, and physics parameters.

### Changing Assets

Replace images in `asssets/images/` or sounds in `asssets/sounds/` with your own files. Make sure to maintain the same file names or update the code accordingly.

## 🐛 Troubleshooting

### Game won't start
- Ensure Pygame is installed: `pip install pygame`
- Check Python version: `python --version` (should be 3.10+)
- Verify all asset files are present in the `asssets/` directory

### No sound
- Check that sound files exist in `asssets/sounds/`
- Ensure your system volume is not muted
- Pygame mixer may need system audio permissions

### Performance issues
- Close other applications to free up system resources
- Lower the screen resolution in `config.json` if needed

## 📝 Notes

- High scores are saved automatically in `high_score.json`
- The game window can be resized by modifying `screen_width` and `screen_height` in `config.json`
- All game assets are included in the repository (except large video files which are excluded)

## 🎯 Tips for High Scores

1. **Timing is Key** - Learn the rhythm of flapping
2. **Collect Power-ups** - Fireballs help clear enemies
3. **Stay Centered** - Try to navigate through the middle of gaps
4. **Practice** - Start with Easy mode to learn the mechanics
5. **Stay Calm** - Don't flap too frantically, maintain control

## 📄 License

This project is part of the AI Maker Bootcamp educational program.

## 👤 Author

Created as part of Week 3 of the AI Maker Bootcamp.

---

**Enjoy the game! 🎮**

