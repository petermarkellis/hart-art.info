#!/usr/bin/env python3
"""
Script to migrate dimensions field to dimensions_en and dimensions_de
in Hugo content files.
"""

import os
import re
import sys
from pathlib import Path

def migrate_dimensions_in_file(file_path):
    """Migrate dimensions to dimensions_en and dimensions_de in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        # Pattern to match gallery_images entries with dimensions but without dimensions_en/dimensions_de
        # We'll look for entries that have dimensions: but check if dimensions_en or dimensions_de exist
        lines = content.split('\n')
        new_lines = []
        i = 0
        
        while i < len(lines):
            line = lines[i]
            new_lines.append(line)
            
            # Check if this is a dimensions line in a gallery_images entry
            if re.match(r'^\s+dimensions:\s+.+', line):
                # Check if dimensions_en or dimensions_de already exist in the next few lines
                # (before the next gallery image entry starts with "  - image:")
                has_en = False
                has_de = False
                lookahead = i + 1
                while lookahead < len(lines) and not re.match(r'^\s+- image:', lines[lookahead]):
                    if re.match(r'^\s+dimensions_en:\s+', lines[lookahead]):
                        has_en = True
                    if re.match(r'^\s+dimensions_de:\s+', lines[lookahead]):
                        has_de = True
                    lookahead += 1
                
                # Extract the dimensions value
                match = re.match(r'^(\s+)dimensions:\s+(.+)$', line)
                if match and not (has_en and has_de):
                    indent = match.group(1)
                    dim_value = match.group(2)
                    
                    # Add dimensions_en and dimensions_de after dimensions if they don't exist
                    if not has_en:
                        new_lines.append(f'{indent}dimensions_en: {dim_value}')
                        modified = True
                    if not has_de:
                        new_lines.append(f'{indent}dimensions_de: {dim_value}')
                        modified = True
            
            i += 1
        
        if modified:
            new_content = '\n'.join(new_lines)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        return False
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
        return False

def main():
    """Main function to process all series content files."""
    content_dir = Path('content/series')
    
    if not content_dir.exists():
        print(f"Error: {content_dir} does not exist", file=sys.stderr)
        sys.exit(1)
    
    files_processed = 0
    files_modified = 0
    
    for file_path in content_dir.glob('*.md'):
        files_processed += 1
        if migrate_dimensions_in_file(file_path):
            files_modified += 1
            print(f"Migrated: {file_path}")
    
    print(f"\nProcessed {files_processed} files, modified {files_modified} files")

if __name__ == '__main__':
    main()

