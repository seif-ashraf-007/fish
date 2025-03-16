new Swiper(".mySwiper", {
  loop: true,
  slidesPerView: 3,
  centerSlide: "true",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-prev",
    prevEl: ".swiper-button-next",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
  },
});
/* nav-bar: focus*/
let navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    setTimeout(() => {
      link.classList.remove("active");
    }, 10000000);
  });
});
// nav BAr BoxShadow
let nav = document.querySelector(".navbar");
window.addEventListener("scroll", Scroll);
function Scroll() {
  window.addEventListener("scroll", function () {
    if (window.scrollY >= 66) {
      nav.style.cssText =
        "box-shadow: 2px 3px 4px #000; background-color: #fff; transition: 0.5s ease-in-out; z-index: 4;";
    } else {
      nav.style.cssText = "transition: 0.5s ease-in-out;";
    }
  });
}
// nav-bar bars
let navbarToggler = document.querySelector(".navbar-toggler");
let myBtnIcon = document.querySelector(".navbar-toggler i");

myBtnIcon.addEventListener("click", () => {
  myBtnIcon.classList.toggle("open");
  const isOpen = myBtnIcon.classList.contains("open");
  if (isOpen) {
    myBtnIcon.classList.replace("fa-bars", "bi-x");
  } else {
    myBtnIcon.classList.replace("bi-x", "fa-bars");
  }
});

// popupSearch
let popsearch = document.getElementById("popsearch");
let input = document.getElementById("search");
let icon = document.querySelector(".icon");
icon.addEventListener("click", function (event) {
  event.stopPropagation();
  input.style.visibility = "visible";
  input.style.transform = "translate(-50%) scale(1)";
  input.style.transition = "0.5s ease-in-out";
  input.focus();
});
document.addEventListener("click", function (event) {
  if (event.target !== input && event.target !== icon) {
    input.style.visibility = "hidden";
    input.style.transform = "translate(-50%) scale(0)";
  }
});

// arrow UP
let arrowUp = document.getElementById("arrowUP");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 200) arrowUp.style.display = "block";
  else arrowUp.style.display = "none";
});
arrowUp.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});
/* CART SHOP */

const Closebtn = document.querySelector(".close"),
  iconCart = document.querySelector(".icon-cart"),
  addToCartButtons = document.querySelectorAll(".text button"),
  cartTotal = document.querySelector(".cart-total"),
  sidebar = document.querySelector(".cartTap"),
  listCart = document.querySelector(".listCart"),
  shop = document.querySelector("#go #total h1"),
  edit = document.querySelector(".icon-cart .edit");
// down shop
let basketTotal = document.querySelector(".basket .pro h3");
let Name = document.querySelectorAll(".text .card-text");
let Price = document.querySelectorAll(".header .card-title");
let paycontainer = document.querySelector(".pay-container .pay h1:last-child");
let priceProduct = document.querySelector(".pay-container span");
let totalAmount = 0;
let cartItems = [];
let payComplete = document.querySelector(".follow p");

addToCartButtons.forEach((el, index) => {
  el.addEventListener("click", () => {
    let item = {
      name: Name[index].textContent,
      price: parseFloat(Price[index].textContent),
      quantity: 1,
    };
    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === item.name
    );
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push(item);
    }
    totalAmount += item.price;
    updateCart();
    payComplete.innerHTML = "متابعة الدفع";
  });
});

function updateCart() {
  updateCartCount();
  showTotalPrice();
  updateCartItemList();
  updatePaymentLink();
}

