const categoriesList = document.getElementById("categories-list");

fetch("https://dummyjson.com/products/category-list")
  .then(res => res.json())
  .then(categories => {
    categoriesList.innerHTML = "";
    categories.forEach((cat, index) => {
      const category = typeof cat === "string" ? cat : cat.name || JSON.stringify(cat);
      const li = document.createElement("li");
      li.innerHTML = `
        <label for="cat-${index}" class="inline-flex items-center gap-2">
          <input type="checkbox" id="cat-${index}" class="size-5 rounded-sm border-gray-300 shadow-sm" value="${category}">
          <span class="text-sm font-medium text-gray-700">${category}</span>
        </label>
      `;
      categoriesList.appendChild(li);
    });
  })
  .catch(err => console.error("Error fetching categories:", err));
