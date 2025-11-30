#!/usr/bin/env python3
"""
Remove legacy 'dimensions' field from series markdown files.
Only removes it if dimensions_en and dimensions_de also exist.
"""

import os
import re

content_dir = 'content/series'
modified_files_count = 0
processed_files_count = 0

for root, _, files in os.walk(content_dir):
    for file_name in files:
        if file_name.endswith('.en.md') or file_name.endswith('.de.md'):
            file_path = os.path.join(root, file_name)
            processed_files_count += 1
            
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            original_lines = lines.copy()
            new_lines = []
            i = 0
            
            while i < len(lines):
                line = lines[i]
                
                # Check if this is a dimensions line
                if re.match(r'^\s+dimensions:\s*', line):
                    # Look ahead to see if dimensions_en and dimensions_de exist in nearby lines
                    has_en = False
                    has_de = False
                    lookahead = 0
                    
                    # Check next 10 lines for dimensions_en and dimensions_de
                    for j in range(i + 1, min(i + 11, len(lines))):
                        if re.match(r'^\s+dimensions_en:\s*', lines[j]):
                            has_en = True
                        if re.match(r'^\s+dimensions_de:\s*', lines[j]):
                            has_de = True
                        # Stop if we hit a new gallery item (starts with '  -')
                        if re.match(r'^\s+- ', lines[j]):
                            break
                    
                    # Only skip the dimensions line if both en and de exist
                    if has_en and has_de:
                        # Skip this line (don't add it to new_lines)
                        i += 1
                        continue
                
                new_lines.append(line)
                i += 1
            
            # Write back if changed
            if new_lines != original_lines:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print(f"Removed legacy dimensions from: {file_path}")
                modified_files_count += 1

print(f"\nProcessed {processed_files_count} files, modified {modified_files_count} files")
