const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/funkcionalnosti-odjemalca/') {
        serveHTML(res, 'funkcionalnosti-odjemalca.html');
    } else if (req.url === '/uml_streznik/') {
        serveImage(res, 'uml_streznik.png');
    } else if (req.url === '/uml_st.png') {
    serveImage(res, 'uml_st.png');
    } else if (req.url === '/posebnosti-streznika/') {
        serveText(res, 'posebnosti-streznika.txt');
    } else if (req.url === '/posebnosti/') {
        serveText(res, 'posebnosti.txt');
    } else if (req.url === '/podatkovni-model/') {
        serveHTML(res, 'podatkovni-model.html');
    } else if (req.url === '/posebnosti-ER/') {
        serveText(res, 'posebnosti-ER.txt');
    } else if (req.url === '/funkcionalnosti-streznika/') {
        serveHTML(res, 'funkcionalnosti-streznika.html');
    } else if (req.url === '/er-smarthabit.png') {
        serveImage(res, 'er-smarthabit.png');
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

function serveImage(res, filename) {
    const filePath = path.join(__dirname, "pages", filename);
    const ext = path.extname(filename).toLowerCase();
    const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Slika ni bila najdena.');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

server.on('request', (req, res) => {
    if (req.url.startsWith('/images/') || req.url.startsWith('/pages/')) {
        serveImage(res, req.url.replace('/', ''));
    }
});



server.listen(3000, () => {
    console.log('Strežnik teče na http://localhost:3000');
});
