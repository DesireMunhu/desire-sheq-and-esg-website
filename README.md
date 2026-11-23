# Desire Munhungewarwa — SHEQ & ESG Consultancy website (v10)

A responsive, single-page static website. No framework, build step or backend.

## Files
- `index.html`: page structure and all text
- `styles.css`: design system (forest and leaf green, Source Serif 4 headings and Source Sans 3 body text from Google Fonts)
- `script.js`: menu, carousels, scroll effects, service pre-selection from Enquire buttons, and the enquiry preparation (Gmail / email app / copy)
- `images/`: the website photos (`photo-*.webp`, from Unsplash, free for commercial use):
  - `photo-hero.webp`: open-pit mine, shown darkened behind the headline
  - `photo-osh`, `photo-environment`, `photo-quality`, `photo-esg`, `photo-training`, `photo-audit`: the six service cards
  - `photo-small`, `photo-medium`, `photo-large`: the three cards in the "Tailored SHEQ and ESG consulting" section
  - `photo-contact-bg`: faded background behind the contact section

  To swap a photo, replace the file with one of the same name (about 960×420 px for the cards, 1920 px wide for the backgrounds).

## What changed in v10
- Simpler page: Home, Services, Who we serve and Contact. The About, "How an engagement works" and Briefing topics sections are removed.
- No mention of years of experience. A scrolling band lists the industries we support, and the "Tailored SHEQ and ESG consulting" section explains how each engagement is shaped around the client's operations, priorities and needs.
- SAQDESK section removed while the platform is pilot tested. It was taken out of the nav, hero highlight cards, enquiry form, footer and page text, along with its images, styles and slideshow code.
- Interactive features: a rotating highlight card in the hero, a services carousel (arrows, swipe, autoplay that pauses on hover), hover effects on buttons, cards, links and contact rows, scroll-in animations and a back-to-top button. All motion turns off for visitors who have "reduce motion" set on their device.
- Contact: landline +263 882 903 595 added. The form has an "Industry" field.

## Before going live
- Check the industry list in the scrolling band (`index.html`, the `marquee` section). Remove any sector you don't want to advertise.
- The enquiry form does **not** send anything by itself. To receive messages directly, add a hosted form endpoint and a privacy notice.
- Legal reference: https://veritaszim.net/node/8125. Not a claim of regulator accreditation.

## Publish
- **Netlify Drop:** drag the unzipped folder (the one that contains `index.html`) to https://app.netlify.com/drop.
- **GitHub Pages:** upload all files and the `images` folder to the repository root, then Settings > Pages > Deploy from branch `main` / root.
