const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/funkcionalnosti-odjemalca/') {
        serveHTML(res, 'funkcionalnosti-odjemalca.html');
    } else if (req.url === '/posebnosti/') {
        serveText(res, 'posebnosti.txt');
    } else if (req.url === '/podatkovni-model/') {
        serveHTML(res, 'podatkovni-model.html');
    } else if (req.url === '/REST/') {
        serveText(res, 'REST.txt');
    } else if (req.url === '/funkcionalnosti-streznika/') {
        serveHTML(res, 'funkcionalnosti-streznika.html');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Stran ni najdena');
    }
});

function serveHTML(res, filename) {
    const filePath = path.join(__dirname, "pages", filename);

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Napaka pri nalaganju datoteke.");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
    });
}

function serveText(res, filename) {
    const filePath = path.join(__dirname, "pages", filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Napaka pri branju datoteke');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        }
    });
}

// tu je se treba za slike dodat, da jih bo znal prikazat

server.listen(3000, () => {
    console.log('Strežnik teče na http://localhost:3000');
});
