const mysql = require('mysql');

module.exports = {
    getByUserId: async (pool, user_id) => {
        var sql = "SELECT * FROM customer_information WHERE user_id = ?";
        sql = mysql.format(sql, [user_id]);
        return await pool.query(sql);
    }
}