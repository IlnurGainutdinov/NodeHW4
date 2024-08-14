const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

let users = [];

// Чтение данных из файла при запуске сервера
fs.readFile("users.json", "utf8", (err, data) => {
  if (!err) {
    users = JSON.parse(data);
  }
});

// Обработчик получения всех пользователей
app.get("/users", (req, res) => {
  res.json(users);
});

// Обработчик создания нового пользователя
app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);

  fs.writeFile("users.json", JSON.stringify(users), (err) => {
    if (err) {
      res.status(500).send("Error saving user");
    } else {
      res.status(201).send("User created successfully");
    }
  });
});

// Обработчик обновления пользователя
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;

    fs.writeFile("users.json", JSON.stringify(users), (err) => {
      if (err) {
        res.status(500).send("Error updating user");
      } else {
        res.send("User updated successfully");
      }
    });
  } else {
    res.status(404).send("User not found");
  }
});

// Обработчик удаления пользователя
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    fs.writeFile("users.json", JSON.stringify(users), (err) => {
      if (err) {
        res.status(500).send("Error deleting user");
      } else {
        res.send("User deleted successfully");
      }
    });
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
