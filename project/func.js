let allProducts = [];
let currentCategory = "all";
let currentSort = "ascending-alphabetical";

const productsContainer = document.querySelector(
  ".section-products .section-right",
);
const sortInput = document.querySelector("#sorting");

window.addEventListener("load", async () => {
  allProducts = await fetchProducts();
  setupCategoryFilters();
  setupSortListener();
  updateProducts();
});

async function fetchProducts() {
  try {
    const res = await fetch("products.json");
    const data = await res.json();
    return data.products;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}

function setupCategoryFilters() {
  const categoryLinks = document.querySelectorAll(".header .nav a");
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentCategory = link.dataset.category;
      updateProducts();

      categoryLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function setupSortListener() {
  sortInput.addEventListener("change", () => {
    currentSort = sortInput.value;
    updateProducts();
  });
}

function updateProducts() {
  let filteredProducts =
    currentCategory === "all"
      ? [...allProducts]
      : allProducts.filter((product) => product.category === currentCategory);

  switch (currentSort) {
    case "ascending-alphabetical":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "descending-alphabetical":
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "ascending-price":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "descending-price":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
  }

  changeBannerText(currentCategory);
  renderProducts(filteredProducts);
}

function changeBannerText(text) {
  let heading = "";
  let description = "";

  switch (text) {
    case "all":
      heading = "All products";
      description = "Here you can find all available products.";
      break;
    case "sofa":
      heading = "Sofas";
      description = "Check out our sofas.";
      break;
    case "table":
      heading = "Tables";
      description = "Take a look at our tables.";
      break;
  }

  const bannerDescription = document.querySelector(".banner p");
  bannerDescription.textContent = description;
  const bannerHeading = document.querySelector(".banner h1");
  bannerHeading.textContent = heading;
}

function renderProducts(products) {
  productsContainer.replaceChildren();

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-description">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <span>$${product.price}</span>
      </div>
      <button class="add-to-cart">Add to cart</button>
    `;

    card.querySelector(".add-to-cart").addEventListener("click", () => {
      showCustomAlert(`${product.name} added to cart.`);
    });

    productsContainer.appendChild(card);
  });
}

function showCustomAlert(message) {
  const alertContainer = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");
  alertMessage.textContent = message;
  alertContainer.classList.add("show");

  setTimeout(() => {
    alertContainer.classList.remove("show");
  }, 2000);
}
