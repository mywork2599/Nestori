// Property Listing Modal Logic
document.addEventListener('DOMContentLoaded', function() {
  var listBtn = document.getElementById('listPropertyBtn');
  var modal = document.getElementById('propertyListingModal');
  var closeBtn = document.getElementById('closePropertyModal');
  var cancelBtn = document.getElementById('cancelPropertyModal');

  if (listBtn && modal) {
    listBtn.addEventListener('click', function() {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  window.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  // Form submission (demo only)
  var form = document.getElementById('propertyListingForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var msg = document.getElementById('formMessage');
      msg.textContent = 'Thank you! Your property listing has been submitted.';
      msg.style.color = '#28a745';
      setTimeout(closeModal, 2000);
      form.reset();
    });
  }
});
// ===============================
// 📸 IMAGE SLIDESHOW
// ===============================
let slideIndex = 0;
showSlides();

function showSlides() {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");

  // Hide all slides
  for (let slide of slides) {
    slide.style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;

  // Remove active class from all dots
  for (let dot of dots) {
    dot.classList.remove("active");
  }

  // Show current slide and activate current dot
  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1]?.classList.add("active");
  }

  // Change slide every 5 seconds
  setTimeout(showSlides, 5000);
}

function currentSlide(n) {
  slideIndex = n - 1;
  showSlides();
}

// ===============================
// 🔍 SEARCH BAR WITH DROPDOWN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownList = document.getElementById("dropdownList");
  const selectedCity = document.getElementById("selectedCity");
  const searchInput = document.getElementById("searchInput");
  const searchForm = document.querySelector(".search-bar");

  // Toggle dropdown
  dropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent closing when clicking inside
    dropdownList.classList.toggle("show");
    dropdownBtn.parentElement.classList.toggle("active");
  });

  // Select city from dropdown
  dropdownList?.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      selectedCity.textContent = item.textContent;
      dropdownList.classList.remove("show");
      dropdownBtn.parentElement.classList.remove("active");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdownBtn.contains(e.target)) {
      dropdownList.classList.remove("show");
      dropdownBtn.parentElement.classList.remove("active");
    }
  });

  // Handle search submission
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = selectedCity.textContent.trim();
    const query = searchInput.value.trim();

    if (city === "Select City" && query === "") {
      alert("Please select a city or enter a search term.");
      return;
    }

    alert(`Searching for "${query || 'all properties'}" in "${city}"`);
  });
});

// ===============================
// ⚡ QUICK FILTER BUTTONS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll('[aria-label="Quick Filters"] .btn');
  const listings = document.querySelectorAll(".card.mb-3");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const text = button.textContent.trim();

      listings.forEach((listing) => {
        const listingText = listing.textContent;

        // Simple filtering logic — can be expanded later
        if (text.includes("₹5,000") || text.includes("₹10,000")) {
          listing.style.display = listingText.includes("₹18,000") ? "none" : "block";
        } else if (text.includes("1 BHK")) {
          listing.style.display = listingText.includes("1 BHK") ? "block" : "none";
        } else if (text.includes("2 BHK")) {
          listing.style.display = listingText.includes("2 BHK") ? "block" : "none";
        } else if (text.includes("Furnished")) {
          listing.style.display = listingText.includes("Furnished") ? "block" : "none";
        } else if (text.includes("Unfurnished")) {
          listing.style.display = listingText.includes("Unfurnished") ? "block" : "none";
        } else {
          listing.style.display = "block";
        }
      });
    });
  });
});

// ===============================
// 🏠 PROPERTY TYPE TOGGLE BUTTONS
// ===============================
let selectedPropertyType = "PG / Hostel"; // default selected

document.querySelectorAll(".property-type-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active from others
    document.querySelectorAll(".property-type-btn").forEach((b) => b.classList.remove("active"));

    // Add active to clicked button
    btn.classList.add("active");

    // Update selected type
    selectedPropertyType = btn.getAttribute("data-type");
  });
});

