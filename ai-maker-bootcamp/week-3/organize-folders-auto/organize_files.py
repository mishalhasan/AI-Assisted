#!/usr/bin/env python3
"""
File Organizer Script
Organizes files in the current directory by type into separate folders.
"""

import os
import shutil
from pathlib import Path


def get_file_category(file_path):
    """
    Determine the category of a file based on its extension.
    
    Args:
        file_path: Path object or string representing the file path
        
    Returns:
        str: Category name ('images', 'pdfs', 'videos', or 'other')
    """
    extension = Path(file_path).suffix.lower()
    
    # Image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg'}
    
    # Video extensions
    video_extensions = {'.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.3gp'}
    
    # PDF extension
    pdf_extensions = {'.pdf'}
    
    if extension in image_extensions:
        return 'images'
    elif extension in pdf_extensions:
        return 'pdfs'
    elif extension in video_extensions:
        return 'videos'
    else:
        return 'other'


def organize_files(directory_path='.'):
    """
    Organize files in the specified directory by type.
    
    Args:
        directory_path: Path to the directory containing files to organize (default: current directory)
    """
    # Convert to Path object
    base_path = Path(directory_path).resolve()
    
    if not base_path.exists():
        print(f"Error: Directory '{base_path}' does not exist.")
        return
    
    if not base_path.is_dir():
        print(f"Error: '{base_path}' is not a directory.")
        return
    
    # Statistics
    stats = {
        'images': 0,
        'pdfs': 0,
        'videos': 0,
        'other': 0,
        'skipped': 0
    }
    
    # Get all files in the directory (excluding directories and the script itself)
    script_name = Path(__file__).name
    files = [f for f in base_path.iterdir() 
             if f.is_file() and f.name != script_name]
    
    if not files:
        print("No files found to organize.")
        return
    
    print(f"Found {len(files)} file(s) to organize...\n")
    
    # Process each file
    for file_path in files:
        category = get_file_category(file_path)
        
        # Skip venv and other special directories/files
        if file_path.name.startswith('.') or file_path.name == '__pycache__':
            stats['skipped'] += 1
            continue
        
        # Create category folder if it doesn't exist
        category_folder = base_path / category
        category_folder.mkdir(exist_ok=True)
        
        # Destination path
        dest_path = category_folder / file_path.name
        
        # Handle file name conflicts
        if dest_path.exists():
            # Add a number suffix if file already exists
            counter = 1
            name_parts = file_path.stem, file_path.suffix
            while dest_path.exists():
                new_name = f"{name_parts[0]}_{counter}{name_parts[1]}"
                dest_path = category_folder / new_name
                counter += 1
        
        # Move file
        try:
            shutil.move(str(file_path), str(dest_path))
            stats[category] += 1
            print(f"Moved: {file_path.name} -> {category}/{dest_path.name}")
        except Exception as e:
            print(f"Error moving {file_path.name}: {e}")
            stats['skipped'] += 1
    
    # Print summary
    print("\n" + "="*50)
    print("Organization Complete!")
    print("="*50)
    print(f"Images moved: {stats['images']}")
    print(f"PDFs moved: {stats['pdfs']}")
    print(f"Videos moved: {stats['videos']}")
    print(f"Other files moved: {stats['other']}")
    print(f"Files skipped: {stats['skipped']}")
    print("="*50)


if __name__ == "__main__":
    # Organize files in the current directory
    organize_files()

