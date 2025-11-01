window.addEventListener("scroll", function() {
  const header = document.querySelector(".header-main");
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

// ბარათის ფორმატირება
cardInput.addEventListener("input", function () {
  let value = onlyNumbers(cardInput.value);
  if (value.length > 16) value = value.substring(0, 16);
  let formatted = "";
  for (let i = 0; i < value.length; i++) {
    formatted += value[i];
    if ((i + 1) % 4 === 0 && i !== value.length - 1) formatted += " ";
  }
  cardInput.value = formatted;
});

// ვადა MM/YY
expiryInput.addEventListener("input", function () {
  let value = onlyNumbers(expiryInput.value);
  if (value.length > 4) value = value.substring(0, 4);
  let formatted = "";
  for (let i = 0; i < value.length; i++) {
    formatted += value[i];
    if (i === 1 && value.length > 2) formatted += "/";
  }
  expiryInput.value = formatted;
});

// CVC
cvcInput.addEventListener("input", function () {
  let value = onlyNumbers(cvcInput.value);
  if (value.length > 3) value = value.substring(0, 3);
  cvcInput.value = value;
});

// trimSpaces
function trimSpaces(text) {
  return text.trim();
}

// ფორმის გაგზავნა
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let card = trimSpaces(cardInput.value);
  let expiry = trimSpaces(expiryInput.value);
  let cvc = trimSpaces(cvcInput.value);
  let owner = trimSpaces(ownerInput.value);

  let digitsOnly = onlyNumbers(card);

  if (digitsOnly.length !== 16) {
    Swal.fire({
      icon: "error",
      title: "ბარათის ნომერი არასწორია!",
      text: "უნდა იყოს 16 ციფრი",
      confirmButtonColor: "#d33",
    });
    return;
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