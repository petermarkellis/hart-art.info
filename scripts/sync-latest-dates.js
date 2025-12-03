#!/usr/bin/env node

/**
 * Script to sync date, exhibition_start_date, and exhibition_end_date fields from EN to DE versions
 * of latest news posts. This ensures both language versions have the same dates.
 * Also supports legacy exhibition_date field for backward compatibility.
 */

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content', 'latest');

// Get all EN files
const enFiles = fs.readdirSync(contentDir)
  .filter(file => file.endsWith('.en.md'))
  .map(file => ({
    enPath: path.join(contentDir, file),
    dePath: path.join(contentDir, file.replace('.en.md', '.de.md')),
    baseName: file.replace('.en.md', '')
  }));

console.log(`Found ${enFiles.length} EN files to process...`);

enFiles.forEach(({ enPath, dePath, baseName }) => {
  if (!fs.existsSync(dePath)) {
    console.log(`⚠️  DE file not found for ${baseName}, skipping...`);
    return;
  }

  // Read EN file
  const enContent = fs.readFileSync(enPath, 'utf8');
  
  // Extract date, exhibition_start_date, and exhibition_end_date from EN file
  const dateMatch = enContent.match(/^date:\s*(.+)$/m);
  const exhibitionStartDateMatch = enContent.match(/^exhibition_start_date:\s*(.+)$/m);
  const exhibitionEndDateMatch = enContent.match(/^exhibition_end_date:\s*(.+)$/m);
  // Legacy support for old exhibition_date field
  const exhibitionDateMatch = enContent.match(/^exhibition_date:\s*(.+)$/m);
  
  if (!dateMatch && !exhibitionStartDateMatch && !exhibitionEndDateMatch && !exhibitionDateMatch) {
    console.log(`ℹ️  No dates found in ${baseName}.en.md, skipping...`);
    return;
  }

  // Read DE file
  let deContent = fs.readFileSync(dePath, 'utf8');
  
  // Parse YAML front matter more carefully
  // Match opening ---, capture content, and match closing --- (with or without newline before it)
  let frontMatterMatch = deContent.match(/^---\n([\s\S]*?)\n---(\n|$)/);
  if (!frontMatterMatch) {
    // Try matching with --- immediately after content (no newline before closing ---)
    frontMatterMatch = deContent.match(/^---\n([\s\S]*?)---(\n|$)/);
  }
  if (!frontMatterMatch) {
    console.log(`⚠️  No front matter found in ${baseName}.de.md, skipping...`);
    return;
  }

  let frontMatter = frontMatterMatch[1];
  // Remove trailing newlines from front matter content (we'll add one back when reconstructing)
  frontMatter = frontMatter.replace(/\n+$/, '');
  const restOfContent = deContent.slice(frontMatterMatch[0].length);
  let updated = false;

  // Update or add date field
  if (dateMatch) {
    const dateValue = dateMatch[1].trim();
    // Remove existing date field (handle multi-line values)
    const dateRegex = /^date:\s*.*(\n(?:\s+.*|$))*/m;
    if (dateRegex.test(frontMatter)) {
      frontMatter = frontMatter.replace(dateRegex, '');
      updated = true;
    }
    // Add date after title, handling multi-line titles
    const titleMatch = frontMatter.match(/^(title:\s*.*(?:\n\s+[^:]+)*?)(\n|$)/m);
    if (titleMatch) {
      // Find the end of the title block (next field or end of front matter)
      const titleEnd = titleMatch.index + titleMatch[0].length;
      // Ensure we have a newline before inserting the date field
      const needsNewline = frontMatter[titleEnd - 1] !== '\n';
      frontMatter = frontMatter.slice(0, titleEnd) + (needsNewline ? '\n' : '') + `date: ${dateValue}\n` + frontMatter.slice(titleEnd);
      updated = true;
    } else {
      frontMatter = `date: ${dateValue}\n${frontMatter}`;
      updated = true;
    }
  }

  // Update or add exhibition_start_date field
  if (exhibitionStartDateMatch) {
    const exhibitionStartDateValue = exhibitionStartDateMatch[1].trim();
    // Remove existing exhibition_start_date field (handle multi-line values)
    const exhibitionStartDateRegex = /^exhibition_start_date:\s*.*(\n(?:\s+.*|$))*/m;
    if (exhibitionStartDateRegex.test(frontMatter)) {
      frontMatter = frontMatter.replace(exhibitionStartDateRegex, '');
      updated = true;
    }
    // Add exhibition_start_date after date (or after title if no date)
    const dateMatchInDe = frontMatter.match(/^(date:\s*.*\n)/m);
    if (dateMatchInDe) {
      const dateEnd = dateMatchInDe.index + dateMatchInDe[0].length;
      frontMatter = frontMatter.slice(0, dateEnd) + `exhibition_start_date: ${exhibitionStartDateValue}\n` + frontMatter.slice(dateEnd);
      updated = true;
    } else {
      const titleMatch = frontMatter.match(/^(title:\s*.*(?:\n\s+[^:]+)*?)(\n|$)/m);
      if (titleMatch) {
        const titleEnd = titleMatch.index + titleMatch[0].length;
        // Ensure we have a newline before inserting the date field
        const needsNewline = frontMatter[titleEnd - 1] !== '\n';
        frontMatter = frontMatter.slice(0, titleEnd) + (needsNewline ? '\n' : '') + `exhibition_start_date: ${exhibitionStartDateValue}\n` + frontMatter.slice(titleEnd);
        updated = true;
      } else {
        frontMatter = `exhibition_start_date: ${exhibitionStartDateValue}\n${frontMatter}`;
        updated = true;
      }
    }
  }

  // Update or add exhibition_end_date field
  if (exhibitionEndDateMatch) {
    const exhibitionEndDateValue = exhibitionEndDateMatch[1].trim();
    // Remove existing exhibition_end_date field (handle multi-line values)
    const exhibitionEndDateRegex = /^exhibition_end_date:\s*.*(\n(?:\s+.*|$))*/m;
    if (exhibitionEndDateRegex.test(frontMatter)) {
      frontMatter = frontMatter.replace(exhibitionEndDateRegex, '');
      updated = true;
    }
    // Add exhibition_end_date after exhibition_start_date (or after date if no start date, or after title)
    const exhibitionStartDateMatchInDe = frontMatter.match(/^(exhibition_start_date:\s*.*\n)/m);
    if (exhibitionStartDateMatchInDe) {
      const startDateEnd = exhibitionStartDateMatchInDe.index + exhibitionStartDateMatchInDe[0].length;
      frontMatter = frontMatter.slice(0, startDateEnd) + `exhibition_end_date: ${exhibitionEndDateValue}\n` + frontMatter.slice(startDateEnd);
      updated = true;
    } else {
      const dateMatchInDe = frontMatter.match(/^(date:\s*.*\n)/m);
      if (dateMatchInDe) {
        const dateEnd = dateMatchInDe.index + dateMatchInDe[0].length;
        frontMatter = frontMatter.slice(0, dateEnd) + `exhibition_end_date: ${exhibitionEndDateValue}\n` + frontMatter.slice(dateEnd);
        updated = true;
      } else {
        const titleMatch = frontMatter.match(/^(title:\s*.*(?:\n\s+[^:]+)*?)(\n|$)/m);
        if (titleMatch) {
          const titleEnd = titleMatch.index + titleMatch[0].length;
          // Ensure we have a newline before inserting the date field
          const needsNewline = frontMatter[titleEnd - 1] !== '\n';
          frontMatter = frontMatter.slice(0, titleEnd) + (needsNewline ? '\n' : '') + `exhibition_end_date: ${exhibitionEndDateValue}\n` + frontMatter.slice(titleEnd);
          updated = true;
        } else {
          frontMatter = `exhibition_end_date: ${exhibitionEndDateValue}\n${frontMatter}`;
          updated = true;
        }
      }
    }
  }

  // Legacy support: Update or add old exhibition_date field (for backward compatibility)
  if (exhibitionDateMatch) {
    const exhibitionDateValue = exhibitionDateMatch[1].trim();
    // Remove existing exhibition_date field (handle multi-line values)
    const exhibitionDateRegex = /^exhibition_date:\s*.*(\n(?:\s+.*|$))*/m;
    if (exhibitionDateRegex.test(frontMatter)) {
      frontMatter = frontMatter.replace(exhibitionDateRegex, '');
      updated = true;
    }
    // Add exhibition_date after date (or after title if no date)
    const dateMatchInDe = frontMatter.match(/^(date:\s*.*\n)/m);
    if (dateMatchInDe) {
      const dateEnd = dateMatchInDe.index + dateMatchInDe[0].length;
      frontMatter = frontMatter.slice(0, dateEnd) + `exhibition_date: ${exhibitionDateValue}\n` + frontMatter.slice(dateEnd);
      updated = true;
    } else {
        const titleMatch = frontMatter.match(/^(title:\s*.*(?:\n\s+[^:]+)*?)(\n|$)/m);
        if (titleMatch) {
          const titleEnd = titleMatch.index + titleMatch[0].length;
          // Ensure we have a newline before inserting the date field
          const needsNewline = frontMatter[titleEnd - 1] !== '\n';
          frontMatter = frontMatter.slice(0, titleEnd) + (needsNewline ? '\n' : '') + `exhibition_date: ${exhibitionDateValue}\n` + frontMatter.slice(titleEnd);
          updated = true;
      } else {
        frontMatter = `exhibition_date: ${exhibitionDateValue}\n${frontMatter}`;
        updated = true;
      }
    }
  }

  // Reconstruct the file
  if (updated) {
    // Clean up extra blank lines (but preserve at least one newline at the end)
    frontMatter = frontMatter.replace(/\n{3,}/g, '\n\n');
    // Trim trailing whitespace but ensure we have exactly one newline before closing delimiter
    frontMatter = frontMatter.trimEnd();
    // Always add a newline before the closing delimiter for proper YAML formatting
    deContent = `---\n${frontMatter}\n---${restOfContent}`;
    fs.writeFileSync(dePath, deContent, 'utf8');
    console.log(`✅ Updated ${baseName}.de.md`);
  } else {
    console.log(`ℹ️  No changes needed for ${baseName}.de.md`);
  }
});

console.log('✨ Sync complete!');
