const db = require('../config/db');
const User = require('../models/userModel');

exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${User.table} WHERE email = ? and status = 1 LIMIT 1`;
    db.query(sql, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

exports.createUser = (fullname, email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ${User.table} (fullname, email, password, user_type,status) VALUES (?, ?, ?,1,1)`;
    db.query(sql, [fullname, email, hashedPassword], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};


exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, fullname, email, created_at FROM ${User.table} where user_type=1 and status=1`;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.editUser = (id, fullname, email) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE ${User.table} SET fullname = ?, email = ? WHERE id = ?`;
    db.query(sql, [fullname, email, id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql =`UPDATE ${User.table} SET status = 0 WHERE id = ?`;
    db.query(sql,[id],(err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    })
  })
}

