#!/usr/bin/env python
import sys
import warnings
import re
import html as html_module
from pathlib import Path

from datetime import datetime

from newsletter_crew.crew import NewsletterCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def generate_html_newsletter(markdown_file: str, html_file: str, topic: str, current_year: str):
    """
    Convert markdown report to HTML newsletter with NYT-style design.
    
    Args:
        markdown_file: Path to the markdown report file
        html_file: Path where HTML file will be saved
        topic: Topic of the newsletter
        current_year: Current year for the newsletter
    """
    # Read markdown file
    markdown_path = Path(markdown_file)
    if not markdown_path.exists():
        print(f"Warning: Markdown file {markdown_file} not found. Skipping HTML generation.")
        return
    
    content = markdown_path.read_text(encoding='utf-8')
    
    # Parse markdown sections (h2 headings)
    sections = []
    current_title = None
    current_content = []
    
    lines = content.split('\n')
    for line in lines:
        # Check for h2 heading (##)
        if line.startswith('## '):
            # Save previous section if exists
            if current_title:
                sections.append({
                    'title': current_title,
                    'content': '\n'.join(current_content).strip()
                })
            # Start new section
            current_title = line[3:].strip()  # Remove '## '
            current_content = []
        elif line.startswith('# '):
            # Skip main title
            continue
        elif current_title:
            if line.strip():  # Only add non-empty lines
                current_content.append(line)
    
    # Add last section
    if current_title:
        sections.append({
            'title': current_title,
            'content': '\n'.join(current_content).strip()
        })
    
    # Generate HTML
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{topic} Newsletter - {current_year}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@600&display=swap" rel="stylesheet">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Georgia', 'Times New Roman', serif;
            background-color: #ffffff;
            color: #121212;
            line-height: 1.625;
            padding: 0;
        }}

        .newspaper-container {{
            max-width: 1200px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 60px 40px;
        }}

        .header {{
            border-bottom: 1px solid #e2e2e2;
            padding-bottom: 15px;
            margin-bottom: 40px;
            text-align: left;
        }}

        .header h1 {{
            font-size: 3.5em;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-family: 'Playfair Display', 'Cormorant Garamond', 'Georgia', serif;
            color: #000;
            line-height: 1.1;
            text-transform: uppercase;
            font-style: italic;
            letter-spacing: 2px;
        }}

        .header .subtitle {{
            font-size: 0.95em;
            color: #666;
            font-weight: 400;
            margin-bottom: 8px;
            font-family: 'Georgia', serif;
        }}

        .header .date {{
            font-size: 0.75em;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: 'Arial', sans-serif;
        }}

        .main-content {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
            margin-top: 0;
        }}

        .article {{
            border-bottom: 1px solid #e2e2e2;
            padding: 35px 0;
            margin: 0;
        }}

        .article:last-child {{
            border-bottom: none;
        }}

        .article-title {{
            font-size: 1.75em;
            font-weight: 700;
            margin-bottom: 12px;
            color: #000;
            font-family: 'Georgia', serif;
            line-height: 1.2;
            letter-spacing: -0.3px;
        }}

        .article-content {{
            font-size: 1.0625em;
            text-align: left;
            color: #121212;
            line-height: 1.625;
            font-family: 'Georgia', serif;
        }}

        .article-content p {{
            margin-bottom: 1.25em;
            text-indent: 0;
        }}

        .article-content p:first-child {{
            font-weight: 400;
        }}

        .footer {{
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #e2e2e2;
            text-align: left;
            font-size: 0.75em;
            color: #666;
            font-family: 'Arial', sans-serif;
        }}

        @media (min-width: 768px) {{
            .newspaper-container {{
                padding: 80px 60px;
            }}

            .main-content {{
                grid-template-columns: 1fr 1fr;
                column-gap: 40px;
            }}

            .article {{
                padding: 40px 0;
            }}

            .article.full-width {{
                grid-column: 1 / -1;
            }}
        }}

        @media (min-width: 1024px) {{
            .newspaper-container {{
                padding: 100px 80px;
            }}
        }}

        @media print {{
            body {{
                background-color: white;
                padding: 0;
            }}

            .newspaper-container {{
                padding: 40px;
            }}
        }}
    </style>
</head>
<body>
    <div class="newspaper-container">
        <header class="header">
            <h1>{topic}</h1>
            <div class="subtitle">Comprehensive Coverage of {current_year} Developments</div>
            <div class="date">{datetime.now().strftime('%B %Y')}</div>
        </header>

        <main class="main-content">
