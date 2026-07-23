class CaroleanBookingForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.apiUrl = this.getAttribute("api-url") || "https://cabfare-backend.mohammad-taimoor855.workers.dev";
    this.googleKey = this.getAttribute("google-maps-key") || "";
    this.step = 1;
    this.luggageType = "handbag";
    this.quotes = [];
    this.selectedQuote = null;
    this.loading = false;
    this.data = {
      journeyType: "one-way", origin: "", destination: "", departureDate: "", returnDate: "",
      passengers: 16, suitcaseCount: 16, handbagCount: 16, vehiclePreference: "minibus",
      stops: [], wpCoords: [], name: "", phone: "", email: "", specialRequests: ""
    };
  }

  connectedCallback() {
    this.render();
    this.loadGoogleMaps();
  }

  async loadGoogleMaps() {
    if (!this.googleKey || window.google?.maps?.places) return this.bindPlaces();
    if (!document.querySelector('script[data-carolean-google]')) {
      const script = document.createElement("script");
      script.dataset.caroleanGoogle = "true";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(this.googleKey)}&libraries=places`;
      script.async = true;
      script.onload = () => this.bindPlaces();
      document.head.appendChild(script);
    }
  }

  bindPlaces() {
    if (!window.google?.maps?.places) return;
    this.shadowRoot.querySelectorAll("[data-place]").forEach(input => {
      if (input.dataset.bound) return;
      input.dataset.bound = "1";
      const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: "gb" },
        fields: ["formatted_address", "geometry", "name"]
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const value = place.formatted_address || place.name || input.value;
        const coords = place.geometry?.location ? {
          lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), name: value
        } : null;
        this.setLocation(input.dataset.place, Number(input.dataset.index), value, coords);
      });
    });
  }

  setLocation(type, index, value, coords) {
    if (type === "origin") {
      this.data.origin = value;
      this.data.wpCoords[0] = coords;
    } else if (type === "destination") {
      this.data.destination = value;
      this.data.wpCoords[this.data.stops.length + 1] = coords;
    } else {
      this.data.stops[index] = { ...this.data.stops[index], place: value, coords };
    }
  }

  fieldChange(event) {
    const field = event.target.dataset.field;
    if (!field) return;
    this.data[field] = event.target.type === "number" ? Number(event.target.value) : event.target.value;
  }

  addStop() {
    this.data.stops.push({ place: "", coords: null });
    this.render();
  }

  removeStop(index) {
    this.data.stops.splice(index, 1);
    this.render();
  }

  moveStop(index, direction) {
    const next = index + direction;
    if (next < 0 || next >= this.data.stops.length) return;
    [this.data.stops[index], this.data.stops[next]] = [this.data.stops[next], this.data.stops[index]];
    this.render();
  }

  adjust(field, amount, min = 0) {
    this.data[field] = Math.max(min, Number(this.data[field] || 0) + amount);
    this.render();
  }

  async calculate() {
    this.syncInputs();
    if (!this.data.origin || !this.data.destination || !this.data.departureDate) {
      return this.showError("Enter pickup, destination, and departure date.");
    }
    this.loading = true;
    this.render();
    try {
      const waypoints = [this.data.origin, ...this.data.stops.map(s => s.place).filter(Boolean), this.data.destination];
      const wpCoords = [this.data.wpCoords[0], ...this.data.stops.map(s => s.coords), this.data.wpCoords[this.data.stops.length + 1]];
      const response = await fetch(`${this.apiUrl}/api/quotes/calculate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...this.data, waypoints, wpCoords })
      });
      if (!response.ok) throw new Error("Pricing service unavailable");
      const result = await response.json();
      this.quotes = result.quotes || [];
      this.selectedQuote = this.quotes.find(q => q.vehicle.id === this.data.vehiclePreference) || this.quotes[0];
      this.step = 2;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
      this.render();
    }
  }

  nextDetails() {
    this.syncInputs();
    if (!this.data.name || !this.data.email || !this.data.phone) {
      return this.showError("Enter your name, email, and phone number.");
    }
    this.step = 3;
    this.render();
    requestAnimationFrame(() => this.renderMap());
  }

  async confirm() {
    if (!this.selectedQuote) return;
    this.loading = true;
    this.render();
    try {
      const response = await fetch(`${this.apiUrl}/api/bookings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: this.data.name, phone: this.data.phone, email: this.data.email },
          journey: this.data, quote: this.selectedQuote
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Booking could not be saved");
      this.reference = result.booking.id;
      this.step = 4;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
      this.render();
    }
  }

  syncInputs() {
    this.shadowRoot.querySelectorAll("[data-field]").forEach(input => this.fieldChange({ target: input }));
    this.shadowRoot.querySelectorAll("[data-place]").forEach(input => {
      if (input.dataset.place === "origin") this.data.origin = input.value;
      else if (input.dataset.place === "destination") this.data.destination = input.value;
      else this.data.stops[Number(input.dataset.index)].place = input.value;
    });
  }

  showError(message) {
    this.error = message;
    this.render();
  }

  renderMap() {
    const container = this.shadowRoot.querySelector("#route-map");
    if (!container || !window.google?.maps || !this.data.origin || !this.data.destination) return;
    const map = new google.maps.Map(container, { zoom: 7, center: { lat: 52.5, lng: -1.5 }, disableDefaultUI: true });
    const renderer = new google.maps.DirectionsRenderer({ map });
    new google.maps.DirectionsService().route({
      origin: this.data.origin, destination: this.data.destination,
      waypoints: this.data.stops.filter(s => s.place).map(s => ({ location: s.place, stopover: true })),
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => status === "OK" && renderer.setDirections(result));
  }

  styles() {
    return `<style>
      :host{display:block;width:100%;max-width:445px;font-family:Arial,sans-serif;color:#1d225c}
      *{box-sizing:border-box}.card{background:#fff;border-radius:38px;padding:28px;box-shadow:0 20px 45px rgba(6,10,72,.18)}
      .head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.head h2{margin:0;font-size:24px}
      .dots{display:flex;gap:4px}.dot{width:6px;height:6px;border-radius:50%;background:#d7d8e2}.dot.on{background:#d2232a}
      .tabs{display:flex;background:#f0edec;border-radius:999px;padding:5px;margin-bottom:22px}.tabs button{flex:1;border:0;border-radius:999px;padding:12px;background:transparent;font-weight:700}.tabs .on{background:#d2232a;color:#fff}
      .stack{display:grid;gap:12px}.place{position:relative}.place input,.input,textarea{width:100%;border:1px solid #c7c5d1;background:#fff;color:#1c1b1b;font-size:15px;outline:0}
      .place input{height:56px;border-radius:999px;padding:0 48px}.pin{position:absolute;left:15px;top:16px;border:0;background:transparent;font-size:20px}.green{color:#20c878}.red{color:#e1262f}.blue{color:#4285f4}
      .stop{display:grid;grid-template-columns:24px 1fr 32px;gap:7px;align-items:center}.order{display:grid}.order button,.remove{border:0;background:transparent;color:#8b91a3;padding:0}.remove{color:#e1262f;font-size:20px}
      .add{justify-self:end;border:1px dashed #c7c5d1;background:#fff;border-radius:999px;padding:6px 11px;color:#1d225c;font-weight:700}
      .dates{display:grid;grid-template-columns:1fr 1fr;gap:10px}.input{height:52px;border-radius:14px;padding:0 15px}textarea.input{height:92px;padding:13px;resize:vertical}
      .controls{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:7px}.pill{height:56px;border:1px solid #c7c5d1;border-radius:999px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#fff}
      .pill button{border:0;background:transparent;color:#8b91a3;font-size:22px}.value{text-align:center;font-weight:800}.value small{display:block;font-size:8px;color:#667085;text-transform:uppercase}.vehicle{width:100%;border:0;color:#1d225c;font-weight:700;font-size:11px;background:transparent}
      .primary{width:100%;height:58px;border:0;border-radius:999px;background:#d2232a;color:#fff;font-size:16px;font-weight:800;box-shadow:0 12px 22px rgba(210,35,42,.25)}
      .actions{display:flex;gap:10px;margin-top:16px}.back{height:52px;padding:0 18px;border:1px solid #c7c5d1;border-radius:999px;background:#fff;color:#1d225c;font-weight:700}.actions .primary{height:52px}
      label{display:block;font-size:10px;font-weight:800;text-transform:uppercase;color:#718096;margin:0 0 5px 4px}.error{padding:10px;border-radius:10px;background:#fff0f0;color:#b91c1c;font-size:12px}
      .route{background:#060a48;color:#fff;border-radius:16px;padding:16px}.route strong{font-size:17px}.route small{display:block;margin-top:5px;opacity:.75}
      .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.box{padding:11px;background:#f6f3f2;border-radius:12px;font-size:11px}.box b{display:block;margin-top:3px}
      .option{border:1px solid #c7c5d1;border-radius:15px;padding:13px}.option-head{display:flex;justify-content:space-between;gap:10px}.price{text-align:right;font-weight:800}
      #route-map{height:150px;border-radius:10px;background:#f0edec;margin-top:10px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:7px}.metric{text-align:center;padding:7px 3px;background:#f6f8fb;border-radius:8px;font-size:10px}.metric b{display:block;margin-top:3px}
      .success{text-align:center;padding:10px 0}.check{width:62px;height:62px;border-radius:50%;background:#e6f8ec;color:#15803d;display:grid;place-items:center;margin:0 auto 16px;font-size:30px}.ref{padding:14px;background:#f6f3f2;border-radius:13px;font-weight:900;letter-spacing:1px}
      @media(max-width:480px){.card{padding:22px;border-radius:28px}.dates{grid-template-columns:1fr}.controls{grid-template-columns:1.2fr 1fr 1fr}}
    </style>`;
  }

  render() {
    const dots = [1,2,3,4].map(i => `<i class="dot ${this.step === i ? "on" : ""}"></i>`).join("");
    let body = "";
    if (this.step === 1) body = this.journeyTemplate();
    if (this.step === 2) body = this.detailsTemplate();
    if (this.step === 3) body = this.reviewTemplate();
    if (this.step === 4) body = this.successTemplate();
    this.shadowRoot.innerHTML = `${this.styles()}<div class="card"><div class="head"><h2>${["","Fast Quote","Your Details","Review Booking","Booking Confirmed"][this.step]}</h2><div class="dots">${dots}</div></div>${body}</div>`;
    this.bindEvents();
    this.bindPlaces();
  }

  journeyTemplate() {
    const stops = this.data.stops.map((stop, index) => `<div class="stop">
      <div class="order"><button data-up="${index}" ${index === 0 ? "disabled" : ""}>⌃</button><button data-down="${index}" ${index === this.data.stops.length - 1 ? "disabled" : ""}>⌄</button></div>
      <div class="place"><button class="pin blue" type="button">●</button><input data-place="stop" data-index="${index}" value="${stop.place || ""}" placeholder="Stop ${index + 1}"></div>
      <button class="remove" data-remove="${index}" type="button">×</button>
    </div>`).join("");
    return `<div class="tabs"><button data-trip="one-way" class="${this.data.journeyType === "one-way" ? "on" : ""}">One-Way</button><button data-trip="return" class="${this.data.journeyType === "return" ? "on" : ""}">Return</button></div>
      <div class="stack">
        <div class="place"><button class="pin green" type="button">●</button><input data-place="origin" value="${this.data.origin}" placeholder="Pickup location"></div>
        ${stops}<button class="add" data-add type="button">＋ ${stops ? "Add another stop" : "Add stop"}</button>
        <div class="place"><button class="pin red" type="button">●</button><input data-place="destination" value="${this.data.destination}" placeholder="Destination"></div>
        <div class="dates"><input class="input" data-field="departureDate" type="datetime-local" value="${this.data.departureDate}">${this.data.journeyType === "return" ? `<input class="input" data-field="returnDate" type="datetime-local" value="${this.data.returnDate}">` : ""}</div>
        <div class="controls">
          <div class="pill"><select class="vehicle" data-field="vehiclePreference"><option value="minibus">Executive Minibus</option><option value="bus">Standard Bus</option><option value="coach">Premium Coach</option></select></div>
          ${this.counter("passengers","Passengers",1)}
          ${this.luggageCounter()}
        </div>
        ${this.error ? `<div class="error">${this.error}</div>` : ""}
        <button class="primary" data-calculate ${this.loading ? "disabled" : ""}>${this.loading ? "Calculating…" : "Continue →"}</button>
      </div>`;
  }

  counter(field, label, min) {
    return `<div class="pill"><button data-adjust="${field}" data-amount="-1" data-min="${min}">−</button><div class="value">${this.data[field]}<small>${label}</small></div><button data-adjust="${field}" data-amount="1" data-min="${min}">＋</button></div>`;
  }

  luggageCounter() {
    const field = this.luggageType === "handbag" ? "handbagCount" : "suitcaseCount";
    return `<div class="pill"><button data-adjust="${field}" data-amount="-1" data-min="0">−</button><div class="value">${this.data[field]}<select data-luggage-type style="display:block;border:0;background:transparent;color:#667085;font-size:8px;font-weight:700;text-transform:uppercase;margin:auto"><option value="handbag">Handbags</option><option value="suitcase">Suitcase 23kg</option></select></div><button data-adjust="${field}" data-amount="1" data-min="0">＋</button></div>`;
  }

  detailsTemplate() {
    return `<div class="stack">
      <div><label>Full name</label><input class="input" data-field="name" value="${this.data.name}" placeholder="Your full name"></div>
      <div><label>Email address</label><input class="input" type="email" data-field="email" value="${this.data.email}" placeholder="you@example.com"></div>
      <div><label>Phone number</label><input class="input" data-field="phone" value="${this.data.phone}" placeholder="+44 7700 900000"></div>
      <div><label>Special requests (optional)</label><textarea class="input" data-field="specialRequests" placeholder="Wheelchair access, mobility assistance, child seats, or other instructions">${this.data.specialRequests}</textarea></div>
      ${this.error ? `<div class="error">${this.error}</div>` : ""}
      <div class="actions"><button class="back" data-back="1">← Back</button><button class="primary" data-details>Continue →</button></div>
    </div>`;
  }

  reviewTemplate() {
    const q = this.selectedQuote;
    const r = q?.result || {};
    const count = q ? Math.max(1, Math.ceil(this.data.passengers / q.vehicle.capacity)) : 1;
    const price = q ? `£${Number(r.finalPrice || 0).toFixed(2)}${r.upperBoundPrice ? `–£${Number(r.upperBoundPrice).toFixed(2)}` : ""}` : "Pending";
    return `<div class="stack">
      <div class="route"><strong>${this.data.origin.split(",")[0]} → ${this.data.destination.split(",")[0]}</strong><small>${new Date(this.data.departureDate).toLocaleString("en-GB")} · ${this.data.passengers} passengers</small></div>
      <div class="summary"><div class="box">Journey<b>${this.data.journeyType === "return" ? "Return" : "One-way"}</b></div><div class="box">Luggage<b>${this.data.handbagCount} hand · ${this.data.suitcaseCount} cases</b></div><div class="box">Contact<b>${this.data.name}</b></div></div>
      <div class="option"><div class="option-head"><div><label>Selected option</label><b>${count} × ${q?.vehicle?.name || "Vehicle"}</b></div><div class="price"><label>Estimated price</label>${price}</div></div>
        <div id="route-map"></div><div class="metrics"><div class="metric">Total route<b>${r.totalKm || "—"} km</b></div><div class="metric">Live km<b>${r.revenueKm || "—"} km</b></div><div class="metric">Duration<b>${r.totalShiftHrs || "—"}h</b></div><div class="metric">Days<b>${r.opDays || 1}</b></div></div>
      </div>
      ${this.error ? `<div class="error">${this.error}</div>` : ""}
      <div class="actions"><button class="back" data-back="2">← Back</button><button class="primary" data-confirm ${this.loading ? "disabled" : ""}>${this.loading ? "Confirming…" : "Confirm Booking →"}</button></div>
    </div>`;
  }

  successTemplate() {
    return `<div class="success"><div class="check">✓</div><h3>Your booking request is confirmed</h3><p>Our team will contact <b>${this.data.email}</b> shortly to finalize the journey and assist with any special requirements.</p><div class="ref">${this.reference}</div></div>`;
  }

  bindEvents() {
    this.shadowRoot.querySelectorAll("[data-trip]").forEach(b => b.onclick = () => { this.data.journeyType = b.dataset.trip; this.render(); });
    this.shadowRoot.querySelector("[data-add]")?.addEventListener("click", () => this.addStop());
    this.shadowRoot.querySelectorAll("[data-remove]").forEach(b => b.onclick = () => this.removeStop(Number(b.dataset.remove)));
    this.shadowRoot.querySelectorAll("[data-up]").forEach(b => b.onclick = () => this.moveStop(Number(b.dataset.up), -1));
    this.shadowRoot.querySelectorAll("[data-down]").forEach(b => b.onclick = () => this.moveStop(Number(b.dataset.down), 1));
    this.shadowRoot.querySelectorAll("[data-adjust]").forEach(b => b.onclick = () => this.adjust(b.dataset.adjust, Number(b.dataset.amount), Number(b.dataset.min)));
    const luggageType = this.shadowRoot.querySelector("[data-luggage-type]");
    if (luggageType) {
      luggageType.value = this.luggageType;
      luggageType.onchange = () => { this.luggageType = luggageType.value; this.render(); };
    }
    this.shadowRoot.querySelectorAll("[data-field],[data-place]").forEach(input => input.onchange = e => this.fieldChange(e));
    this.shadowRoot.querySelector("[data-calculate]")?.addEventListener("click", () => this.calculate());
    this.shadowRoot.querySelector("[data-details]")?.addEventListener("click", () => this.nextDetails());
    this.shadowRoot.querySelector("[data-confirm]")?.addEventListener("click", () => this.confirm());
    this.shadowRoot.querySelectorAll("[data-back]").forEach(b => b.onclick = () => { this.syncInputs(); this.step = Number(b.dataset.back); this.error = ""; this.render(); });
    const vehicle = this.shadowRoot.querySelector('[data-field="vehiclePreference"]');
    if (vehicle) vehicle.value = this.data.vehiclePreference;
  }
}

if (!customElements.get("carolean-booking-form")) {
  customElements.define("carolean-booking-form", CaroleanBookingForm);
}