function showTotalPrice() {
  cartTotal.textContent = `${totalAmount.toFixed(3)}د.ك`;
  paycontainer.textContent = `${totalAmount.toFixed(3)} د.ك`;
  priceProduct.textContent = `(${totalAmount.toFixed(3)} د.ك)`;
  if (shop) shop.textContent = `${totalAmount.toFixed(3)} د.ك`;
  if (basketTotal) basketTotal.textContent = `${totalAmount.toFixed(3)} د.ك`;
}
function updateCartItemList() {
  listCart.innerHTML = "";
  cartItems.forEach((item, index) => {
    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-it");
    cartItem.innerHTML = `
            <span>(${item.quantity}x) ${item.name}</span>
            <span>${(item.price * item.quantity).toFixed(3)}د.ك</span>
            <div >
                <button class="decrease btn btn-danger" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class=" increase btn btn-success" data-index="${index}">+</button>
            </div>
            `;

    listCart.append(cartItem);
  });
  activateIncreaseDecrease();
}
function activateIncreaseDecrease() {
  increase();
  decrease();
}
function increase() {
  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", (e) => {
      let index = e.target.dataset.index;
      cartItems[index].quantity++;
      totalAmount += cartItems[index].price;
      updateCart();
    });
  });
}
function decrease() {
  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", (e) => {
      let index = e.target.dataset.index;
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        totalAmount -= cartItems[index].price;
      } else {
        totalAmount -= cartItems[index].price;
        cartItems.splice(index, 1);
      }
      updateCart();
    });
  });
}
function updateCartCount() {
  let totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  let cartCounter = document.querySelector(".basket .pro span");
  let cartCounter1 = document.querySelector("#go #total span");
  let counterEdit = edit;
  if (cartCounter) {
    cartCounter.textContent = `(${totalItems})`;
  }
  if (cartCounter1) {
    cartCounter1.textContent = totalItems;
  }
  if (counterEdit) {
    counterEdit.textContent = totalItems;
  }
}

function closeTab() {
  sidebar.classList.remove("genet");
}

Closebtn.addEventListener("click", closeTab);
iconCart.addEventListener("click", () => {
  sidebar.classList.toggle("genet");
});

/* Search Item */
const product = [
  {
    id: 0,
    image: "img/down1.jpg",
    title: "عرض كل الكويت",
    price: "8.000د.ك",
    quantity: 1,
  },
  {
    id: 1,
    image: "img/down2.png",
    title: "عرض الوطنية",
    price: "20.000د.ك",
    quantity: 1,
  },
  {
    id: 2,
    image: "img/down3.png",
    title: "عرض اليوم",
    price: "8.000د.ك",
    quantity: 1,
  },
  {
    id: 3,
    image: "img/down4.jpg",
    title: "كرتون سيباس تركي",
    price: "32.000د.ك",
    quantity: 1,
  },
  {
    id: 4,
    image: "img/down5.jpg",
    title: "سلمون نيجيري",
    price: "5.750د.ك",
    quantity: 1,
  },
  {
    id: 5,
    image: "img/down6.jpg",
    title: "روبيان كبير",
    price: "4.500د.ك",
    quantity: 1,
  },
  {
    id: 6,
    image: "img/down7.jpg",
    title: "1 كيلو روبيان كبير.",
    price: "4.500د.ك",
    quantity: 1,
  },
];
const addToCart1 = (productId) => {
  let selectedProduct = product.find((item) => item.id === productId);
  if (!selectedProduct) return;
  let existingItem = cartItems.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({
      id: selectedProduct.id,
      name: selectedProduct.title,
      price: parseFloat(selectedProduct.price),
      quantity: 1,
    });
  }
  totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  updateCart();
  payComplete.innerHTML = "متابعة الدفع";
};
const setupQuantityButtons = () => {
  document.querySelectorAll(".increasing").forEach((button) => {
    button.addEventListener("click", (event) => {
      let productId = parseInt(event.target.getAttribute("data-id"));
      addToCart1(productId);
    });
  });

  document.querySelectorAll(".decreasing").forEach((button) => {
    button.addEventListener("click", (event) => {
      let productId = parseInt(event.target.getAttribute("data-id"));
      decreaseQuantity(productId);
    });
  });
};
const decreaseQuantity = (productId) => {
  let itemIndex = cartItems.findIndex((item) => item.id === productId);
  if (itemIndex !== -1) {
    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity--;
    } else {
      cartItems.splice(itemIndex, 1);
    }
  }
  totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  show(product);
  updateCart();
};

