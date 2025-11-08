document.addEventListener("DOMContentLoaded", async () => {
  const newArrivalSection = document.getElementById("new-arrival-product");

  if (!newArrivalSection) {
    console.error("The section #new-arrival-product was not found on the page!");
    return;
  }

  
  const skeletonCard = () => `
    <div class="group relative block overflow-hidden rounded-lg shadow-lg bg-white animate-pulse">
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
  `;

 
  newArrivalSection.innerHTML = Array(4).fill(skeletonCard()).join("");

  try {
    
    const res = await fetch("https://dummyjson.com/products?limit=100");
    const data = await res.json();
    const firstProducts = data.products.slice(0, 4); 

    newArrivalSection.innerHTML = ""; 

    
    firstProducts.forEach((product) => {
      if (typeof createProductCard === "function") {
        const card = createProductCard(product);
        newArrivalSection.appendChild(card);
      } else {
        console.error("there is an error");
      }
    });
  } catch (err) {
    console.error("An error occurred while loading the products:", err);
    newArrivalSection.innerHTML =
      '<p class="text-center text-red-500 col-span-full">فشل تحميل المنتجات.</p>';
  }
});
