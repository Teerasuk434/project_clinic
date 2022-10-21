const mysql = require('mysql');

module.exports = {
    createRoom: async (pool,room_name,room_type_id) => {
        var sql = "INSERT INTO rooms (room_name,room_type_id) VALUES (?,?)";
        sql = mysql.format(sql,[room_name,room_type_id]);
        return await pool.query(sql);
    },

    updateRoom: async (pool,room_id,room_name,room_type_id) => {
        var sql = "UPDATE rooms SET room_name = ?, room_type_id = ? WHERE room_id = ?";
        sql = mysql.format(sql,[room_name,room_type_id,room_id]);
        return await pool.query(sql);
    },

    deleteRoom: async (pool,room_id) => {
        var sql = "DELETE FROM rooms WHERE room_id = ?";
        sql = mysql.format(sql,[room_id]);

        return await pool.query(sql);
    },

    getByroom_id: async(pool,room_id) =>{
        var sql = "SELECT * FROM rooms WHERE room_id = ?";
        sql = mysql.format(sql,[room_id]);
        return await pool.query(sql);
    },
    getByRoomType: async(pool,room_type_id) =>{
        var sql = "SELECT * FROM rooms WHERE room_type_id = ?";
        sql = mysql.format(sql,[room_type_id]);
        return await pool.query(sql)
    },

    isDuplicate: async (pool,room_name,room_id) => {
        var sql = "SELECT * FROM rooms WHERE room_name = ?";

        if(room_id != null) {
            sql = sql + "AND room_id <> ?";
            sql = mysql.format(sql, [room_name, room_id])
        } else {
            sql = mysql.format(sql, [room_name]);
        }
        var result = await pool.query(sql);
        if(result.length > 0) {
            return true;
        }
        return false;
    },
    isUsed: async(pool, room_id) => {
        var sql = `SELECT * FROM rooms a JOIN appointment b ON a.room_id = b.room_id  WHERE a.room_id = ?`;
        
        sql = mysql.format(sql, [room_id])

        var result = await pool.query(sql);

        if(result.length > 0){
            return true
        }else{
            return false;
        }
    }
};