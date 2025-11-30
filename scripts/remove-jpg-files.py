#!/usr/bin/env python3
"""
Remove JPG/JPEG files from uploads folder that have corresponding WebP versions.
Keeps files that are still referenced in content files.
"""

import os
import re

uploads_dir = 'static/images/uploads'
keep_files = {
    'mark_hartzheim_photo.jpg',  # Still used in about page
    'placeholder.jpg',  # Still used in sample artworks
    'hero_background.jpg',  # Still used in sample artworks
}

removed_count = 0
kept_count = 0

# Find all JPG files
for root, _, files in os.walk(uploads_dir):
    for file_name in files:
        if file_name.lower().endswith(('.jpg', '.jpeg')):
            file_path = os.path.join(root, file_name)
            
            # Check if we should keep this file
            if file_name in keep_files:
                print(f"Keeping (still referenced): {file_path}")
                kept_count += 1
                continue
            
            # Check if corresponding WebP exists
            webp_path = os.path.splitext(file_path)[0] + '.webp'
            
            if os.path.exists(webp_path):
                # Safe to remove - WebP version exists
                os.remove(file_path)
                print(f"Removed: {file_path}")
                removed_count += 1
            else:
                print(f"Keeping (no WebP version): {file_path}")
                kept_count += 1

print(f"\nRemoved {removed_count} JPG files")
print(f"Kept {kept_count} JPG files")

