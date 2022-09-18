const mysql = require('mysql');

module.exports = {
    addAppointment: async (pool, symtoms,date,time,appoint_status,note,pet_id,service_id,room_id) =>{
        var sql = "INSERT INTO appointment (symtoms, date, time, appoint_status, note, pet_id, service_id, room_id) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [symtoms,date,time,appoint_status,note,pet_id,service_id,room_id]);
        console.log(sql)
        return await pool.query(sql);
    },  
    uploadImage: async (pool, appoint_new_id, fileName) => {
        var sql = "UPDATE appointment SET payment_image = ? WHERE appoint_id = ?";
        sql = mysql.format(sql, [fileName,appoint_new_id]);
        return await pool.query(sql);
    },
    updateStatus: async (pool, appoint_status, appoint_id) => {
        var sql = "UPDATE appointment SET appoint_status = ? WHERE appoint_id = ?";
        sql = mysql.format(sql, [appoint_status,appoint_id]);
        return await pool.query(sql);
    },
    getListAppointment: async (pool, cust_id) => {
        var sql = `SELECT a.*,b.pet_name,c.service_name,d.room_name
                        FROM appointment a 
                        JOIN pets b 
                        ON a.pet_id = b.pet_id 
                        JOIN service c 
                        ON a.service_id = c.service_id
                        JOIN rooms d
                        ON a.room_id = d.room_id
                        WHERE b.cust_id = ?`;
        sql = mysql.format(sql, [cust_id]);
        return await pool.query(sql);
    }
}