const users = [];

//add user
const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }
  const existingUser = users.find((user) => {
    return user.room == room && user.username === username;
  });
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};

//remove user
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//getUser
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

//getUsersInRoom
const getUserInRoom = (room) => {
  return users.filter((user) => user.room == room);
};

console.log(users);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
};
