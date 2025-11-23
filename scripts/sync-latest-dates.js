#!/usr/bin/env node

/**
 * Script to sync date and exhibition_date fields from EN to DE versions
 * of latest news posts. This ensures both language versions have the same dates.
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
  
  // Extract date and exhibition_date from EN file
  const dateMatch = enContent.match(/^date:\s*(.+)$/m);
  const exhibitionDateMatch = enContent.match(/^exhibition_date:\s*(.+)$/m);
  
  if (!dateMatch && !exhibitionDateMatch) {
    console.log(`ℹ️  No dates found in ${baseName}.en.md, skipping...`);
    return;
  }

  // Read DE file
  let deContent = fs.readFileSync(dePath, 'utf8');
  
  // Parse YAML front matter more carefully
  const frontMatterMatch = deContent.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) {
    console.log(`⚠️  No front matter found in ${baseName}.de.md, skipping...`);
    return;
  }

  let frontMatter = frontMatterMatch[1];
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
      frontMatter = frontMatter.slice(0, titleEnd) + `date: ${dateValue}\n` + frontMatter.slice(titleEnd);
      updated = true;
    } else {
      frontMatter = `date: ${dateValue}\n${frontMatter}`;
      updated = true;
    }
  }

  // Update or add exhibition_date field
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
        frontMatter = frontMatter.slice(0, titleEnd) + `\nexhibition_date: ${exhibitionDateValue}\n` + frontMatter.slice(titleEnd);
        updated = true;
      } else {
        frontMatter = `exhibition_date: ${exhibitionDateValue}\n${frontMatter}`;
        updated = true;
      }
    }
  }

  // Reconstruct the file
  if (updated) {
    // Clean up extra blank lines
    frontMatter = frontMatter.replace(/\n{3,}/g, '\n\n');
    deContent = `---\n${frontMatter}---${restOfContent}`;
    fs.writeFileSync(dePath, deContent, 'utf8');
    console.log(`✅ Updated ${baseName}.de.md`);
  } else {
    console.log(`ℹ️  No changes needed for ${baseName}.de.md`);
  }
});

console.log('✨ Sync complete!');
