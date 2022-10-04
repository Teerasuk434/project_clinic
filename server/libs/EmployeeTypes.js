const mysql = require('mysql');

module.exports = {
    createEmptypes: async (pool,emp_position_name) => {
        var sql = "INSERT INTO emp_type(emp_position_name) VALUES (?)";
        sql = mysql.format(sql,[emp_position_name]);

        return await pool.query(sql);
    },

    updateEmptypes: async (pool,emp_position_id,emp_position_name) => {
        var sql = "UPDATE emp_type SET emp_position_name = ? WHERE emp_position_id = ?";
        sql = mysql.format(sql,[emp_position_name,emp_position_id]);
        console.log(sql);
        return await pool.query(sql);
    },

    deleteEmptypes: async (pool,emp_position_id) => {
        var sql = "DELETE FROM emp_type WHERE emp_position_id = ?";
        sql = mysql.format(sql,[emp_position_id]);

        return await pool.query(sql);
    },

    getByEmp_position_id: async(pool,emp_position_id) =>{
        var sql = "SELECT * FROM emp_type WHERE emp_position_id = ?";
        sql = mysql.format(sql,[emp_position_id]);

        return await pool.query(sql);
    },
    isDuplicate: async (pool,emp_position_id,emp_position_name) => {
        var sql = "SELECT * FROM emp_type WHERE emp_position_name = ?";
        if(emp_position_id != null) {
            sql = sql + "AND emp_position_id <> ?";
            sql = mysql.format(sql, [emp_position_name,emp_position_id ])
        } else {
            sql = mysql.format(sql, [emp_position_name]);
        }
        var result = await pool.query(sql);
        if(result.length > 0) {
            return true;
        }
        
        return false;
    }
};