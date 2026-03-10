let allProducts = [];
let currentCategory = "all";
let currentSort = "ascending-alphabetical";
let selectedColors = [];
let minPrice = 0;
let maxPrice = 1500;
let visibleProducts = 8;
const productsPerLoad = 8;

const productsContainer = document.querySelector(
  ".section-products .section-right",
);
const sortInput = document.querySelector("#sorting");

window.addEventListener("load", async () => {
  allProducts = await fetchProducts();

  sortInput.value = currentSort;

  setupCategoryFilters();
  setupSortListener();
  setupColorFilters();
  setupPriceFilters();
  resetPriceFilters();
  setupLoadMore();
  updateProducts();
  setupMobileMenu();
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

      visibleProducts = productsPerLoad;

      selectedColors = [];
      document.querySelectorAll(".color-filter").forEach((checkbox) => {
        checkbox.checked = false;
      });

      resetPriceFilters();

      updateProducts();

      categoryLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function resetPriceFilters() {
  const minSlider = document.querySelector("#price-min");
  const maxSlider = document.querySelector("#price-max");
  const minLabel = document.querySelector("#min-price");
  const maxLabel = document.querySelector("#max-price");

  minPrice = Number(minSlider.min);
  maxPrice = Number(maxSlider.max);

  minSlider.value = minPrice;
  maxSlider.value = maxPrice;

  minLabel.textContent = `$${minPrice}`;
  maxLabel.textContent = `$${maxPrice}`;
}

function updateProducts() {
  let filteredProducts =
    currentCategory === "all"
      ? [...allProducts]
      : allProducts.filter((product) => product.category === currentCategory);

  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      return selectedColors.includes(product.color);
    });
  }

  filteredProducts = filteredProducts.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice,
  );

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
  const productsToShow = filteredProducts.slice(0, visibleProducts);
  renderProducts(productsToShow);
  updateProductCount(filteredProducts);

  const loadMoreBtn = document.querySelector(".load-more");

  if (visibleProducts >= filteredProducts.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
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
        <div>
          <span>$${product.price}</span>
          <span>${product.color}</span>
        </div>
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

function updateProductCount(filteredProducts) {
  const countSpan = document.getElementById("product-count");
  const total = filteredProducts.length;
  const shown = Math.min(visibleProducts, total);

  if (total === 0) {
    countSpan.textContent = `No products found`;
  } else {
    countSpan.textContent = `Showing 1-${shown} of ${total} results`;
  }
}

function setupSortListener() {
  sortInput.addEventListener("change", () => {
    currentSort = sortInput.value;
    updateProducts();
  });
}

function setupColorFilters() {
  const colorCheckboxes = document.querySelectorAll(".color-filter");

  selectedColors = [...colorCheckboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  colorCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      selectedColors = [...colorCheckboxes]
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
      visibleProducts = productsPerLoad;
      updateProducts();
    });
  });
}

function setupPriceFilters() {
  const minSlider = document.querySelector("#price-min");
  const maxSlider = document.querySelector("#price-max");
  const minLabel = document.querySelector("#min-price");
  const maxLabel = document.querySelector("#max-price");

  minSlider.addEventListener("input", () => {
    minPrice = Number(minSlider.value);
    minLabel.textContent = `$${minPrice}`;
    visibleProducts = productsPerLoad;
    updateProducts();
  });

  maxSlider.addEventListener("input", () => {
    maxPrice = Number(maxSlider.value);
    maxLabel.textContent = `$${maxPrice}`;
    visibleProducts = productsPerLoad;
    updateProducts();
  });
}

function setupLoadMore() {
  const loadMoreBtn = document.querySelector(".load-more");

  loadMoreBtn.addEventListener("click", () => {
    visibleProducts += productsPerLoad;

    if (visibleProducts > allProducts.length) {
      visibleProducts = allProducts.length;
    }
    updateProducts();
  });
}

function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  menuToggle.addEventListener("click", (event) => {
    nav.classList.toggle("active");
    event.target.classList.toggle("active");
  });
}
