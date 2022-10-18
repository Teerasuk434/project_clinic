const mysql = require('mysql');

module.exports = {
    createUser: async (pool, username, password, role_id) => {
        var sql ="INSERT INTO users (username, password, role_id) "
                    + "VALUES (?, MD5(?), ?)";
        sql = mysql.format(sql, [username, password, role_id]);

        return await pool.query(sql);
    },
    createUserGoogle: async (pool, username, role_id) => {
        var sql = "INSERT INTO users (username, role_id) VALUES (?,?)";
        sql = mysql.format(sql,[username,role_id])

        return await pool.query(sql);
    },
    updateUser: async (pool, user_id,username, password, role_id,status) =>{
        if(status == true){
            var sql = "UPDATE users SET username = ?,password = MD5(?),role_id = ? WHERE user_id = ?";
        }else{
            var sql = "UPDATE users SET username = ?,password = ?,role_id = ? WHERE user_id = ?";
        }
        sql = mysql.format(sql, [username,password,role_id,user_id]);

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
    getByUserName: async (pool, username) =>{
        var sql = "SELECT * FROM users WHERE username = ?";
        sql = mysql.format(sql,[username]);

        var result = await pool.query(sql);

        if(result.length > 0){
            return true;
        }

        return false;
    },
    updatePassword : async (pool, password, user_id) => {
        var sql = "UPDATE users SET password = MD5(?) WHERE user_id = ?";
        sql = mysql.format(sql, [password,user_id]);

        return await pool.query(sql);
    },
    isDuplicate: async (pool, username, user_id) => {
        var sql = "SELECT * FROM users WHERE username = ?";

        if (user_id != null){
            sql = sql + "AND user_id <> ?";
            sql = mysql.format(sql, [username, user_id])
        }else {
            sql = mysql.format(sql, [username])
        }

        var result = await pool.query(sql);

        if(result.length > 0){
            return true;
        }

        return false;
    }
}