# SNF-Provider-Site

Website for **Integrated Health Partners (IHP)**, powered by AMA. IHP was formerly the SNF Provider Program.

This is a static site (HTML, CSS and vanilla JavaScript) with no build step or dependencies. It follows the *Proposed Website Sitemap, Draft V1* and the homepage concept direction (modern, interactive design with strong service and outcomes sections).

## Pages

| File | Nav item | Sections (from the sitemap) |
| --- | --- | --- |
| `index.html` | Home | Hero, Who We Are, Clinical Services carousel, The IHP Difference, Care Model, Why Partner, Outcomes & Impact, Executive Leadership, Testimonial, Partnership CTA |
| `about.html` | About IHP | `#who-we-are`, `#mission`, `#leadership` |
| `our-model.html` | Our Model | `#integrated-care-model`, `#how-we-partner`, `#post-acute-approach` |
| `services.html` | Services | Expandable cards: `#primary-care`, `#medical-directorship`, `#psychological-care`, `#behavioral-health`, `#lab-diagnostics`, `#ancillary-services` |
| `outcomes.html` | Outcomes & Impact | `#program-metrics` (animated counters), `#clinical-outcomes` (charts), `#operational-impact`, `#success-stories` |
| `partnerships.html` | Partnerships | `#why-partner`, `#who-we-serve`, `#partnership-approach` |
| `contact.html` | Contact / Partner With Us | `#partnership-inquiries` (form), `#general-contact`, Provider Portal "coming soon" |

Linking to a service anchor (for example `services.html#behavioral-health`) opens that card automatically.

## Structure

```
assets/
  css/styles.css     All styles; design tokens (colors, radii, shadows) are at the top in :root
  js/main.js         Mobile nav, scroll reveal, counters, charts, carousels, service cards, form
  img/               IHP logo (color + white), mark, favicons
  img/photos/        Site photography (see below)
```

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploying

Any static host works, for example GitHub Pages (Settings → Pages → deploy from `main`, root folder), Netlify, Azure Static Web Apps or S3.

## Photography

The current photos are cropped from the low-resolution homepage mockup so the site matches it visually. **They are stand-ins and should be replaced with high-resolution originals.** To swap a photo, overwrite the file in `assets/img/photos/` with the same name (JPG, landscape unless noted).

| File | Used for | Recommended size | Current quality |
| --- | --- | --- | --- |
| `hero-clinician-resident.jpg` | Homepage hero, Our Model | 2400 × 1400 | Soft, replace |
| `svc-primary-care.jpg` | Primary Care card | 800 × 500 | **Poor, replace** |
| `svc-medical-directorship.jpg` | Medical Directorship card | 800 × 500 | **Poor, replace** |
| `svc-psychological-care.jpg` | Psychological Care card | 800 × 500 | **Poor, replace** |
| `svc-behavioral-health.jpg` | Behavioral Health card | 800 × 500 | **Poor, replace** |
| `step-understand.jpg` | Model step 01, inner pages | 1200 × 640 | Acceptable stand-in |
| `step-integrate.jpg` | Model step 02, Lab & Diagnostics card, inner pages | 1200 × 640 | Acceptable stand-in |
| `step-optimize.jpg` | Model step 03, Ancillary card, inner pages | 1200 × 640 | Acceptable stand-in |
| `facility-exterior.jpg` | Testimonial, Who We Serve, case studies | 2400 × 1200 | Soft, replace |
| `bg-interior-blur.jpg` | Blurred background behind the services diagram | any (blurred) | OK |
| `bg-facility-blur.jpg` | Blurred background in Impact + Testimonial | any (blurred) | OK |
| `leader-corby.jpg` | Corby headshot (square or 4:3) | 800 × 800 | Mockup placeholder, replace with real headshot |
| `leader-arshad.jpg` | Dr. Arshad headshot (square or 4:3) | 800 × 800 | Mockup placeholder, replace with real headshot |

Lab & Diagnostics and Ancillary Services don't have their own photos yet; add `svc-lab-diagnostics.jpg` / `svc-ancillary-services.jpg` and update `index.html` and `services.html`.

## Other placeholders to replace before launch

- **Metrics:** all numbers (50+ facilities, 200+ providers, 25%, 95%, charts and case-study results) are illustrative. Corby to confirm which metrics can be published.
- **Leadership:** Corby and Dr. Arshad need full names, titles and bios. Additional leaders are TBD.
- **Testimonial and case studies:** placeholders.
- **Services:** each card shows "Service availability to be confirmed". Confirm which services are provided directly, which are coordinated through partners, and which are planned.
- **Contact details:** email, phone and address are "coming soon".
- **Contact form:** not connected yet. Set `FORM_ENDPOINT` in `assets/js/main.js` to a form handler (Formspree, HubSpot, an internal API, etc.). Until then the form validates input and shows a preview message without sending anything.
- **Social links** (LinkedIn, YouTube) in the footer and the **Privacy Policy / Terms of Use** links point to `#`.

## Open questions (from the sitemap draft)

1. Are all proposed service lines currently offered by IHP, or are some future capabilities?
2. Which clinical and operational outcomes can be published?
3. Who should be featured on the Executive Leadership page?
4. Which post-acute settings should IHP explicitly market to beyond SNFs?
5. What makes IHP's model different from MedOne, Eventus and other competitors?
6. What is the ideal next action for a prospective owner-operator visiting the site?
7. Should provider recruitment or careers be included in the initial sitemap?
8. Which future portal capabilities should the website architecture accommodate?
