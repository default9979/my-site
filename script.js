const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");
const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");
const messageInput = document.getElementById("messageInput");

form.addEventListener("submit", function(event) {
   event.preventDefault(); 

    if (nameInput.value.trim() === "" || phoneInput.value.trim() === "" || messageInput.value.trim() === "") {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  successMsg.style.display = "block";
  document.getElementById("submitBtn").disabled = true;
  nameInput.value = "";
  phoneInput.value = "";
  messageInput.value = "";
});