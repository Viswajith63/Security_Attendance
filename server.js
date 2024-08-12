const express = require('express');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const requestIp = require('request-ip');
const cors = require('cors'); // Import cors

const app = express();
const upload = multer({ dest: 'uploads/' });

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'attendance',
  password: 'root',
  port: 5432,
});


app.use(cors());


app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw()); // Middleware to capture IP address

const OFFICE_IPS = ['171.79.49.1', '171.79.49.255', '127.0.0.1'];
// Update with your office IPs



function checkIP(req, res, next) {
  const clientIp = req.clientIp;
  if (OFFICE_IPS.includes(clientIp)) {
    next();
  } else {
    res.status(403).send('Access denied');
  }
}

app.get('/api/get-ip', (req, res) => {
  const clientIp = req.clientIp; 
  res.json({ ip: clientIp });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.post('/api/attendance',checkIP,upload.single('selfie'), async (req, res) => {
  const { employeeId } = req.body;
  const selfiePath = req.file.path;

  const query = 'INSERT INTO attendance (employee_id, selfie_path) VALUES ($1, $2)';
  const values = [employeeId, selfiePath];

  try {
    await pool.query(query, values);
    res.status(200).send('Selfie uploaded successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error uploading selfie');
  }
});


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1); 
  } else {
    console.log('Database connected:', res.rows[0]);
    app.listen(3000, () => console.log('Server running on port 3000'));
  }
});
//http://localhost:3000
