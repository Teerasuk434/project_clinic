const mysql = require('mysql');

module.exports = {
    createAccount: async (pool, cust_fname, cust_lname, cust_tel, cust_address, cust_gender, cust_birthdate, email, user_id) =>{
        var sql = "INSERT INTO customer_information (cust_fname, cust_lname, cust_tel, cust_address, cust_gender, cust_birthdate, email, user_id) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [cust_fname, cust_lname, cust_tel, cust_address, 
            cust_gender, cust_birthdate, email, user_id]);

        return await pool.query(sql);
    },
    isDuplicate: async (pool, username) => {
        var sql = "SELECT * FROM users WHERE username = ?";
        sql = mysql.format(sql, [username])

        var result = await pool.query(sql);

        if(result.length > 0){
            return true;
        }

        return false;
    }

}