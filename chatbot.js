const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const query = chatInput.value.trim();
  if (!query) return;

  appendMessage(query, "user");
  chatInput.value = "";

  try {
    const res = await fetch("http://localhost:5000/api/products/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const data = await res.json();

    if (data.length === 0) {
      appendMessage("No matching products found.", "bot");
      return;
    }

    data.forEach(p => appendProduct(p));

  } catch (err) {
    console.error(err);
    appendMessage("Error fetching products.", "bot");
  }
}

function appendMessage(msg, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender === "bot" ? "bot-message" : "user-message");
  div.innerText = msg;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendProduct(p) {
  const div = document.createElement("div");
  div.classList.add("message", "bot-message");
  div.style.border = "1px solid #ddd";
  div.style.padding = "8px";
  div.style.marginBottom = "8px";
  div.style.borderRadius = "10px";

  div.innerHTML = `
    <img src="${p.image}" width="100" style="display:block; margin-bottom:5px; border-radius:8px;">
    <b>${p.name}</b><br>
    ₹${p.price}<br>
    <button onclick="addToCart('${p.name}', '${p.price}', '${p.image}')"
      style="margin-top:5px; padding:5px 10px; border:none; background:#4a90e2; color:white; border-radius:5px; cursor:pointer;">
      Add to Cart
    </button>
  `;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addToCart(name, price, img) {
  cart.push({ name, price, img });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

function appendProduct(p) {
  const div = document.createElement("div");
  div.classList.add("message", "bot-message");
  div.style.border = "1px solid #ddd";
  div.style.padding = "10px";
  div.style.marginBottom = "8px";
  div.style.borderRadius = "12px";
  div.style.display = "flex";
  div.style.flexDirection = "column"; /* stack content vertically */
  div.style.alignItems = "flex-start"; /* left-align inside bubble */
  div.style.background = "#fff";
  div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

  div.innerHTML = `
    <img src="${p.image}" width="120" style="border-radius:8px; margin-bottom:5px;">
    <b style="margin-bottom:5px;">${p.name}</b>
    <span style="margin-bottom:5px;">₹${p.price}</span>
    <button onclick="addToCart('${p.name}', '${p.price}', '${p.image}')"
      style="
        padding:5px 10px;
        border:none;
        background:#4a90e2;
        color:white;
        border-radius:5px;
        cursor:pointer;
      ">
      Add to Cart
    </button>
  `;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
