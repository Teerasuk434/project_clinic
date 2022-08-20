const mysql = require('mysql');


module.exports = {
    createEmployee: async (pool, emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id, user_id) => {
        var sql ="INSERT INTO employee (emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id, user_id) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id, user_id]);

        return await pool.query(sql);
    },
    updateEmployee: async (pool, user_id,username, password, role_id,status) =>{
        if(status == true){
            var sql = "UPDATE employee SET username = ?,password = MD5(?),role_id = ? WHERE user_id = ?";
        }else{
            console.log("else");
            var sql = "UPDATE employee SET username = ?,password = ?,role_id = ? WHERE user_id = ?";
        }
        sql = mysql.format(sql, [username,password,role_id,user_id]);

        return await pool.query(sql);
    },
    deleteEmployee: async (pool, user_id) => {
        var sql = "DELETE FROM employee WHERE user_id = ?";
        sql = mysql.format(sql, [user_id]);

        return await pool.query(sql);
    },
    getByUserId: async (pool, user_id) => {
        var sql = "SELECT * FROM employee WHERE user_id = ?";
        sql = mysql.format(sql, [user_id]);

        return await pool.query(sql);
    }
}