"""
    
    # Helper function to convert markdown to HTML
    def markdown_to_html(text):
        """Convert markdown text to HTML"""
        if not text:
            return ''
        
        # First, convert markdown links [text](url) to HTML links
        # Extract links and replace with placeholders
        links = []
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        
        def link_replacer(match):
            link_text = match.group(1)
            link_url = match.group(2)
            links.append((link_text, link_url))
            return f"__LINK_{len(links)-1}__"
        
        text = re.sub(link_pattern, link_replacer, text)
        
        # Escape HTML special characters
        text = html_module.escape(text)
        
        # Restore links as HTML
        for i, (link_text, link_url) in enumerate(links):
            escaped_text = html_module.escape(link_text)
            text = text.replace(f"__LINK_{i}__", f'<a href="{html_module.escape(link_url)}" style="color: #326891; text-decoration: none;">{escaped_text}</a>')
        
        # Convert bold **text** to <strong>
        text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
        
        # Convert italic *text* to <em> (simple pattern, avoiding conflicts)
        text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', text)
        
        return text
    
    # Add articles
    for i, section in enumerate(sections):
        # First and last articles are full-width
        full_width_class = 'full-width' if (i == 0 or i == len(sections) - 1) else ''
        
        # Split into paragraphs (by double newlines or treat as single paragraph)
        if '\n\n' in section['content']:
            paragraphs = [p.strip() for p in section['content'].split('\n\n') if p.strip()]
        else:
            # If no double newlines, treat entire content as one paragraph
            paragraphs = [section['content'].strip()] if section['content'].strip() else []
        
        # Convert each paragraph to HTML
        if paragraphs:
            paragraphs_html = '\n                    '.join([f'<p>{markdown_to_html(p)}</p>' for p in paragraphs])
        else:
            paragraphs_html = '<p></p>'
        
        html_template += f"""            <article class="article {full_width_class}">
                <h2 class="article-title">{section['title']}</h2>
                <div class="article-content">
                    {paragraphs_html}
                </div>
            </article>

"""
    
    # Close HTML
    html_template += f"""        </main>

        <footer class="footer">
            <p>© {current_year} {topic} Newsletter</p>
        </footer>
    </div>
</body>
</html>
"""
    
    # Write HTML file
    html_path = Path(html_file)
    html_path.parent.mkdir(parents=True, exist_ok=True)
    html_path.write_text(html_template, encoding='utf-8')
    print(f"✓ HTML newsletter generated: {html_file}")

def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'Winter Sports',
        'current_year': str(datetime.now().year)
    }

    try:
        result = NewsletterCrew().crew().kickoff(inputs=inputs)
        
        # Generate HTML newsletter from the markdown report
        try:
            project_root = Path(__file__).parent.parent.parent
            markdown_file = project_root / 'report.md'
            html_file = project_root / 'newsletter.html'
            
            generate_html_newsletter(
                markdown_file=str(markdown_file),
                html_file=str(html_file),
                topic=inputs['topic'],
                current_year=inputs['current_year']
            )
        except Exception as html_error:
            # Don't fail the entire run if HTML generation fails
            import traceback
            print(f"Warning: Failed to generate HTML newsletter: {html_error}")
            print(traceback.format_exc())
        
        return result
    except Exception as e:
        # Log the error but don't re-raise to avoid exit code 1
        import traceback
        print(f"\nError during crew execution: {e}")
        print(traceback.format_exc())
        # Return None or empty result instead of raising
        return None


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs",
        'current_year': str(datetime.now().year)
    }
    try:
        NewsletterCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        NewsletterCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs",
        "current_year": str(datetime.now().year)
    }

    try:
        NewsletterCrew().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

def run_with_trigger():
    """
    Run the crew with trigger payload.
    """
    import json

    if len(sys.argv) < 2:
        raise Exception("No trigger payload provided. Please provide JSON payload as argument.")

    try:
        trigger_payload = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        raise Exception("Invalid JSON payload provided as argument")

    inputs = {
        "crewai_trigger_payload": trigger_payload,
        "topic": "",
        "current_year": ""
    }

    try:
        result = NewsletterCrew().crew().kickoff(inputs=inputs)
        return result
    except Exception as e:
        raise Exception(f"An error occurred while running the crew with trigger: {e}")
