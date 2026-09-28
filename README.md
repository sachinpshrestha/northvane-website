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

## Letting the job board load in the frame

The job board is the **Job Posting & Application** Experience Cloud site
(`https://yachting-dev-ed.develop.my.site.com/s/`). Its clickjack protection is
**"Allow framing by the same origin only"**, so any other website shows an empty frame.

To allow it: **Experience Builder → Settings → Security & Privacy → Clickjack Protection Level**.
Choose **"Allow framing by specific external domains"** (named "Allow framing of site pages on external
domains" in some releases), add each website that may frame the site to **Trusted Domains for Inline Frames**
(for example `http://localhost:8080` for testing, and the customer's real domain), then **Publish** the site.
