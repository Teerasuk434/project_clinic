const mysql = require('mysql');

module.exports = {
    addSchedule: async (pool, emp_id, appoint_id, room_id, date, time) =>{
        var sql = "INSERT INTO schedules (emp_id,appoint_id,room_id,date,time) "
                    + "VALUES (?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [emp_id, appoint_id, room_id, date, time]);
        console.log(sql);
        return await pool.query(sql);
    }
}