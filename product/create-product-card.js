// js/components.js

function truncateTitle(title, maxLength = 20) {
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
}

function createProductCard(product) {
  let stars = "";
  const fullStars = Math.floor(product.rating);
  for (let i = 0; i < fullStars; i++) stars += "★";
  for (let i = fullStars; i < 5; i++) stars += "☆";

  const li = document.createElement("li");
  li.className = "group relative block overflow-hidden rounded-lg shadow-lg";

  li.innerHTML = `
    <a href="/product/product-details.html?id=${product.id}">
      <img src="${product.thumbnail}" 
           alt="${product.title}" 
           class="h-64 w-full object-cover transition duration-500 group-hover:scale-105">

      <div class="relative border border-gray-100 bg-white p-6 flex flex-col justify-between h-55">
        <div>
          <h3 class="mt-1.5 text-lg font-medium text-gray-900">${truncateTitle(product.title)}</h3>
          <p class="text-gray-700 mt-2">
            $${product.price}
            ${
              product.discountPercentage
                ? `<span class="text-gray-400 line-through">$${(
                    product.price * 100 / (100 - product.discountPercentage)
                  ).toFixed(2)}</span>`
                : ""
            }
          </p>
          <p class="text-yellow-500 mt-1 text-sm">${stars}</p>
        </div>
        <button type="button" 
                class="add-to-cart  mt-4 block w-full rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:scale-105">
          Add To Cart
        </button>
      </div>
    </a>
  `;

   
  li.querySelector(".add-to-cart").addEventListener("click", (e) => {
    e.preventDefault(); 
    addToCart(product);
  });
  return li;
}
