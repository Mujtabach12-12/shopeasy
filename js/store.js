const products = [
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 120,
    "category": "electronics",
    "rating": 4.7,
    "inStock": true,
    "image": "images/headphones.svg"
  },
  {
    "id": 2,
    "name": "Smart Watch",
    "price": 185,
    "category": "electronics",
    "rating": 4.6,
    "inStock": true,
    "image": "images/watch.svg"
  },
  {
    "id": 3,
    "name": "Bluetooth Speaker",
    "price": 85,
    "category": "electronics",
    "rating": 4.5,
    "inStock": true,
    "image": "images/speaker.svg"
  },
  {
    "id": 4,
    "name": "Desk Lamp",
    "price": 45,
    "category": "home",
    "rating": 4.8,
    "inStock": true,
    "image": "images/lamp.svg"
  },
  {
    "id": 5,
    "name": "Coffee Mug",
    "price": 22,
    "category": "home",
    "rating": 4.4,
    "inStock": true,
    "image": "images/mug.svg"
  },
  {
    "id": 6,
    "name": "Notebook Set",
    "price": 18,
    "category": "stationery",
    "rating": 4.6,
    "inStock": true,
    "image": "images/notebooks.svg"
  },
  {
    "id": 7,
    "name": "Everyday Backpack",
    "price": 74,
    "category": "accessories",
    "rating": 4.7,
    "inStock": true,
    "image": "images/backpack.svg"
  },
  {
    "id": 8,
    "name": "Sunglasses",
    "price": 55,
    "category": "accessories",
    "rating": 4.3,
    "inStock": true,
    "image": "images/sunglasses.svg"
  },
  {
    "id": 9,
    "name": "Phone Stand",
    "price": 26,
    "category": "accessories",
    "rating": 4.5,
    "inStock": true,
    "image": "images/stand.svg"
  },
  {
    "id": 10,
    "name": "Wireless Mouse",
    "price": 49,
    "category": "electronics",
    "rating": 4.6,
    "inStock": true,
    "image": "images/mouse.svg"
  },
  {
    "id": 11,
    "name": "Water Bottle",
    "price": 28,
    "category": "home",
    "rating": 4.5,
    "inStock": true,
    "image": "images/bottle.svg"
  },
  {
    "id": 12,
    "name": "Color Pen Set",
    "price": 16,
    "category": "stationery",
    "rating": 4.4,
    "inStock": true,
    "image": "images/pens.svg"
  }
];

// The JSON file supplies the displayed catalog; this original array stays unchanged.
let catalog = [...products];
let cart = [];

// Restore saved cart entries using trusted product details and valid quantities.
try {
  const saved = JSON.parse(localStorage.getItem("shopeasy_cart") || "[]");
  if (Array.isArray(saved)) {
    cart = saved.filter((item) =>
      products.some((product) => product.id === item.id) &&
      Number.isInteger(item.quantity) && item.quantity > 0
    ).map((item) => ({
      ...products.find((product) => product.id === item.id),
      quantity: item.quantity
    }));
  }
} catch (error) {
  cart = [];
}

