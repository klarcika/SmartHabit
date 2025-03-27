const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const file = path.join(__dirname, '../data/recommendations.json');
const read = () => JSON.parse(fs.readFileSync(file));
const write = (data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// get
router.get('/', (req, res) => {
  let data = read();
  if (req.query.userId) {
    data = data.filter(x => x.userId == req.query.userId);
  }
  res.json(data);
});

// psot
router.post('/', (req, res) => {
  const data = read();
  const newRecommendation = { id: Date.now(), ...req.body };
  data.push(newRecommendation);
  write(data);
  res.status(201).json(newRecommendation);
});

// put
router.put('/:id', (req, res) => {
  let data = read();
  const index = data.findIndex(x => x.id == req.params.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    write(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Priporočilo ni bilo najdeno.' });
  }
});

// delete
router.delete('/:id', (req, res) => {
  let data = read();
  const newData = data.filter(x => x.id != req.params.id);
  write(newData);
  res.json({ message: 'Priporočilo izbrisano.' });
});

module.exports = router;
