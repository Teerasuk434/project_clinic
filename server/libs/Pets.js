const mysql = require('mysql');

module.exports = {
    createPet: async (pool, pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month, image, cust_id) => {
        var sql ="INSERT INTO pets (pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month, image, cust_id) "
                    + "VALUES (?,?,?,?,?,?,?,?)";
        sql = mysql.format(sql, [pet_name, pet_type, pet_species, pet_gender, pet_age_year, pet_age_month,image, cust_id]);

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
    ,
    getListPets: async (pool, cust_id) => {
        var sql = "SELECT a.* FROM pets a JOIN customer_information b ON a.cust_id = b.cust_id WHERE a.cust_id = ?";
        sql = mysql.format(sql, [cust_id]);
        return await pool.query(sql);
    },
    uploadImage: async (pool, pet_id, fileName) => {
        var sql = "UPDATE pets SET image = ? WHERE pet_id = ?";
        sql = mysql.format(sql, [fileName,pet_id]);

        console.log(sql);
        return await pool.query(sql);
    },
}