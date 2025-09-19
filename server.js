const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-data', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const { lat, lon, accuracy, ts, ua } = req.body;
  const now = new Date().toISOString();

  const logEntry = `${now}\tIP:${ip}\tUA:"${ua}"\tLat:${lat}\tLon:${lon}\tAccuracy:${accuracy}m\tTS:${ts}\n`;

  fs.appendFile(path.join(__dirname, 'visitors.log'), logEntry, err => {
    if (err) {
      console.error('❌ خطأ في الحفظ:', err);
      return res.status(500).send('خطأ في الخادم');
    }
    console.log('✅ تم تسجيل زيارة:', logEntry.trim());
    res.send('تم الحفظ');
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});
