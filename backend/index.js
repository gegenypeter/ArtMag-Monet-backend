const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const fs = require("fs");
const artworks = require("./savedArtworks.json");

app.post("/api/save", (req, res) => {

  const existingSave = artworks.some((art) => art.id === req.body.id);

  if (existingSave) return res.sendStatus(409);

  const newArtwork = {
    id: req.body.id,
    title: req.body.title,
    artist: req.body.artist,
    image: req.body.image,
  };

  artworks.push(newArtwork);

  fs.writeFileSync("savedArtworks.json", JSON.stringify(artworks, null, 4));
  res.sendStatus(200);
});

app.get('/api/collection', (req, res) => {
    res.json(artworks);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
