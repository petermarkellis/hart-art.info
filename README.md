# Mark Hartzheim - Artist Gallery Website

A bilingual (English/German) artist gallery website for Mark Hartzheim, built with Hugo and Decap CMS.

**Live Site:** [https://hart-art.info/](https://hart-art.info/)

## About the Artist

Mark Hartzheim is an American artist living in Germany. His work explores various artistic expressions including drawings, watercolors, calligraphy, and assemblages.

### Contact Information

**Mark Hartzheim**  
95138 Bad Steben  
Oberfranken  
Bayern  
Germany

## Curriculum Vitae

### Education
- **1954** - Born in Appleton, Wisconsin, USA
- **1973-1975** - University of Wisconsin - Oshkosh  
  Art Major, German Minor
- **1975-1982** - National Art Academy Düsseldorf  
  Class of Professor Rolf Crummenauer  
  Art, Art Education
- **1982** - Awarded "Master Student" status
- **1978-1981** - Heinrich Heine University Düsseldorf  
  English

### Professional Experience
- **1985-2018** - Middle school / High school teacher
- **Since 1996** - Free-lance artist
- **2018-2019** - 8-month road trip throughout the US

### Memberships
- Art Association of Hof
- Union of Franconian Artists (Upper Bavaria)

## Technology Stack

- **Static Site Generator:** [Hugo](https://gohugo.io/)
- **Theme:** [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke)
- **CMS:** [Decap CMS](https://decapcms.org/) (formerly Netlify CMS)
- **Hosting:** Netlify
- **Languages:** English & German (bilingual support)

## Features

- 🌍 Bilingual support (English/German)
- 🎨 Content management via Decap CMS
- 📱 Responsive design
- 🖼️ Artwork gallery with image uploads
- 🔍 SEO-friendly structure

## Project Structure

```
.
├── content/
│   └── artworks/          # Artwork content (bilingual)
├── static/
│   ├── admin/             # Decap CMS interface
│   └── images/
│       └── uploads/       # Uploaded artwork images
├── themes/
│   └── ananke/           # Hugo theme (submodule)
└── hugo.toml             # Hugo configuration
```

## Local Development

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended version recommended)
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/petermarkellis/hart-art.info.git
cd hart-art.info
```

2. Initialize and update submodules:
```bash
git submodule update --init --recursive
```

3. Start the development server:
```bash
hugo server
```

4. Visit `http://localhost:1313` in your browser

## Content Management

The site uses Decap CMS for content management. Access the CMS at:
- Production: `https://hart-art.info/admin/`
- Local: `http://localhost:1313/admin/`

### Adding Artworks

1. Navigate to the CMS admin panel
2. Click on "Artworks" collection
3. Create new entries in both English and German
4. Upload images to the media library
5. Save and publish

## Deployment

This site is deployed on Netlify. The deployment is automatic when changes are pushed to the `main` branch.

### Netlify Configuration

- **Build command:** `hugo`
- **Publish directory:** `public`
- **Git Gateway:** Enabled (required for Decap CMS)

## Configuration

The site configuration is in `hugo.toml`. Key settings:

- **Languages:** English (en) and German (de)
- **Base URL:** Configured for Netlify deployment
- **Theme:** Ananke

## Intellectual Property Notice

**⚠️ IMPORTANT: Copyright and Usage Restrictions**

This repository and all its contents, including but not limited to artwork images, content, design, and code structure, are the intellectual property of **Mark Hartzheim**.

**This repository may NOT be:**
- Forked
- Copied
- Replicated
- Hosted elsewhere
- Used for any purpose

**without express written permission from Mark Hartzheim.**

All rights reserved. Unauthorized use, reproduction, or distribution of this work, or any portion thereof, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.

For permission requests, please contact Mark Hartzheim using the contact information provided above.

## License

Licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file for details.

**Note:** The Apache License 2.0 applies to the code structure and technical implementation. All artistic content, images, and personal information remain the exclusive intellectual property of Mark Hartzheim and are subject to the restrictions outlined above.

## Credits

- Theme: [Ananke by The New Dynamic](https://github.com/theNewDynamic/gohugo-theme-ananke)
- CMS: [Decap CMS](https://decapcms.org/)

