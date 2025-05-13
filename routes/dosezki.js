// routes/dosezki.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const file = path.join(__dirname, '../data/dosezki.json');
const read = () => JSON.parse(fs.readFileSync(file));
const write = (data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  let data = read();
  if (req.query.uporabnik) {
    data = data.filter(x => x.userId == req.query.uporabnik);
  }
  res.json(data);
});

router.post('/', (req, res) => {
  const data = read();
  const nov = { id: Date.now(), ...req.body };
  data.push(nov);
  write(data);
  res.status(201).json(nov);
});

router.delete('/:id', (req, res) => {
  let data = read();
  const novo = data.filter(x => x.id != req.params.id);
  write(novo);
  res.json({ msg: 'Izbrisano' });
});

module.exports = router;
