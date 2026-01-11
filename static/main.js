const inputBox = document.getElementById("inputbox");
const sendBtn = document.getElementById("sendbtn");
const messages = document.getElementById("messages");

sendBtn.onclick = async function() {
    const userText = inputBox.value.trim();
    if (!userText) return;
    appendMessage("user", userText);
    inputBox.value = "";

    const response = await fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: userText})
    });
    const data = await response.json();
    appendMessage("bot", data.response);
};

function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendBtn.click();
    }
});