let connection = null;

let colors = [
    "red",
    "cyan",
    "palevioletred",
    "lime",
    "yellow",
    "orange",
]

const registration_area = document.getElementById("registration")
const messaging_area = document.getElementById("messaging-area")

let current_user = null;
let current_color = null;

// Handle the submission of the registration and take user to the messaging area
const reg_form = document.getElementById("registration-form");
reg_form.onsubmit = (e) => {
    e.preventDefault();
    current_user = document.getElementById("user-name").value;
    current_color = colors[Math.floor(Math.random() * colors.length)];

    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7027/chat")
        .build();


    connection.on("ReceiveMessage", (user, message, color) => {
        const messages = document.getElementById("all-messages")

        if (user == current_user) {
            user = "You";
        }

        let received_message = document.createElement("p");
        let sender_name = document.createElement("span");
        let sender_message = document.createElement("span");
        sender_name.style.color = color;
        sender_name.innerText = `${user}: `

        sender_message.innerText = message;
        sender_message.style.color = "white";

        received_message.appendChild(sender_name);
        received_message.appendChild(sender_message);

        messages.appendChild(received_message);
    })

    connection.start()
        .then(() => {
            console.log("Connection started");
        })
        .catch((err) => {
            return console.error(err.toString());
        })

    registration_area.classList.add("d-none");
    messaging_area.classList.remove("d-none");
}

let enter_button = document.getElementById("enter-button");
// Send a new message to all others from the client
enter_button.onclick = (e) => {
    let message = document.getElementById("new-message").value.trim();

    if (!message || message == "") return;

    if (!connection) return;

    connection.invoke("SendMessage", current_user, message, current_color)
        .catch((err) => {
            return console.error(err.toString())
        })
    e.preventDefault();
    document.getElementById("new-message").value = "";
}

// When enter key is clicked on the page, make a virtual click of the enter button
document.getElementById("new-message").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        enter_button.click();
    }
});

// Leave the chat and return to messaging area
const leave_button = document.getElementById("leave-button")
leave_button.onclick = () => {
    registration_area.classList.remove("d-none");
    messaging_area.classList.add("d-none");

    if (!connection)
        connection.stop();
}
