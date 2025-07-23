let allListings = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("/products")
    .then(res => res.json())
    .then(data => {
      allListings = data;
      renderListings(allListings);
    })
    .catch(err => {
      console.error("Failed to fetch products:", err);
    });

  document.getElementById("categoryFilter").addEventListener("change", applyFilters);
  document.getElementById("departmentFilter").addEventListener("change", applyFilters);
  document.getElementById("subjectFilter").addEventListener("change", applyFilters);
});

function renderListings(listings) {
  const container = document.getElementById("listingContainer");
  container.innerHTML = "";

  listings.forEach((item) => {
    const card = document.createElement("div");
    card.className = "listing";
    card.innerHTML = `
      <img src="${item.imageUrl || item.image}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      ${item.location ? <p><strong>Location:</strong> ${item.location}</p> : ""}
      <p><strong>Type:</strong> ${item.type}</p>
      <button onclick="addToCart('${item.title}')">Add to Cart</button>
      <button onclick="addToWishlist('${item.title}')">Add to Wishlist</button>
    `;
    container.appendChild(card);
  });
}

function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const department = document.getElementById("departmentFilter").value;
  const subject = document.getElementById("subjectFilter").value;

  const filtered = allListings.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const matchDepartment = department === "All" || item.department === department;
    const matchSubject = subject === "All" || item.subject === subject;
    return matchCategory && matchDepartment && matchSubject;
  });

  renderListings(filtered);
}

function filterType(type) {
  const filtered = allListings.filter(item => item.type === type);
  renderListings(filtered);
}

function addToCart(title) {
  alert(`${title} added to cart 🛒`);
  const cart = document.getElementById("cartItems");
  const item = document.createElement("div");
  item.textContent = title;
  cart.appendChild(item);
}

function addToWishlist(title) {
  alert(`${title} added to wishlist ❤`);
  const wishlist = document.getElementById("wishlistItems");
  const item = document.createElement("div");
  item.textContent = title;
  wishlist.appendChild(item);
}