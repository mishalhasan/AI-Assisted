import pygame
import json
import os
import random
import math

# Initialize Pygame
pygame.init()
pygame.mixer.init()

class Bird:
    def __init__(self, x, y, size, gravity, flap_strength):
        self.x = x
        self.y = y
        self.size = size
        self.velocity = 0
        self.gravity = gravity
        self.flap_strength = flap_strength
        self.image = None
        self.rect = None
        self.has_flapped = False  # Track if bird has flapped yet
        
    def load_image(self, path):
        """Load and scale bird image"""
        try:
            img = pygame.image.load(path).convert_alpha()
            self.image = pygame.transform.scale(img, (self.size, self.size))
            self.rect = self.image.get_rect(center=(self.x, self.y))
        except:
            # Fallback to colored rectangle if image fails to load
            self.image = pygame.Surface((self.size, self.size))
            self.image.fill((255, 200, 0))
            self.rect = self.image.get_rect(center=(self.x, self.y))
    
    def flap(self):
        """Make the bird flap upward"""
        self.has_flapped = True  # Enable gravity after first flap
        self.velocity = self.flap_strength
    
    def update(self):
        """Update bird position based on gravity"""
        # Only apply gravity after first flap
        if self.has_flapped:
            self.velocity += self.gravity
        self.y += self.velocity
        if self.rect:
            self.rect.center = (self.x, self.y)
    
    def draw(self, screen):
        """Draw the bird on screen"""
        if self.image and self.rect:
            screen.blit(self.image, self.rect)
        else:
            pygame.draw.circle(screen, (255, 200, 0), (int(self.x), int(self.y)), self.size // 2)

class Wall:
    def __init__(self, x, screen_height, gap_size, wall_width, speed, min_gap_size):
        self.x = x
        self.screen_height = screen_height
        # Ensure gap is always larger than minimum required
        self.gap_size = max(gap_size, min_gap_size + 20)
        self.wall_width = wall_width
        self.speed = speed
        
        # Calculate gap position (random but ensuring gap is visible)
        gap_y = random.randint(self.gap_size, screen_height - self.gap_size)
        self.top_height = gap_y - self.gap_size // 2
        self.bottom_y = gap_y + self.gap_size // 2
        self.bottom_height = screen_height - self.bottom_y
        
        # Mario pipe colors - cylindrical shading
        self.pipe_top_dark = (0, 120, 0)  # Dark green for top
        self.pipe_top_medium = (0, 150, 0)  # Medium green for top checkered
        self.pipe_body_light = (0, 180, 0)  # Light green for body center
        self.pipe_body_medium = (0, 150, 0)  # Medium green for body stripes
        self.pipe_body_dark = (0, 120, 0)  # Dark green for shadows
        self.pipe_highlight = (50, 200, 50)  # Bright green for highlights
        self.pipe_border = (0, 80, 0)  # Dark border
        self.pipe_top_height = 30  # Height of the top section
        
        self.passed = False
    
    def update(self):
        """Move wall to the left"""
        self.x -= self.speed
    
    def draw(self, screen):
        """Draw Mario-style green pipes"""
        # Top pipe
        self._draw_pipe(screen, self.x, 0, self.top_height, True)
        
        # Bottom pipe
        self._draw_pipe(screen, self.x, self.bottom_y, self.bottom_height, False)
    
    def _draw_pipe(self, screen, x, y, height, is_top):
        """Draw a Mario-style green pipe with cylindrical 3D effect"""
        # For top pipe: top section at bottom (near gap)
        # For bottom pipe: top section at top (near gap)
        if is_top:
            # Top pipe: top section at the bottom, body above
            top_section_y = y + height - self.pipe_top_height
            body_y = y
            body_height = height - self.pipe_top_height
        else:
            # Bottom pipe: top section at the top, body below
            top_section_y = y
            body_y = y + self.pipe_top_height
            body_height = height - self.pipe_top_height
        
        # Draw pipe body with cylindrical shading
        if body_height > 0:
            body_rect = pygame.Rect(x, body_y, self.wall_width, body_height)
            
            # Base color
            pygame.draw.rect(screen, self.pipe_body_light, body_rect)
            
            # Create cylindrical shading effect - darker on edges, lighter in center
            center_x = self.wall_width // 2
            highlight_width = self.wall_width // 3
            
            # Left shadow (darker)
            shadow_rect = pygame.Rect(x, body_y, self.wall_width // 4, body_height)
            pygame.draw.rect(screen, self.pipe_body_dark, shadow_rect)
            
            # Right shadow (darker)
            shadow_rect = pygame.Rect(x + self.wall_width - self.wall_width // 4, body_y, 
                                     self.wall_width // 4, body_height)
            pygame.draw.rect(screen, self.pipe_body_dark, shadow_rect)
            
            # Center highlight (brighter)
            highlight_rect = pygame.Rect(x + center_x - highlight_width // 2, body_y, 
                                       highlight_width, body_height)
            pygame.draw.rect(screen, self.pipe_highlight, highlight_rect)
            
            # Draw vertical stripes with cylindrical effect
            stripe_width = 3
            for stripe_x in range(0, self.wall_width, stripe_width * 2):
                # Make stripes darker on edges, lighter in center
                stripe_center_dist = abs(stripe_x - center_x)
                stripe_alpha = max(0, 255 - int(stripe_center_dist * 2))
                stripe_color = self.pipe_body_medium
                
                stripe_rect = pygame.Rect(x + stripe_x, body_y, stripe_width, body_height)
                pygame.draw.rect(screen, stripe_color, stripe_rect)
        
        # Draw pipe top section with cylindrical effect
        top_rect = pygame.Rect(x, top_section_y, self.wall_width, self.pipe_top_height)
        pygame.draw.rect(screen, self.pipe_top_dark, top_rect)
        
        # Add cylindrical shading to top section
        center_x = self.wall_width // 2
        highlight_width = self.wall_width // 3
        
        # Left shadow
        shadow_rect = pygame.Rect(x, top_section_y, self.wall_width // 4, self.pipe_top_height)
        darker_top = tuple(max(0, c - 20) for c in self.pipe_top_dark)
        pygame.draw.rect(screen, darker_top, shadow_rect)
        
        # Right shadow
        shadow_rect = pygame.Rect(x + self.wall_width - self.wall_width // 4, top_section_y,
                                 self.wall_width // 4, self.pipe_top_height)
        pygame.draw.rect(screen, darker_top, shadow_rect)
        
        # Center highlight
        highlight_rect = pygame.Rect(x + center_x - highlight_width // 2, top_section_y,
                                   highlight_width, self.pipe_top_height)
        brighter_top = tuple(min(255, c + 30) for c in self.pipe_top_medium)
        pygame.draw.rect(screen, brighter_top, highlight_rect)
        
        # Draw checkered pattern on top section
        checker_size = 8
        for check_y in range(0, self.pipe_top_height, checker_size):
            for check_x in range(0, self.wall_width, checker_size):
                if ((check_x // checker_size) + (check_y // checker_size)) % 2 == 0:
                    pygame.draw.rect(screen, self.pipe_top_medium,
                                   (x + check_x, top_section_y + check_y,
                                    min(checker_size, self.wall_width - check_x),
                                    min(checker_size, self.pipe_top_height - check_y)))
        
        # Draw rounded top/bottom edges for cylindrical look
        if is_top:
            # Draw rounded bottom edge of top pipe
            pygame.draw.ellipse(screen, self.pipe_body_light, 
                               (x - 2, y + height - 8, self.wall_width + 4, 8))
        else:
            # Draw rounded top edge of bottom pipe
            pygame.draw.ellipse(screen, self.pipe_body_light,
                               (x - 2, y - 2, self.wall_width + 4, 8))
        
        # Draw border around entire pipe with rounded corners effect
        full_rect = pygame.Rect(x, y, self.wall_width, height)
        pygame.draw.rect(screen, self.pipe_border, full_rect, 3)
        
        # Draw inner border on top section for depth
        pygame.draw.rect(screen, self.pipe_border, top_rect, 2)
        
        # Add subtle highlight line on the left edge for 3D effect
        highlight_line = pygame.Rect(x + 2, y, 2, height)
        pygame.draw.rect(screen, self.pipe_highlight, highlight_line)
    
    def get_rects(self):
        """Get collision rectangles for top and bottom walls"""
        top_rect = pygame.Rect(self.x, 0, self.wall_width, self.top_height)
        bottom_rect = pygame.Rect(self.x, self.bottom_y, self.wall_width, self.bottom_height)
        return top_rect, bottom_rect
    
    def get_gap_area(self):
        """Get the safe gap area between top and bottom pipes"""
        gap_top = self.top_height
        gap_bottom = self.bottom_y
        return gap_top, gap_bottom
    
    def is_off_screen(self):
        """Check if wall has moved off screen"""
        return self.x + self.wall_width < 0

class Enemy:
    def __init__(self, x, y, size, speed, screen_width):
        self.x = x
        self.y = y
        self.size = size
        self.speed = speed
        self.screen_width = screen_width
        self.image = None
        self.rect = None
        self.animation_frame = 0
        
    def load_image(self, path):
        """Load and scale enemy image"""
        try:
            img = pygame.image.load(path).convert_alpha()
            self.image = pygame.transform.scale(img, (self.size, self.size))
            self.rect = self.image.get_rect(center=(self.x, self.y))
        except:
            # Fallback to colored rectangle if image fails to load
            self.image = pygame.Surface((self.size, self.size))
            self.image.fill((255, 0, 0))
            self.rect = self.image.get_rect(center=(self.x, self.y))
    
    def update(self, bird_y):
        """Move enemy toward player (bird)"""
        # Move horizontally toward player
        self.x -= self.speed
        
        # Add slight vertical movement to make it look like flying
        self.animation_frame += 0.1
        self.y += math.sin(self.animation_frame) * 0.5
        
        if self.rect:
            self.rect.center = (self.x, self.y)
    
    def draw(self, screen):
        """Draw enemy on screen"""
        if self.image and self.rect:
            screen.blit(self.image, self.rect)
        else:
            pygame.draw.circle(screen, (255, 0, 0), (int(self.x), int(self.y)), self.size // 2)
    
    def is_off_screen(self):
        """Check if enemy has moved off screen"""
        return self.x + self.size < 0

class Coin:
    def __init__(self, x, y, size, speed, screen_width):
        self.x = x
        self.y = y
        self.size = size
        self.speed = speed
        self.screen_width = screen_width
        self.image = None
        self.rect = None
        self.animation_frame = 0
        self.collected = False
        
    def load_image(self, path):
        """Load and scale coin image"""
        try:
            img = pygame.image.load(path).convert_alpha()
            self.image = pygame.transform.scale(img, (self.size, self.size))
            self.rect = self.image.get_rect(center=(self.x, self.y))
        except:
            # Fallback to colored circle if image fails to load
            self.image = pygame.Surface((self.size, self.size), pygame.SRCALPHA)
            pygame.draw.circle(self.image, (255, 215, 0), (self.size // 2, self.size // 2), self.size // 2)
            self.rect = self.image.get_rect(center=(self.x, self.y))
    
    def update(self):
        """Move coin to the left and animate"""
        # Move horizontally
        self.x -= self.speed
        
        # Add floating animation (up and down)
        self.animation_frame += 0.15
        self.y += math.sin(self.animation_frame) * 1.5
        
        if self.rect:
            self.rect.center = (self.x, self.y)
    
    def draw(self, screen):
        """Draw coin on screen"""
        if self.image and self.rect:
            # Add rotation effect for visual appeal
            rotated_image = pygame.transform.rotate(self.image, self.animation_frame * 10)
            rotated_rect = rotated_image.get_rect(center=self.rect.center)
            screen.blit(rotated_image, rotated_rect)
        else:
            pygame.draw.circle(screen, (255, 215, 0), (int(self.x), int(self.y)), self.size // 2)
    
    def is_off_screen(self):
        """Check if coin has moved off screen"""
        return self.x + self.size < 0

class FireballCollectible:
    def __init__(self, x, y, size, speed, screen_width):
        self.x = x
        self.y = y
        self.size = size
        self.speed = speed
        self.screen_width = screen_width
        self.image = None
        self.rect = None
        self.animation_frame = 0
        self.collected = False
        
    def load_image(self, path):
        """Load and scale fireball image"""
        try:
            img = pygame.image.load(path).convert_alpha()
            self.image = pygame.transform.scale(img, (self.size, self.size))
            self.rect = self.image.get_rect(center=(self.x, self.y))
        except:
            # Fallback to colored circle if image fails to load
            self.image = pygame.Surface((self.size, self.size), pygame.SRCALPHA)
            pygame.draw.circle(self.image, (255, 100, 0), (self.size // 2, self.size // 2), self.size // 2)
            self.rect = self.image.get_rect(center=(self.x, self.y))
    
    def update(self):
        """Move fireball collectible to the left and animate"""
        # Move horizontally
        self.x -= self.speed
        
        # Add floating animation (up and down)
        self.animation_frame += 0.15
        self.y += math.sin(self.animation_frame) * 1.5
        
        if self.rect:
            self.rect.center = (self.x, self.y)
    
    def draw(self, screen):
        """Draw fireball collectible on screen"""
        if self.image and self.rect:
            # Add rotation effect for visual appeal
            rotated_image = pygame.transform.rotate(self.image, self.animation_frame * 15)
            rotated_rect = rotated_image.get_rect(center=self.rect.center)
            screen.blit(rotated_image, rotated_rect)
        else:
            pygame.draw.circle(screen, (255, 100, 0), (int(self.x), int(self.y)), self.size // 2)
    
    def is_off_screen(self):
        """Check if fireball collectible has moved off screen"""
        return self.x + self.size < 0

class FireballProjectile:
    def __init__(self, x, y, size, speed, screen_width):
        self.x = x
        self.y = y
        self.size = size
        self.speed = speed
        self.screen_width = screen_width
        self.image = None
        self.rect = None
        
    def load_image(self, path):
        """Load and scale fireball projectile image"""
        try:
            img = pygame.image.load(path).convert_alpha()
            self.image = pygame.transform.scale(img, (self.size, self.size))
            self.rect = self.image.get_rect(center=(self.x, self.y))
        except:
            # Fallback to colored circle if image fails to load
            self.image = pygame.Surface((self.size, self.size), pygame.SRCALPHA)
            pygame.draw.circle(self.image, (255, 100, 0), (self.size // 2, self.size // 2), self.size // 2)
            self.rect = self.image.get_rect(center=(self.x, self.y))
    
    def update(self):
        """Move fireball projectile to the right"""
        self.x += self.speed
        if self.rect:
            self.rect.center = (self.x, self.y)
    
    def draw(self, screen):
        """Draw fireball projectile on screen"""
        if self.image and self.rect:
            screen.blit(self.image, self.rect)
        else:
            pygame.draw.circle(screen, (255, 100, 0), (int(self.x), int(self.y)), self.size // 2)
    
    def is_off_screen(self):
        """Check if fireball projectile has moved off screen"""
        return self.x - self.size > self.screen_width

class Game:
    def __init__(self):
        # Load configuration
        with open('config.json', 'r') as f:
            self.config = json.load(f)
        
        # Screen setup
        self.screen_width = self.config['screen_width']
        self.screen_height = self.config['screen_height']
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Flappy Bird - Mario Kart Edition")
        
        # Game state
        self.state = "start"  # start, playing, gameover
        self.clock = pygame.time.Clock()
        self.score = 0
        self.coins_collected = 0  # Track coins collected
        self.high_score = self.load_high_score()
        self.current_level = 0
        self.level_config = self.config['levels'][self.current_level]
        
        # Game objects
        self.bird = None
        self.walls = []
        self.enemies = []
        self.coins = []
        self.fireball_collectibles = []
        self.fireball_projectiles = []
        self.fireball_ammo = 0  # Number of fireballs available
        
        # Timing
        self.wall_timer = 0
        self.enemy_timer = 0
        self.coin_timer = 0
        self.coin_cluster_timer = 0  # Timer for coin clusters
        self.fireball_collectible_timer = 0
        self.last_wall_x = self.screen_width  # Track last wall position for spacing
        
        # Load assets
        self.assets_path = "asssets"  # Using existing folder name
        self.load_assets()
        
        # Background
        self.bg_image = None
        self.load_background()
        
        # Fonts - try to use bold fonts for Mario Kart style
        try:
            # Try to use a bold system font
            self.font_large = pygame.font.Font(None, 96)
            self.font_large.set_bold(True)
            self.font_medium = pygame.font.Font(None, 56)
            self.font_medium.set_bold(True)
            self.font_small = pygame.font.Font(None, 36)
        except:
            # Fallback to default fonts
            self.font_large = pygame.font.Font(None, 96)
            self.font_medium = pygame.font.Font(None, 56)
            self.font_small = pygame.font.Font(None, 36)
        
        # Animation timer for start screen effects
        self.start_screen_timer = 0
        
        # Volume control
        volume_settings = self.load_volume_settings()
        self.volume = volume_settings.get('volume', 0.7)  # 0.0 to 1.0
        self.muted = volume_settings.get('muted', False)
        self.volume_slider_rect = None
        self.mute_button_rect = None
        self.slider_dragging = False
        
        # Level dropdown
        self.dropdown_open = False
        self.level_dropdown_rect = None
        self.level_option_rects = []
        
        # Sounds
        self.sounds = {}
        self.load_sounds()
    
    def load_assets(self):
        """Load game assets"""
        # Load bird image
        bird_path = os.path.join(self.assets_path, "images", "player.png")
        if os.path.exists(bird_path):
            self.bird_image_path = bird_path
        else:
            self.bird_image_path = None
        
        # Load enemy image
        enemy_path = os.path.join(self.assets_path, "images", "enemy.png")
        if os.path.exists(enemy_path):
            self.enemy_image_path = enemy_path
        else:
            self.enemy_image_path = None
        
        # Load coin image
        coin_path = os.path.join(self.assets_path, "images", "coin.png")
        if os.path.exists(coin_path):
            self.coin_image_path = coin_path
        else:
            self.coin_image_path = None
        
        # Load fireball image
        fireball_path = os.path.join(self.assets_path, "images", "fireball.png")
        if os.path.exists(fireball_path):
            self.fireball_image_path = fireball_path
        else:
            self.fireball_image_path = None
    
    def load_background(self):
        """Load background image"""
        bg_path = os.path.join(self.assets_path, "images", "map.png")
        if os.path.exists(bg_path):
            try:
                img = pygame.image.load(bg_path).convert()
                self.bg_image = pygame.transform.scale(img, (self.screen_width, self.screen_height))
            except:
                self.bg_image = None
        else:
            self.bg_image = None
    
    def load_sounds(self):
        """Load game sounds"""
        sound_files = {
            'flap': 'flap.wav',
            'bg': 'bg.wav',
            'enemy': 'enemy.wav',
            'gameover': 'gameover.wav',
            'coin': 'coin-collecting.wav',
            'fireball_collect': 'fireball_collect.wav',
            'fireball_shoot': 'fireball_shoot.wav',
            'enemy_die': 'enemy_die.wav'
        }
        
        for sound_name, filename in sound_files.items():
            sound_path = os.path.join(self.assets_path, "sounds", filename)
            if os.path.exists(sound_path):
                try:
                    self.sounds[sound_name] = pygame.mixer.Sound(sound_path)
                except:
                    pass
        
        # Play background music with volume
        if 'bg' in self.sounds:
            self.sounds['bg'].set_volume(self.volume if not self.muted else 0.0)
            self.sounds['bg'].play(-1)  # Loop background music
    
    def load_high_score(self):
        """Load high score from file"""
        try:
            if os.path.exists('high_score.json'):
                with open('high_score.json', 'r') as f:
                    data = json.load(f)
                    return data.get('high_score', 0)
        except:
            pass
        return 0
    
    def save_high_score(self):
        """Save high score to file"""
        try:
            with open('high_score.json', 'w') as f:
                json.dump({'high_score': self.high_score}, f)
        except:
            pass
    
    def load_volume_settings(self):
        """Load volume settings from file"""
        try:
            if os.path.exists('settings.json'):
                with open('settings.json', 'r') as f:
                    data = json.load(f)
                    return {
                        'volume': data.get('volume', 0.7),
                        'muted': data.get('muted', False)
                    }
        except:
            pass
        return {'volume': 0.7, 'muted': False}  # Default settings
    
    def save_volume_settings(self):
        """Save volume settings to file"""
        try:
            settings = {
                'volume': self.volume,
                'muted': self.muted
            }
            with open('settings.json', 'w') as f:
                json.dump(settings, f)
        except:
            pass
    
    def set_volume(self, volume):
        """Set volume for all sounds"""
        old_volume = self.volume
        self.volume = max(0.0, min(1.0, volume))  # Clamp between 0 and 1
        
        # Automatically mute when volume is 0, unmute when volume increases from 0
        if self.volume == 0.0:
            self.muted = True
        elif old_volume == 0.0 and self.volume > 0.0:
            # When volume increases from 0, automatically unmute
            self.muted = False
        
        actual_volume = 0.0 if self.muted else self.volume
        
        # Set volume for all sounds
        for sound in self.sounds.values():
            sound.set_volume(actual_volume)
        
        self.save_volume_settings()
    
    def toggle_mute(self):
        """Toggle mute state"""
        self.muted = not self.muted
        actual_volume = 0.0 if self.muted else self.volume
        
        # Set volume for all sounds
        for sound in self.sounds.values():
            sound.set_volume(actual_volume)
        
        self.save_volume_settings()
    
    def shoot_fireball(self):
        """Shoot a fireball projectile if player has ammo"""
        if self.fireball_ammo > 0 and self.bird and self.bird.rect:
            # Give Mario a small upward boost when shooting to help stay afloat
            # Use 60% of flap strength so shooting provides lift but not as much as flapping
            shoot_boost = self.level_config['flap_strength'] * 0.6
            # Apply boost: if falling (negative velocity), set to boost value; if rising, add boost
            if self.bird.velocity < 0:
                self.bird.velocity = shoot_boost
            else:
                self.bird.velocity += shoot_boost * 0.3  # Smaller boost if already rising
            self.bird.has_flapped = True  # Ensure gravity is enabled
            
            # Create fireball projectile at bird position
            fireball_size = self.config.get('fireball_size', 40)
            fireball_speed = 8  # Fast projectile speed
            fireball = FireballProjectile(
                self.bird.x + self.bird.size // 2,
                self.bird.y,
                fireball_size,
                fireball_speed,
                self.screen_width
            )
            if self.fireball_image_path:
                fireball.load_image(self.fireball_image_path)
            self.fireball_projectiles.append(fireball)
            self.fireball_ammo -= 1
            
            # Play fireball shoot sound with higher volume
            if 'fireball_shoot' in self.sounds:
                if self.muted:
                    fireball_shoot_volume = 0.0
                else:
                    fireball_shoot_volume = max(0.6, self.volume * 2.0)  # At least 60% or 2x master volume
                    fireball_shoot_volume = min(1.0, fireball_shoot_volume)  # Cap at 100%
                self.sounds['fireball_shoot'].set_volume(fireball_shoot_volume)
                self.sounds['fireball_shoot'].play()
    
    def start_game(self):
        """Initialize game objects"""
        self.state = "playing"
        self.score = 0
        self.coins_collected = 0  # Reset coins collected
        self.dropdown_open = False  # Close dropdown when starting game
        
        # Update level config based on selected level
        self.level_config = self.config['levels'][self.current_level]
        
        # Create bird (reset has_flapped flag)
        bird_x = self.screen_width // 4
        bird_y = self.screen_height // 2
        bird_size = self.config['bird_size']
        self.bird = Bird(bird_x, bird_y, bird_size, 
                        self.level_config['gravity'], 
                        self.level_config['flap_strength'])
        self.bird.has_flapped = False  # Bird won't fall until first flap
        
        if self.bird_image_path:
            self.bird.load_image(self.bird_image_path)
        
        # Clear walls, enemies, coins, and fireballs
        self.walls = []
        self.enemies = []
        self.coins = []
        self.fireball_collectibles = []
        self.fireball_projectiles = []
        self.fireball_ammo = 0  # Reset fireball ammo
        self.wall_timer = 0
        self.enemy_timer = 0
        self.coin_timer = 0
        self.coin_cluster_timer = 0
        self.fireball_collectible_timer = 0
        self.last_wall_x = self.screen_width
    
    def handle_events(self):
        """Handle pygame events"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    if self.state == "start":
                        self.dropdown_open = False  # Close dropdown when starting
                        self.start_game()
                    elif self.state == "playing":
                        # Check if shift is held to shoot fireball
                        keys = pygame.key.get_pressed()
                        if keys[pygame.K_LSHIFT] or keys[pygame.K_RSHIFT]:
                            self.shoot_fireball()
                        else:
                            self.bird.flap()
                            if 'flap' in self.sounds:
                                self.sounds['flap'].set_volume(0.0 if self.muted else self.volume)
                                self.sounds['flap'].play()
                    elif self.state == "gameover":
                        self.dropdown_open = False  # Close dropdown when restarting
                        self.start_game()
                elif event.key == pygame.K_f:  # F key to shoot fireball
                    if self.state == "playing":
                        self.shoot_fireball()
            
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Left mouse button
                    mouse_x, mouse_y = pygame.mouse.get_pos()
                    
                    # Check volume controls (available in all states)
                    if self.mute_button_rect and self.mute_button_rect.collidepoint(mouse_x, mouse_y):
                        self.toggle_mute()
                    elif self.volume_slider_rect and self.volume_slider_rect.collidepoint(mouse_x, mouse_y):
                        self.slider_dragging = True
                        # Update volume based on click position
                        slider_x = mouse_x - self.volume_slider_rect.x
                        slider_width = self.volume_slider_rect.width
                        new_volume = max(0.0, min(1.0, slider_x / slider_width))
                        self.set_volume(new_volume)
                    # Check dropdown options FIRST to prevent start button from being triggered
                    elif self.state == "start" and self.level_dropdown_rect and self.dropdown_open:
                        # Check if clicking on a dropdown option
                        level_selected = False
                        for i, option_rect in enumerate(self.level_option_rects):
                            if option_rect.collidepoint(mouse_x, mouse_y):
                                self.current_level = i
                                self.level_config = self.config['levels'][self.current_level]
                                self.dropdown_open = False
                                level_selected = True
                                break
                        
                        # If clicked on dropdown button, toggle it
                        if not level_selected and self.level_dropdown_rect.collidepoint(mouse_x, mouse_y):
                            self.dropdown_open = False
                        # If clicked outside dropdown area, close it
                        elif not level_selected:
                            clicked_in_dropdown_area = False
                            for option_rect in self.level_option_rects:
                                if option_rect.collidepoint(mouse_x, mouse_y):
                                    clicked_in_dropdown_area = True
                                    break
                            
                            if not clicked_in_dropdown_area:
                                self.dropdown_open = False
                    # Check start button (only if dropdown option wasn't clicked)
                    elif self.state == "start":
                        button_rect = pygame.Rect(self.screen_width // 2 - 120, 
                                                 self.screen_height // 2 + 30, 
                                                 240, 70)
                        if button_rect.collidepoint(mouse_x, mouse_y):
                            # Close dropdown if open
                            if self.dropdown_open:
                                self.dropdown_open = False
                            self.start_game()
                        # Check level dropdown button (only if not clicking start button and dropdown not open)
                        elif self.level_dropdown_rect and not self.dropdown_open:
                            # Open dropdown if clicking on button
                            if self.level_dropdown_rect.collidepoint(mouse_x, mouse_y):
                                self.dropdown_open = True
                    # Check level dropdown for gameover state
                    elif self.state == "gameover" and self.level_dropdown_rect:
                        if self.dropdown_open:
                            # Check if clicking on an option
                            level_selected = False
                            for i, option_rect in enumerate(self.level_option_rects):
                                if option_rect.collidepoint(mouse_x, mouse_y):
                                    self.current_level = i
                                    self.level_config = self.config['levels'][self.current_level]
                                    self.dropdown_open = False
                                    level_selected = True
                                    break
                            
                            # If clicked on dropdown button, toggle it
                            if not level_selected and self.level_dropdown_rect.collidepoint(mouse_x, mouse_y):
                                self.dropdown_open = False
                            # If clicked outside dropdown area, close it
                            elif not level_selected:
                                clicked_in_dropdown_area = False
                                for option_rect in self.level_option_rects:
                                    if option_rect.collidepoint(mouse_x, mouse_y):
                                        clicked_in_dropdown_area = True
                                        break
                                
                                if not clicked_in_dropdown_area:
                                    self.dropdown_open = False
                        else:
                            # Open dropdown if clicking on button
                            if self.level_dropdown_rect.collidepoint(mouse_x, mouse_y):
                                self.dropdown_open = True
                    elif self.state == "playing":
                        self.bird.flap()
                        if 'flap' in self.sounds:
                            self.sounds['flap'].set_volume(0.0 if self.muted else self.volume)
                            self.sounds['flap'].play()
                    elif self.state == "gameover":
                        # Close dropdown if open
                        if self.dropdown_open:
                            self.dropdown_open = False
                        self.start_game()
            
            if event.type == pygame.MOUSEBUTTONUP:
                if event.button == 1:
                    self.slider_dragging = False
            
            if event.type == pygame.MOUSEMOTION:
                if self.slider_dragging and self.volume_slider_rect:
                    mouse_x, mouse_y = pygame.mouse.get_pos()
                    slider_x = mouse_x - self.volume_slider_rect.x
                    slider_width = self.volume_slider_rect.width
                    new_volume = max(0.0, min(1.0, slider_x / slider_width))
                    self.set_volume(new_volume)
        
        return True
    
    def update(self):
        """Update game logic"""
        if self.state != "playing":
            return
        
        # Update bird
        self.bird.update()
        
        # Check bird boundaries
        if self.bird.y < 0 or self.bird.y > self.screen_height:
            self.game_over()
            return
        
        # Update walls - spawn based on spacing, not just timer
        should_spawn = False
        if len(self.walls) == 0:
            # Spawn first wall
            should_spawn = True
        else:
            # Check if last wall has moved far enough
            last_wall = max(self.walls, key=lambda w: w.x) if self.walls else None
            if last_wall and last_wall.x < self.screen_width - self.level_config['wall_spacing']:
                should_spawn = True
        
        if should_spawn:
            new_wall = Wall(self.screen_width, self.screen_height,
                          self.level_config['wall_gap_size'],
                          self.config['wall_width'],
                          self.level_config['wall_speed'],
                          self.config['bird_size'] + 20)  # Ensure gap > bird size
            self.walls.append(new_wall)
            self.last_wall_x = self.screen_width
        
        for wall in self.walls[:]:
            wall.update()
            
            # Check collision
            top_rect, bottom_rect = wall.get_rects()
            if self.bird.rect and (top_rect.colliderect(self.bird.rect) or 
                                  bottom_rect.colliderect(self.bird.rect)):
                self.game_over()
                return
            
            # Check if bird passed wall
            if not wall.passed and wall.x + self.config['wall_width'] < self.bird.x:
                wall.passed = True
                self.score += 1
            
            # Remove off-screen walls
            if wall.is_off_screen():
                self.walls.remove(wall)
        
        # Update enemies
        self.enemy_timer += 1
        if self.enemy_timer >= self.level_config['enemy_spawn_rate']:
            self.enemy_timer = 0
            # Spawn enemy from right side, random Y position
            enemy_y = random.randint(50, self.screen_height - 50)
            enemy = Enemy(self.screen_width, enemy_y,
                         self.config['enemy_size'],
                         self.level_config['enemy_speed'],
                         self.screen_width)
            if self.enemy_image_path:
                enemy.load_image(self.enemy_image_path)
            self.enemies.append(enemy)
        
        for enemy in self.enemies[:]:
            enemy.update(self.bird.y)
            
            # Check collision
            if self.bird.rect and enemy.rect and self.bird.rect.colliderect(enemy.rect):
                self.game_over()
                return
            
            # Remove off-screen enemies
            if enemy.is_off_screen():
                self.enemies.remove(enemy)
        
        # Update coins - spawn single coins more frequently
        self.coin_timer += 1
        if self.coin_timer >= 120:  # Spawn coins more frequently (reduced from 200)
            self.coin_timer = 0
            
            # Try to spawn a coin in a safe location (preferably in pipe gaps)
            coin_size = self.config.get('coin_size', 30)
            bird_size = self.config['bird_size']
            # Adaptive clearance padding - smaller gaps need less padding
            max_attempts = 40  # More attempts to find a good spot
            coin_spawned = False
            
            # First, try to spawn in pipe gaps (safest locations)
            gap_positions = []
            for wall in self.walls:
                if wall.x > self.screen_width - 300:  # Only consider walls that are coming soon
                    gap_top, gap_bottom = wall.get_gap_area()
                    gap_height = gap_bottom - gap_top
                    
                    # Adaptive clearance padding based on gap size
                    if gap_height >= 250:
                        clearance_padding = 25  # Easy level - more padding
                    elif gap_height >= 230:
                        clearance_padding = 20  # Medium level - moderate padding
                    else:
                        clearance_padding = 15  # Hard level - minimal padding
                    
                    # Minimum gap height with adaptive padding
                    min_gap_height = bird_size + coin_size + (clearance_padding * 2)
                    
                    # Gap must be large enough for Mario + coin + clearance
                    if gap_height >= min_gap_height:
                        # Calculate safe spawn area within gap (with padding from edges)
                        safe_top = gap_top + clearance_padding
                        safe_bottom = gap_bottom - clearance_padding
                        
                        # Ensure safe area is still large enough
                        if safe_bottom - safe_top >= coin_size + bird_size:
                            # Spawn in center of safe area
                            safe_center = (safe_top + safe_bottom) // 2
                            gap_positions.append((safe_center, wall.x, gap_top, gap_bottom, gap_height, clearance_padding))
            
            # Try gap positions first
            for coin_y, wall_x, gap_top, gap_bottom, gap_height, clearance_padding in gap_positions:
                coin_x = self.screen_width
                
                # Coin is already positioned in safe area (between safe_top and safe_bottom)
                # which accounts for clearance_padding, so we don't need additional safe_margin checks
                coin_top = coin_y - coin_size // 2
                coin_bottom = coin_y + coin_size // 2
                
                # Verify coin is within the safe area we calculated
                safe_top = gap_top + clearance_padding
                safe_bottom = gap_bottom - clearance_padding
                
                if coin_top < safe_top or coin_bottom > safe_bottom:
                    continue  # Coin outside safe area
                
                # Check if Mario can collect it safely (Mario above and below coin)
                # Use the gap boundaries for space calculation
                mario_top_space = coin_top - gap_top
                mario_bottom_space = gap_bottom - coin_bottom
                
                # Need at least bird_size space on each side for Mario to collect
                # Reduced requirement - just need bird_size, not bird_size + padding
                if mario_top_space < bird_size or mario_bottom_space < bird_size:
                    continue  # Not enough space for Mario to collect
                
                # Check if this position is safe from enemies
                temp_coin_rect = pygame.Rect(coin_x - coin_size // 2, coin_y - coin_size // 2, 
                                           coin_size, coin_size)
                
                too_close_to_enemy = False
                enemy_safe_margin = 40  # Fixed margin for enemy checking
                for enemy in self.enemies:
                    if enemy.rect:
                        enemy_check_rect = enemy.rect.inflate(enemy_safe_margin * 2, enemy_safe_margin * 2)
                        if temp_coin_rect.colliderect(enemy_check_rect):
                            too_close_to_enemy = True
                            break
                
                if too_close_to_enemy:
                    continue
                
                # Check if coin will be blocked by upcoming walls as it moves
                will_be_blocked = False
                for wall in self.walls:
                    if wall.x > coin_x - 400:  # Check walls that will be near the coin's path
                        top_rect, bottom_rect = wall.get_rects()
                        # Check multiple positions along coin's path
                        for check_x in range(int(coin_x), int(coin_x - 300), -20):
                            future_coin_rect = pygame.Rect(check_x - coin_size // 2, coin_y - coin_size // 2,
                                                         coin_size, coin_size)
                            if future_coin_rect.colliderect(top_rect) or future_coin_rect.colliderect(bottom_rect):
                                will_be_blocked = True
                                break
                        if will_be_blocked:
                            break
                    
                    if will_be_blocked:
                        break
                
                if not will_be_blocked:
                    # Safe position found, spawn coin
                    coin = Coin(coin_x, coin_y,
                              coin_size,
                              self.level_config['wall_speed'],
                              self.screen_width)
                    if self.coin_image_path:
                        coin.load_image(self.coin_image_path)
                    self.coins.append(coin)
                    coin_spawned = True
                    break
            
            # If no gap position worked, try random positions with adaptive checks
            if not coin_spawned:
                for attempt in range(max_attempts):
                    coin_y = random.randint(150, self.screen_height - 150)
                    coin_x = self.screen_width
                    
                    coin_top = coin_y - coin_size // 2
                    coin_bottom = coin_y + coin_size // 2
                    
                    # Check collision with walls/pipes with adaptive clearance
                    too_close_to_wall = False
                    for wall in self.walls:
                        top_rect, bottom_rect = wall.get_rects()
                        gap_top, gap_bottom = wall.get_gap_area()
                        gap_height = gap_bottom - gap_top
                        
                        # Adaptive clearance padding based on gap size
                        if gap_height >= 250:
                            adaptive_clearance = 25
                        elif gap_height >= 230:
                            adaptive_clearance = 20
                        else:
                            adaptive_clearance = 15
                        
                        # Check if coin overlaps with pipes
                        coin_rect = pygame.Rect(coin_x - coin_size // 2, coin_y - coin_size // 2, 
                                              coin_size, coin_size)
                        if coin_rect.colliderect(top_rect) or coin_rect.colliderect(bottom_rect):
                            too_close_to_wall = True
                            break
                        
                        # If coin is in gap, check clearance with adaptive padding
                        if gap_top < coin_y < gap_bottom:
                            safe_top = gap_top + adaptive_clearance
                            safe_bottom = gap_bottom - adaptive_clearance
                            
                            if coin_top < safe_top or coin_bottom > safe_bottom:
                                too_close_to_wall = True
                                break
                            
                            # Check Mario clearance - just need bird_size on each side
                            mario_top_space = coin_top - gap_top
                            mario_bottom_space = gap_bottom - coin_bottom
                            if mario_top_space < bird_size or mario_bottom_space < bird_size:
                                too_close_to_wall = True
                                break
                    
                    if too_close_to_wall:
                        continue
                    
                    # Check if coin will be blocked by upcoming walls
                    will_be_blocked = False
                    for wall in self.walls:
                        if wall.x > coin_x - 500:  # Check walls in coin's path
                            top_rect, bottom_rect = wall.get_rects()
                            gap_top, gap_bottom = wall.get_gap_area()
                            gap_height = gap_bottom - gap_top
                            
                            # Adaptive clearance padding for path checking
                            if gap_height >= 250:
                                path_clearance = 25
                            elif gap_height >= 230:
                                path_clearance = 20
                            else:
                                path_clearance = 15
                            
                            # Check multiple positions along coin's path
                            for check_x in range(int(coin_x), int(coin_x - 400), -20):
                                future_coin_rect = pygame.Rect(check_x - coin_size // 2, coin_y - coin_size // 2,
                                                             coin_size, coin_size)
                                if future_coin_rect.colliderect(top_rect) or future_coin_rect.colliderect(bottom_rect):
                                    will_be_blocked = True
                                    break
                                
                                # If in gap, check clearance with adaptive padding
                                if gap_top < coin_y < gap_bottom:
                                    safe_top = gap_top + path_clearance
                                    safe_bottom = gap_bottom - path_clearance
                                    future_top = coin_y - coin_size // 2
                                    future_bottom = coin_y + coin_size // 2
                                    if future_top < safe_top or future_bottom > safe_bottom:
                                        will_be_blocked = True
                                        break
                            
                            if will_be_blocked:
                                break
                    
                    if will_be_blocked:
                        continue
                    
                    # Check collision with enemies
                    too_close_to_enemy = False
                    enemy_safe_margin = 40  # Fixed margin for enemy checking
                    for enemy in self.enemies:
                        if enemy.rect:
                            enemy_check_rect = enemy.rect.inflate(enemy_safe_margin * 2, enemy_safe_margin * 2)
                            coin_rect = pygame.Rect(coin_x - coin_size // 2, coin_y - coin_size // 2, 
                                                  coin_size, coin_size)
                            if coin_rect.colliderect(enemy_check_rect):
                                too_close_to_enemy = True
                                break
                    
                    if too_close_to_enemy:
                        continue
                    
                    # Safe position found, spawn coin
                    coin = Coin(coin_x, coin_y,
                              coin_size,
                              self.level_config['wall_speed'],
                              self.screen_width)
                    if self.coin_image_path:
                        coin.load_image(self.coin_image_path)
                    self.coins.append(coin)
                    coin_spawned = True
                    break
            
            # If we couldn't find a safe spot after max attempts, skip this spawn
            # (Better to skip than spawn in a bad location)
        
        # Update coin clusters - spawn clusters less frequently than single coins
        self.coin_cluster_timer += 1
        if self.coin_cluster_timer >= 300:  # Spawn clusters every 300 frames
            self.coin_cluster_timer = 0
            
            coin_size = self.config.get('coin_size', 30)
            bird_size = self.config['bird_size']
            cluster_size = random.randint(3, 5)  # 3-5 coins per cluster
            coin_spacing = coin_size + 15  # Spacing between coins in cluster
            cluster_spawned = False
            
            # Try to spawn cluster in pipe gaps
            gap_positions = []
            for wall in self.walls:
                if wall.x > self.screen_width - 300:
                    gap_top, gap_bottom = wall.get_gap_area()
                    gap_height = gap_bottom - gap_top
                    
                    # Adaptive clearance padding based on gap size
                    if gap_height >= 250:
                        clearance_padding = 25  # Easy level - more padding
                    elif gap_height >= 230:
                        clearance_padding = 20  # Medium level - moderate padding
                    else:
                        clearance_padding = 15  # Hard level - minimal padding
                    
                    # Need enough space for cluster (cluster height + Mario clearance)
                    cluster_height = (cluster_size - 1) * coin_spacing + coin_size
                    min_gap_for_cluster = bird_size + cluster_height + (clearance_padding * 2)
                    
                    if gap_height >= min_gap_for_cluster:
                        # Calculate safe spawn area
                        safe_top = gap_top + clearance_padding
                        safe_bottom = gap_bottom - clearance_padding
                        
                        if safe_bottom - safe_top >= cluster_height + bird_size:
                            # Center of safe area
                            safe_center = (safe_top + safe_bottom) // 2
                            gap_positions.append((safe_center, wall.x, gap_top, gap_bottom, gap_height, clearance_padding))
            
            # Try to spawn cluster in gaps
            for cluster_y, wall_x, gap_top, gap_bottom, gap_height, clearance_padding in gap_positions:
                cluster_x = self.screen_width
                
                # Cluster is already positioned in safe area (between safe_top and safe_bottom)
                # which accounts for clearance_padding
                safe_top = gap_top + clearance_padding
                safe_bottom = gap_bottom - clearance_padding
                
                # Calculate cluster bounds
                cluster_height = (cluster_size - 1) * coin_spacing + coin_size
                cluster_top = cluster_y - cluster_height // 2
                cluster_bottom = cluster_y + cluster_height // 2
                
                # Verify cluster is within the safe area
                if cluster_top < safe_top or cluster_bottom > safe_bottom:
                    continue
                
                # Check if Mario can collect safely
                # Use gap boundaries for space calculation
                mario_top_space = cluster_top - gap_top
                mario_bottom_space = gap_bottom - cluster_bottom
                
                # Need at least bird_size space on each side
                if mario_top_space < bird_size or mario_bottom_space < bird_size:
                    continue
                
                # Check if cluster position is safe from enemies
                cluster_rect = pygame.Rect(cluster_x - coin_size // 2, cluster_top,
                                         coin_size, cluster_height)
                
                too_close_to_enemy = False
                enemy_safe_margin = 40  # Fixed margin for enemy checking
                for enemy in self.enemies:
                    if enemy.rect:
                        enemy_check_rect = enemy.rect.inflate(enemy_safe_margin * 2, enemy_safe_margin * 2)
                        if cluster_rect.colliderect(enemy_check_rect):
                            too_close_to_enemy = True
                            break
                
                if too_close_to_enemy:
                    continue
                
                # Check if cluster will be blocked by upcoming walls
                will_be_blocked = False
                for wall in self.walls:
                    if wall.x > cluster_x - 400:
                        top_rect, bottom_rect = wall.get_rects()
                        for check_x in range(int(cluster_x), int(cluster_x - 300), -20):
                            future_cluster_rect = pygame.Rect(check_x - coin_size // 2, cluster_top,
                                                            coin_size, cluster_height)
                            if future_cluster_rect.colliderect(top_rect) or future_cluster_rect.colliderect(bottom_rect):
                                will_be_blocked = True
                                break
                        if will_be_blocked:
                            break
                
                if not will_be_blocked:
                    # Spawn cluster - arrange coins vertically
                    start_y = cluster_y - (cluster_size - 1) * coin_spacing // 2
                    for i in range(cluster_size):
                        coin_y = start_y + i * coin_spacing
                        coin = Coin(cluster_x, coin_y,
                                  coin_size,
                                  self.level_config['wall_speed'],
                                  self.screen_width)
                        if self.coin_image_path:
                            coin.load_image(self.coin_image_path)
                        self.coins.append(coin)
                    cluster_spawned = True
                    break
            
            # If no gap position worked, try random positions with adaptive checks
            if not cluster_spawned:
                for attempt in range(20):
                    cluster_y = random.randint(200, self.screen_height - 200)
                    cluster_x = self.screen_width
                    
                    cluster_height = (cluster_size - 1) * coin_spacing + coin_size
                    cluster_top = cluster_y - cluster_height // 2
                    cluster_bottom = cluster_y + cluster_height // 2
                    
                    # Check collision with walls/pipes with adaptive clearance
                    too_close_to_wall = False
                    for wall in self.walls:
                        top_rect, bottom_rect = wall.get_rects()
                        gap_top, gap_bottom = wall.get_gap_area()
                        gap_height = gap_bottom - gap_top
                        
                        # Adaptive clearance padding based on gap size
                        if gap_height >= 250:
                            adaptive_clearance = 25
                        elif gap_height >= 230:
                            adaptive_clearance = 20
                        else:
                            adaptive_clearance = 15
                        
                        cluster_rect = pygame.Rect(cluster_x - coin_size // 2, cluster_top,
                                                 coin_size, cluster_height)
                        if cluster_rect.colliderect(top_rect) or cluster_rect.colliderect(bottom_rect):
                            too_close_to_wall = True
                            break
                        
                        # If cluster is in gap, check clearance with adaptive padding
                        if gap_top < cluster_y < gap_bottom:
                            safe_top = gap_top + adaptive_clearance
                            safe_bottom = gap_bottom - adaptive_clearance
                            
                            if cluster_top < safe_top or cluster_bottom > safe_bottom:
                                too_close_to_wall = True
                                break
                            
                            # Check Mario clearance - just need bird_size on each side
                            mario_top_space = cluster_top - gap_top
                            mario_bottom_space = gap_bottom - cluster_bottom
                            if mario_top_space < bird_size or mario_bottom_space < bird_size:
                                too_close_to_wall = True
                                break
                    
                    if too_close_to_wall:
                        continue
                    
                    # Check if cluster will be blocked
                    will_be_blocked = False
                    for wall in self.walls:
                        if wall.x > cluster_x - 500:
                            top_rect, bottom_rect = wall.get_rects()
                            gap_top, gap_bottom = wall.get_gap_area()
                            gap_height = gap_bottom - gap_top
                            
                            # Adaptive clearance padding for path checking
                            if gap_height >= 250:
                                path_clearance = 25
                            elif gap_height >= 230:
                                path_clearance = 20
                            else:
                                path_clearance = 15
                            
                            for check_x in range(int(cluster_x), int(cluster_x - 400), -20):
                                future_cluster_rect = pygame.Rect(check_x - coin_size // 2, cluster_top,
                                                                coin_size, cluster_height)
                                if future_cluster_rect.colliderect(top_rect) or future_cluster_rect.colliderect(bottom_rect):
                                    will_be_blocked = True
                                    break
                                
                                if gap_top < cluster_y < gap_bottom:
                                    safe_top = gap_top + path_clearance
                                    safe_bottom = gap_bottom - path_clearance
                                    if cluster_top < safe_top or cluster_bottom > safe_bottom:
                                        will_be_blocked = True
                                        break
                            
                            if will_be_blocked:
                                break
                    
                    if will_be_blocked:
                        continue
                    
                    # Check enemies (use a reasonable fixed margin for enemy checking)
                    too_close_to_enemy = False
                    cluster_rect = pygame.Rect(cluster_x - coin_size // 2, cluster_top,
                                             coin_size, cluster_height)
                    enemy_safe_margin = 40  # Fixed margin for enemy checking
                    for enemy in self.enemies:
                        if enemy.rect:
                            enemy_check_rect = enemy.rect.inflate(enemy_safe_margin * 2, enemy_safe_margin * 2)
                            if cluster_rect.colliderect(enemy_check_rect):
                                too_close_to_enemy = True
                                break
                    
                    if too_close_to_enemy:
                        continue
                    
                    # Spawn cluster
                    start_y = cluster_y - (cluster_size - 1) * coin_spacing // 2
                    for i in range(cluster_size):
                        coin_y = start_y + i * coin_spacing
                        coin = Coin(cluster_x, coin_y,
                                  coin_size,
                                  self.level_config['wall_speed'],
                                  self.screen_width)
                        if self.coin_image_path:
                            coin.load_image(self.coin_image_path)
                        self.coins.append(coin)
                    cluster_spawned = True
                    break
        
        # Update fireball collectibles
        self.fireball_collectible_timer += 1
        if self.fireball_collectible_timer >= 400:  # Spawn fireball collectibles less frequently
            self.fireball_collectible_timer = 0
            
            # Try to spawn a fireball collectible in a safe location (preferably in pipe gaps)
            fireball_size = self.config.get('fireball_size', 40)
            bird_size = self.config['bird_size']
            # Adaptive clearance padding - smaller gaps need less padding
            max_attempts = 40  # More attempts to find a good spot
            fireball_spawned = False
            
            # First, try to spawn in pipe gaps (safest locations)
            gap_positions = []
            for wall in self.walls:
                if wall.x > self.screen_width - 300:  # Only consider walls that are coming soon
                    gap_top, gap_bottom = wall.get_gap_area()
                    gap_height = gap_bottom - gap_top
                    
                    # Adaptive clearance padding based on gap size
                    if gap_height >= 250:
                        clearance_padding = 25  # Easy level - more padding
                    elif gap_height >= 230:
                        clearance_padding = 20  # Medium level - moderate padding
                    else:
                        clearance_padding = 15  # Hard level - minimal padding
                    
                    # Minimum gap height with adaptive padding
                    min_gap_height = bird_size + fireball_size + (clearance_padding * 2)
                    
                    # Gap must be large enough for Mario + fireball + clearance
                    if gap_height >= min_gap_height:
                        # Calculate safe spawn area within gap (with padding from edges)
                        safe_top = gap_top + clearance_padding
                        safe_bottom = gap_bottom - clearance_padding
                        
                        # Ensure safe area is still large enough
                        if safe_bottom - safe_top >= fireball_size + bird_size:
                            # Spawn in center of safe area
                            safe_center = (safe_top + safe_bottom) // 2
                            gap_positions.append((safe_center, wall.x, gap_top, gap_bottom, gap_height, clearance_padding))
            
            # Try gap positions first
            for fireball_y, wall_x, gap_top, gap_bottom, gap_height, clearance_padding in gap_positions:
                fireball_x = self.screen_width
                
                # Fireball is already positioned in safe area (between safe_top and safe_bottom)
                # which accounts for clearance_padding, so we don't need additional safe_margin checks
                fireball_top = fireball_y - fireball_size // 2
                fireball_bottom = fireball_y + fireball_size // 2
                
                # Verify fireball is within the safe area we calculated
                safe_top = gap_top + clearance_padding
                safe_bottom = gap_bottom - clearance_padding
                
                if fireball_top < safe_top or fireball_bottom > safe_bottom:
                    continue  # Fireball outside safe area
                
                # Check if Mario can collect it safely (Mario above and below fireball)
                # Use the gap boundaries for space calculation
                mario_top_space = fireball_top - gap_top
                mario_bottom_space = gap_bottom - fireball_bottom
                
                # Need at least bird_size space on each side for Mario to collect
                # Reduced requirement - just need bird_size, not bird_size + padding
                if mario_top_space < bird_size or mario_bottom_space < bird_size:
                    continue  # Not enough space for Mario to collect
                
                # Check if this position is safe from enemies
                temp_fireball_rect = pygame.Rect(fireball_x - fireball_size // 2, fireball_y - fireball_size // 2,
                                               fireball_size, fireball_size)
                
                too_close_to_enemy = False
                enemy_safe_margin = 40  # Fixed margin for enemy checking
                for enemy in self.enemies:
                    if enemy.rect:
                        enemy_check_rect = enemy.rect.inflate(enemy_safe_margin * 2, enemy_safe_margin * 2)
                        if temp_fireball_rect.colliderect(enemy_check_rect):
                            too_close_to_enemy = True
                            break
                
                if too_close_to_enemy:
                    continue
                
                # Check if fireball will be blocked by upcoming walls as it moves
                will_be_blocked = False
                for wall in self.walls:
                    if wall.x > fireball_x - 400:  # Check walls that will be near the fireball's path
                        top_rect, bottom_rect = wall.get_rects()
                        gap_check_top, gap_check_bottom = wall.get_gap_area()
                        gap_check_height = gap_check_bottom - gap_check_top
                        
                        # Adaptive clearance padding for path checking
                        if gap_check_height >= 250:
                            path_clearance = 25
                        elif gap_check_height >= 230:
                            path_clearance = 20
                        else:
                            path_clearance = 15
                        
                        # Check multiple positions along fireball's path
                        for check_x in range(int(fireball_x), int(fireball_x - 300), -20):
                            future_fireball_rect = pygame.Rect(check_x - fireball_size // 2, fireball_y - fireball_size // 2,
                                                             fireball_size, fireball_size)
                            if future_fireball_rect.colliderect(top_rect) or future_fireball_rect.colliderect(bottom_rect):
                                will_be_blocked = True
                                break
                            
                            # Check clearance in gap with adaptive padding
                            if gap_check_top < fireball_y < gap_check_bottom:
                                safe_top = gap_check_top + path_clearance
                                safe_bottom = gap_check_bottom - path_clearance
                                future_top = fireball_y - fireball_size // 2
                                future_bottom = fireball_y + fireball_size // 2
                                if future_top < safe_top or future_bottom > safe_bottom:
                                    will_be_blocked = True
                                    break
                        if will_be_blocked:
                            break
                    
                    if will_be_blocked:
                        break
                
                if not will_be_blocked:
                    # Safe position found, spawn fireball collectible
                    fireball_collectible = FireballCollectible(
                        fireball_x, fireball_y,
                        fireball_size,
                        self.level_config['wall_speed'],
                        self.screen_width
                    )
                    if self.fireball_image_path:
                        fireball_collectible.load_image(self.fireball_image_path)
                    self.fireball_collectibles.append(fireball_collectible)
                    fireball_spawned = True
                    break
            
            # If no gap position worked, try random positions with adaptive checks
            if not fireball_spawned:
                for attempt in range(max_attempts):
                    fireball_y = random.randint(150, self.screen_height - 150)
                    fireball_x = self.screen_width
                    
                    fireball_top = fireball_y - fireball_size // 2
                    fireball_bottom = fireball_y + fireball_size // 2
                    
                    # Check collision with walls/pipes with adaptive clearance
                    too_close_to_wall = False
                    for wall in self.walls:
                        top_rect, bottom_rect = wall.get_rects()
                        gap_top, gap_bottom = wall.get_gap_area()
                        gap_height = gap_bottom - gap_top
                        
                        # Adaptive clearance padding based on gap size
                        if gap_height >= 250:
                            adaptive_clearance = 25
                        elif gap_height >= 230:
                            adaptive_clearance = 20
                        else:
                            adaptive_clearance = 15
                        
                        # Check if fireball overlaps with pipes
                        fireball_rect = pygame.Rect(fireball_x - fireball_size // 2, fireball_y - fireball_size // 2,
                                                  fireball_size, fireball_size)
                        if fireball_rect.colliderect(top_rect) or fireball_rect.colliderect(bottom_rect):
                            too_close_to_wall = True
                            break
                        
                        # If fireball is in gap, check clearance with adaptive padding
                        if gap_top < fireball_y < gap_bottom:
                            safe_top = gap_top + adaptive_clearance
                            safe_bottom = gap_bottom - adaptive_clearance
                            
                            if fireball_top < safe_top or fireball_bottom > safe_bottom:
                                too_close_to_wall = True
                                break
                            
                            # Check Mario clearance - just need bird_size on each side
                            mario_top_space = fireball_top - gap_top
                            mario_bottom_space = gap_bottom - fireball_bottom
                            if mario_top_space < bird_size or mario_bottom_space < bird_size:
                                too_close_to_wall = True
                                break
                    
                    if too_close_to_wall:
                        continue
                    
                    # Check if fireball will be blocked by upcoming walls
                    will_be_blocked = False
                    for wall in self.walls:
                        if wall.x > fireball_x - 500:  # Check walls in fireball's path
                            top_rect, bottom_rect = wall.get_rects()
                            gap_top, gap_bottom = wall.get_gap_area()
                            gap_height = gap_bottom - gap_top
                            
                            # Adaptive clearance padding for path checking
                            if gap_height >= 250:
                                path_clearance = 25
                            elif gap_height >= 230:
                                path_clearance = 20
                            else:
                                path_clearance = 15
                            
                            # Check multiple positions along fireball's path
                            for check_x in range(int(fireball_x), int(fireball_x - 400), -20):
                                future_fireball_rect = pygame.Rect(check_x - fireball_size // 2, fireball_y - fireball_size // 2,
                                                                 fireball_size, fireball_size)
                                if future_fireball_rect.colliderect(top_rect) or future_fireball_rect.colliderect(bottom_rect):
                                    will_be_blocked = True
                                    break
                                
                                # If in gap, check clearance with adaptive padding
                                if gap_top < fireball_y < gap_bottom:
                                    safe_top = gap_top + path_clearance
                                    safe_bottom = gap_bottom - path_clearance
                                    future_top = fireball_y - fireball_size // 2
                                    future_bottom = fireball_y + fireball_size // 2
                                    if future_top < safe_top or future_bottom > safe_bottom:
                                        will_be_blocked = True
                                        break
                            
                            if will_be_blocked:
                                break
                    
                    if will_be_blocked:
                        continue
                    
                    # Check collision with enemies
                    too_close_to_enemy = False
                    enemy_safe_margin = 40  # Fixed margin for enemy checking
                    for enemy in self.enemies:
                        if enemy.rect:
                            enemy_check_rect = enemy.rect.inflate(enemy_safe_margin * 2, enemy_safe_margin * 2)
                            fireball_rect = pygame.Rect(fireball_x - fireball_size // 2, fireball_y - fireball_size // 2,
                                                      fireball_size, fireball_size)
                            if fireball_rect.colliderect(enemy_check_rect):
                                too_close_to_enemy = True
                                break
                    
                    if too_close_to_enemy:
                        continue
                    
                    # Safe position found, spawn fireball collectible
                    fireball_collectible = FireballCollectible(
                        fireball_x, fireball_y,
                        fireball_size,
                        self.level_config['wall_speed'],
                        self.screen_width
                    )
                    if self.fireball_image_path:
                        fireball_collectible.load_image(self.fireball_image_path)
                    self.fireball_collectibles.append(fireball_collectible)
                    fireball_spawned = True
                    break
        
        for fireball_collectible in self.fireball_collectibles[:]:
            fireball_collectible.update()
            
            # Check collision with bird
            if self.bird.rect and fireball_collectible.rect and self.bird.rect.colliderect(fireball_collectible.rect) and not fireball_collectible.collected:
                fireball_collectible.collected = True
                self.fireball_ammo += 1  # Add fireball ammo
                # Play fireball collect sound with higher volume
                if 'fireball_collect' in self.sounds:
                    if self.muted:
                        fireball_collect_volume = 0.0
                    else:
                        fireball_collect_volume = max(0.6, self.volume * 2.0)  # At least 60% or 2x master volume
                        fireball_collect_volume = min(1.0, fireball_collect_volume)  # Cap at 100%
                    self.sounds['fireball_collect'].set_volume(fireball_collect_volume)
                    self.sounds['fireball_collect'].play()
                self.fireball_collectibles.remove(fireball_collectible)
            
            # Remove off-screen fireball collectibles
            elif fireball_collectible.is_off_screen():
                self.fireball_collectibles.remove(fireball_collectible)
        
        # Update fireball projectiles
        for fireball in self.fireball_projectiles[:]:
            fireball.update()
            
            # Check collision with enemies
            for enemy in self.enemies[:]:
                if fireball.rect and enemy.rect and fireball.rect.colliderect(enemy.rect):
                    # Enemy hit! Remove both fireball and enemy
                    self.fireball_projectiles.remove(fireball)
                    self.enemies.remove(enemy)
                    self.score += 10  # Bonus points for killing enemy
                    # Play enemy die sound with higher volume
                    if 'enemy_die' in self.sounds:
                        if self.muted:
                            enemy_die_volume = 0.0
                        else:
                            enemy_die_volume = max(0.6, self.volume * 2.0)  # At least 60% or 2x master volume
                            enemy_die_volume = min(1.0, enemy_die_volume)  # Cap at 100%
                        self.sounds['enemy_die'].set_volume(enemy_die_volume)
                        self.sounds['enemy_die'].play()
                    break
            
            # Remove off-screen fireballs
            if fireball.is_off_screen():
                self.fireball_projectiles.remove(fireball)
        
        for coin in self.coins[:]:
            coin.update()
            
            # Check collision with bird
            if self.bird.rect and coin.rect and self.bird.rect.colliderect(coin.rect) and not coin.collected:
                coin.collected = True
                self.score += 5  # Coins worth 5 points
                self.coins_collected += 1  # Track coin collection
                # Play coin collection sound with higher volume
                if 'coin' in self.sounds:
                    # Increase coin sound volume significantly (make it much louder)
                    # Use at least 0.5 volume even if master volume is low, or 2x master volume
                    if self.muted:
                        coin_volume = 0.0
                    else:
                        coin_volume = max(0.5, self.volume * 2.0)  # At least 50% or 2x master volume
                        coin_volume = min(1.0, coin_volume)  # Cap at 100%
                    self.sounds['coin'].set_volume(coin_volume)
                    self.sounds['coin'].play()
                self.coins.remove(coin)
            
            # Remove off-screen coins
            elif coin.is_off_screen():
                self.coins.remove(coin)
    
    def game_over(self):
        """Handle game over"""
        self.state = "gameover"
        if self.score > self.high_score:
            self.high_score = self.score
            self.save_high_score()
        
        if 'gameover' in self.sounds:
            self.sounds['gameover'].set_volume(0.0 if self.muted else self.volume)
            self.sounds['gameover'].play()
    
    def draw_level_dropdown(self, y_position):
        """Draw level selection dropdown"""
        # Get current level name and calculate text width
        current_level_name = self.config['levels'][self.current_level]['name']
        level_text = self.font_small.render(f"Level: {current_level_name}", True, (255, 255, 255))
        text_width = level_text.get_width()
        
        # Calculate dropdown width dynamically based on current text + arrow space
        # Padding values for visual balance
        left_padding = 15  # Padding on left side
        arrow_spacing = 15  # Equal space before and after arrow
        arrow_size = 8  # Size of arrow
        # Total space needed: left padding + text + arrow spacing + arrow + arrow spacing
        total_right_space = arrow_spacing + arrow_size + arrow_spacing
        
        dropdown_width = text_width + left_padding + total_right_space
        dropdown_height = 40
        dropdown_x = self.screen_width // 2 - dropdown_width // 2
        dropdown_y = y_position
        
        # Main dropdown button
        self.level_dropdown_rect = pygame.Rect(dropdown_x, dropdown_y, dropdown_width, dropdown_height)
        
        # Button background
        button_color = (60, 60, 60) if not self.dropdown_open else (80, 80, 80)
        pygame.draw.rect(self.screen, button_color, self.level_dropdown_rect)
        pygame.draw.rect(self.screen, (255, 255, 255), self.level_dropdown_rect, 2)
        
        # Current level text - positioned with left padding
        text_start_x = dropdown_x + left_padding
        text_center_x = text_start_x + text_width // 2
        level_text_rect = level_text.get_rect(centerx=text_center_x, centery=self.level_dropdown_rect.centery)
        self.screen.blit(level_text, level_text_rect)
        
        # Dropdown arrow - positioned with equal space before and after
        # Text ends at: text_start_x + text_width
        # Arrow center: text_end + arrow_spacing + arrow_size/2
        text_end_x = text_start_x + text_width
        arrow_x = text_end_x + arrow_spacing + arrow_size // 2
        arrow_y = dropdown_y + dropdown_height // 2
        
        if self.dropdown_open:
            # Arrow pointing up (v)
            arrow_points = [
                (arrow_x, arrow_y - arrow_size // 2),
                (arrow_x - arrow_size, arrow_y + arrow_size // 2),
                (arrow_x + arrow_size, arrow_y + arrow_size // 2)
            ]
        else:
            # Arrow pointing down (^)
            arrow_points = [
                (arrow_x, arrow_y + arrow_size // 2),
                (arrow_x - arrow_size, arrow_y - arrow_size // 2),
                (arrow_x + arrow_size, arrow_y - arrow_size // 2)
            ]
        pygame.draw.polygon(self.screen, (255, 255, 255), arrow_points)
        
        # Draw dropdown options if open
        if self.dropdown_open:
            # Calculate max width needed for all options
            max_option_width = dropdown_width
            for level in self.config['levels']:
                option_text_test = self.font_small.render(level['name'], True, (255, 255, 255))
                option_width = option_text_test.get_width() + left_padding + total_right_space
                max_option_width = max(max_option_width, option_width)
            
            # Use the wider of dropdown width or max option width
            final_dropdown_width = max(dropdown_width, max_option_width)
            
            # If width changed, recalculate positions
            if final_dropdown_width > dropdown_width:
                dropdown_x = self.screen_width // 2 - final_dropdown_width // 2
                # Update dropdown rect
                self.level_dropdown_rect = pygame.Rect(dropdown_x, dropdown_y, final_dropdown_width, dropdown_height)
                # Redraw button background with new width
                pygame.draw.rect(self.screen, button_color, self.level_dropdown_rect)
                pygame.draw.rect(self.screen, (255, 255, 255), self.level_dropdown_rect, 2)
                # Redraw text with left padding
                text_start_x = dropdown_x + left_padding
                text_center_x = text_start_x + text_width // 2
                level_text_rect = level_text.get_rect(centerx=text_center_x, centery=self.level_dropdown_rect.centery)
                self.screen.blit(level_text, level_text_rect)
                # Redraw arrow with equal spacing before and after
                text_end_x = text_start_x + text_width
                arrow_x = text_end_x + arrow_spacing + arrow_size // 2
                arrow_points = [
                    (arrow_x, arrow_y - arrow_size // 2),
                    (arrow_x - arrow_size, arrow_y + arrow_size // 2),
                    (arrow_x + arrow_size, arrow_y + arrow_size // 2)
                ]
                pygame.draw.polygon(self.screen, (255, 255, 255), arrow_points)
            else:
                final_dropdown_width = dropdown_width
            
            option_height = 35
            self.level_option_rects = []
            
            for i, level in enumerate(self.config['levels']):
                option_y = dropdown_y + dropdown_height + (i * option_height)
                option_rect = pygame.Rect(dropdown_x, option_y, final_dropdown_width, option_height)
                self.level_option_rects.append(option_rect)
                
                # Highlight selected level
                if i == self.current_level:
                    pygame.draw.rect(self.screen, (100, 150, 200), option_rect)
                else:
                    pygame.draw.rect(self.screen, (40, 40, 40), option_rect)
                
                pygame.draw.rect(self.screen, (200, 200, 200), option_rect, 1)
                
                # Level name text - centered
                level_name = level['name']
                option_text = self.font_small.render(level_name, True, (255, 255, 255))
                option_text_rect = option_text.get_rect(centerx=option_rect.centerx, centery=option_rect.centery)
                self.screen.blit(option_text, option_text_rect)
        else:
            self.level_option_rects = []
    
    def draw_volume_controls(self):
        """Draw volume control UI (mute button and slider)"""
        # Mute button (top right corner with padding)
        button_size = 40
        padding = 15  # Space from right edge
        button_x = self.screen_width - button_size - padding
        button_y = 10
        self.mute_button_rect = pygame.Rect(button_x, button_y, button_size, button_size)
        
        # Draw mute button background
        button_color = (200, 50, 50) if self.muted else (100, 150, 100)
        pygame.draw.rect(self.screen, button_color, self.mute_button_rect)
        pygame.draw.rect(self.screen, (0, 0, 0), self.mute_button_rect, 3)
        
        # Draw mute/unmute icon (standard speaker icon)
        icon_x = button_x + button_size // 2
        icon_y = button_y + button_size // 2
        icon_color = (255, 255, 255)
        
        if self.muted:
            # Draw muted icon: speaker cone + X
            # Speaker cone (triangle pointing right)
            speaker_base_left = icon_x - 10
            speaker_base_top = icon_y - 6
            speaker_base_bottom = icon_y + 6
            speaker_apex_x = icon_x - 2
            speaker_apex_y = icon_y
            
            # Draw speaker cone
            speaker_points = [
                (speaker_base_left, speaker_base_top),
                (speaker_base_left, speaker_base_bottom),
                (speaker_apex_x, speaker_apex_y)
            ]
            pygame.draw.polygon(self.screen, icon_color, speaker_points)
            
            # Draw small circle at apex (speaker center)
            pygame.draw.circle(self.screen, icon_color, (speaker_apex_x, speaker_apex_y), 2)
            
            # Draw X symbol (diagonal lines)
            x_start_x = icon_x + 2
            x_start_y = icon_y - 5
            x_end_x = icon_x + 8
            x_end_y = icon_y + 5
            
            # First diagonal line
            pygame.draw.line(self.screen, icon_color, 
                           (x_start_x, x_start_y), (x_end_x, x_end_y), 3)
            # Second diagonal line
            pygame.draw.line(self.screen, icon_color, 
                           (x_start_x, x_end_y), (x_end_x, x_start_y), 3)
        else:
            # Draw unmuted icon: speaker cone + sound waves
            # Speaker cone (triangle pointing right)
            speaker_base_left = icon_x - 10
            speaker_base_top = icon_y - 6
            speaker_base_bottom = icon_y + 6
            speaker_apex_x = icon_x - 2
            speaker_apex_y = icon_y
            
            # Draw speaker cone
            speaker_points = [
                (speaker_base_left, speaker_base_top),
                (speaker_base_left, speaker_base_bottom),
                (speaker_apex_x, speaker_apex_y)
            ]
            pygame.draw.polygon(self.screen, icon_color, speaker_points)
            
            # Draw small circle at apex (speaker center)
            pygame.draw.circle(self.screen, icon_color, (speaker_apex_x, speaker_apex_y), 2)
            
            # Draw sound waves (curved lines emanating from speaker) - smaller for balance
            wave_start_x = icon_x
            wave_center_y = icon_y
            
            # First wave (smallest)
            wave1_rect = pygame.Rect(wave_start_x - 1, wave_center_y - 2, 4, 4)
            pygame.draw.arc(self.screen, icon_color, wave1_rect, -math.pi/4, math.pi/4, 2)
            
            # Second wave (medium)
            wave2_rect = pygame.Rect(wave_start_x + 1, wave_center_y - 3, 5, 6)
            pygame.draw.arc(self.screen, icon_color, wave2_rect, -math.pi/3, math.pi/3, 2)
            
            # Third wave (largest)
            wave3_rect = pygame.Rect(wave_start_x + 3, wave_center_y - 4, 6, 8)
            pygame.draw.arc(self.screen, icon_color, wave3_rect, -math.pi/2.5, math.pi/2.5, 2)
        
        # Volume slider (below mute button, matching button width exactly)
        slider_y = button_y + button_size + 5
        slider_width = button_size  # Match button width exactly
        slider_x = button_x  # Align left edge with button (right edges will match)
        slider_height = 8
        self.volume_slider_rect = pygame.Rect(slider_x, slider_y, slider_width, slider_height)
        
        # Draw slider track
        pygame.draw.rect(self.screen, (100, 100, 100), self.volume_slider_rect)
        pygame.draw.rect(self.screen, (0, 0, 0), self.volume_slider_rect, 2)
        
        # Draw filled portion based on volume
        fill_width = int(slider_width * self.volume)
        if fill_width > 0:
            fill_rect = pygame.Rect(slider_x, slider_y, fill_width, slider_height)
            fill_color = (100, 200, 100) if not self.muted else (150, 150, 150)
            pygame.draw.rect(self.screen, fill_color, fill_rect)
        
        # Draw slider handle
        handle_x = slider_x + int(slider_width * self.volume)
        handle_y = slider_y + slider_height // 2
        handle_radius = 8
        handle_color = (200, 200, 200) if not self.muted else (100, 100, 100)
        pygame.draw.circle(self.screen, handle_color, (handle_x, handle_y), handle_radius)
        pygame.draw.circle(self.screen, (0, 0, 0), (handle_x, handle_y), handle_radius, 2)
    
    def draw_start_screen(self):
        """Draw Mario Kart themed start screen"""
        # Background
        if self.bg_image:
            self.screen.blit(self.bg_image, (0, 0))
        else:
            # Mario Kart style gradient background
            for y in range(self.screen_height):
                color_ratio = y / self.screen_height
                r = int(135 + (200 - 135) * color_ratio)
                g = int(206 + (230 - 206) * color_ratio)
                b = int(235 + (255 - 235) * color_ratio)
                pygame.draw.line(self.screen, (r, g, b), (0, y), (self.screen_width, y))
        
        # Draw decorative checkered border at top
        checker_size = 20
        for x in range(0, self.screen_width, checker_size * 2):
            pygame.draw.rect(self.screen, (255, 255, 0), 
                           (x, 0, checker_size, checker_size))
            pygame.draw.rect(self.screen, (255, 0, 0), 
                           (x + checker_size, 0, checker_size, checker_size))
        
        # Main title with Mario Kart colors - centered properly
        title_y = self.screen_height // 2 - 130
        
        # Title "MARIO FLAPPY" - render with proper alignment
        title_text = "MARIO FLAPPY"
        
        # Calculate total width properly
        words = title_text.split()
        word_spacing = 25
        word_widths = [self.font_large.size(word)[0] for word in words]
        total_width = sum(word_widths) + word_spacing * (len(words) - 1)
        start_x = self.screen_width // 2 - total_width // 2
        
        # Render each word with proper shadows
        current_x = start_x
        char_index = 0
        for word_idx, word in enumerate(words):
            word_width = word_widths[word_idx]
            
            # Render shadow for entire word first (properly aligned)
            word_shadow_surf = self.font_large.render(word, True, (0, 0, 0))
            word_shadow_rect = word_shadow_surf.get_rect(midleft=(current_x + 3, title_y + 3))
            self.screen.blit(word_shadow_surf, word_shadow_rect)
            
            # Render each character with alternating colors
            char_x_offset = 0
            for i, char in enumerate(word):
                char_width = self.font_large.size(char)[0]
                
                # Shadow for each character (aligned with word shadow)
                char_shadow = self.font_large.render(char, True, (0, 0, 0))
                char_shadow_rect = char_shadow.get_rect(midleft=(current_x + char_x_offset + 3, title_y + 3))
                self.screen.blit(char_shadow, char_shadow_rect)
                
                # Main character - alternating yellow and red
                char_color = (255, 220, 0) if char_index % 2 == 0 else (255, 0, 0)
                char_surf = self.font_large.render(char, True, char_color)
                char_rect = char_surf.get_rect(midleft=(current_x + char_x_offset, title_y))
                self.screen.blit(char_surf, char_rect)
                
                char_x_offset += char_width
                char_index += 1
            
            current_x += word_width + word_spacing
            char_index += 1  # Account for space
        
        # Subtitle "KART EDITION" - render properly aligned
        subtitle_y = title_y + 80
        
        subtitle_text = "KART EDITION"
        subtitle_words = subtitle_text.split()
        sub_word_widths = [self.font_medium.size(word)[0] for word in subtitle_words]
        sub_total_width = sum(sub_word_widths) + 20
        sub_start_x = self.screen_width // 2 - sub_total_width // 2
        
        # Render subtitle shadow for entire text (properly aligned)
        subtitle_shadow_surf = self.font_medium.render(subtitle_text, True, (0, 0, 0))
        subtitle_shadow_rect = subtitle_shadow_surf.get_rect(center=(self.screen_width // 2 + 3, subtitle_y + 3))
        self.screen.blit(subtitle_shadow_surf, subtitle_shadow_rect)
        
        # Render each word with colors
        sub_current_x = sub_start_x
        for word_idx, word in enumerate(subtitle_words):
            word_width = sub_word_widths[word_idx]
            # Color: blue for "KART", yellow for "EDITION"
            word_color = (0, 150, 255) if word_idx == 0 else (255, 240, 0)
            
            # Render word shadow
            word_shadow = self.font_medium.render(word, True, (0, 0, 0))
            word_shadow_rect = word_shadow.get_rect(midleft=(sub_current_x + 3, subtitle_y + 3))
            self.screen.blit(word_shadow, word_shadow_rect)
            
            # Render word with color
            word_surf = self.font_medium.render(word, True, word_color)
            word_rect = word_surf.get_rect(midleft=(sub_current_x, subtitle_y))
            self.screen.blit(word_surf, word_rect)
            
            sub_current_x += word_width + 20
        
        # Mario Kart styled START button with checkered pattern
        button_x = self.screen_width // 2 - 120
        button_y = self.screen_height // 2 + 30
        button_width = 240
        button_height = 70
        
        button_rect = pygame.Rect(button_x, button_y, button_width, button_height)
        
        # Button shadow
        shadow_rect = pygame.Rect(button_x + 5, button_y + 5, button_width, button_height)
        pygame.draw.rect(self.screen, (0, 0, 0, 100), shadow_rect)
        
        # Button background - solid black
        pygame.draw.rect(self.screen, (0, 0, 0), button_rect)
        
        # Button border (thick, white for contrast)
        pygame.draw.rect(self.screen, (255, 255, 255), button_rect, 5)
        
        # Inner border (gray for subtle detail)
        pygame.draw.rect(self.screen, (100, 100, 100), button_rect, 2)
        
        # Button text "START" with strong shadow for visibility
        button_text = "START"
        button_center_x = button_rect.centerx
        button_center_y = button_rect.centery
        
        # Render multiple shadow layers (properly aligned)
        shadow_offsets = [(4, 4), (3, 3), (2, 2)]
        for offset_x, offset_y in shadow_offsets:
            button_text_shadow = self.font_medium.render(button_text, True, (0, 0, 0))
            button_text_shadow_rect = button_text_shadow.get_rect(center=(button_center_x + offset_x, 
                                                                         button_center_y + offset_y))
            self.screen.blit(button_text_shadow, button_text_shadow_rect)
        
        # Main button text - bright white
        button_text_surf = self.font_medium.render(button_text, True, (255, 255, 255))
        button_text_rect = button_text_surf.get_rect(center=(button_center_x, button_center_y))
        self.screen.blit(button_text_surf, button_text_rect)
        
        # Pulsing effect for button
        pulse = int(math.sin(self.start_screen_timer * 0.1) * 5)
        if pulse > 0:
            highlight_rect = pygame.Rect(button_x - pulse, button_y - pulse, 
                                       button_width + pulse * 2, button_height + pulse * 2)
            pygame.draw.rect(self.screen, (255, 255, 0, 50), highlight_rect, 3)
        
        # Level dropdown - drawn AFTER start button so it appears on top when open
        dropdown_y = self.screen_height // 2 - 20
        self.draw_level_dropdown(dropdown_y)
        
        # Instructions section
        inst_y = button_y + button_height + 40
        
        # Main instruction
        inst_text_str = "Press SPACE or Click START to Play!"
        inst_shadow = self.font_small.render(inst_text_str, True, (0, 0, 0))
        inst_shadow_rect = inst_shadow.get_rect(center=(self.screen_width // 2 + 3, inst_y + 3))
        self.screen.blit(inst_shadow, inst_shadow_rect)
        inst_text = self.font_small.render(inst_text_str, True, (255, 255, 255))
        inst_rect = inst_text.get_rect(center=(self.screen_width // 2, inst_y))
        self.screen.blit(inst_text, inst_rect)
        
        # Game instructions panel
        instructions_y = inst_y + 50
        instructions = [
            "HOW TO PLAY:",
            "• SPACE or Left Click = Flap",
            "• F Key or Right Click = Shoot Fireball"
        ]
        
        # Draw instructions background panel
        panel_height = len(instructions) * 28 + 20  # Increased spacing
        panel_y = instructions_y
        panel_rect = pygame.Rect(self.screen_width // 2 - 220, panel_y, 440, panel_height)
        # More transparent background so water is visible underneath
        panel_surface = pygame.Surface((440, panel_height))
        panel_surface.set_alpha(150)  # Reduced from 200 to 150 for more transparency
        panel_surface.fill((0, 0, 0))
        self.screen.blit(panel_surface, (panel_rect.x, panel_rect.y))
        pygame.draw.rect(self.screen, (255, 255, 255), panel_rect, 2)
        
        # Draw each instruction line
        for i, instruction in enumerate(instructions):
            line_y = panel_y + 15 + i * 28  # Increased line spacing
            if i == 0:  # Title
                line_color = (255, 255, 0)  # Yellow for title
                line_font = self.font_small
            else:
                line_color = (255, 255, 255)  # White for instructions
                line_font = pygame.font.Font(None, 28)  # Slightly smaller font
            
            line_shadow = line_font.render(instruction, True, (0, 0, 0))
            line_shadow_rect = line_shadow.get_rect(center=(self.screen_width // 2 + 2, line_y + 2))
            self.screen.blit(line_shadow, line_shadow_rect)
            
            line_text = line_font.render(instruction, True, line_color)
            line_rect = line_text.get_rect(center=(self.screen_width // 2, line_y))
            self.screen.blit(line_text, line_rect)
        
        # High score with golden trophy style (moved down to make room for instructions)
        if self.high_score > 0:
            hs_y = panel_y + panel_height + 40  # Increased spacing below instructions panel
            # Trophy icon (simple star)
            star_points = []
            star_size = 20
            center_x, center_y = self.screen_width // 2 - 80, hs_y
            for i in range(10):
                angle = i * math.pi / 5
                if i % 2 == 0:
                    r = star_size
                else:
                    r = star_size // 2
                x = center_x + r * math.cos(angle - math.pi / 2)
                y = center_y + r * math.sin(angle - math.pi / 2)
                star_points.append((x, y))
            pygame.draw.polygon(self.screen, (255, 215, 0), star_points)
            pygame.draw.polygon(self.screen, (255, 255, 255), star_points, 2)
            
            hs_text_str = f"Best Score: {self.high_score}"
            
            # Strong shadow for high score (properly aligned)
            hs_shadow = self.font_small.render(hs_text_str, True, (0, 0, 0))
            hs_shadow_rect = hs_shadow.get_rect(center=(self.screen_width // 2 + 3, hs_y + 3))
            self.screen.blit(hs_shadow, hs_shadow_rect)
            
            # Bright golden yellow for better readability
            hs_text = self.font_small.render(hs_text_str, True, (255, 240, 100))
            hs_rect = hs_text.get_rect(center=(self.screen_width // 2, hs_y))
            self.screen.blit(hs_text, hs_rect)
        
        # Draw volume controls
        self.draw_volume_controls()
    
    def draw_game(self):
        """Draw game screen"""
        # Background
        if self.bg_image:
            self.screen.blit(self.bg_image, (0, 0))
        else:
            self.screen.fill((135, 206, 235))  # Sky blue
        
        # Draw walls
        for wall in self.walls:
            wall.draw(self.screen)
        
        # Draw enemies
        for enemy in self.enemies:
            enemy.draw(self.screen)
        
        # Draw coins
        for coin in self.coins:
            coin.draw(self.screen)
        
        # Draw fireball collectibles
        for fireball_collectible in self.fireball_collectibles:
            fireball_collectible.draw(self.screen)
        
        # Draw fireball projectiles
        for fireball in self.fireball_projectiles:
            fireball.draw(self.screen)
        
        # Draw bird
        self.bird.draw(self.screen)
        
        # Draw score with black text for readability
        score_text = self.font_medium.render(f"Score: {self.score}", True, (0, 0, 0))
        # Add white shadow for contrast
        score_shadow = self.font_medium.render(f"Score: {self.score}", True, (255, 255, 255))
        self.screen.blit(score_shadow, (21, 21))
        self.screen.blit(score_text, (20, 20))
        
        # Draw coins collected
        coins_text = self.font_small.render(f"Coins: {self.coins_collected}", True, (0, 0, 0))
        # Add white shadow for contrast
        coins_shadow = self.font_small.render(f"Coins: {self.coins_collected}", True, (255, 255, 255))
        self.screen.blit(coins_shadow, (21, 71))
        self.screen.blit(coins_text, (20, 70))
        
        # Draw fireball ammo count
        if self.fireball_ammo > 0:
            ammo_text = self.font_small.render(f"Fireballs: {self.fireball_ammo}", True, (0, 0, 0))
            ammo_shadow = self.font_small.render(f"Fireballs: {self.fireball_ammo}", True, (255, 255, 255))
            self.screen.blit(ammo_shadow, (21, 101))
            self.screen.blit(ammo_text, (20, 100))
        
        # Draw high score with black text for readability (closer spacing)
        hs_text = self.font_small.render(f"High Score: {self.high_score}", True, (0, 0, 0))
        # Add white shadow for contrast
        hs_shadow = self.font_small.render(f"High Score: {self.high_score}", True, (255, 255, 255))
        hs_y_pos = 130 if self.fireball_ammo > 0 else 100
        self.screen.blit(hs_shadow, (21, hs_y_pos + 1))
        self.screen.blit(hs_text, (20, hs_y_pos))
        
        # Draw volume controls
        self.draw_volume_controls()
    
    def draw_gameover_screen(self):
        """Draw game over screen"""
        # Semi-transparent overlay
        overlay = pygame.Surface((self.screen_width, self.screen_height))
        overlay.set_alpha(180)
        overlay.fill((0, 0, 0))
        self.screen.blit(overlay, (0, 0))
        
        # Game Over text
        gameover_text = self.font_large.render("GAME OVER", True, (255, 0, 0))
        gameover_rect = gameover_text.get_rect(center=(self.screen_width // 2, self.screen_height // 2 - 100))
        self.screen.blit(gameover_text, gameover_rect)
        
        # Score with white text (visible on dark overlay)
        score_text = self.font_medium.render(f"Score: {self.score}", True, (255, 255, 255))
        score_rect = score_text.get_rect(center=(self.screen_width // 2, self.screen_height // 2 - 40))
        # Add black shadow for contrast
        score_shadow = self.font_medium.render(f"Score: {self.score}", True, (0, 0, 0))
        score_shadow_rect = score_shadow.get_rect(center=(self.screen_width // 2 + 2, self.screen_height // 2 - 38))
        self.screen.blit(score_shadow, score_shadow_rect)
        self.screen.blit(score_text, score_rect)
        
        # Coins collected with gold text (visible on dark overlay)
        coins_text = self.font_medium.render(f"Coins Collected: {self.coins_collected}", True, (255, 215, 0))
        coins_rect = coins_text.get_rect(center=(self.screen_width // 2, self.screen_height // 2))
        # Add black shadow for contrast
        coins_shadow = self.font_medium.render(f"Coins Collected: {self.coins_collected}", True, (0, 0, 0))
        coins_shadow_rect = coins_shadow.get_rect(center=(self.screen_width // 2 + 2, self.screen_height // 2 + 2))
        self.screen.blit(coins_shadow, coins_shadow_rect)
        self.screen.blit(coins_text, coins_rect)
        
        # High score with yellow text (visible on dark overlay)
        hs_text = self.font_medium.render(f"High Score: {self.high_score}", True, (255, 255, 0))
        hs_rect = hs_text.get_rect(center=(self.screen_width // 2, self.screen_height // 2 + 40))
        # Add black shadow for contrast
        hs_shadow = self.font_medium.render(f"High Score: {self.high_score}", True, (0, 0, 0))
        hs_shadow_rect = hs_shadow.get_rect(center=(self.screen_width // 2 + 2, self.screen_height // 2 + 42))
        self.screen.blit(hs_shadow, hs_shadow_rect)
        self.screen.blit(hs_text, hs_rect)
        
        # Restart instruction - drawn FIRST so dropdown appears on top (higher z-index)
        restart_text = self.font_small.render("Press SPACE to Restart", True, (255, 255, 255))
        # Position restart text further down to avoid overlap with open dropdown
        # Dropdown when open: button (40px) + 3 options (35px each = 105px) = 145px total
        # Dropdown ends at: dropdown_y (85) + 145 = 230px from center
        # Add gap of 25px for better spacing, so restart at: 230 + 25 = 255px from center
        restart_rect = restart_text.get_rect(center=(self.screen_width // 2, self.screen_height // 2 + 255))
        self.screen.blit(restart_text, restart_rect)
        
        # Level dropdown - drawn AFTER restart text so it appears on top when open
        # Positioned with proper spacing above restart text (accounting for dropdown height when open)
        dropdown_y = self.screen_height // 2 + 85
        self.draw_level_dropdown(dropdown_y)
        
        # Draw volume controls
        self.draw_volume_controls()
    
    def draw(self):
        """Draw current screen based on game state"""
        if self.state == "start":
            self.draw_start_screen()
        elif self.state == "playing":
            self.draw_game()
        elif self.state == "gameover":
            self.draw_gameover_screen()
        
        pygame.display.flip()
    
    def run(self):
        """Main game loop"""
        running = True
        while running:
            running = self.handle_events()
            self.update()
            # Update animation timer for start screen
            if self.state == "start":
                self.start_screen_timer += 1
            self.draw()
            self.clock.tick(60)  # 60 FPS
        
        pygame.quit()

if __name__ == "__main__":
    game = Game()
    game.run()

