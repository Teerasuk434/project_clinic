const mysql = require('mysql');

module.exports = {
    addSchedule: async (pool, emp_id, appoint_id, room_id, date, time) =>{
        var sql = "INSERT INTO schedules (emp_id,appoint_id,room_id,date,time) "
                    + "VALUES (?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [emp_id, appoint_id, room_id, date, time]);
        return await pool.query(sql);
    },
    findByAppointment: async (pool, appoint_id) =>{
        var sql = `SELECT c.* FROM schedules a 
                    JOIN appointment b  ON a.appoint_id = b.appoint_id
                    JOIN employee c ON a.emp_id = c.emp_id
                    WHERE b.appoint_id = 4`
        sql = mysql.format(sql, [appoint_id]);
        return await pool.query(sql);
    }
}