const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

const TOKEN = "8997551715:AAEGcEgtfbN95gDQkfQQa_tjbmv8SzEEFvQ";
const CHAT_ID = "6275779905";

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();

  if (name === "" || phone === "") {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  const text = `🔔 Новая заявка!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Вопрос: ${message}`;

  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  })
  .then(function() {
    successMsg.style.display = "block";
    document.getElementById("nameInput").value = "";
    document.getElementById("phoneInput").value = "";
    document.getElementById("messageInput").value = "";
    document.getElementById("submitBtn").disabled = true;
  });
});
