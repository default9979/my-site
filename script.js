const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (name === "" || phone === "") {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
   alert("Пожалуйста, введите корректный номер телефона");
   return;
  }

  fetch("https://salon-server-production-85f7.up.railway.app/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, message })
  })
  .then(function() {
    successMsg.style.display = "block";
    document.getElementById("nameInput").value = "";
    document.getElementById("phoneInput").value = "";
    document.getElementById("messageInput").value = "";
    document.getElementById("submitBtn").disabled = true;
  });
});

window.addEventListener('scroll', function() {
  const btn = document.getElementById('scrollTop');
  if (window.scrollY > 300) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

const burgerBtn = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");

burgerBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

const links = navLinks.querySelectorAll("a");

links.forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
});