// Display every item in the given list as a product card using forEach and the DOM.
function displayProducts(list) {
  const grid = document.getElementById("product-grid") || document.getElementById("featured-grid");
  if (!grid) return;

  grid.innerHTML = "";
  if (list.length === 0) {
    const message = document.createElement("p");
    message.className = "no-products";
    message.textContent = "No products found. Try another search or category.";
    grid.appendChild(message);
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const imageBox = document.createElement("div");
    imageBox.className = "product-image";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    imageBox.appendChild(image);

    const info = document.createElement("div");
    info.className = "product-info";
    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.category;
    const name = document.createElement("h3");
    name.textContent = product.name;
    const rating = document.createElement("p");
    rating.className = "product-rating";
    rating.textContent = `★ ${product.rating.toFixed(1)} / 5`;
    const bottom = document.createElement("div");
    bottom.className = "product-bottom";
    const price = document.createElement("strong");
    price.className = "product-price";
    price.textContent = `$${product.price.toFixed(2)}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-button";
    button.dataset.addId = String(product.id);
    button.textContent = product.inStock ? "Add to Cart" : "Out of Stock";
    button.disabled = !product.inStock;

    bottom.append(price, button);
    info.append(category, name, rating, bottom);
    card.append(imageBox, info);
    grid.appendChild(card);
  });

  // A native event lets ui.js use jQuery for the card fade-in effect.
  document.dispatchEvent(new Event("catalogRendered"));
}

// Return matching products without changing the original list, ignoring letter case.
function searchProducts(list, text) {
  return list.filter((product) => product.name.toLowerCase().includes(text.toLowerCase().trim()));
}

// Return a new list for the selected category, or a copy for "all".
function filterByCategory(list, category) {
  return category === "all" ? [...list] : list.filter((product) => product.category === category);
}

// Sort a spread copy by price while keeping the original list unchanged.
function sortProducts(list, order) {
  const copy = [...list];
  if (order === "low") return copy.sort((a, b) => a.price - b.price);
  if (order === "high") return copy.sort((a, b) => b.price - a.price);
  return copy;
}

// Find a product by its numeric ID or return the required not-found message.
function getProductById(list, id) {
  return list.find((product) => product.id === Number(id)) || "Product not found";
}

// Add a product to the cart or increase its existing quantity by one.
function addToCart(id) {
  const product = getProductById(products, id);
  if (product === "Product not found" || !product.inStock) return;

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    cart = cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
  } else {
    cart = [...cart, { ...product, quantity: 1 }];
  }
  saveCart();
  updateCartCount();
  renderCart();
  document.dispatchEvent(new CustomEvent("shopEasyMessage", { detail: `${product.name} added to cart!` }));
}

// Remove an item with filter and return the new cart array.
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== Number(id));
  saveCart();
  updateCartCount();
  renderCart();
  return cart;
}

// Change a quantity with map and remove any item whose quantity reaches zero.
function updateQuantity(id, change) {
  if (change !== 1 && change !== -1) return cart;
  cart = cart.map((item) => item.id === Number(id)
    ? { ...item, quantity: item.quantity + change }
    : item).filter((item) => item.quantity > 0);
  saveCart();
  updateCartCount();
  renderCart();
  return cart;
}

// Sum each item's price multiplied by quantity using reduce.
function getCartTotal(cartItems) {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Add any number of prices using rest/reduce and subtract the discount percentage.
function calculateBill(discount, ...prices) {
  const subtotal = prices.reduce((sum, price) => sum + price, 0);
  return subtotal - subtotal * discount / 100;
}

// Validate all five checkout fields and show red messages below invalid fields.
function validateCheckout() {
  const fullName = document.getElementById("full-name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const city = document.getElementById("city");
  const address = document.getElementById("address");
  if (!fullName || !email || !phone || !city || !address) return false;

  const fields = [
    { input: fullName, message: "Please enter your full name (at least 3 characters)." },
    { input: email, message: "Please enter a valid email address." },
    { input: phone, message: "Enter 10–15 digits, optionally starting with +." },
    { input: city, message: "Please select a city." },
    { input: address, message: "Please enter an address (at least 10 characters)." }
  ];
  let allValid = true;

  fields.forEach(({ input, message }) => {
    const text = input.value.trim();
    const wrong = text === "" || !input.checkValidity() ||
      (input === fullName && text.length < 3) ||
      (input === address && text.length < 10);
    const error = document.getElementById(`${input.id}-error`);
    if (wrong) {
      error.textContent = message;
      input.setAttribute("aria-invalid", "true");
      allValid = false;
    } else {
      error.textContent = "";
      input.removeAttribute("aria-invalid");
    }
  });
  return allValid;
}

// Save current cart data in localStorage for the assignment bonus.
function saveCart() {
  try {
    localStorage.setItem("shopeasy_cart", JSON.stringify(cart));
  } catch (error) {
    // Cart still works for the current page if storage is blocked.
  }
}

// Show the total number of products in cart badges on all pages.
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-badge").forEach((badge) => { badge.textContent = count; });
}

// Render cart rows, quantity controls, remove controls and the grand total.
function renderCart() {
  const body = document.getElementById("cart-items");
  const total = document.getElementById("grand-total");
  if (!body || !total) return;
  body.innerHTML = "";

  if (cart.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "empty-cart";
    cell.textContent = "Your cart is empty. ";
    const link = document.createElement("a");
    link.href = "products.html";
    link.textContent = "Browse products";
    cell.appendChild(link);
    row.appendChild(cell);
    body.appendChild(row);
  }

  cart.forEach((item) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.className = "cart-product-name";
    nameCell.textContent = item.name;
    const priceCell = document.createElement("td");
    priceCell.textContent = `$${item.price.toFixed(2)}`;
    const quantityCell = document.createElement("td");
    const quantityBox = document.createElement("div");
    quantityBox.className = "quantity-control";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.dataset.cartAction = "decrease";
    minus.dataset.id = String(item.id);
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);
    const plus = document.createElement("button");
    plus.type = "button";
    plus.dataset.cartAction = "increase";
    plus.dataset.id = String(item.id);
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Increase quantity of ${item.name}`);
    quantityBox.append(minus, quantity, plus);
    quantityCell.appendChild(quantityBox);
    const removeCell = document.createElement("td");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.dataset.cartAction = "remove";
    remove.dataset.id = String(item.id);
    remove.textContent = "Remove";
    removeCell.appendChild(remove);
    row.append(nameCell, priceCell, quantityCell, removeCell);
    body.appendChild(row);
  });
  total.textContent = `$${getCartTotal(cart).toFixed(2)}`;
}

