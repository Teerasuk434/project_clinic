const mysql = require('mysql');

module.exports = {
    createRoomtypes: async (pool,room_type_name) => {
        var sql = "INSERT INTO room_type(room_type_name) VALUES (?)";
        sql = mysql.format(sql,[room_type_name]);

        return await pool.query(sql);
    },

    updateRoomtypes: async (pool,room_type_id,room_type_name) => {
        var sql = "UPDATE room_type SET room_type_name = ? WHERE room_type_id = ?";
        sql = mysql.format(sql,[room_type_name,room_type_id]);

        

        return await pool.query(sql);
    },

    deleteRoomtypes: async (pool,room_type_id) => {
        var sql = "DELETE FROM room_type WHERE room_type_id = ?";
        sql = mysql.format(sql,[room_type_id]);

        return await pool.query(sql);
    },

    getByroom_type_id: async(pool,room_type_id) =>{
        var sql = "SELECT * FROM room_type WHERE room_type_id = ?";
        sql = mysql.format(sql,[room_type_id]);

        return await pool.query(sql);
    },

    isDupicate: async (pool,room_type_name, room_type_id) => {
        var sql = "SELECT * FROM room_type WHERE room_type_name = ?";

        if(room_id != null) {
            sql = sql + "AND room_type_id <> ?";
            sql = mysql.format(sql, [room_type_name, room_type_id])
        } else {
            sql = mysql.format(sql, [room_type_name]);
        }
        var result = await pool.query(sql);
        if(result.length > 0) {
            return true;
        }
        
        return false;
    }
};