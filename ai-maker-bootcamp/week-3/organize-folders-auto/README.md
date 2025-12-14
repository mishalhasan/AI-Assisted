# 📁 Automatic Folder Organizer

A Python script that automatically organizes files in a directory by their file type into separate folders. Perfect for cleaning up messy directories, organizing downloads, or maintaining a tidy file structure.

## ✨ Features

- **Automatic File Categorization** - Organizes files by extension into categories
- **Smart Folder Creation** - Creates category folders automatically
- **Conflict Handling** - Handles duplicate file names intelligently
- **Progress Reporting** - Shows detailed progress and statistics
- **Safe Operation** - Moves files without data loss
- **No Dependencies** - Uses only Python standard library

## 📂 File Categories

Files are organized into the following categories:

- **Images** → `images/` folder
  - `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp`, `.svg`

- **PDFs** → `pdfs/` folder
  - `.pdf`

- **Videos** → `videos/` folder
  - `.mp4`, `.mov`, `.avi`, `.mkv`, `.wmv`, `.flv`, `.webm`, `.m4v`, `.3gp`

- **Other** → `other/` folder
  - All other file types

## 📋 Requirements

- Python 3.6 or higher
- No external dependencies required (uses only standard library)

## 🚀 Installation

1. **Navigate to the project directory:**
   ```bash
   cd week-3/organize-folders-auto
   ```

2. **No installation needed!** The script uses only Python's standard library.

   (Optional) Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

## 💻 Usage

### Basic Usage

1. **Place the script in the directory you want to organize:**
   ```bash
   cd /path/to/messy/directory
   cp organize_files.py .
   ```

2. **Run the script:**
   ```bash
   python organize_files.py
   ```

3. **Files are automatically organized:**
   ```
   Before:
   ├── photo1.jpg
   ├── document.pdf
   ├── video.mp4
   ├── script.py
   └── organize_files.py

   After:
   ├── images/
   │   └── photo1.jpg
   ├── pdfs/
   │   └── document.pdf
   ├── videos/
   │   └── video.mp4
   ├── other/
   │   └── script.py
   └── organize_files.py
   ```

### Organizing a Specific Directory

Edit the script to specify a directory:

```python
# At the bottom of organize_files.py
if __name__ == "__main__":
    organize_files('/path/to/directory')  # Specify directory here
```

Or modify the script to accept command-line arguments.

## 📁 Project Structure

```
organize-folders-auto/
├── organize_files.py     # Main script
├── other/
│   └── requirements.txt  # Optional dependencies (not required)
├── images/              # Created automatically (image files)
├── pdfs/                # Created automatically (PDF files)
├── videos/              # Created automatically (video files)
├── other/               # Created automatically (other files)
└── README.md           # This file
```

## 🔧 How It Works

1. **Scan Directory**: Finds all files in the specified directory
2. **Categorize**: Determines file category based on extension
3. **Create Folders**: Creates category folders if they don't exist
4. **Handle Conflicts**: Renames files if duplicates exist (adds `_1`, `_2`, etc.)
5. **Move Files**: Safely moves files to appropriate folders
6. **Report**: Displays summary statistics

## 📊 Example Output

```
Found 25 file(s) to organize...

Moved: photo1.jpg -> images/photo1.jpg
Moved: photo2.png -> images/photo2.png
Moved: document.pdf -> pdfs/document.pdf
Moved: video.mp4 -> videos/video.mp4
Moved: script.py -> other/script.py
...

==================================================
Organization Complete!
==================================================
Images moved: 12
PDFs moved: 5
Videos moved: 3
Other files moved: 5
Files skipped: 0
==================================================
```

## ⚙️ Customization

### Adding New File Types

Edit the `get_file_category()` function in `organize_files.py`:

```python
def get_file_category(file_path):
    extension = Path(file_path).suffix.lower()
    
    # Add your custom extensions
    code_extensions = {'.py', '.js', '.html', '.css'}
    document_extensions = {'.doc', '.docx', '.txt'}
    
    if extension in image_extensions:
        return 'images'
    elif extension in code_extensions:
        return 'code'  # New category
    # ... etc
```

### Changing Folder Names

Modify the category names returned by `get_file_category()`:

```python
return 'photos'  # Instead of 'images'
return 'documents'  # Instead of 'pdfs'
```

### Excluding Files

The script automatically excludes:
- Hidden files (starting with `.`)
- `__pycache__` directories
- The script itself

To exclude more files, modify the filtering logic:

```python
files = [f for f in base_path.iterdir() 
         if f.is_file() 
         and f.name != script_name
         and not f.name.startswith('.')
         and f.name not in ['exclude1.txt', 'exclude2.txt']]  # Add exclusions
```

## 🎯 Use Cases

- **Downloads Folder**: Organize downloaded files automatically
- **Desktop Cleanup**: Tidy up a cluttered desktop
- **Project Organization**: Organize project assets
- **Media Library**: Organize photos, videos, and documents
- **Backup Organization**: Organize backup files by type

## 📝 Notes

- **Safe Operation**: Files are moved, not copied (original files are moved to new locations)
- **No Data Loss**: Files are preserved during the move operation
- **Script Location**: The script itself is never moved
- **Hidden Files**: Hidden files (starting with `.`) are skipped
- **Duplicate Names**: Files with duplicate names get numbered suffixes (`_1`, `_2`, etc.)
- **Large Files**: Works with files of any size (limited by available disk space)

## 🐛 Troubleshooting

### Permission Errors
- Ensure you have write permissions in the directory
- Check file permissions: `ls -la`
- Run with appropriate permissions if needed

### Files Not Moving
- Verify file extensions are recognized
- Check that files aren't hidden (starting with `.`)
- Ensure files aren't currently in use by another program

### Folders Not Created
- Check write permissions in the directory
- Verify disk space is available
- Ensure directory path is correct

### Script Moves Itself
- The script automatically excludes itself
- If this happens, check the script name matches `organize_files.py`
- Modify the exclusion logic if using a different script name

## 🔄 Running Multiple Times

The script is safe to run multiple times:
- Already organized files stay in their folders
- New files are organized into existing folders
- Duplicate names are handled automatically

## 💡 Tips

1. **Backup First**: Always backup important files before organizing
2. **Test on Small Directory**: Test with a small directory first
3. **Review Output**: Check the summary statistics after running
4. **Customize Categories**: Modify categories to match your needs
5. **Schedule Regular Runs**: Set up a cron job or scheduled task for automatic organization

## 📄 License

This project is part of the AI Maker Bootcamp educational program.

## 👤 Author

Created as part of Week 3 of the AI Maker Bootcamp.

---

**Keep your files organized! 📁✨**

