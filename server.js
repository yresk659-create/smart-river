const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

let db = JSON.parse(fs.readFileSync('db.json'));

// ===== LOGIN =====
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  let user = db.users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).send('Login gagal');

  user.otp = Math.floor(100000 + Math.random() * 900000);
  console.log("OTP:", user.otp);

  res.send('OTP dikirim');
});

app.post('/verify', (req, res) => {
  const { username, otp } = req.body;

  let user = db.users.find(u => u.username === username);

  if (user && user.otp == otp) {
    res.send('Login berhasil');
  } else {
    res.status(401).send('OTP salah');
  }
});

// ===== DATA =====
app.get('/api/sungai', (req, res) => {
  res.json(db.sungai);
});

app.get('/api/devices', (req, res) => {
  res.json(db.devices);
});

// ===== CONTROL =====
let controlSession = false;

app.post('/control', (req, res) => {
  let device = db.devices[0];

  if (device.status !== "ERROR") {
    return res.send("Tidak bisa kontrol");
  }

  if (controlSession) {
    return res.send("Sedang dikontrol");
  }

  controlSession = true;

  setTimeout(() => {
    controlSession = false;
  }, 1800000); // 30 menit

  res.send("Kontrol aktif 30 menit");
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Server jalan di 3000");
});