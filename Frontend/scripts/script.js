let connection = null;


const registration_area = document.getElementById("registration")
const messaging_area = document.getElementById("messaging")

// Leave the chat and return to messaging area
const leave_button = document.getElementById("leave-button")
leave_button.onclick = () => {
    registration_area.style.display = "block";
    messaging_area.style.display = "none";

    if (!connection)
        connection.stop();
}

let user = null;

// Handle the submission of the registration and take user to the messaging area
const reg_form = document.getElementById("registration-form");
reg_form.onsubmit = (e) => {
    e.preventDefault();
    user = document.getElementById("user-name").value;

    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7027/chat")
        .build();


    connection.on("ReceiveMessage", (user, message) => {
        const textarea = document.getElementById("messages")
        let text = textarea.value;

        text += `${user}: ${message}\n`;
        textarea.value = text;
    })

    connection.start()
        .then(() => {
            console.log("Connection started");
        })
        .catch((err) => {
            return console.error(err.toString());
        })

    registration_area.style.display = "none";
    messaging_area.style.display = "block";
}


document.getElementById("new-message-button").onclick = (e) => {
    let message = document.getElementById("new-message").value.trim();

    if (!message || message == "") return;

    if (!connection) return;

    connection.invoke("SendMessage", user, message)
        .catch((err) => {
            return console.error(err.toString())
        })
    e.preventDefault();
}