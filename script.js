// --------------header

window.addEventListener("scroll", function() {
  const header = document.querySelector(".fixed");

  if (window.scrollY > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});


// ---------------- category

const categoryContainer = document.querySelector(".category-inline");

async function loadCategories() {
    try {
        const response = await fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll");
        const data = await response.json();

        data.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("category-btn");
            btn.dataset.id = category.id;

            btn.addEventListener("click", () => {
                document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                filterByCategory(category.id);
            });

            categoryContainer.appendChild(btn);
        });

        document.querySelector(".category-btn[data-id='0']").addEventListener("click", () => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            document.querySelector(".category-btn[data-id='0']").classList.add("active");
            filterByCategory(0);
        });

    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

loadCategories();



// -------------- filter

const spiceRange = document.getElementById("range");
const spiceLable = document.getElementById("spiceLabel");
const resetBtn = document.getElementById("resetBtn");

spiceRange.addEventListener("input", () => {
    const value = Number(spiceRange.value);

    let text = "Not Chosen";

    switch (value) {
        case 0: text = "Not Chosen"; break;
        case 1: text = "0"; break;
        case 2: text = "1"; break;
        case 3: text = "2"; break;
        case 4: text = "3"; break;
        case 5: text = "4"; break;
    }

    spiceLable.textContent = `Spiciness: ${text}`
});


resetBtn.addEventListener("click", () => {
    spiceRange.value = 0;
    spiceLable.textContent = "Spiciness: Not Chosen";


    document.getElementById("noNuts").checked = false;
    document.getElementById("vegeterian").checked = false;
})


// ------------- product 


fetch('https://restaurant.stepprojects.ge/api/Products/GetAll')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        renderProducts(data);
    })
    .catch(err => console.error(err));


function renderProducts(product) {
    const conteiner = document.getElementById('products');
    const template = document.getElementById('product-template');

    product.forEach(prod => {
        const clone = template.content.cloneNode(true);


        clone.querySelector(".product-img").src = prod.image;
        clone.querySelector(".product-img").alt = prod.name;
        clone.querySelector(".product-name").textContent = prod.name;
        clone.querySelector(".product-price").textContent = `${prod.price} ₾`;

        clone.querySelector(".nuts").textContent = prod.nuts ? "🌰 Contains Nuts" : "✅ Nut-free";

        clone.querySelector(".vegeteriann").textContent = prod.vegeterian ? "🌿 Vegetarian" : "🍗 Non-Vegetarian";

        let pepers = "🌶️".repeat(prod.spiciness ?? 0);
        clone.querySelector(".spicy").textContent = pepers || "No spiciness";

        conteiner.appendChild(clone);
    })
}