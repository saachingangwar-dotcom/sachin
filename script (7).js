/* =========================================================
   EDIT THIS BLOCK FIRST – clinic details used across the site
   Phone numbers: digits only with country code, e.g. 919876543210
   ========================================================= */
const CONFIG = {
  clinicName: "[CLINIC NAME]",
  phone: "",            // [PHONE NUMBER]    e.g. "919876543210"
  whatsapp: "",         // [WHATSAPP NUMBER] e.g. "919876543210"
  email: "",            // [CLINIC EMAIL]
  address: "",          // [CLINIC ADDRESS] – used for Get Directions
  privacyUrl: "#"       // link to your privacy policy page
};

/* Services – edit text, or replace image file names in /images */
const SERVICES = [
  ["Teeth Cleaning & Scaling", "Removes plaque and tartar to keep gums healthy and breath fresh.", "service-scaling"],
  ["Root Canal Treatment", "Relieves tooth pain by treating infected pulp and saving the natural tooth.", "service-rct"],
  ["Dental Fillings", "Repairs cavities and restores the shape and function of damaged teeth.", "service-filling"],
  ["Teeth Whitening", "Brightens stained or yellowed teeth under professional supervision.", "service-whitening"],
  ["Braces & Orthodontics", "Straightens teeth and corrects bite problems for children and adults.", "service-braces"],
  ["Dental Implants", "A fixed, long-term option for replacing one or more missing teeth.", "service-implants"],
  ["Tooth Extraction", "Gentle removal of damaged or problem teeth, including wisdom teeth.", "service-extraction"],
  ["Pediatric Dentistry", "Friendly preventive and restorative care designed for young children.", "service-pediatric"],
  ["Smile Makeover", "A personalised plan combining treatments to improve the look of your smile.", "service-makeover"],
  ["Crowns & Bridges", "Caps and fixed replacements that restore strength and appearance.", "service-crowns"]
];

