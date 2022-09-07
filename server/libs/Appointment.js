const mysql = require('mysql');

module.exports = {
    addAppointment: async (pool, symtoms,date,time,payment_image,appoint_status,note,pet_id,service_id,room_id) =>{
        var sql = "INSERT INTO appointment (symtoms, date, time, payment_image, appoint_status, note, pet_id, service_id, room_id) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [symtoms,date,time,payment_image,appoint_status,note,pet_id,service_id,room_id]);

        return await pool.query(sql);
    },  
    uploadImage: async (pool, appoint_new_id, fileName) => {
        var sql = "UPDATE appointment SET payment_image = ? WHERE appoint_id = ?";
        sql = mysql.format(sql, [fileName,appoint_new_id]);
    console.log(sql);

        return await pool.query(sql);
    }
}