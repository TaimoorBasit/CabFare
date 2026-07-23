# Carolean booking form integration

The form-only integration is available at `/embed`. It contains the complete
journey, personal-details, quote review, route map, pricing, and booking
confirmation flow without the demonstration landing page.

## Embed on an existing website

After deploying this frontend, add:

```html
<iframe
  src="https://YOUR-FRONTEND-DOMAIN/embed"
  title="Carolean Coaches booking form"
  style="width:100%;max-width:540px;min-height:900px;border:0;display:block;margin:auto"
  loading="lazy"
></iframe>
```

The form calls the configured `NEXT_PUBLIC_API_URL` for:

- `POST /api/quotes/calculate`
- `POST /api/bookings`
- `GET /api/admin/config`

Environment files are excluded by `.gitignore` and must be configured directly
in the deployment environment.
