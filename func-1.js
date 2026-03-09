let allProducts = [];
let currentCategory = "all";
let currentSort = "ascending-alphabetical";

window.addEventListener("load", async function () {
  products = await fetchProducts();
  sortProducts(products);
  renderProducts(products);
  filterCategoryProducts(products);
});

// Fetch products
async function fetchProducts() {
  try {
    const res = await fetch("products.json");
    const data = await res.json();
    return data.products;
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

// Handle sorting
function sortProducts() {
  let sortOption = document.getElementById("sorting").value;
  console.log(sortOption);

  switch (sortOption) {
  }
}

// Handle changing of categories
function filterCategoryProducts(products) {
  let links = document.querySelectorAll(".header .nav a");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      let category = link.dataset.category;

      links.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");

      changeBannerText(link.textContent);

      if (category === "all") {
        renderProducts(products);
        return;
      }

      const filteredByCategory = products.filter(
        (product) => product.category === category,
      );

      renderProducts(filteredByCategory);
    });
  });
}

// Change banner text upon changing the selected category
function changeBannerText(text) {
  const bannerHeading = document.querySelector(".banner h1");
  bannerHeading.textContent = text;
  let description = "";

  switch (text) {
    case "All products":
      description = "Here you can find all available products.";
      break;
    case "Sofas":
      description = "Check out our sofas.";
      break;
    case "Tables":
      description = "Take a look at our tables.";
      break;
  }

  const bannerDescription = document.querySelector(".banner p");
  bannerDescription.textContent = description;
}

// Handle product rendering
function renderProducts(products) {
  let container = document.querySelector(".section-products .section-right");
  container.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
                <div class="product-image">
                  <img src="${product.image}" alt="" />
                </div>
                <div class="product-description">
                  <h2>${product.name}</h2>
                  <p>${product.description}</p>
                  <span>${product.price}</span>
                </div>
                <button>Add to cart</button>`;
    container.appendChild(card);
    card.querySelector("button").addEventListener("click", successAlert);
  });
}

// Show success alert on adding a product to the cart
function successAlert() {
  const alertBox = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");
  alertMessage.textContent = "Product added to cart";
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2000);
}

const sortInput = document.querySelector("#sorting");
sortInput.addEventListener("change", async () => {
  sortProducts(products);
});
