var express = require('express');
var router = express.Router();
const mysql = require('mysql2'); //prepared statements SQL injection
const request = require('request');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydatabase',
});
/* SEND EMAIL */
router.post('/send-notification', (req, res) => {
  const { IDS, mensagem } = req.body;

  for(var i of IDS){
    console.log(mensagem);
  }
  res.status(200).json({ message: 'Messages sended successfully' });

});

/* CREATE */
router.post('/employee', (req, res) => {
  const { name, role } = req.body;
  const sql = 'INSERT INTO employees (name, role) VALUES (?, ?)';
  db.query(sql, [name, role], (err, result) => {
    if (err) {
      console.error('Error creating:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      console.log('Employee created');
      res.status(201).json({ message: 'Employee created successfully' });
    }
  });
});

/* READ */
router.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
});

router.get('/employees/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM employees WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      res.json(result[0]);
    }
  });
});

/* UPDATE */
router.put('/employees/:id', (req, res) => {
  const id = req.params.id;
  const { name, role } = req.body;
  const sql = 'UPDATE employees SET name=?, role=? WHERE id=?';
  db.query(sql, [name, role, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      console.log('Employee updated');
      res.json({ message: 'Employee updated successfully' });
    }
  });
});

/* DELETE */
router.delete('/employees/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM employees WHERE id=?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      console.log('Employee deleted');
      res.json({ message: 'Employee deleted successfully' });
    }
  });
});

module.exports = router;
