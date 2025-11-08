let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;

const cardList = document.getElementById("card-list");
const paginationContainer = document.createElement("nav");
paginationContainer.className = "flex justify-center mt-8 space-x-2";
paginationContainer.setAttribute("aria-label", "Pagination");
if (cardList) cardList.insertAdjacentElement("afterend", paginationContainer);


async function loadAllProducts() {
  try {
    if (cardList) {
     
      const skeletonCard = () => `
        <li class="animate-pulse">
          <div class="group relative block overflow-hidden rounded-lg shadow-lg bg-white">
            <div class="h-64 w-full bg-gray-300"></div>
            <div class="p-6 flex flex-col justify-between h-55">
              <div>
                <div class="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div class="flex space-x-1 mb-3">
                  ${'<div class="h-4 w-4 bg-gray-300 rounded"></div>'.repeat(5)}
                </div>
              </div>
              <div class="h-10 bg-gray-300 rounded-full w-full"></div>
            </div>
          </div>
        </li>
      `;
      cardList.innerHTML = Array(9).fill(skeletonCard()).join("");
    }

    const res = await fetch("https://dummyjson.com/products?limit=100");
    const data = await res.json();
    allProducts = data.products;
    filteredProducts = [...allProducts];

    renderProducts();
    renderPagination();

    const newArrivalSection = document.getElementById("new-arrival-product");
    if (newArrivalSection) renderNewArrivals();
  } catch (err) {
    console.error("Error loading products:", err);
    if (cardList)
      cardList.innerHTML =
        '<p class="text-center text-red-500 col-span-full">Failed to load products.</p>';
  }
}


function renderProducts() {
  if (!cardList) return;
  cardList.innerHTML = "";
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const productsToShow = filteredProducts.slice(start, end);

  if (productsToShow.length === 0) {
    cardList.innerHTML =
      '<p class="col-span-full text-gray-500 text-center">No products found.</p>';
    return;
  }

  productsToShow.forEach((product) => {
    const card = createProductCard(product);
    const li = document.createElement("li");
    li.appendChild(card);
    cardList.appendChild(li);
  });
}


function renderPagination() {
  if (!paginationContainer) return;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  paginationContainer.innerHTML = "";
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "&laquo;";
  prevBtn.className =
    "px-3 py-1 border rounded-md text-sm font-semibold bg-white hover:bg-gray-100";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      renderPagination();
      updateURLParams();
    }
  };
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className =
      "px-3 py-1 border rounded-md text-sm font-semibold " +
      (i === currentPage
        ? "bg-gray-900 text-white"
        : "bg-white hover:bg-gray-100");
    btn.onclick = () => {
      currentPage = i;
      renderProducts();
      renderPagination();
      updateURLParams();
    };
    paginationContainer.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "&raquo;";
  nextBtn.className =
    "px-3 py-1 border rounded-md text-sm font-semibold bg-white hover:bg-gray-100";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      renderPagination();
      updateURLParams();
    }
  };
  paginationContainer.appendChild(nextBtn);
}


function updateURLParams() {
  const params = new URLSearchParams();

  const selectedCats = Array.from(
    document.querySelectorAll("#categories-list input:checked")
  ).map((cb) => cb.value);
  if (selectedCats.length > 0) params.set("categories", selectedCats.join(","));

  const from = document.getElementById("price-from").value;
  const to = document.getElementById("price-to").value;
  if (from) params.set("priceFrom", from);
  if (to) params.set("priceTo", to);

  const rating = document.querySelector('input[name="rating"]:checked')?.value;
  if (rating) params.set("rating", rating);

  const sortValue = document.getElementById("SortBy").value;
  if (sortValue !== "Sort By") params.set("sort", sortValue);

  params.set("page", currentPage);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}


async function applyFilters() {
  let filtered = [];

  const selectedCats = Array.from(
    document.querySelectorAll("#categories-list input:checked")
  ).map((cb) => cb.value.toLowerCase().replace(/\s+/g, "-"));

  if (selectedCats.length > 0) {
    for (const cat of selectedCats) {
      const res = await fetch(`https://dummyjson.com/products/category/${cat}`);
      const data = await res.json();
      filtered = filtered.concat(data.products);
    }
  } else {
    filtered = [...allProducts];
  }

  const from = parseFloat(document.getElementById("price-from").value) || 0;
  const to = parseFloat(document.getElementById("price-to").value) || Infinity;
  filtered = filtered.filter((p) => p.price >= from && p.price <= to);

  const rating = parseInt(
    document.querySelector('input[name="rating"]:checked')?.value || 0
  );
  if (rating > 0) filtered = filtered.filter((p) => p.rating >= rating);

  const sortValue = document.getElementById("SortBy").value;
  if (sortValue !== "Sort By") {
    const [key, dir] = sortValue.split(", ");
    filtered.sort((a, b) => {
      if (key === "title")
        return dir === "ASC"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      if (key === "price")
        return dir === "ASC" ? a.price - b.price : b.price - a.price;
    });
  }

  filteredProducts = filtered;
  currentPage = 1;
  renderProducts();
  renderPagination();
  updateURLParams();
}


async function renderNewArrivals() {
  const newArrivalSection = document.getElementById("new-arrival-product");
  if (!newArrivalSection) return;

  newArrivalSection.innerHTML =
    '<p class="text-center text-gray-500">Loading...</p>';

  try {
    const firstProducts = allProducts.slice(0, 8);
    newArrivalSection.innerHTML = "";

    firstProducts.forEach((product) => {
      const card = createProductCard(product);
      newArrivalSection.appendChild(card);
    });
  } catch (err) {
    console.error("Error rendering New Arrivals:", err);
    newArrivalSection.innerHTML =
      '<p class="text-center text-red-500">Failed to load products.</p>';
  }
}


document.addEventListener("change", (e) => {
  if (
    e.target.matches("#SortBy") ||
    e.target.matches("#categories-list input") ||
    e.target.matches('input[name="rating"]') ||
    e.target.matches("#price-from") ||
    e.target.matches("#price-to")
  ) {
    applyFilters();
  }
});


document.addEventListener("DOMContentLoaded", async () => {
  await loadAllProducts();

  const params = new URLSearchParams(window.location.search);

  const categories = params.get("categories")?.split(",") || [];
  categories.forEach((cat) => {
    const input = document.querySelector(
      `#categories-list input[value="${cat}"]`
    );
    if (input) input.checked = true;
  });

  if (params.get("priceFrom"))
    document.getElementById("price-from").value = params.get("priceFrom");
  if (params.get("priceTo"))
    document.getElementById("price-to").value = params.get("priceTo");

  if (params.get("rating")) {
    const ratingInput = document.querySelector(
      `input[name="rating"][value="${params.get("rating")}"]`
    );
    if (ratingInput) ratingInput.checked = true;
  }

  if (params.get("sort"))
    document.getElementById("SortBy").value = params.get("sort");

  currentPage = parseInt(params.get("page")) || 1;

  applyFilters();
});
