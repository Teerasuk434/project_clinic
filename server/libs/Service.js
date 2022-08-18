const mysql = require('mysql');

module.exports = {
    createService: async (pool, service_name,cost_service,cost_deposit,time_spent,room_type_id) => {
        var sql ="INSERT INTO service (service_name, cost_service, cost_deposit, time_spent,room_type_id) "
                    + "VALUES (?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [service_name, cost_service, cost_deposit, time_spent,room_type_id]);

        return await pool.query(sql);
    },
    updateService: async (pool, service_id,service_name,cost_service,cost_deposit,time_spent,room_type_id) =>{
        var sql = "UPDATE service SET service_name = ?, cost_service = ?, cost_deposit = ?, time_spent = ?, room_type_id = ? WHERE service_id = ?";
        sql = mysql.format(sql, [service_name,cost_service,cost_deposit,time_spent,room_type_id,service_id]);
        console.log(sql)

        return await pool.query(sql);
    },
    deleteService: async (pool, service_id) => {
        var sql = "DELETE FROM service WHERE service_id = ?";
        sql = mysql.format(sql, [service_id]);

        return await pool.query(sql);
    },
    getByServiceId: async (pool, service_id) => {
        var sql = "SELECT * FROM service WHERE service_id = ?";
        sql = mysql.format(sql, [service_id]);

        return await pool.query(sql);
    },
    uploadImage: async (pool, service_id, fileName) => {
        var sql = "UPDATE service SET service_image = ? WHERE service_id = ?";
        sql = mysql.format(sql, [fileName,service_id]);
        return await pool.query(sql);
    }

}