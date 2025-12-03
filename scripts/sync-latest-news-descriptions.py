#!/usr/bin/env python3
"""
Helper script to sync or add descriptions to German latest news files.
This is a workaround for Decap CMS bug where description field doesn't save to .de.md files.
"""

import os
import re
from pathlib import Path

content_dir = Path(__file__).parent.parent / "content" / "latest"

def read_frontmatter(file_path):
    """Read frontmatter from a markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match frontmatter between --- markers
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if match:
        frontmatter = match.group(1)
        body = match.group(2)
        return frontmatter, body
    return None, content

def parse_frontmatter(frontmatter):
    """Parse YAML frontmatter into a dict."""
    data = {}
    for line in frontmatter.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            # Remove quotes if present
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            data[key] = value
    return data

def format_frontmatter(data):
    """Format dict back into YAML frontmatter."""
    lines = []
    for key, value in data.items():
        if isinstance(value, str) and ('\n' in value or ':' in value or value.startswith('|-')):
            # Multi-line or special format
            if value.startswith('|-'):
                lines.append(f"{key}: {value}")
            else:
                lines.append(f"{key}: |-\n  {value.replace(chr(10), chr(10) + '  ')}")
        else:
            # Simple value
            if ' ' in str(value) or ':' in str(value):
                lines.append(f'{key}: "{value}"')
            else:
                lines.append(f'{key}: {value}')
    return '\n'.join(lines)

def sync_descriptions():
    """Sync descriptions from English to German files."""
    en_files = list(content_dir.glob("*.en.md"))
    
    for en_file in en_files:
        # Find corresponding German file
        base_name = en_file.stem.replace('.en', '')
        de_file = content_dir / f"{base_name}.de.md"
        
        if not de_file.exists():
            print(f"⚠️  No German file found for {en_file.name}")
            continue
        
        # Read English file
        en_frontmatter, en_body = read_frontmatter(en_file)
        if not en_frontmatter:
            print(f"⚠️  Could not parse frontmatter in {en_file.name}")
            continue
        
        en_data = parse_frontmatter(en_frontmatter)
        en_description = en_data.get('description', '').strip()
        
        if not en_description or en_description == '""':
            print(f"ℹ️  No description in {en_file.name}")
            continue
        
        # Read German file
        de_frontmatter, de_body = read_frontmatter(de_file)
        if not de_frontmatter:
            print(f"⚠️  Could not parse frontmatter in {de_file.name}")
            continue
        
        de_data = parse_frontmatter(de_frontmatter)
        de_description = de_data.get('description', '').strip()
        
        # Check if German description is empty or missing
        if not de_description or de_description == '""':
            print(f"📝 Adding description to {de_file.name}")
            # For now, we'll just mark it - user needs to translate
            # You could add a placeholder or copy the English as a starting point
            de_data['description'] = '""'  # Placeholder - user should translate
            print(f"   ⚠️  Please manually add German translation to {de_file.name}")
        else:
            print(f"✓ {de_file.name} already has a description")
        
        # Write back if we made changes
        # (For now, we're just reporting - uncomment to auto-update)
        # new_frontmatter = format_frontmatter(de_data)
        # with open(de_file, 'w', encoding='utf-8') as f:
        #     f.write(f"---\n{new_frontmatter}\n---\n{de_body}")

if __name__ == "__main__":
    print("Latest News Description Sync Helper")
    print("=" * 50)
    sync_descriptions()
    print("\nNote: This script helps identify files that need German descriptions.")
    print("Due to Decap CMS bug, descriptions need to be manually added to .de.md files.")