/* Gallery – replace files in /images with your own clinic photos (keep names or edit here) */
const GALLERY = [
  ["gallery-1", "Dentist consulting with a patient"],
  ["gallery-2", "Clinic reception area"],
  ["gallery-3", "Treatment room with dental chair"],
  ["gallery-4", "Dental instruments tray"],
  ["gallery-5", "Digital X-ray equipment"],
  ["gallery-6", "Clinic interior"],
  ["gallery-7", "Waiting area"],
  ["gallery-8", "Dentist examining teeth"],
  ["gallery-9", "Sterilisation area"],
  ["gallery-10", "Healthy smile after treatment"],
  ["gallery-11", "Dental care products"],
  ["gallery-12", "Dentist and assistant at work"]
];

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waLink = (text = "") => `https://wa.me/${CONFIG.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;

/* Placeholder shown until a real photo exists in /images */
function placeholder(label, w = 800, h = 600) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#e6f3f4"/><text x="50%" y="50%" fill="#0b6e74" font-family="sans-serif" font-size="26" text-anchor="middle">${label}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function withFallback(img, label, w, h) {
  img.addEventListener("error", () => { img.onerror = null; img.src = placeholder(label, w, h); }, { once: true });
}

/* ---------- render services + gallery ---------- */
$("#serviceGrid").innerHTML = SERVICES.map(([t, d, f]) => `
  <article class="card svc">
    <img src="images/${f}.webp" alt="${t} at ${CONFIG.clinicName}" width="400" height="250" loading="lazy">
    <div class="svc__body"><h3>${t}</h3><p>${d}</p>
      <a href="#appointment" data-service="${t}">Learn More &amp; book</a></div>
  </article>`).join("");

$("#galleryGrid").innerHTML = GALLERY.map(([f, alt], i) => `
  <button type="button" data-i="${i}" aria-label="Open image: ${alt}">
    <img src="images/${f}.webp" alt="${alt}" width="600" height="${i % 3 === 0 ? 700 : 450}" loading="lazy">
  </button>`).join("");

$("#service").innerHTML = '<option value="">Select service</option>' +
  SERVICES.map(s => `<option>${s[0]}</option>`).join("") + "<option>General check-up / Not sure</option>";
$("#footerServices").innerHTML = SERVICES.slice(0, 6).map(s => `<a href="#services">${s[0]}</a>`).join("");

/* image fallbacks */
$$(".svc img").forEach((img, i) => withFallback(img, SERVICES[i][0], 400, 250));
$$("#galleryGrid img").forEach((img, i) => withFallback(img, GALLERY[i][1], 600, i % 3 === 0 ? 700 : 450));
$$("img[data-img]").forEach(img => withFallback(img, img.alt, 640, 720));

/* "Learn More" preselects the service in the form */
$("#serviceGrid").addEventListener("click", e => {
  const a = e.target.closest("[data-service]");
  if (a) $("#service").value = a.dataset.service;
});

/* ---------- contact links ---------- */
$$("[data-wa]").forEach(a => a.href = waLink(`Hello ${CONFIG.clinicName}, I would like to know more about your dental services.`));
$$("[data-call]").forEach(a => a.href = CONFIG.phone ? `tel:+${CONFIG.phone}` : "tel:");
$$("[data-mail]").forEach(a => a.href = CONFIG.email ? `mailto:${CONFIG.email}` : "#");
$$("[data-directions]").forEach(a => a.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG.address || CONFIG.clinicName));
$("#privacyLink").href = CONFIG.privacyUrl;
$("#year").textContent = new Date().getFullYear();

/* ---------- navigation ---------- */
const nav = $("#nav"), toggle = $("#navToggle"), menu = $("#menu");
const setMenu = open => { menu.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open); toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });

/* highlight current section in the menu */
const links = $$("#menu a:not(.btn)");
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
links.forEach(l => { const s = $(l.getAttribute("href")); if (s) io.observe(s); });

/* ---------- lightbox ---------- */
const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
let cur = 0, opener = null;
function showImg(i) {
  cur = (i + GALLERY.length) % GALLERY.length;
  const src = $$("#galleryGrid img")[cur].src;
  lbImg.src = src; lbImg.alt = GALLERY[cur][1]; lbCap.textContent = `${GALLERY[cur][1]} (${cur + 1}/${GALLERY.length})`;
}
function openLb(i) { opener = document.activeElement; showImg(i); lb.hidden = false; document.body.style.overflow = "hidden"; $(".lb-close").focus(); }
function closeLb() { lb.hidden = true; document.body.style.overflow = ""; opener && opener.focus(); }
$("#galleryGrid").addEventListener("click", e => { const b = e.target.closest("button"); if (b) openLb(+b.dataset.i); });
$(".lb-close").onclick = closeLb;
$(".lb-prev").onclick = () => showImg(cur - 1);
$(".lb-next").onclick = () => showImg(cur + 1);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") showImg(cur - 1);
  if (e.key === "ArrowRight") showImg(cur + 1);
});

/* ---------- appointment form ---------- */
const form = $("#apptForm"), done = $("#done");
const dateInput = $("#date");
dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().split("T")[0];

function validate() {
  let ok = true;
  $$("[required]", form).forEach(f => {
    const msg = $(".err", f.closest(".field"));
    let error = "";
    if (!f.value.trim()) error = "This field is required.";
    else if (f.name === "phone" && f.value.replace(/\D/g, "").length < 7) error = "Enter a valid phone number.";
    msg.textContent = error;
    f.closest(".field").classList.toggle("invalid", !!error);
    if (error) ok = false;
  });
  const em = $("#email");
  if (em.value && !em.validity.valid) { $(".err", em.closest(".field")).textContent = "Enter a valid email address."; ok = false; }
  else $(".err", em.closest(".field")).textContent = "";
  return ok;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!validate()) { const bad = $(".invalid input, .invalid select", form); bad && bad.focus(); return; }
  const d = Object.fromEntries(new FormData(form));
  const text =
`Appointment request – ${CONFIG.clinicName}
Name: ${d.name}
Phone: ${d.phone}
Email: ${d.email || "-"}
Preferred date: ${d.date}
Preferred time: ${d.time}
Service: ${d.service}
Message: ${d.message || "-"}`;
  /* NOTE: this demo has no server. Connect the form to a backend/email service
     (e.g. Formspree, EmailJS) here if you want requests delivered automatically. */
  $("#doneName").textContent = d.name;
  $("#doneWa").href = waLink(text);
  form.hidden = true; done.hidden = false; done.focus();
});
$("#again").addEventListener("click", () => { form.reset(); done.hidden = true; form.hidden = false; $("#name").focus(); });
$$("input,select", form).forEach(f => f.addEventListener("input", () => { f.closest(".field").classList.remove("invalid"); }));
