const mysql = require('mysql');

module.exports = {
    createPet: async (pool, pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month, cust_id) => {
        var sql ="INSERT INTO pets (pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month, cust_id) "
                    + "VALUES (?,?,?,?,?,?,?)";
        sql = mysql.format(sql, [pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month, cust_id]);

        return await pool.query(sql);
    },
    updatePet: async (pool, pet_id, pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month) =>{
        var sql = "UPDATE pets SET pet_name = ?, pet_type = ?, pet_species = ?, pet_gender = ?, pet_age_year = ?, pet_age_month = ? WHERE pet_id = ?";
        sql = mysql.format(sql, [pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month, pet_id]);
        console.log(sql);
        return await pool.query(sql);
    },
    deletePet: async (pool, pet_id) => {
        var sql = "DELETE FROM pets WHERE pet_id = ?";
        sql = mysql.format(sql, [pet_id]);

        return await pool.query(sql);
    },
    getByPetId: async (pool, pet_id) => {
        var sql = "SELECT * FROM pets WHERE pet_id = ?";
        sql = mysql.format(sql, [pet_id]);

        return await pool.query(sql);
    }
}