
window.addEventListener("scroll", function() {
    const header = document.querySelector(".fixed");
    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Format card number with spaces
function formatCardNumber(value) {
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

// Format expiry date as MM/YY
function formatExpiryDate(value) {
    return value.replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .replace(/^(\d{2}\d{2}).*/, '$1');
}

// Update cart count in header
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartText = document.querySelector('.cart-text');
    
    if (cartText) {
        cartText.textContent = `Cart (${cartCount})`;
    }
}

// Load saved card info if available
function loadSavedCard() {
    const currentEmail = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === currentEmail);
    
    if (user?.cardInfo) {
        document.getElementById('card-number').value = formatCardNumber(user.cardInfo.cardNumber);
        document.getElementById('expiry').value = user.cardInfo.expiryDate;
        document.getElementById('cvc').value = user.cardInfo.cvv;
        document.getElementById('owner').value = user.cardInfo.cardName || '';
    }
}

// Display total amount, load saved card, and update profile on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateUserProfile();
    
    // Get total from localStorage and display it
    const totalAmount = localStorage.getItem('orderTotal') || '0';
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
        totalElement.textContent = `${parseFloat(totalAmount).toFixed(2)}₾`;
    }
    
    // Load saved card if user is logged in
    if (localStorage.getItem('loggedIn') === 'true') {
        loadSavedCard();
    }
});

window.addEventListener("scroll", function() {
    const header = document.querySelector(".fixed");
    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// გადახდის ფორმა
const cardInput = document.getElementById("card-number");
const expiryInput = document.getElementById("expiry");
const cvcInput = document.getElementById("cvc");
const ownerInput = document.getElementById("owner");
const form = document.getElementById("checkout-form");

// მხოლოდ ციფრები
function onlyNumbers(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] >= "0" && text[i] <= "9") result += text[i];
  }
  return result;
}

// Card number formatting
cardInput.addEventListener("input", function () {
  let value = onlyNumbers(cardInput.value);
  if (value.length > 16) value = value.substring(0, 16);
  cardInput.value = formatCardNumber(value);
});

// Expiry date formatting (MM/YY)
expiryInput.addEventListener("input", function () {
  expiryInput.value = formatExpiryDate(expiryInput.value);
});

// CVC/CVV input
cvcInput.addEventListener("input", function () {
  cvcInput.value = onlyNumbers(cvcInput.value).substring(0, 3);
});

// Helper functions
function trimSpaces(text) {
  return text.trim();
}

// Save card info to profile if user is logged in
function saveCardToProfile(cardData) {
    if (localStorage.getItem('loggedIn') !== 'true') return false;
    
    const currentEmail = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentEmail);
    
    if (userIndex !== -1) {
        if (!users[userIndex].cardInfo) {
            users[userIndex].cardInfo = {};
        }
        users[userIndex].cardInfo = {
            cardNumber: cardData.cardNumber,
            expiryDate: cardData.expiryDate,
            cvv: cardData.cvv,
            cardName: cardData.owner
        };
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
}

// Form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const cardNumber = trimSpaces(cardInput.value);
  const expiry = trimSpaces(expiryInput.value);
  const cvc = trimSpaces(cvcInput.value);
  const owner = trimSpaces(ownerInput.value);
  const digitsOnly = onlyNumbers(cardNumber);

  // Validation
  if (digitsOnly.length !== 16) {
    Swal.fire({
      icon: "error",
      title: "Invalid Card Number",
      text: "Card number must be 16 digits",
      confirmButtonColor: "#d33",
    });
    return;
  }
  
  // Save card info to profile if user is logged in
  if (localStorage.getItem('loggedIn') === 'true') {
    saveCardToProfile({
      cardNumber: digitsOnly,
      expiryDate: expiry,
      cvv: cvc,
      owner: owner
    });
  }

  if (expiry.length !== 5 || expiry[2] !== "/") {
    Swal.fire({
      icon: "error",
      title: "ვადა არასწორია!",
      text: "ფორმატი უნდა იყოს MM/YY",
      confirmButtonColor: "#d33",
    });
    return;
  }

  if (cvc.length !== 3) {
    Swal.fire({
      icon: "error",
      title: "CVC არასწორია!",
      text: "უნდა იყოს 3 ციფრი",
      confirmButtonColor: "#d33",
    });
    return;
  }

  if (owner === "") {
    Swal.fire({
      icon: "error",
      title: "შეავსეთ მფლობელის სახელი!",
      confirmButtonColor: "#d33",
    });
    return;
  }

  // Show loading state
  Swal.fire({
    title: 'მიმდინარეობს გადახდა...',
    text: 'გთხოვთ მოიცადოთ',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  // Simulate payment processing
  setTimeout(() => {
    // Randomly determine success (90% success rate for demo)
    const isSuccess = Math.random() < 0.9;
    
    if (isSuccess) {
      // Clear cart on successful payment
      localStorage.removeItem('cart');
      
      Swal.fire({
        icon: 'success',
        title: 'გადახდა წარმატებით განხორციელდა!',
        text: `მადლობა, ${owner}!`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      }).then(() => {
        // Redirect to home page after showing success message
        window.location.href = 'index.html';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'შეცდომა გადახდის დროს',
        text: 'ვერ მოხერხდა გადახდა. გთხოვთ სცადოთ თავიდან.',
        confirmButtonText: 'კარგი',
        confirmButtonColor: '#d33'
      });
    }
  }, 2000);
});


// Burger menu functionality
document.addEventListener('DOMContentLoaded', function () {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }
});