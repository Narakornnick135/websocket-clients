const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// เสิร์ฟไฟล์ static (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname)));

// ตั้งค่าเส้นทางหลัก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`WebSocket Client server is running at http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});