// ===============================
// 🔍 UPDATED SEARCH FUNCTION
// ===============================
function handleSearch(event) {
  event.preventDefault();

  const city = document.getElementById("selectedCity").textContent;
  const query = document.getElementById("searchInput").value;

  if (city === "Select City" && !query && !selectedPropertyType) {
    alert("Please select a city, property type, or enter a search term.");
    return;
  }

  alert(`Searching for ${selectedPropertyType} rentals in ${city}${query ? ` near "${query}"` : ""}.`);
}

// ===============================
// 🎡 FEATURES CAROUSEL
// ===============================




// Features carousel logic (auto slides every 21 seconds)
(function () {
  const cards = Array.from(document.querySelectorAll('.feature-card'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const next = document.querySelector('.feat-arrow.next');
  const prev = document.querySelector('.feat-arrow.prev');
  const wrapper = document.getElementById('featuresWrapper');
  if (!cards.length) return;

  let idx = 0;
  let intervalId = null;
  const AUTO_DELAY = 11000; // 11 seconds ⏱️

  function show(i) {
    cards.forEach((c, j) => {
      c.classList.toggle('active', j === i);
      c.setAttribute('aria-hidden', j === i ? 'false' : 'true');
    });
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
    idx = i;
  }

  function nextItem() { show((idx + 1) % cards.length); }
  function prevItem() { show((idx - 1 + cards.length) % cards.length); }

  // wiring
  next?.addEventListener('click', () => { nextItem(); resetAuto(); });
  prev?.addEventListener('click', () => { prevItem(); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); resetAuto(); }));

  // keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextItem(); resetAuto(); }
    if (e.key === 'ArrowLeft') { prevItem(); resetAuto(); }
  });

  // auto-slide control
  function startAuto() {
    stopAuto();
    intervalId = setInterval(nextItem, AUTO_DELAY);
  }
  function stopAuto() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }
  function resetAuto() { stopAuto(); startAuto(); }

  // hover/touch pause
  wrapper?.addEventListener('mouseenter', stopAuto);
  wrapper?.addEventListener('mouseleave', startAuto);
  wrapper?.addEventListener('focusin', stopAuto);
  wrapper?.addEventListener('focusout', startAuto);

  // swipe gestures (mobile)
  let touchStartX = 0;
  wrapper?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? nextItem() : prevItem(); resetAuto(); }
  });

  // init
  show(0);
  startAuto();
})();


// ===============================
// 🎡 "WHY CHOOSE NESTORI" CAROUSEL
// ===============================


// WHY CHOOSE NESTORI AUTO SLIDER (21s)
(function () {
  const cards = document.querySelectorAll(".why-card");
  const dots = document.querySelectorAll(".why-dot");
  const prevBtn = document.querySelector(".why-btn.prev");
  const nextBtn = document.querySelector(".why-btn.next");

  let index = 0;
  const intervalTime = 11000;
  let autoSlide;

  function showCard(i) {
    cards.forEach((c, j) => c.classList.toggle("active", j === i));
    dots.forEach((d, j) => d.classList.toggle("active", j === i));
    index = i;
  }

  function next() {
    showCard((index + 1) % cards.length);
  }

  function prev() {
    showCard((index - 1 + cards.length) % cards.length);
  }

  function start() {
    clearInterval(autoSlide);
    autoSlide = setInterval(next, intervalTime);
  }

  nextBtn.addEventListener("click", () => {
    next();
    start();
  });

  prevBtn.addEventListener("click", () => {
    prev();
    start();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showCard(i);
      start();
    });
  });

  showCard(0);
  start();
})();

// ===============================
// 👤 AUTH MODAL - ACCOUNT BUTTON
// ===============================
document.addEventListener("DOMContentLoaded", function() {
  const authBtn = document.getElementById("authBtn");
  if (authBtn) {
    authBtn.addEventListener("click", function() {
      openAuthModal();
    });
  }
});



// ======================
// PROPERTY MODAL (FIXED)
// ======================



function openPropertyModal() {
  // Your code here
  document.getElementById('propertyModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}