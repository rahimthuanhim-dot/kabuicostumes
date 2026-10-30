(() => {
  "use strict";

  const WHATSAPP_URL = "https://wa.me/918259090135";
  // Set this to the deployed Apps Script /exec URL to enable Sheet logging.
  const APPS_SCRIPT_URL = "";
  const products = window.KABUI_PRODUCTS;
  const productGrid = document.getElementById("product-grid");
  const bookingForm = document.getElementById("booking-form");
  const productSelect = document.getElementById("booking-product");
  const dateInput = document.getElementById("booking-date");
  const bookingStatus = document.getElementById("booking-status");
  const catalogStatus = document.getElementById("catalog-status");
  const heroImage = document.querySelector("#top img");
  const heroFallback = document.querySelector("[data-hero-fallback]");
  const logo = document.querySelector("header img");

  if (!Array.isArray(products) || !productGrid || !bookingForm || !productSelect || !dateInput || !bookingStatus || !catalogStatus) {
    throw new Error("The page could not be initialized: product data or a required catalog or booking element is missing.");
  }

  if (heroImage && heroFallback) {
    heroImage.addEventListener("error", () => {
      heroImage.hidden = true;
      heroFallback.hidden = false;
    }, { once: true });
  }
  if (logo) {
    logo.addEventListener("error", () => {
      logo.hidden = true;
    }, { once: true });
  }

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.available ? product.name : `${product.name} — Currently rented out`;
    option.disabled = !product.available;
    productSelect.append(option);
  });

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "min-w-0";

    const imageFrame = document.createElement("div");
    imageFrame.className = "relative aspect-[0.78] overflow-hidden rounded-t-[45%] rounded-b-xl border border-copper bg-blush";

    const imageFallback = document.createElement("div");
    imageFallback.className = "absolute inset-0 grid place-items-center px-4 text-center font-heading text-xl text-rose-dark";
    imageFallback.textContent = product.name;
    imageFallback.hidden = true;

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.width = 720;
    image.height = 900;
    image.loading = "lazy";
    image.decoding = "async";
    image.className = "relative h-full w-full object-cover";
    image.addEventListener("error", () => {
      image.hidden = true;
      imageFallback.hidden = false;
    }, { once: true });

    imageFrame.append(imageFallback, image);

    const name = document.createElement("h3");
    name.className = "mt-3 font-heading text-xl font-semibold leading-tight text-ink sm:text-2xl";
    name.textContent = product.name;

    const rentalType = document.createElement("p");
    rentalType.className = "mt-1 text-xs font-semibold text-ink sm:text-sm";
    rentalType.textContent = "Rent or buy";

    let action;
    if (product.available) {
      action = document.createElement("a");
      action.className = "mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#7F3347] px-3 py-3 text-center text-sm font-bold text-white hover:bg-[#68283B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F3347]";
      action.textContent = "Ask on WhatsApp";
      action.href = `${WHATSAPP_URL}?text=${encodeURIComponent(`Hello, I’d like to ask for the price of the ${product.name}.`)}`;
      action.target = "_blank";
      action.rel = "noopener noreferrer";
    } else {
      action = document.createElement("button");
      action.type = "button";
      action.disabled = true;
      action.className = "mt-3 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full border border-copper bg-blush px-3 py-3 text-center text-sm font-bold text-ink";
      action.textContent = "Currently rented out";
    }

    card.append(imageFrame, name, rentalType, action);
    productGrid.append(card);
  });
  catalogStatus.textContent = `${products.length} collection items available to browse.`;

  const today = new Date();
  dateInput.min = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  function createReference() {
    const now = new Date();
    const date = [
      String(now.getFullYear()).slice(-2),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("");
    const random = new Uint16Array(1);
    window.crypto.getRandomValues(random);
    return `KB-${date}-${random[0].toString(16).padStart(4, "0").toUpperCase()}`;
  }

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    bookingStatus.textContent = "";

    if (!bookingForm.reportValidity()) return;

    const formData = new FormData(bookingForm);
    const product = products.find((item) => item.id === formData.get("product"));
    if (!product || !product.available) {
      bookingStatus.textContent = "Please choose a set that is currently available.";
      return;
    }

    const request = {
      reference: createReference(),
      name: String(formData.get("name")).trim(),
      instagram: String(formData.get("instagram")).trim(),
      productId: product.id,
      productName: product.name,
      date: String(formData.get("date")),
      mayTag: formData.get("photoTag") === "on"
    };
    const message = [
      "Kabui Costume Rental booking request",
      `Reference: ${request.reference}`,
      `Name: ${request.name}`,
      `Instagram ID: ${request.instagram || "Not provided"}`,
      `Set: ${request.productName}`,
      `Date needed: ${request.date}`,
      `You may tag me when you share photos: ${request.mayTag ? "Yes" : "No"}`
    ].join("\n");

    const whatsappUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
    if (!APPS_SCRIPT_URL) {
      window.location.assign(whatsappUrl);
      return;
    }

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(request)
      });
    } catch (error) {
      console.error("Could not log the booking request to the configured Apps Script.", error);
    }
    window.location.assign(whatsappUrl);
  });
})();
