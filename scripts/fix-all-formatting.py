#!/usr/bin/env python3
"""
Fix all formatting issues where fields are on the same line.
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
            
            # Fix pattern: year: ...    dimensions_en: ...
            pattern1 = r'(year:\s*"[^"]+")\s{4,}(dimensions_en:)'
            replacement1 = r'\1\n    \2'
            content = re.sub(pattern1, replacement1, content)
            
            # Fix pattern: year: ...    dimensions_de: ...
            pattern2 = r'(year:\s*"[^"]+")\s{4,}(dimensions_de:)'
            replacement2 = r'\1\n    \2'
            content = re.sub(pattern2, replacement2, content)
            
            # Fix pattern: medium_en: ...    dimensions_en: ...
            pattern3 = r'(medium_en:[^\n]+)\s{4,}(dimensions_en:)'
            replacement3 = r'\1\n    \2'
            content = re.sub(pattern3, replacement3, content)
            
            # Fix pattern: medium_de: ...    dimensions_de: ...
            pattern4 = r'(medium_de:[^\n]+)\s{4,}(dimensions_de:)'
            replacement4 = r'\1\n    \2'
            content = re.sub(pattern4, replacement4, content)
            
            # Fix pattern: medium_de: ...    dimensions_en: ...
            pattern5 = r'(medium_de:[^\n]+)\s{4,}(dimensions_en:)'
            replacement5 = r'\1\n    \2'
            content = re.sub(pattern5, replacement5, content)
            
            # Fix pattern: title_de: ...    dimensions_en: ...
            pattern6 = r'(title_de:[^\n]+)\s{4,}(dimensions_en:)'
            replacement6 = r'\1\n    \2'
            content = re.sub(pattern6, replacement6, content)
            
            # Fix pattern: title_en: ...    dimensions_en: ...
            pattern7 = r'(title_en:[^\n]+)\s{4,}(dimensions_en:)'
            replacement7 = r'\1\n    \2'
            content = re.sub(pattern7, replacement7, content)
            
            # Fix pattern: title_de: ...    dimensions_de: ...
            pattern8 = r'(title_de:[^\n]+)\s{4,}(dimensions_de:)'
            replacement8 = r'\1\n    \2'
            content = re.sub(pattern8, replacement8, content)
            
            # Fix pattern: image: ...    dimensions_en: ...
            pattern9 = r'(image:\s*[^\n]+)\s{4,}(dimensions_en:)'
            replacement9 = r'\1\n    \2'
            content = re.sub(pattern9, replacement9, content)
            
            # Fix pattern: image: ...    dimensions_de: ...
            pattern10 = r'(image:\s*[^\n]+)\s{4,}(dimensions_de:)'
            replacement10 = r'\1\n    \2'
            content = re.sub(pattern10, replacement10, content)
            
            # Fix pattern: any field ending with value followed by 4+ spaces and another field
            # This catches any remaining cases
            pattern11 = r'([a-z_]+:\s*[^\n]+)\s{4,}([a-z_]+:)'
            replacement11 = r'\1\n    \2'
            content = re.sub(pattern11, replacement11, content)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed formatting in: {file_path}")
                modified_files_count += 1

print(f"\nFixed formatting in {modified_files_count} files")

