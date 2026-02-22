# Interactive CV Website

A modern, interactive portfolio website featuring parallax effects, LinkedIn integration, and dynamic content presentation.

## Project Goal

Create a professional, engaging online CV that:
- Showcases skills and experience with visual flair
- Uses parallax scrolling for depth and engagement
- Integrates LinkedIn profile data
- Allows CV upload for content generation
- Works flawlessly on mobile and desktop
- Hosted on GitHub Pages

## Project Structure

```
interactive-cv/
├── index.html           # Main page
├── css/
│   ├── style.css       # Main styles
│   └── parallax.css    # Parallax effects
├── js/
│   ├── main.js         # Core functionality
│   ├── parallax.js     # Parallax logic
│   └── linkedin.js     # LinkedIn integration
├── assets/
│   ├── images/         # Photos, backgrounds
│   └── icons/          # Skill icons, logos
├── documents/          # Source files (CVs, cover letters, etc.)
└── data/
    └── content.json    # CV content data
```

## Design Principles

**Visual Hierarchy:** Hero section → About → Experience → Skills → Projects → Contact
**Parallax Layers:** Background (slow) → Midground (medium) → Foreground (fast)
**Color Palette:** Professional but distinctive (avoid generic blue/gray)
**Typography:** Max 2 fonts - one for headers, one for body
**Whitespace:** Generous spacing, avoid cluttered sections
**Accessibility:** Proper contrast ratios, semantic HTML, keyboard navigation

## Core Features

### 1. Parallax Scrolling
- Multi-layer background parallax
- Element reveal on scroll
- Smooth scroll transitions
- Performance optimized (transform3d, will-change)

### 2. LinkedIn Integration
- Profile photo import
- Work experience sync
- Skills visualization
- Education timeline
- Recommendations display

### 3. CV Upload & Parse
- PDF/DOCX upload support
- Auto-extract: name, contact, experience, skills, education
- Generate JSON structure from CV
- Preview before publish

### 4. Interactive Sections
- **Hero:** Full-screen with parallax background, name, title, CTA
- **About:** Photo, bio, key achievements
- **Experience:** Timeline with hover effects
- **Skills:** Visual bars/circles with proficiency levels
- **Projects:** Card grid with hover previews
- **Contact:** Form + social links

## Technical Stack

**HTML5:** Semantic markup (header, section, article, footer)
**CSS3:** Flexbox/Grid, CSS variables, animations, transforms
**JavaScript:** Vanilla ES6+ (no jQuery dependency)
**Libraries (optional):**
- Rellax.js or custom parallax implementation
- AOS (Animate On Scroll) for reveals
- PDF.js for CV parsing
- Typed.js for typing effect

## Parallax Implementation

### Basic Pattern
```javascript
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.parallax');
  
  parallaxElements.forEach(el => {
    const speed = el.dataset.speed || 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});
```

### Performance Best Practices
- Use `transform: translate3d()` not `top/left`
- Add `will-change: transform` to parallax elements
- Throttle scroll events (requestAnimationFrame)
- Limit parallax to desktop (disable on mobile if needed)
- Use CSS `transform` over position changes

### Parallax Layers
```html
<section class="hero">
  <div class="parallax" data-speed="0.2"><!-- Background --></div>
  <div class="parallax" data-speed="0.5"><!-- Midground --></div>
  <div class="parallax" data-speed="0.8"><!-- Foreground --></div>
</section>
```

## LinkedIn Integration Options

### Option 1: Manual Data Entry
- Copy LinkedIn profile info
- Structure in `data/content.json`
- Most reliable, no API limitations

### Option 2: LinkedIn API (Requires Auth)
- LinkedIn OAuth 2.0
- Fetch profile data via API
- Limitations: Rate limits, approval required
- **Not recommended** for simple CV sites

### Option 3: LinkedIn Badge/Plugin
```html
<script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></script>
<div class="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="yourprofile" data-version="v1"></div>
```

**Recommended:** Option 1 (manual) or scrape your own LinkedIn page once to populate JSON

## CV Upload & Parsing

### Documents Folder
The `documents/` folder contains source files:
- **CVs** - Current and previous versions (PDF/DOCX)
- **Cover Letters** - Various versions for different roles
- **Certificates** - Professional certifications, diplomas
- **References** - Letters of recommendation

**Important:** This folder is for development only. Do NOT commit sensitive documents to GitHub if the repo is public. Add `documents/` to `.gitignore` to keep these files private locally.

### Workflow
1. User uploads PDF/DOCX CV
2. Extract text using PDF.js or Mammoth.js
3. Parse sections (regex patterns for experience, education, skills)
4. Generate `content.json` structure
5. Preview and edit before publishing
6. Save to project

### Parsing Strategy
```javascript
// Example patterns
const patterns = {
  email: /[\w.-]+@[\w.-]+\.\w+/,
  phone: /[\d\s()+-]{10,}/,
  experience: /(?:experience|work history)/i,
  education: /(?:education|academic)/i,
  skills: /(?:skills|expertise|proficiencies)/i
};
```

### Libraries
- **PDF.js** (Mozilla) - PDF text extraction
- **Mammoth.js** - DOCX to HTML/text conversion
- **docx-parser** - Alternative DOCX parser

