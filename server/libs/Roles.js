const mysql = require('mysql');

module.exports = {
    createRole: async (pool, role_name) => {
        var sql ="INSERT INTO roles (role_name) "
                    + "VALUES (?)";
        sql = mysql.format(sql, [role_name]);

        return await pool.query(sql);
    },
    updateRole: async (pool, role_id, role_name) =>{
        var sql = "UPDATE roles SET role_name = ? WHERE role_id = ?";
        sql = mysql.format(sql, [role_name,role_id]);

        return await pool.query(sql);
    },
    deleteRole: async (pool, role_id) => {
        var sql = "DELETE FROM roles WHERE role_id = ?";
        sql = mysql.format(sql, [role_id]);

        return await pool.query(sql);
    },
    getByRoleId: async (pool, role_id) => {
        var sql = "SELECT * FROM roles WHERE role_id = ?";
        sql = mysql.format(sql, [role_id]);

        return await pool.query(sql);
    },
    isDuplicate: async (pool,role_name,role_id) => {
        var sql = "SELECT * FROM roles WHERE role_name = ?";
        if(role_id != null) {
            sql = sql + "AND role_id <> ?";
            sql = mysql.format(sql, [role_name, role_id])
        } else {
            sql = mysql.format(sql, [role_name]);
        }
        var result = await pool.query(sql);
        if(result.length > 0) {
            return true;
        }
        
        return false;
    }
}