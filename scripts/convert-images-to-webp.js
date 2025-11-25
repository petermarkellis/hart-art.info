#!/usr/bin/env node

/**
 * Script to convert all JPG images in static/images/uploads to WebP format
 * and update all series markdown files to reference the WebP versions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const UPLOADS_DIR = path.join(__dirname, '../static/images/uploads');
const SERIES_DIR = path.join(__dirname, '../content/series');

// Check if sharp is available (preferred) or use ImageMagick/ffmpeg
function checkConversionTool() {
  try {
    require.resolve('sharp');
    return 'sharp';
  } catch (e) {
    // Check for ImageMagick
    try {
      execSync('which convert', { stdio: 'ignore' });
      return 'imagemagick';
    } catch (e) {
      // Check for ffmpeg
      try {
        execSync('which ffmpeg', { stdio: 'ignore' });
        return 'ffmpeg';
      } catch (e) {
        return null;
      }
    }
  }
}

// Convert image using available tool
function convertImage(inputPath, outputPath, tool) {
  try {
    if (tool === 'sharp') {
      const sharp = require('sharp');
      return sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
    } else if (tool === 'imagemagick') {
      execSync(`convert "${inputPath}" -quality 85 "${outputPath}"`, { stdio: 'inherit' });
      return Promise.resolve();
    } else if (tool === 'ffmpeg') {
      execSync(`ffmpeg -i "${inputPath}" -c:v libwebp -quality 85 "${outputPath}"`, { stdio: 'inherit' });
      return Promise.resolve();
    }
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message);
    throw error;
  }
}

// Get all JPG files
function getJpgFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isFile() && /\.jpg$/i.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Get all series markdown files
function getSeriesMarkdownFiles() {
  const files = [];
  const items = fs.readdirSync(SERIES_DIR);
  
  for (const item of items) {
    if (item.endsWith('.md')) {
      files.push(path.join(SERIES_DIR, item));
    }
  }
  
  return files;
}

// Update markdown file to use WebP instead of JPG
function updateMarkdownFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace .jpg with .webp in image paths
  content = content.replace(/\/images\/uploads\/([^"'\s]+)\.jpg/gi, '/images/uploads/$1.webp');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
async function main() {
  console.log('🖼️  Converting series images to WebP format...\n');
  
  // Check for conversion tool
  const tool = checkConversionTool();
  if (!tool) {
    console.error('❌ No image conversion tool found!');
    console.error('Please install one of the following:');
    console.error('  - npm install sharp (recommended)');
    console.error('  - ImageMagick (convert command)');
    console.error('  - ffmpeg');
    process.exit(1);
  }
  
  console.log(`✅ Using ${tool} for conversion\n`);
  
  // Get all JPG files
  const jpgFiles = getJpgFiles(UPLOADS_DIR);
  console.log(`Found ${jpgFiles.length} JPG files to convert\n`);
  
  // Convert each file
  let converted = 0;
  let skipped = 0;
  
  for (const jpgPath of jpgFiles) {
    const filename = path.basename(jpgPath);
    const webpPath = jpgPath.replace(/\.jpg$/i, '.webp');
    const webpFilename = path.basename(webpPath);
    
    // Skip if WebP already exists
    if (fs.existsSync(webpPath)) {
      console.log(`⏭️  Skipping ${filename} (WebP already exists)`);
      skipped++;
      continue;
    }
    
    try {
      console.log(`🔄 Converting ${filename} → ${webpFilename}...`);
      await convertImage(jpgPath, webpPath, tool);
      console.log(`✅ Converted ${filename}`);
      converted++;
    } catch (error) {
      console.error(`❌ Failed to convert ${filename}:`, error.message);
    }
  }
  
  console.log(`\n📊 Conversion complete:`);
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  
  // Update markdown files
  console.log(`\n📝 Updating markdown files...`);
  const markdownFiles = getSeriesMarkdownFiles();
  let updated = 0;
  
  for (const mdFile of markdownFiles) {
    if (updateMarkdownFile(mdFile)) {
      const filename = path.basename(mdFile);
      console.log(`   ✅ Updated ${filename}`);
      updated++;
    }
  }
  
  console.log(`\n📊 Updated ${updated} markdown files`);
  console.log(`\n✨ All done!`);
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

