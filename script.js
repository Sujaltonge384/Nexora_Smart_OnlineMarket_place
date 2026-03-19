/* ===============================
   GLOBAL TOAST SYSTEM
================================= */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}


/* ===============================
   ADD TO CART (BACKEND VERSION)
================================= */
async function addToCart(name, price, image, description, type = "shopping") {

  const token = localStorage.getItem("token");

  if (!token) {
    showToast("Please login first", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({
        name,
        price,
        image,
        description,
        type
      })
    });

    const data = await res.json();

    if (res.ok) {
      if (type === "fresh") {
        showToast("Added to Nexora Daily 🥬", "success");
      } else {
        showToast("Added to Shopping Cart 🛒", "success");
      }

      updateCartCount();
    } else {
      showToast(data.message || "Failed to add", "error");
    }

  } catch (err) {
    showToast("Server error", "error");
  }
}
/* ===============================
   LOAD CART COUNT FROM DATABASE
================================= */
async function loadCart() {

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/cart", {
    headers: { "Authorization": token }
  });

  const cart = await res.json();

  const shoppingDiv = document.getElementById("shoppingCart");
  const freshDiv = document.getElementById("freshCart");

  shoppingDiv.innerHTML = "";
  freshDiv.innerHTML = "";

  cart.shopping.forEach(item => {
    shoppingDiv.innerHTML += `
      <p>${item.name} - ₹${item.price} x ${item.quantity}</p>
    `;
  });

  cart.fresh.forEach(item => {
    freshDiv.innerHTML += `
      <p>${item.name} - ₹${item.price} x ${item.quantity}</p>
    `;
  });
}


/* ===============================
   LOAD CART PAGE ITEMS
================================= */
async function displayCart() {
  const token = localStorage.getItem("token");
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotalSpan = document.getElementById("cart-total");

  if (!token || !cartItemsDiv) return;

  try {
    const res = await fetch("http://localhost:5000/api/cart", {
      headers: {
        "Authorization": token
      }
    });

    const cart = await res.json();

    cartItemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const div = document.createElement("div");
      div.className = "product";

      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: ₹${item.price}</p>
        <p>Subtotal: ₹${item.price * item.quantity}</p>
        <button onclick="removeFromCart('${item.name}')">Remove</button>
      `;

      cartItemsDiv.appendChild(div);
      total += item.price * item.quantity;
    });

    if (cartTotalSpan)
      cartTotalSpan.textContent = total;

  } catch (err) {
    showToast("Failed to load cart", "error");
  }
}


/* ===============================
   REMOVE FROM CART
================================= */
async function removeFromCart(name) {
  const token = localStorage.getItem("token");

  try {
    await fetch("http://localhost:5000/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ name })
    });

    showToast("Item removed", "success");
    displayCart();

  } catch (err) {
    showToast("Error removing item", "error");
  }
}


//updatecartcount function


async function updateCartCount() {

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/cart", {
      headers: { "Authorization": token }
    });

    const cart = await res.json();

    let count = 0;

    if (cart.shopping) {
      count += cart.shopping.reduce((sum, item) => sum + item.quantity, 0);
    }

    if (cart.fresh) {
      count += cart.fresh.reduce((sum, item) => sum + item.quantity, 0);
    }

    const countElem = document.getElementById("cart-count");

    if (countElem) {
      countElem.innerText = count;
    }

  } catch (err) {
    console.error("Cart count error:", err);
  }
}

/* ===============================
   IMAGE CAROUSEL
================================= */
let currentSlide = 0;

function moveSlide(direction) {
  const slides = document.getElementById("carouselSlides");
  if (!slides) return;

  const totalSlides = slides.children.length;

  currentSlide += direction;
  if (currentSlide < 0) currentSlide = totalSlides - 1;
  if (currentSlide >= totalSlides) currentSlide = 0;

  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}


/* ===============================
   HORIZONTAL SCROLL SECTIONS
================================= */
function scrollLeft(id) {
  const container = document.getElementById(id);
  if (container)
    container.scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight(id) {
  const container = document.getElementById(id);
  if (container)
    container.scrollBy({ left: 300, behavior: 'smooth' });
}

function scrollLeft_1(id) {
  const container = document.getElementById(id);
  if (container)
    container.scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight_1(id) {
  const container = document.getElementById(id);
  if (container)
    container.scrollBy({ left: 300, behavior: 'smooth' });
}
/* ===============================
   THUMBNAIL IMAGE SWITCH
================================= */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll('.product-card').forEach(card => {
    const mainImg = card.querySelector('.main-product');
    const thumbnails = card.querySelectorAll('.thumbnail-scroll img');
      updateCartCount(); 

      thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        if (mainImg)
          mainImg.src = thumbnail.src;
      });
    });
  });
  displayCart();

});


async function executeCommand(cmd) {

  if (cmd.action === "add") {

    for (let i = 0; i < cmd.quantity; i++) {
      await addToCart(cmd.product, 50, "", "", "fresh");
    }

  }

  if (cmd.action === "clear") {

    await fetch("http://localhost:5000/api/cart/clear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
      body: JSON.stringify({ type: cmd.type })
    });

    displayCart();
  }
}




async function sendChat() {

  const message = document.getElementById("chatInput").value;

  const res = await fetch("http://localhost:5000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message })
  });

  const command = await res.json();

  executeCommand(command);
}







document.addEventListener("DOMContentLoaded", () => {

  const username = localStorage.getItem("username");
  const authSection = document.getElementById("authSection");

  if (!authSection) return;

  if (username) {
    const firstLetter = username.charAt(0).toUpperCase();

    authSection.innerHTML = `
      <div class="profile-wrapper">
        <div class="profile-circle">${firstLetter}</div>
        <span>${username}</span>
        <button onclick="logout()" class="logout-btn">Logout</button>
      </div>
    `;
  } else {
    authSection.innerHTML = `
      <div class="login-reg"><a href="login.html">Login</a>
      <a href="register.html">Register</a></div>
    `;
  }

});




document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  updateCartCount();
});

function loadUser() {
  const username = localStorage.getItem("username");
  const authSection = document.getElementById("authSection");

  if (!authSection) return;

  if (username) {
    const firstLetter = username.charAt(0).toUpperCase();

    authSection.innerHTML = `
      <div class="profile-wrapper">
        <div class="profile-circle">${firstLetter}</div>
        <span class="profile-name">${username}</span>
        <button onclick="logout()" class="logout-btn">Logout</button>
      </div>
    `;
  } else {
    authSection.innerHTML = `
      <a class="nav-item" href="login.html">Login</a>
      <a class="nav-item" href="register.html">Register</a>
    `;
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}



function slideLeft(id) {
  const slider = document.getElementById(id);
  slider.scrollBy({
    left: -300,
    behavior: "smooth"
  });
}

function slideRight(id) {
  const slider = document.getElementById(id);
  slider.scrollBy({
    left: 300,
    behavior: "smooth"
  });
}