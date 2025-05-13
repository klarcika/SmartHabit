var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/habits.json');


const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};


const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};


router.get('/', (req, res) => {
    const habits = readData();
    res.json(habits);
});


router.post('/', (req, res) => {
    const habits = readData();
    const newHabit = {
        id: Date.now(),
        name: req.body.name,
        description: req.body.description,
        frequency: req.body.frequency,
    };
    habits.push(newHabit);
    writeData(habits);
    res.status(201).json(newHabit);
});

router.put('/:id', (req, res) => {
    const habits = readData();
    const habitIndex = habits.findIndex(h => h.id == req.params.id);
    if (habitIndex === -1) return res.status(404).json({ message: "Navada ne obstaja" });

    habits[habitIndex] = { ...habits[habitIndex], ...req.body };
    writeData(habits);
    res.json(habits[habitIndex]);
});


router.delete('/:id', (req, res) => {
    let habits = readData();
    habits = habits.filter(h => h.id != req.params.id);
    writeData(habits);
    res.status(204).end();
});

module.exports = router;