const setupAddToCartButtons = () => {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      let productId = parseInt(event.target.getAttribute("data-id"));
      addToCart1(productId);
    });
  });
};

let productContainer = document.querySelector(".sec3 .container .row");
let show = (product) => {
  let result = "";
  for (let i = 0; i < product.length; i++) {
    result += `
 <div class="col-sm-6 col-12">
            <div class="card width-card mb-3" style="max-width: 500px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${product[i].image}" class="img-fluid All-pic" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${product[i].title}</h5>
                            <p class="card-text">10 كيلو روبيان كويتي جامبو طازج.</p>
                            <div class="add d-flex align-items-center justify-content-between">
                            <div id="cart-controls-${product[i].id}">
                                    <button type="button" class="add-to-cart text-black btn btn-primary" data-id="${product[i].id}">إضافة</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
  }
  productContainer.innerHTML = result;
  setupAddToCartButtons();
  setupQuantityButtons();
};

show(product);
let search = document.getElementById("search"),
  search1 = document.getElementById("search1");
let searchForName = (_) => {
  let searchValue = search.value.toLowerCase();
  let filtered = product.filter((item) =>
    item.title.toLowerCase().includes(searchValue)
  );
  show(filtered);
};
let searchForName1 = (_) => {
  let searchValue = search1.value.toLowerCase();
  let filtered = product.filter((item) =>
    item.title.toLowerCase().includes(searchValue)
  );
  show(filtered);
};
search.addEventListener("keyup", searchForName);
search1.addEventListener("keyup", searchForName1);

/* footer to go shop */

let btnGo = document.getElementById("go"),
  exitbtn = document.getElementById("exit"),
  popcontainer = document.querySelector(".popcontainer");
btnGo.addEventListener("click", () => {
  popcontainer.classList.add("appear");
});
exitbtn.addEventListener("click", () => {
  popcontainer.classList.remove("appear");
});

/* data For Users */
let userName = document.getElementById("userName");
let Address = document.getElementById("Address");
let Flat = document.getElementById("flat");
let Phone = document.getElementById("phone");
let driveNote = document.getElementById("driveNote");
let regxUserName = /([أا-يؤ لآآإلإ]{2,}|[a-z]{2,})/i;
let regxAddress = /([أا-يؤ لآآإلإ]{1,}|[0-9]|[a-z]{1,})$/i;
let regxFlat = /([أا-يؤ لآآإلإ]{2,}|[0-9]|[a-z]{2,})$/i;
let regxPhone = /^(?:\+965)?[569]\d{7}$/i;
let regxTextArea = /([أا-يؤلآآإلإ]{1,200}|[0-9]{1,200})$/i;
let validName = document.querySelector(".userName .validName"),
  vaildAddress = document.querySelector(".address .vaildAddress"),
  vaildFlat = document.querySelector(".flat .vaildFlat"),
  vaildPhone = document.querySelector(".phone .vaildPhone"),
  vaildArea = document.querySelector(".textArea .vaildArea");
let arr = [];
function addToTableDashBoard() {
  if (showVaildation() && wayPay()) {
    let user = {
      username: userName.value.trim(),
      address: Address.value.trim(),
      flat: Flat.value.trim(),
      phone: Phone.value.trim(),
      drive: driveNote.value.trim(),
    };
    arr.push(user);
  }
  clearInputsField();
}
function showVaildation() {
  let flag = true;
  if (regxUserName.test(userName.value)) {
    validName.style.cssText = "display:none";
  } else {
    validName.style.cssText = "display:block";
    setTimeout(() => {
      validName.style.cssText = "display:none";
    }, 3000);
    flag = false;
  }
  if (regxAddress.test(Address.value)) {
    vaildAddress.style.cssText = "display:none";
  } else {
    vaildAddress.style.cssText = "display:block";
    setTimeout(() => {
      vaildAddress.style.cssText = "display:none";
    }, 3000);
    flag = false;
  }
  if (regxFlat.test(Flat.value)) {
    vaildFlat.style.cssText = "display:none";
  } else {
    vaildFlat.style.cssText = "display:block";
    setTimeout(() => {
      vaildFlat.style.cssText = "display:none";
    }, 3000);
    flag = false;
  }
  if (regxPhone.test(Phone.value.trim())) {
    vaildPhone.style.cssText = "display:none";
  } else {
    vaildPhone.style.cssText = "display:block";
    setTimeout(() => {
      vaildPhone.style.cssText = "display:none";
    }, 3000);
    flag = false;
  }
  if (regxTextArea.test(driveNote.value)) {
    vaildArea.style.cssText = "display:none";
  } else {
    vaildArea.style.cssText = "display:block";
    setTimeout(() => {
      vaildArea.style.cssText = "display:none";
    }, 3000);
    flag = false;
  }
  return flag;
}
function clearInputsField() {
  userName.value = "";
  Address.value = "";
  Flat.value = "";
  driveNote.value = "";
}
// المفروض اعرض من خلالها الداتا بس المفروض مكانها مش هنا علشان باك هيستقبل مني الريسبونس
// function displayData(){

// }
/* input selector */
let complete = document.querySelector(".follow");
const payFull = document.getElementById("payFull");
let drive = document.querySelector(".payFull2 #payFull2");
complete.disabled = true;
function updatePrice() {
  if (payFull.checked) {
    totalAmount.textContent = totalAmount;
    priceProduct.textContent = `(${totalAmount.toFixed(3)}د.ك)`;
    shop.textContent = `${totalAmount.toFixed(3)}د.ك`;
    paycontainer.textContent = `${totalAmount.toFixed(3)}د.ك`;
  } else if (drive.checked) {
    totalAmount.textContent = "0.5 د.ك";
    priceProduct.textContent = "(0.5 د.ك)";
    shop.textContent = "0.5 د.ك";
    paycontainer.textContent = "0.5 د.ك";
  }
  complete.disabled = totalAmount === 0;
}

payFull.addEventListener("change", updatePrice);
drive.addEventListener("change", updatePrice);
complete.addEventListener("click", addToTableDashBoard);
function wayPay() {
  let truthValue = true;
  if (totalAmount) {
    const paymentLink = document.getElementById("paymentLink");
    if (paymentLink) {
      console.log("Opening payment link with amount:", totalAmount);
      // Update the link before opening it
      updatePaymentLink();
      console.log("Updated payment URL:", paymentLink.href);
      window.open(paymentLink.href, "_blank");
    } else {
      console.log("Payment link element not found!");
    }
    truthValue = true;
  }
  return truthValue;
}

// Setup form listeners to update payment link whenever form fields change
function setupFormListeners() {
  const formFields = ["userName", "Address", "flat", "phone", "driveNote"];

  formFields.forEach((fieldId) => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.addEventListener("input", () => {
        updatePaymentLink();
      });
    }
  });
}

// Update payment link with current form data, cart total, and cart items
function updatePaymentLink() {
  const paymentLink = document.getElementById("paymentLink");
  if (paymentLink) {
    // Get all form values
    const formData = {
      amount: totalAmount.toFixed(3),
      name: document.getElementById("userName")?.value || "",
      address: document.getElementById("Address")?.value || "",
      flat: document.getElementById("flat")?.value || "",
      phone: document.getElementById("phone")?.value || "",
      notes: document.getElementById("driveNote")?.value || "",
    };

    // Add cart items to the form data
    if (cartItems && cartItems.length > 0) {
      // Convert cart items to a JSON string and encode it
      formData.cartItems = JSON.stringify(cartItems);
    }

    // Build URL with all parameters
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
      params.append(key, encodeURIComponent(value));
    }

    console.log("Updating payment link with data:", formData);
    paymentLink.href = `../pay/index.html?${params.toString()}`;
  } else {
    console.log("Payment link element not found in updatePaymentLink!");
  }
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupFormListeners();
  updatePaymentLink(); // Initial update

  // Add a click event listener to the "Continue Payment" button
  const followButton = document.querySelector(".follow");
  if (followButton) {
    followButton.addEventListener("click", () => {
      updatePaymentLink(); // Ensure payment link is updated before clicking
    });
  }
});
