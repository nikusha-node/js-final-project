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

const categoryHeader = document.querySelector(".category-header")
const categoryList = document.querySelector(".category-list")

categoryHeader.addEventListener("click", () => {
    categoryHeader.classList.toggle("active");
    if (categoryList.style.maxHeight) {
        categoryList.style.maxHeight = null;
        categoryList.classList.remove("open")
    } else {
        categoryList.style.maxHeight = categoryList.scrollHeight + "px";
        
        setTimeout(() => {
            categoryList.classList.add("open");
        }, 150);
    }
})

const API_Categories = "https://restaurant.stepprojects.ge/api/Categories/GetAll";

async function loadCategories() {
    try {
        const respons = await fetch(API_Categories);
        const data = await respons.json();

        categoryList.innerHTML = "";

        data.forEach(categoryy => {
            const li = document.createElement("li");
            li.textContent = categoryy.name;
            categoryList.appendChild(li);
        });

        if (categoryHeader.classList.contains("active")) {
            categoryList.style.maxHeight = categoryList.scrollHeight + "px";
        }


    } catch (error) {
        console.error("error loading categories:", error)
    }
}


loadCategories()


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