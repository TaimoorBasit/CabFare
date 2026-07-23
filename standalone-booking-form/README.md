# Standalone Carolean booking form

This folder is the portable deliverable. It does not include the demonstration
landing page and does not require React, Next.js, or this repository.

Copy `carolean-booking-form.js` into the target website, then add:

```html
<script src="/assets/carolean-booking-form.js" defer></script>

<carolean-booking-form
  api-url="https://cabfare-backend.mohammad-taimoor855.workers.dev"
  google-maps-key="THE_TARGET_WEBSITE_GOOGLE_MAPS_KEY">
</carolean-booking-form>
```

The component uses Shadow DOM, so its styles remain isolated from the host
website. It connects directly to the Cloudflare pricing and booking API.

Do not place secret keys in this repository. The target website should inject
its Maps key from its own environment or server-rendered configuration.
