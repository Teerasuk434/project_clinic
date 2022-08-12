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
    searchRole: async (pool, data) => {
        var sql = "SELECT * FROM roles WHERE role_id = ? OR role_name = ?";
        sql = mysql.format(sql,[data,data]);

        return await pool.query(sql);
    }
}