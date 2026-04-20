const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ===== LOAD DATABASE =====
let db = JSON.parse(fs.readFileSync('db.json'));

// ===== ROOT (BIAR GAK NOT FOUND) =====const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ===== LOAD DATABASE =====
let db = JSON.parse(fs.readFileSync('db.json'));

// auto reload db (biar update realtime)
function saveDB() {
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
}

// ===== ROOT =====
app.get('/', (req, res) => {
  res.json({
    name: "smart-river",
    status: "running",
    endpoints: [
      "/api/sungai",
      "/api/devices",
      "/login",
      "/verify",
      "/control"
    ]
  });
});

// ===== LOGIN =====
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  let user = db.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).send('Login gagal');

  user.otp = Math.floor(100000 + Math.random() * 900000);
  saveDB(); // simpan OTP

  console.log("OTP:", user.otp);

  res.send('OTP dikirim (cek console)');
});

// ===== VERIFY OTP =====
app.post('/verify', (req, res) => {
  const { username, otp } = req.body;

  let user = db.users.find(u => u.username === username);

  if (user && user.otp == otp) {
    user.otp = null; // reset OTP
    saveDB();
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

// ===== CONTROL PER DEVICE =====
let controlSession = {};

app.post('/control', (req, res) => {
  const { deviceName } = req.body;

  let device = db.devices.find(d => d.name === deviceName);

  if (!device) return res.status(404).send("Device tidak ditemukan");

  if (device.status !== "ERROR") {
    return res.send("Tidak bisa kontrol (tidak error)");
  }

  if (controlSession[deviceName]) {
    return res.send("Sedang dikontrol");
  }

  controlSession[deviceName] = true;

  setTimeout(() => {
    controlSession[deviceName] = false;
  }, 1800000); // 30 menit

  res.send("Kontrol aktif 30 menit untuk " + deviceName);
});

// ===== UPDATE STATUS DEVICE (buat ESP32/Raspi nanti) =====
app.post('/update-device', (req, res) => {
  const { name, status } = req.body;

  let device = db.devices.find(d => d.name === name);
  if (!device) return res.status(404).send("Device tidak ditemukan");

  device.status = status;
  saveDB();

  res.send("Status diupdate");
});

// ===== PORT (REPLIT FIX) =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server jalan di " + PORT);
});
app.get('/', (req, res) => {
  res.json({
    name: "smart-river",
    status: "running",
    endpoints: [
      "/api/sungai",
      "/api/devices",
      "/login",
      "/verify",
      "/control"
    ]
  });
});

// ===== LOGIN =====
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  let user = db.users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).send('Login gagal');

  user.otp = Math.floor(100000 + Math.random() * 900000);
  console.log("OTP:", user.otp);

  res.send('OTP dikirim');
});

// ===== VERIFY OTP =====
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

// ===== CONTROL PER DEVICE =====
let controlSession = {};

app.post('/control', (req, res) => {
  const { deviceName } = req.body;

  let device = db.devices.find(d => d.name === deviceName);

  if (!device) return res.status(404).send("Device tidak ditemukan");

  if (device.status !== "ERROR") {
    return res.send("Tidak bisa kontrol (tidak error)");
  }

  if (controlSession[deviceName]) {
    return res.send("Sedang dikontrol");
  }

  controlSession[deviceName] = true;

  setTimeout(() => {
    controlSession[deviceName] = false;
  }, 1800000); // 30 menit

  res.send("Kontrol aktif 30 menit untuk " + deviceName);
});

// ===== PORT (WAJIB UNTUK REPLIT) =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server jalan di " + PORT);
});
