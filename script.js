const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function(event) {
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");
  const messageInput = document.getElementById("messageInput");

  if (nameInput.value.trim() === "" || phoneInput.value.trim() === "") {
    event.preventDefault();
    alert("Пожалуйста, заполните все поля");
    return;
  }

  successMsg.style.display = "block";
});
