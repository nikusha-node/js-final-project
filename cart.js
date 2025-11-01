window.addEventListener("scroll", function() {
    const header = document.querySelector(".fixed");
    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

const API_GET = "https://restaurant.stepprojects.ge/api/Baskets/GetAll";
const API_ADD = "https://restaurant.stepprojects.ge/api/Baskets/Add";
const API_DELETE = "https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/";

const body = document.getElementById("basketBody");
const totalPrice = document.getElementById("price");

let basket = [];

function baskett() {
  fetch(API_GET)
    .then((response) => response.json())
    .then((data) => {
      basket = data;
      renderBasket();
    });
}

function addProduct(product) {
  fetch(API_ADD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("product added:", data);
      basket.push(data);
      renderBasket();
    });
}

function deleteProduct(id) {
  console.log("Deleting product ID:", id);

  fetch(`${API_DELETE}${id}`, { method: "DELETE" })
    .then((res) => {
      if (res.ok) {
        const index = basket.findIndex((item) => item.product.id == id);
        if (index !== -1){
            basket.splice(index, 1);
        } 
        renderBasket();
      } else {
        console.error("Failed to delete product:", res.status);
      }
    })
    .catch((err) => console.error("Error deleting product:", err));
}

function renderBasket() {
  body.innerHTML = "";
  let sum = 0;
  const template = document.getElementById('basketItemTemplate');

  basket.forEach((item) => {
    const clone = template.content.cloneNode(true);
    const tr = clone.querySelector('tr');
    
  
    tr.setAttribute('data-id', item.product.id);
    
 
    const img = clone.querySelector('.item-image');
    img.src = item.product.image;
    img.alt = item.product.name;
    
    clone.querySelector('.item-name').textContent = item.product.name;
    clone.querySelector('.item-price').textContent = item.product.price;
    clone.querySelector('.item-quantity').textContent = item.quantity;
    clone.querySelector('.item-spicy').textContent = item.product.spiciness || 'No';
    clone.querySelector('.item-nuts').textContent = item.product.nuts ? 'Yes' : 'No';
    
   
    const deleteBtn = clone.querySelector('.delete-btn');
    deleteBtn.dataset.id = item.product.id;
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      deleteProduct(item.product.id);
    });
    
    body.appendChild(clone);
    sum += item.product.price * item.quantity;
  });

  totalPrice.textContent = `${sum}$`;
}

baskett();