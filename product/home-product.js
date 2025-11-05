document.addEventListener("DOMContentLoaded", async () => {
  const newArrivalSection = document.getElementById("new-arrival-product");

  if (!newArrivalSection) {
    console.error("❌ لم يتم العثور على القسم #new-arrival-product في الصفحة!");
    return;
  }

  // 🦴 سكلتون مطابق لتصميم الكارد الحقيقي
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

  // 🩶 تعبئة السكشن بـ 8 سكلتونات بنفس تصميم الشبكة الأصلية
  newArrivalSection.innerHTML = Array(8).fill(skeletonCard()).join("");

  try {
    // جلب المنتجات
    const res = await fetch("https://dummyjson.com/products?limit=100");
    const data = await res.json();
    const firstProducts = data.products.slice(0, 8); // أول 8 منتجات

    newArrivalSection.innerHTML = ""; // تنظيف السكلتون

    // ✅ عرض الكروت الفعلية
    firstProducts.forEach((product) => {
      if (typeof createProductCard === "function") {
        const card = createProductCard(product);
        newArrivalSection.appendChild(card);
      } else {
        console.error("❌ createProductCard غير معرف!");
      }
    });
  } catch (err) {
    console.error("حدث خطأ أثناء تحميل المنتجات:", err);
    newArrivalSection.innerHTML =
      '<p class="text-center text-red-500 col-span-full">فشل تحميل المنتجات.</p>';
  }
});
