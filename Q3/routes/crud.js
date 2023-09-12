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

function createEmployee(name,role,res){
  const sql = 'INSERT INTO employees (name, role) VALUES (?, ?)';
  db.query(sql, [name, role], (err, result) => {
    if (err) {
      console.error('Error creating:', err);
    } else {
      console.log('Employee created');
    }
  });
}

/* POPULATE */
router.get('/populate', (req, res) => {
  request({
    url: 'https://randomuser.me/api/?results=10&inc=name',
    method: 'GET',
    dataType: 'json',
  }, (err, response, body) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      console.log(body);
      const jsonBody = JSON.parse(body);
      var newData=[];
      var name;
      for(var person of jsonBody["results"]){
        name = person.name.first+" "+person.name.last;
        newData.push({"name":name,"role":"Developer"})
        createEmployee(person.name.first+" "+person.name.last, "Developer", res);
      }
      res.status(201).json({ message: newData });
    }
  });
})

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
