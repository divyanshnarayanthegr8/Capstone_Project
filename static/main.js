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


const micBtn = document.getElementById("micbtn");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    micBtn.onclick = () => {
        recognition.start();
        micBtn.classList.add("listening");
    };

    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        inputBox.value = spokenText;
        micBtn.classList.remove("listening");
        sendBtn.click(); // auto-send
    };

    recognition.onerror = () => {
        micBtn.classList.remove("listening");
        alert("Microphone access denied or not supported.");
    };

    recognition.onend = () => {
        micBtn.classList.remove("listening");
    };
} else {
    micBtn.disabled = true;
    micBtn.title = "Speech recognition not supported";
}
