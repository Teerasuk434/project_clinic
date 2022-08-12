const mysql = require('mysql');
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: async (pool, username, password, role_id) => {
        var sql ="INSERT INTO users (username, password, role_id) "
                    + "VALUES (?, MD5(?), ?)";
        sql = mysql.format(sql, [username, password, role_id]);

        return await pool.query(sql);
    },
    updateUser: async (pool, user_id,username, password, role_id) =>{
        var sql = "UPDATE users SET username = ?,password = MD5(?),role_id = ? WHERE user_id = ?";
        sql = mysql.format(sql, [username,password,role_id,user_id]);
        console.log(password);

        return await pool.query(sql);
    },
    deleteUser: async (pool, user_id) => {
        var sql = "DELETE FROM users WHERE user_id = ?";
        sql = mysql.format(sql, [user_id]);

        return await pool.query(sql);
    },
    getByUserId: async (pool, user_id) => {
        var sql = "SELECT * FROM users WHERE user_id = ?";
        sql = mysql.format(sql, [user_id]);

        return await pool.query(sql);
    },
    searchUser: async (pool, data) => {
        var sql = "SELECT * FROM users a JOIN roles b ON a.role_id = b.role_id WHERE a.user_id = ? OR a.username = ? OR b.role_name = ?";
        sql = mysql.format(sql,[data,data,data]);

        return await pool.query(sql);
    }
}