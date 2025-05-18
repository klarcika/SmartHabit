const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const file = path.join(__dirname, '../data/uporabniki.json');
const read = () => JSON.parse(fs.readFileSync(file));
const write = (data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));


router.get('/', (req, res) => {
    const data = read();
    res.json(data);
  });

router.get('/:id', (req, res) => {
  const data = read();
  const u = data.find(x => x.id == req.params.id);
  u ? res.json(u) : res.status(404).json({ msg: 'Ni najdeno' });
});

router.post('/', (req, res) => {
  const data = read();
  const nov = { id: Date.now(), ...req.body };
  data.push(nov);
  write(data);
  res.status(201).json(nov);
});

router.put('/:id', (req, res) => {
  const data = read();
  const i = data.findIndex(x => x.id == req.params.id);
  if (i === -1) return res.status(404).json({ msg: 'Ni najdeno' });
  data[i] = { ...data[i], ...req.body };
  write(data);
  res.json(data[i]);
});

router.delete('/:id', (req, res) => {
  let data = read();
  const novo = data.filter(x => x.id != req.params.id);
  write(novo);
  res.json({ msg: 'Izbrisano' });
});

module.exports = router;
