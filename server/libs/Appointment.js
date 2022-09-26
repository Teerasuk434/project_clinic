const mysql = require('mysql');

module.exports = {
    addAppointment: async (pool, symtoms,date,time,time_end,appoint_status,note,pet_id,service_id,room_id) =>{
        var sql = "INSERT INTO appointment (symtoms, date, time, time_end, status_id, note, pet_id, service_id, room_id) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [symtoms,date,time,time_end,appoint_status,note,pet_id,service_id,room_id]);
        return await pool.query(sql);
    },  
    uploadImage: async (pool, appoint_new_id, fileName) => {
        var sql = "UPDATE appointment SET payment_image = ? WHERE appoint_id = ?";
        sql = mysql.format(sql, [fileName,appoint_new_id]);
        console.log(sql);
        return await pool.query(sql);
    },
    updateStatus: async (pool, appoint_status, appoint_id, appoint_note) => {
        var sql = "UPDATE appointment SET status_id = ? , note = ? WHERE appoint_id = ?";
        sql = mysql.format(sql, [appoint_status,appoint_note,appoint_id]);
        console.log(sql);
        return await pool.query(sql);
    },
    getListAppointment: async (pool, cust_id) => {
        var sql = `SELECT a.*,b.pet_name,c.service_name,d.room_name,e.status_name,c.time_spent
                        FROM appointment a 
                        JOIN pets b ON a.pet_id = b.pet_id 
                        JOIN service c ON a.service_id = c.service_id
                        JOIN rooms d ON a.room_id = d.room_id
                        JOIN appoint_status e ON a.status_id = e.status_id
                        WHERE b.cust_id = ? AND a.status_id = 1 OR a.status_id = 2 OR a.status_id = 3
                        GROUP BY a.appoint_id`;
        sql = mysql.format(sql, [cust_id]);
        return await pool.query(sql);
    },
    getHistoryAppointment: async (pool,cust_id) => {
        var sql = `SELECT  
                a.appoint_id,
                a.symtoms,
                a.date,
                a.time,
                a.time_end,
                a.payment_image,
                a.status_id,
                a.note,
                b.*,
                c.cust_fname,
                c.cust_lname,
                c.cust_tel,
                c.email,
                d.service_id,
                d.service_name,
                d.cost_deposit,
                d.time_spent,
                e.*,
                f.status_name
                FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
                JOIN customer_information c ON b.cust_id = c.cust_id
                JOIN service d ON a.service_id = d.service_id
                JOIN rooms e ON a.room_id = e.room_id
                JOIN appoint_status f ON a.status_id = f.status_id
                WHERE a.status_id = 4 OR a.status_id = 5 OR a.status_id = 6
                AND b.cust_id = ?
                GROUP BY a.appoint_id`
        sql = mysql.format(sql,cust_id);
        return await pool.query(sql);
    },
    updateAppointment: async (pool, pet_id,symtoms,payment_image,status_id, appoint_id) => {
        var sql = "UPDATE appointment SET pet_id = ? , symtoms = ? , payment_image = ? , status_id = ? WHERE appoint_id = ?";
        sql = mysql.format(sql, [pet_id,symtoms,payment_image,status_id, appoint_id]);
        console.log(sql)
        return await pool.query(sql);
    },
    checkPassword: async (pool, user_id,password) => {
        var sql = "SELECT * FROM users WHERE user_id = ? AND password = MD5(?)";
        sql = mysql.format(sql, [user_id,password]);
        console.log(sql);
        return await pool.query(sql);
    },
    getAmountAppointByService: async (pool, date) =>{
        var sql = `SELECT a.service_id,b.service_name,
           COUNT(a.service_id) as count FROM appointment a
           JOIN service b on a.service_id = b.service_id
           WHERE a.date = "2022-09-28"
           GROUP BY
           a.service_id,
           b.service_name;`
        sql = mysql.format(sql, [date]);
        return await pool.query(sql);
    }
}