const express = require('express')
const app = express();
const mysql = require('mysql2')
const cors = require('cors')
const dotenv = require('dotenv')

app.use(express.json())
app.use(cors());
dotenv.config();

app.set('view engine', 'ejs');


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) =>{
    if(err) return console.log("Error Connecting to Mysql", err)
    
    console.log("Connected to Mysql with id: ", db.threadId)
});




// GET: Retrieve all patients
app.get('/patients', (req, res) => {         
  const query = ('SELECT patient_id, first_name, last_name, date_of_birth FROM patients');
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving patients');
    }
    res.render('patients', {results:results});
  });
});

// GET: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = ('SELECT first_name, last_name, provider_specialty FROM providers');
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving providers');
    }
    res.render('providers',{results: results });
  });
});

// GET: Filter patients by First Name
app.get('/patients/:first_name', (req, res) => {
  const { first_name } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [first_name], (err, results) => {
    if (err) {
      return res.status(500).send('Error filtering patients');
    }
    res.render('patients', { results} );
  });
});

// GET: Retrieve all providers by specialty
app.get('/providers/specialty/:provider_specialty', (req, res) => {
  const { provider_specialty } = req.params;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [provider_specialty], (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving providers by specialty');
    }
    res.render('providers', { results: results });
  });
});


const PORT = 3000
   app.listen(PORT, () => {
     console.log(`server is runnig on http://localhost:${PORT}`)
   });