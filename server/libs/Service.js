const mysql = require('mysql');

module.exports = {
    createService: async (pool, service_name,cost_service,cost_deposit,time_spent,room_type_id,service_image) => {
        var sql ="INSERT INTO service (service_name, cost_service, cost_deposit, time_spent,service_image,room_type_id) "
                    + "VALUES (?, ?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [service_name, cost_service, cost_deposit, time_spent,service_image,room_type_id]);

        return await pool.query(sql);
    },
    updateService: async (pool, service_id,service_name,cost_service,cost_deposit,time_spent,room_type_id,service_image) =>{
        var sql = "UPDATE service SET service_name = ?, cost_service = ?, cost_deposit = ?, time_spent = ?, service_image = ?, room_type_id = ? WHERE service_id = ?";
        sql = mysql.format(sql, [service_name,cost_service,cost_deposit,time_spent,service_image,room_type_id,service_id]);

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
    },
    isDuplicate: async (pool, service_name, service_id) => {
        var sql = "SELECT * FROM service WHERE service_name = ?";

        if (service_id != null){
            sql = sql + "AND service_id <> ?";
            sql = mysql.format(sql, [service_name, service_id])
        }else {
            sql = mysql.format(sql, [service_name])
        }

        var result = await pool.query(sql);

        if(result.length > 0){
            return true;
        }

        return false;
    },

    getByService: async (pool, service_name , cost_service , time_spent) => {
        var sql = "SELECT service_name , cost_service , time_spent FROM service";
        sql = mysql.format(sql, [service_name , cost_service , time_spent]);

        return await pool.query(sql);
    }

}