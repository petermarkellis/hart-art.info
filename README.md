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
- **Authentication:** Netlify Identity
- **Development Tools:** Node.js, npm, Netlify CLI
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
├── layouts/
│   └── partials/         # Custom Hugo templates
│       └── site-scripts.html  # Netlify Identity widget
├── static/
│   ├── admin/             # Decap CMS interface
│   └── images/
│       └── uploads/       # Uploaded artwork images
├── themes/
│   └── ananke/           # Hugo theme (submodule)
├── hugo.toml             # Hugo configuration
├── netlify.toml          # Netlify deployment configuration
└── package.json          # npm scripts and dependencies
```

## Local Development

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended version recommended)
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (for CMS authentication locally)
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

3. Install Netlify CLI (if not already installed):
```bash
npm install -g netlify-cli
```

4. Link your local project to Netlify (first time only):
```bash
netlify login
netlify link --name markhartzheimart
```

5. Install npm dependencies (optional, for code formatting):
```bash
npm install
```

### Development Options

**Option 1: Development with CMS Authentication (Recommended)**
Use Netlify Dev to run the site locally with full CMS authentication support:

```bash
npm run dev:netlify
# or
netlify dev
```

This will:
- Start Hugo server (usually on port 8888)
- Enable Netlify Identity authentication
- Allow CMS access at `http://localhost:8888/admin/`
- Proxy git-gateway requests to Netlify

**Option 2: Standard Hugo Development**
For quick site preview without CMS access:

```bash
npm run dev
# or
hugo server
```

Visit `http://localhost:1313` in your browser

### Available npm Scripts

The project includes several useful npm scripts:

**Development:**
- `npm run dev` - Start Hugo development server
- `npm run dev:netlify` - Start with Netlify Dev (includes CMS auth)
- `npm run serve` - Start Hugo server with fast render disabled
- `npm run preview` - Preview site including drafts and future posts

**Build:**
- `npm run build` - Build site for production (minified)
- `npm run build:production` - Build with production environment
- `npm run rebuild` - Clean and rebuild from scratch

**Cleanup:**
- `npm run clean` - Remove build artifacts

**Git Operations:**
- `npm run push` - Push changes to GitHub
- `npm run pull` - Pull latest changes from GitHub
- `npm run status` - Check git status
- `npm run commit` - Stage all changes and commit

**Deployment:**
- `npm run deploy` - Build, commit, and push (all-in-one)

**Quality Checks:**
- `npm run check` - Quick build check
- `npm run lint` - Run build check and confirm success
- `npm run format` - Format markdown and static files with Prettier

## Content Management

The site uses Decap CMS for content management. Access the CMS at:
- **Production:** `https://markhartzheimart.netlify.app/admin/`
- **Local (with Netlify Dev):** `http://localhost:8888/admin/` (requires `npm run dev:netlify`)

**Note:** For local CMS access, you must use Netlify Dev (`npm run dev:netlify`) as it provides the authentication proxy. Standard Hugo server (`npm run dev`) will not allow CMS login.

### Adding Artworks

1. Navigate to the CMS admin panel
2. Click on "Artworks" collection
3. Create new entries in both English and German
4. Upload images to the media library
5. Save and publish

### Authentication

The CMS uses Netlify Identity for authentication:
- **Production:** Log in with your Netlify Identity account
- **Local:** Use `netlify dev` to authenticate with your Netlify account

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

