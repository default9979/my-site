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

  fetch("http://localhost:3000/send", {
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