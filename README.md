# Northvane Energy: prototype customer website

A sample company website that shows how a CCP Recruit customer puts its Salesforce-hosted
job board on its own careers page. Northvane Energy is fictional.

- `index.html`: home
- `about.html`: about
- `careers.html`: careers page; embeds the Experience Cloud job board in an iframe
- `assets/`: logo and stylesheet

## Run it

The careers iframe needs a real web origin (not `file://`):

```bash
cd prototypes/northvane-website
python -m http.server 8080
# open http://localhost:8080/careers.html
```

## How the job board is embedded (Lightning Out)

`careers.html` places the CCP Recruit `atsJobBoard` component directly on the page with Salesforce
Lightning Out. There is no iframe, so the site's clickjack setting doesn't matter.

- `assets/job-board.js` loads the Lightning Out app `c:ccpRecruitOut` from the Experience Cloud site
  (`https://yachting-dev-ed.develop.my.site.com`) and creates the component with Northvane's titles.
  Applications are tagged with Source "Company Website".
- `assets/recaptcha-bridge.js` answers the component's reCAPTCHA token requests.

Requirements in Salesforce and Google:

1. **Lightning Out app** `force-app/main/default/aura/ccpRecruitOut` (deployed). It gives guest access and
   is unstyled, so Salesforce's styles don't leak into this page.
2. **CORS allowlist** entries for each website origin (`force-app/main/default/corsWhitelistOrigins`,
   deployed for `https://sachinpshrestha.github.io` and `http://localhost:8080`).
3. **reCAPTCHA domains:** in the Google reCAPTCHA admin console, add the website's domain
   (`sachinpshrestha.github.io`, `localhost`) to the site key, or applications are rejected at submit.
