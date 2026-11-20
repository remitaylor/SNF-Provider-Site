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
  js/main.js         Mobile nav, scroll reveal, counters, charts, carousel, service cards, form
  img/               Logo mark + favicon (SVG)
```

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploying

Any static host works, for example GitHub Pages (Settings → Pages → deploy from `main`, root folder), Netlify, Azure Static Web Apps or S3.

## Placeholders to replace before launch

All content is draft. Items that still need real assets or verified information:

- **Photography:** every image is a styled placeholder (`<div class="ph" ...>` with a "Photo: …" label). Replace each one with `<img src="assets/img/....jpg" alt="...">` and keep the same container.
- **Logo:** `assets/img/logo-mark.svg` and the inline header mark are placeholders. Swap in the final IHP logo files.
- **Metrics:** all numbers (50+ facilities, 200+ providers, 25%, 95%, charts and case-study results) are illustrative and labeled that way on the site. Corby to confirm which metrics can be published.
- **Leadership:** Corby and Dr. Arshad need full names, titles, bios and headshots. Additional leaders are TBD.
- **Testimonial and case studies:** placeholders.
- **Services:** each card shows "Service availability to be confirmed". Confirm which services are provided directly, which are coordinated through partners, and which are planned.
- **Contact details:** email, phone and address are "coming soon".
- **Contact form:** not connected yet. Set `FORM_ENDPOINT` in `assets/js/main.js` to a form handler (Formspree, HubSpot, an internal API, etc.). Until then the form validates input and shows a preview message without sending anything.
- **Privacy Policy and Terms of Use** links in the footer.

## Open questions (from the sitemap draft)

1. Are all proposed service lines currently offered by IHP, or are some future capabilities?
2. Which clinical and operational outcomes can be published?
3. Who should be featured on the Executive Leadership page?
4. Which post-acute settings should IHP explicitly market to beyond SNFs?
5. What makes IHP's model different from MedOne, Eventus and other competitors?
6. What is the ideal next action for a prospective owner-operator visiting the site?
7. Should provider recruitment or careers be included in the initial sitemap?
8. Which future portal capabilities should the website architecture accommodate?
