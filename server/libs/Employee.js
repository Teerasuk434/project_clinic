const mysql = require('mysql');


module.exports = {
    createEmployee: async (pool, emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id , user_id, username , password) => {
        var sql ="INSERT INTO employee (emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id , user_id, username , password)"
                    + "VALUES (?, ?, ?, ?, ?, ? , ?, ? , ?)";
        sql = mysql.format(sql, [emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id , user_id, username , password]);
        console.log(sql)
        return await pool.query(sql);
    },
    updateEmployee: async (pool,emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id, emp_id, username , password) =>{
        var sql = "UPDATE employee SET emp_fname = ?, emp_lname = ?, emp_address = ?, emp_tel = ?, emp_salary = ?, emp_position_id = ? , username = ? , password = ? WHERE emp_id = ?";
        sql = mysql.format(sql, [emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id , emp_id, username , password]);
        console.log(sql);
        return await pool.query(sql);
    },
    deleteEmployee: async (pool, emp_id) => {
        var sql = "DELETE FROM employee WHERE emp_id = ?";
        sql = mysql.format(sql, [emp_id]);

        return await pool.query(sql);
    },
    getByEmpId: async (pool, emp_id) => {
        var sql = "SELECT * FROM employee WHERE emp_id = ?";
        sql = mysql.format(sql, [emp_id]);

        return await pool.query(sql);
    }
}