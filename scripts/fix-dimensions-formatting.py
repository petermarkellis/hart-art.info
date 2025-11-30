#!/usr/bin/env python3
"""
Fix formatting issues where medium_en and dimensions_en are on the same line.
"""

import os
import re

content_dir = 'content/series'
modified_files_count = 0

for root, _, files in os.walk(content_dir):
    for file_name in files:
        if file_name.endswith('.en.md') or file_name.endswith('.de.md'):
            file_path = os.path.join(root, file_name)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Fix pattern: medium_en: ...    dimensions_en: ...
            # Replace with: medium_en: ...\n    dimensions_en: ...
            pattern = r'(medium_en:[^\n]+)\s{4,}(dimensions_en:)'
            replacement = r'\1\n    \2'
            content = re.sub(pattern, replacement, content)
            
            # Also fix medium_de pattern
            pattern2 = r'(medium_de:[^\n]+)\s{4,}(dimensions_de:)'
            replacement2 = r'\1\n    \2'
            content = re.sub(pattern2, replacement2, content)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed formatting in: {file_path}")
                modified_files_count += 1

print(f"\nFixed formatting in {modified_files_count} files")

