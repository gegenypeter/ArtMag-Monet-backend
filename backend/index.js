const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const fs = require("fs");
let users = require("./users.json");

let mySessionStorage = {};

app.post("/api/save", (req, res) => {
  const sessionId = req.header("authorization");
  if (!sessionId) return res.sendStatus(401);
  const user = mySessionStorage[sessionId];
  if (!user) return res.sendStatus(401);

  const newArtwork = {
    sessionId: {
      id: req.body.id,
      title: req.body.title,
      artist: req.body.artist,
      image: req.body.image,
    },
  };
  user.artworks.push(newArtwork);
  fs.writeFileSync("savedusers.json", JSON.stringify(users, null, 4));
  res.sendStatus(200);
});

app.get("/api/collection", (req, res) => {
  res.json(users);
});
app.get("/", (req, res) => {
  res.send("The Metropolitan Museum of Art Collection");
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.post("/api/signup", (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).json("missing credentials");
  const userExists = users.some((user) => user.email === req.body.email);
  if (userExists) return res.sendStatus(409);
  const user = {
    email: req.body.email,
    password: req.body.password,
    artworks: [],
  };
  users.push(user);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 4));
  res.sendStatus(200);
});

app.post("/api/login", (req, res) => {
  const authHeader = req.header("authorization");
  if (!authHeader) return res.sendStatus(401);

  const userEmail = authHeader.split(":::")[0];
  const password = authHeader.split(":::")[1];

  const user = users.find(
    (user) => user.email === userEmail && user.password === password
  );

  if (!user) return res.sendStatus(401);
  const sessionId = Math.random().toString();
  mySessionStorage[sessionId] = user;

  console.log(mySessionStorage);

  res.json(sessionId);
});

app.delete("/api/logout", (req, res) => {
  const sessionId = req.header('authorization')
  if(!sessionId) return res.sendStatus(401)
  delete mySessionStorage[sessionId];
  res.sendStatus(200)
})