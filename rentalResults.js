const listings = [
  {
    title: "PG for Girls in Koramangala",
    images: [
      "https://source.unsplash.com/800x600/?pg,room",
      "https://source.unsplash.com/800x600/?hostel,interior",
      "https://source.unsplash.com/800x600/?girls,pg"
    ],
    location: "Koramangala, Bengaluru",
    price: "₹8,000/month",
    type: "PG / Hostel",
    rating: 4.4,
    badge: "Frequently Booked",
    distance: "1.5 km",
    features: "Wi-Fi • Meals • Laundry • 24x7 Security"
  },
  {
    title: "2BHK Flat in Bandra West",
    images: [
      "https://source.unsplash.com/800x600/?apartment,interior",
      "https://source.unsplash.com/800x600/?flat,livingroom",
      "https://source.unsplash.com/800x600/?apartment,balcony"
    ],
    location: "Bandra West, Mumbai",
    price: "₹38,000/month",
    type: "2 BHK Apartment",
    rating: 4.7,
    badge: "Top Rated",
    distance: "3.2 km",
    features: "Fully Furnished • AC • Parking • Pet Friendly"
  },
  {
    title: "Co-working Space in Cyber City",
    images: [
      "https://source.unsplash.com/800x600/?office,workspace",
      "https://source.unsplash.com/800x600/?coworking,office",
      "https://source.unsplash.com/800x600/?workspace,interior"
    ],
    location: "Cyber City, Gurgaon",
    price: "₹12,000/seat/month",
    type: "Office Space",
    rating: 4.5,
    badge: "Popular Choice",
    distance: "0.8 km",
    features: "Conference Room • Wi-Fi • Cafeteria • 24x7 Access"
  },
  {
    title: "PG for Girls in Koramangala",
    images: [
      "https://source.unsplash.com/800x600/?pg,room",
      "https://source.unsplash.com/800x600/?hostel,interior",
      "https://source.unsplash.com/800x600/?girls,pg"
    ],
    location: "Koramangala, Bengaluru",
    price: "₹8,000/month",
    type: "PG / Hostel",
    rating: 4.4,
    badge: "Frequently Booked",
    distance: "1.5 km",
    features: "Wi-Fi • Meals • Laundry • 24x7 Security"
  },
  {
    title: "2BHK Flat in Bandra West",
    images: [
      "https://source.unsplash.com/800x600/?apartment,interior",
      "https://source.unsplash.com/800x600/?flat,livingroom",
      "https://source.unsplash.com/800x600/?apartment,balcony"
    ],
    location: "Bandra West, Mumbai",
    price: "₹38,000/month",
    type: "2 BHK Apartment",
    rating: 4.7,
    badge: "Top Rated",
    distance: "3.2 km",
    features: "Fully Furnished • AC • Parking • Pet Friendly"
  },
  {
    title: "Co-working Space in Cyber City",
    images: [
      "https://source.unsplash.com/800x600/?office,workspace",
      "https://source.unsplash.com/800x600/?coworking,office",
      "https://source.unsplash.com/800x600/?workspace,interior"
    ],
    location: "Cyber City, Gurgaon",
    price: "₹12,000/seat/month",
    type: "Office Space",
    rating: 4.5,
    badge: "Popular Choice",
    distance: "0.8 km",
    features: "Conference Room • Wi-Fi • Cafeteria • 24x7 Access"
  }
];

const container = document.getElementById("results-container");

listings.forEach((item, index) => {
  const card = document.createElement("div");
  card.classList.add("property-card");

  card.innerHTML = `
    <div class="property-carousel" id="carousel-${index}">
      ${item.images.map((img, i) => 
        `<img src="${img}" class="${i === 0 ? 'active' : ''}" alt="${item.title}">`
      ).join('')}
    </div>
    <div class="property-info">
      <h5>${item.title}</h5>
      <p>${item.location}</p>
      <div class="property-meta">
        <span>${item.price}</span>
        <span class="rating">⭐ ${item.rating}</span>
      </div>
      <p>${item.features}</p>
      <span class="badge">${item.badge}</span>
    </div>
  `;

  container.appendChild(card);

  // Simple auto-image carousel
  const images = card.querySelectorAll(".property-carousel img");
  let current = 0;
  setInterval(() => {
    images[current].classList.remove("active");
    current = (current + 1) % images.length;
    images[current].classList.add("active");
  }, 3000);
});