// Apply search, category and sorting to the catalog in that order.
function refreshProducts() {
  if (document.getElementById("product-grid")) {
    const search = document.getElementById("search-input").value;
    const category = document.getElementById("category-filter").value;
    const order = document.getElementById("sort-order").value;
    const result = sortProducts(filterByCategory(searchProducts(catalog, search), category), order);
    displayProducts(result);
    document.getElementById("results-count").textContent = `${result.length} product${result.length === 1 ? "" : "s"} found`;
  } else if (document.getElementById("featured-grid")) {
    displayProducts(catalog.slice(0, 3));
  }
}

// Replace the visible catalog with JSON-loaded data, keeping the original product list intact.
function setCatalog(jsonProducts) {
  if (!Array.isArray(jsonProducts)) return;
  catalog = [...jsonProducts];
  refreshProducts();
}

// Attach native listeners to controls and use one delegated click listener for cart buttons.
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  const search = document.getElementById("search-input");
  const category = document.getElementById("category-filter");
  const order = document.getElementById("sort-order");
  if (search) search.addEventListener("input", refreshProducts);
  if (category) category.addEventListener("change", refreshProducts);
  if (order) order.addEventListener("change", refreshProducts);

  // Event delegation: one parent listener for Add, +, − and Remove buttons.
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-id]");
    if (addButton) {
      addToCart(Number(addButton.dataset.addId));
      return;
    }
    const cartButton = event.target.closest("[data-cart-action]");
    if (!cartButton) return;
    const id = Number(cartButton.dataset.id);
    if (cartButton.dataset.cartAction === "increase") updateQuantity(id, 1);
    if (cartButton.dataset.cartAction === "decrease") updateQuantity(id, -1);
    if (cartButton.dataset.cartAction === "remove") removeFromCart(id);
  });

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // No back end: prevent actual form submission.
      const valid = validateCheckout();
      const result = document.getElementById("checkout-message");
      if (!valid) {
        result.className = "checkout-message error";
        result.textContent = "Please fix the highlighted fields before checking out.";
      } else if (cart.length === 0) {
        result.className = "checkout-message error";
        result.textContent = "Add at least one product to your cart first.";
      } else {
        result.className = "checkout-message success";
        result.textContent = "Demo order confirmed! No real order was placed.";
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        form.reset();
        form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
      }
    });
  }
});
