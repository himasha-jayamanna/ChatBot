const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");


let userMessage;
const API_KEY = "ADD_API_KEY_HERE";   //add API Key here.
const inputInitHeight = chatInput.scrollHeight;

const createChatList = (message, className) => {
    const chatList = document.createElement("li");
    chatList.classList.add("chat", className);
    let chatContent = className === "send" ?
        `<p></p>` :
        `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatList.innerHTML = chatContent;
    chatList.querySelector("p").textContent = message;
    return chatList;
}

const provideResponse = (receivingChatList) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = receivingChatList.querySelector("p");

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}], 
        })
    }

    // Send POST request to API
    fetch(API_URL, request)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content.trim();
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again later.";
        })
        .finally(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append user's message to chatbox
    chatbox.appendChild(createChatList(userMessage, "send"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Processing..." message
        const receivingChatList = createChatList("Processing...", "receive");
        chatbox.appendChild(receivingChatList);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Provide response from API
        provideResponse(receivingChatList);
    }, 600);
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
    
});

chatInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        handleChat();
    }
    
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));


