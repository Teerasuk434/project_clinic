const mysql = require('mysql');


module.exports = {
    createEmployee: async (pool, emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id ) => {
        var sql ="INSERT INTO employee (emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id)"
                    + "VALUES (?, ?, ?, ?, ?, ?)";
        sql = mysql.format(sql, [emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id]);
        console.log(sql)
        return await pool.query(sql);
    },
    updateEmployee: async (pool,emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id, emp_id) =>{
        var sql = "UPDATE employee SET emp_fname = ?, emp_lname = ?, emp_address = ?, emp_tel = ?, emp_salary = ?, emp_position_id = ?  WHERE emp_id = ?";
        sql = mysql.format(sql, [emp_fname, emp_lname, emp_address, emp_tel, emp_salary, emp_position_id , emp_id]);
        console.log(sql);
        return await pool.query(sql);
    },
    updateEmployeeUser: async (pool,user_id,emp_id) =>{
        var sql = "UPDATE employee SET user_id = ? WHERE emp_id = ?";
        sql = mysql.format(sql,[user_id,emp_id])
        return await pool.query(sql);

    }
    ,deleteEmployee: async (pool, emp_id) => {
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