## Content Structure (content.json)

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Job Title",
    "tagline": "One-line pitch",
    "email": "email@example.com",
    "phone": "+49...",
    "location": "City, Country",
    "photo": "./assets/images/profile.jpg",
    "linkedin": "linkedin.com/in/yourprofile",
    "github": "github.com/yourusername"
  },
  "about": {
    "bio": "2-3 paragraph bio",
    "highlights": ["Achievement 1", "Achievement 2"]
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "Jan 2020 - Present",
      "description": "What you did",
      "achievements": ["Bullet 1", "Bullet 2"]
    }
  ],
  "skills": [
    {"name": "JavaScript", "level": 90, "category": "Programming"},
    {"name": "React", "level": 85, "category": "Framework"}
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University",
      "period": "2015-2019",
      "description": "Details"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "What it does",
      "tech": ["React", "Node.js"],
      "link": "https://project.com",
      "image": "./assets/images/project.jpg"
    }
  ]
}
```

## GitHub Pages Deployment

**CRITICAL SECURITY:** Add `.gitignore` to exclude private documents:
```gitignore
# Keep private documents local only
documents/
*.pdf
*.docx
*.doc

# Environment files
.env
.env.local
```

**CRITICAL:** Use relative paths for all assets

```bash
# Deploy workflow
git add .
git commit -m "Update CV content"
git push origin main
# Live at: https://[username].github.io/interactive-cv
```

**Custom Domain (Optional):**
1. Add `CNAME` file with your domain: `cv.yourdomain.com`
2. Configure DNS: `CNAME` record pointing to `[username].github.io`
3. Enable HTTPS in GitHub Pages settings

**SEO Optimization:**
- Add meta tags (description, keywords, og:image)
- Semantic HTML structure
- Alt text for all images
- Structured data (JSON-LD for Person schema)

## Development Workflow

### Phase 1: Structure & Content
1. Create HTML semantic structure
2. Upload CV and parse to JSON
3. Scrape/copy LinkedIn data to JSON
4. Test content rendering

### Phase 2: Styling
1. Define color palette and typography
2. Create responsive grid layout
3. Style each section
4. Add mobile breakpoints

### Phase 3: Interactivity
1. Implement parallax effects
2. Add scroll animations
3. Create hover effects
4. Test smooth scrolling

### Phase 4: Polish
1. Optimize images (WebP format)
2. Minify CSS/JS
3. Test on multiple devices
4. Add loading animations
5. Performance audit (Lighthouse)

### Phase 5: Deploy
1. Test locally with http-server
2. Push to GitHub
3. Verify GitHub Pages deployment
4. Test live URL
5. Share!

## Performance Checklist

- [ ] Images optimized (max 500KB total)
- [ ] CSS/JS minified for production
- [ ] Lazy load images below fold
- [ ] Debounce scroll events
- [ ] Use CSS transforms (not position)
- [ ] Lighthouse score >90
- [ ] Mobile-first responsive design
- [ ] Touch gestures work on mobile

## Accessibility Checklist

- [ ] Semantic HTML tags
- [ ] Alt text on all images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Contrast ratio WCAG AA compliant
- [ ] Screen reader tested
- [ ] Skip to content link

## Browser Support

**Target:** Modern browsers (Chrome, Firefox, Safari, Edge)
**Fallbacks:** Disable parallax on older browsers/mobile if laggy
**Testing:** BrowserStack or manual testing on real devices

## Common Issues & Solutions

**Parallax jank on mobile** → Disable parallax, use simple scroll reveals
**Images slow to load** → Compress with TinyPNG, use WebP, lazy load
**LinkedIn data outdated** → Manually update content.json quarterly
**CV parsing inaccurate** → Manual review and edit after parsing
**Layout breaks on mobile** → Use mobile-first CSS, test early
**GitHub Pages not updating** → Hard refresh, check GitHub Actions

## Resources & Inspiration

**Parallax Libraries:**
- Rellax.js (lightweight, simple API)
- Locomotive Scroll (smooth scrolling + parallax)
- GSAP ScrollTrigger (powerful but heavier)

**CV Parsing:**
- PDF.js: mozilla.github.io/pdf.js
- Mammoth.js: github.com/mwilliamson/mammoth.js

**Design Inspiration:**
- awwwards.com (portfolio sites)
- dribbble.com (CV designs)
- LinkedIn featured sections

**Icons & Graphics:**
- Font Awesome (icons)
- Heroicons (clean SVG icons)
- unDraw (illustrations)

## Privacy & Data

**Important:** This is a public website. Only include:
- Professional email (not personal)
- Work phone or contact form (not private number)
- Public social profiles
- Information you'd put on a business card

**Avoid:** Home address, private email, sensitive personal details

## Skills Available

**frontend-design** (.claude/skills/frontend-design/)
- Creates distinctive, polished UI
- Avoids generic templates
- Modern color palettes
- Professional typography
- Responsive layouts

Activates automatically when building pages/components.

## Next Steps

1. **Gather content:** 
   - Add CV(s) to `documents/` folder
   - Add cover letters to `documents/`
   - Export LinkedIn data
   - Collect project screenshots for `assets/images/`
   - Create `.gitignore` to exclude `documents/` folder
2. **Choose design:** Pick color palette, find inspiration examples
3. **Build structure:** HTML skeleton first, content second, styling third
4. **Add interactivity:** Parallax and animations after core content works
5. **Test & deploy:** Mobile testing, then push to GitHub Pages
