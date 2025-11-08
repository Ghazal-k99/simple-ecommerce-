// js/components.js


function truncateTitle(title, maxLength = 50) {
  return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
}


function createProductCard(product) {
  const li = document.createElement("li");
  li.className = "rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between md:gap-6 space-y-4 md:space-y-0";

  li.innerHTML = `
    <!-- Image -->
    <a href="${product.url}" class="shrink-0 md:order-1">
      <img class="h-20 w-20 dark:hidden" src="${product.thumbnail}" alt="${product.title}" />
      <img class="hidden h-20 w-20 dark:block" src="${product.thumbnailDark || product.thumbnail}" alt="${product.title}" />
    </a>

    <!-- Quantity & Price -->
    <div class="flex items-center justify-between md:order-3 md:justify-end gap-2">
      <div class="flex items-center">
        <button type="button" class="decrement inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
          <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 18 2" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
          </svg>
        </button>
        <input type="text" value="${product.quantity || 1}" readonly class="counter w-10 text-center border-0 bg-transparent text-sm font-medium text-gray-900 dark:text-white"/>
        <button type="button" class="increment inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
          <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
          </svg>
        </button>
      </div>
      <div class="text-end md:w-32">
        <p class="text-base font-bold text-gray-900 dark:text-white">$${product.price}</p>
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex-1 md:order-2 space-y-4 w-full min-w-0 md:max-w-md">
      <a href="${product.url}" class="text-base font-medium text-gray-900 hover:underline dark:text-white">
        ${truncateTitle(product.title)}
      </a>

      <div class="flex items-center gap-4">
        <button type="button" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
          <svg class="me-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"/>
          </svg>
          Add to Favorites
        </button>

        <button type="button" class="remove-btn inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500">
          <svg class="me-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
          </svg>
          Remove
        </button>
      </div>
    </div>
  `;

 
  const decrementBtn = li.querySelector(".decrement");
  const incrementBtn = li.querySelector(".increment");
  const counterInput = li.querySelector(".counter");

decrementBtn.addEventListener("click", () => {
  let val = parseInt(counterInput.value);
  if (val > 1) {
    counterInput.value = val - 1;
    updateQuantity(product.id, val - 1);
  }
});

incrementBtn.addEventListener("click", () => {
  let val = parseInt(counterInput.value);
  counterInput.value = val + 1;
  updateQuantity(product.id, val + 1);
});

const removeBtn = li.querySelector(".remove-btn");
removeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let cart = getCart().filter((item) => item.id !== product.id);
  saveCart(cart);
  renderCart(); 
});



  return li;
}
