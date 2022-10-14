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
        var sql = `SELECT a.*,b.pet_name,c.service_name,d.room_name,e.status_name,
                    c.time_spent,f.cust_fname,f.cust_lname,CONCAT(h.emp_fname," ",h.emp_lname) AS employee_fullname
                    FROM appointment a 
                    JOIN pets b ON a.pet_id = b.pet_id 
                    JOIN service c ON a.service_id = c.service_id
                    JOIN rooms d ON a.room_id = d.room_id
                    JOIN appoint_status e ON a.status_id = e.status_id
                    JOIN customer_information f ON b.cust_id = f.cust_id
                    LEFT JOIN schedules g ON a.appoint_id = g.appoint_id
                    LEFT JOIN employee h ON g.emp_id = h.emp_id
                    WHERE b.cust_id = ? AND a.status_id <=3
                    GROUP BY a.appoint_id`;
        sql = mysql.format(sql, [cust_id]);
        return await pool.query(sql);
    },
    getHistoryAppointment: async (pool,cust_id) => {
        var sql = `SELECT  
                a.*,
                b.*,
                c.cust_fname,
                c.cust_lname,
                c.cust_tel,
                c.email,
                d.service_name,
                d.cost_deposit,
                d.time_spent,
                e.*,
                f.status_name,
                CONCAT(h.emp_fname," ",h.emp_lname) AS employee_fullname
                FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
                JOIN customer_information c ON b.cust_id = c.cust_id
                JOIN service d ON a.service_id = d.service_id
                JOIN rooms e ON a.room_id = e.room_id
                JOIN appoint_status f ON a.status_id = f.status_id
                JOIN schedules g ON a.appoint_id = g.appoint_id
                JOIN employee h ON g.emp_id = h.emp_id
                WHERE b.cust_id = ? AND a.status_id >=4
                GROUP BY a.appoint_id`
        sql = mysql.format(sql,cust_id);
        return await pool.query(sql);
    },
    updateAppointment: async (pool, pet_id,symtoms,payment_image,status_id, appoint_id) => {
        var sql = "UPDATE appointment SET pet_id = ? , symtoms = ? , payment_image = ? , status_id = ? WHERE appoint_id = ?";
        sql = mysql.format(sql, [pet_id,symtoms,payment_image,status_id, appoint_id]);
        return await pool.query(sql);
    },
    checkPassword: async (pool, user_id,password) => {
        var sql = "SELECT * FROM users WHERE user_id = ? AND password = MD5(?)";
        sql = mysql.format(sql, [user_id,password]);
        return await pool.query(sql);
    },
    getReportByService: async (pool, service_id, dateRange) =>{
        var sql;

        if(dateRange == 0){
            sql = `SELECT date,COUNT(*) as count FROM appointment
                        WHERE WEEKOFYEAR(date)=WEEKOFYEAR(CURDATE())
                        AND service_id = ? AND status_id = 5
                        GROUP BY date`
        }else if(dateRange == 1){
            sql = `SELECT date,COUNT(*) as count FROM appointment 
                        WHERE date between  DATE_FORMAT(CURDATE() ,'%Y-%m-01') AND LAST_DAY(CURDATE())
                        AND service_id = ? AND status_id = 5
                        GROUP BY date`
        }else if(dateRange == 2){
            sql = `SELECT date_format(date,'%M') as date,COUNT(*) as count
                        FROM appointment
                        WHERE service_id = ? AND status_id = 5
                        GROUP BY year(date),month(date)`
        }     

        sql = mysql.format(sql, [service_id]);
        return await pool.query(sql);
    },

    getCountAppointmentByAppointment: async (pool, dateRange ) => {
        var sql ;
        console.log(dateRange)
        if(dateRange == 0){
        sql = `SELECT service_name, COUNT(*) as appointment_count 
                FROM appointment a
                JOIN service b ON a.service_id = b.service_id
                WHERE WEEKOFYEAR(a.date)=WEEKOFYEAR(CURDATE()) 
                AND status_id = 5 GROUP BY service_name`
        
        }else if(dateRange == 1) {
        
        sql = `SELECT service_name, COUNT(*) as appointment_count 
                FROM appointment a
                JOIN service b ON a.service_id = b.service_id
                WHERE date BETWEEN DATE_FORMAT(CURDATE() ,'%Y-%m-01') AND LAST_DAY(CURDATE()) 
                AND status_id = 5 GROUP BY service_name`

        }else if(dateRange == 2) {
            sql =  `SELECT service_name, COUNT(*) as appointment_count 
            FROM appointment a
            JOIN service b ON a.service_id = b.service_id
            WHERE status_id = 5
            GROUP BY service_name`
            
        }
        sql = mysql.format(sql);
        

        return await pool.query(sql);
    },


}

    

    