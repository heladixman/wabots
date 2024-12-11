const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 8080;

// Set template engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


const client = new Client();
let isLoggedIn = false;

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    app.locals.qrCode = qr;  // Menyimpan QR code dalam local context untuk dapat digunakan di views
    isLoggedIn = false;
});

client.on('ready', () => {
    console.log('Client is ready!');
    isLoggedIn = true;
    app.locals.qrCode = null;
});

client.on('message', message => {
    console.log(message.body);
});

// Menjalankan client WhatsApp
client.initialize();

app.use(express.json());

app.get('/', (req, res) => {
    if (isLoggedIn) {
        return res.redirect('/dashboard');
    }
    res.render('index', { qrCode: app.locals.qrCode });
});

app.get('/dashboard', (req, res) => {
    if (!isLoggedIn) {
        return res.redirect('/');
    }
    res.render('dashboard', { message: 'Welcome to the WhatsApp Dashboard!' });
});

app.post('/send-message', (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).send('Phone number and message are required');
    }

    // Mengirim pesan ke nomor tujuan
    client.sendMessage(`${phoneNumber}@c.us`, message)
        .then(response => {
            res.status(200).send('Message sent successfully!');
        })
        .catch(err => {
            res.status(500).send('Error sending message: ' + err.message);
        });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});