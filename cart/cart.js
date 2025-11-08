// ✅ cart.js


function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}


function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}


function addToCart(product) {
  let cart = getCart();

 
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1; 
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  alert("The product has been added to the cart!");
}


function updateQuantity(productId, newQty) {
  const cart = getCart();
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity = newQty;
    saveCart(cart);
    renderCart(); 
  }
}




//  cart-page.js

function renderCart() {
  const cartList = document.getElementById("cart-list");
  const emptyCart = document.getElementById("empty-cart");
  const totalElement = document.getElementById("cart-total");
  const cartSummaryAndDiscount = document.getElementById("cart-summary-and-discount");

  
  const originalPriceEl = document.getElementById("orginal-price");
  const savingsEl = document.getElementById("savings");
  const totalEl = document.getElementById("total");

  const cart = getCart();
  cartList.innerHTML = "";

  if (cart.length === 0) {
   
    emptyCart.innerHTML = `
      <div class="flex flex-col items-center justify-center h-[70vh] text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 6.707A1 1 0 007.69 21h8.62a1 1 0 00.983-.707L19 13M10 21a2 2 0 104 0" />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Your cart is empty</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven’t added any products yet.</p>
        <a href="/product/product.html"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
          Continue Shopping
        </a>
      </div>
    `;
    totalElement.textContent = "";
   
    return;
  }

 
  emptyCart.innerHTML = "";
 

  let total = 0;
  let originalTotal = 0;
  let totalSavings = 0;

  cart.forEach((product) => {
    const card = createProductCard(product);
    cartList.appendChild(card);

   
    const originalPrice = product.discountPercentage
      ? product.price * 100 / (100 - product.discountPercentage)
      : product.price;

    originalTotal += originalPrice * product.quantity;
    total += product.price * product.quantity;
  });

  totalSavings = originalTotal - total;


  originalPriceEl.textContent = `$ ${originalTotal.toFixed(2)}`;
  savingsEl.textContent = `- $ ${totalSavings.toFixed(2)}`;
  totalEl.textContent = `$ ${total.toFixed(2)}`;

 
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}


document.addEventListener("DOMContentLoaded", renderCart);
