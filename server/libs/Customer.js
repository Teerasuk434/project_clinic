const mysql = require('mysql');

module.exports = {
    getByUserId: async (pool, user_id) => {
        var sql = "SELECT * FROM customer_information WHERE user_id = ?";
        sql = mysql.format(sql, [user_id]);
        return await pool.query(sql);
    },
    UpdateProfile: async (pool, firstname, lastname, tel, address, gender, birthDate, email, custId) => {
        var sql = "UPDATE customer_information SET cust_fname = ?, cust_lname = ?, cust_tel = ? , cust_address = ?, cust_gender = ?, cust_birthdate = ?, email = ? WHERE cust_id = ?";
        sql = mysql.format(sql, [firstname, lastname, tel, address, gender, birthDate, email,custId]);
        return await pool.query(sql);
    },
    updateScore: async (pool,cust_id) => {
        var sql = "UPDATE customer_information SET appoint_score = appoint_score+1 WHERE cust_id = ?";
        sql = mysql.format(sql,[cust_id]);
        return await pool.query(sql);
    },
    getAppointScore: async (pool,cust_id) => {
        var sql = "SELECT appoint_score FROM customer_information WHERE cust_id = ?";
        sql = mysql.format(sql,[cust_id]);
        return await pool.query(sql);
    }
}