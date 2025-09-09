const db = require('../config/db');
const Category = require('../models/categoryModel');


exports.addCategory = (category_name) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO ${Category.table} (category_name,status) VALUES (?,1)`;
    db.query(sql, [category_name], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

exports.getCategory = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,category_name, created_at FROM ${Category.table} WHERE status=1`;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


exports.editCategory = (id,category_name) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE ${Category.table} SET category_name = ? WHERE id = ?`;
    db.query(sql, [category_name, id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

exports.deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    const sql =`UPDATE ${Category.table} SET status = 0 WHERE id = ?`;
    db.query(sql,[id],(err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    })
  })
};
