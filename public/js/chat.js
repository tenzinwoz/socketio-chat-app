const socket = io();

//elements
const messageForm = document.getElementById("message-form");
const messageFormInput = document.querySelector("input");
const messageFormButton = document.getElementById("message-button");
const locationButton = document.getElementById("send-location");
const messages = document.getElementById("messages");

//Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationMessageTemplate = document.getElementById(
  "location-message-template"
).innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  const newMessage = messages.lastElementChild;
  const newMessagestyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessagestyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
  const visibleHeight = messages.offsetHeight;
  const containerHeight = messages.scrollHeight;
  const scrollOffset = messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on("message", (msg) => {
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    message: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (msg) => {
  const html = Mustache.render(locationMessageTemplate, {
    username: msg.username,
    url: msg.url,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  console.log({ users });
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.getElementById("sidebar").innerHTML = html;
});

document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  messageFormButton.disabled = true;

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (err) => {
    messageFormButton.disabled = false;
    messageFormInput.value = "";
    messageFormInput.focus();

    if (err) {
      return console.log(err);
    }
    console.log("Message delivered");
  });
});

document.getElementById("send-location").addEventListener("click", () => {
  locationButton.disabled = true;

  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    };
    socket.emit("sendLocation", location, () => {
      locationButton.disabled = false;
      console.log("Location shared");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
