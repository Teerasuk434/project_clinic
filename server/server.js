const util = require('util');
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");

const Account = require('./libs/Account');
const Users = require('./libs/Users');
const Roles = require('./libs/Roles');
const Service = require('./libs/Service');
const Customer = require('./libs/Customer');

const EmployeeTypes = require('./libs/EmployeeTypes');
const RoomTypes = require('./libs/RoomTypes');
const Room = require('./libs/Room');
const Pets = require('./libs/Pets');

const port = 8080;
const bodyParser = require('body-parser');
const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use('/images', express.static('images'));

var mysql = require('mysql');
const { response } = require('express');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "db_clinic"
})

pool.query = util.promisify(pool.query);

let checkAuth = (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    } else {
        token = req.body.token;
    }

    if (token) {
        jwt.verify(token, "MySecretKey", (err, decoded) => {
            if (err) {
                res.send(JSON.stringify({
                    result: false,
                    message: "ไม่ได้เข้าสู่ระบบ"
                }));
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).send("Not authorized");
    }
}

app.post("/api/authen_request", (req, res) => {
    const query = "SELECT * FROM users WHERE MD5(username) = ?";
    pool.query(query, [req.body.username], (error, results) => {
        var response;
        if (error) {
            response = {
                result: false,
                message: error.message
            };
        } else {
            if (results) {
                var payload = {username: req.body.username};
                var secretKey = "MySecretKey";
                const authToken = jwt.sign(payload.username, secretKey);
                response = {
                    result: true,
                    data: {
                        auth_token: authToken
                    }
                };
            } else {
                response = {
                    result: false,
                    message: "Username ไม่ถูกต้อง"
                };
            }
        }
        res.json(response);
    });
});

app.post("/api/access_request", (req, res) => {
    const authenSignature = req.body.auth_signature;
    const authToken = req.body.auth_token;
    var decoded = jwt.verify(authToken, "MySecretKey");

    if (decoded) {
        const query = "SELECT a.user_id, a.username, a.role_id, b.role_name "
            + "FROM users a JOIN roles b ON a.role_id = b.role_id WHERE MD5(CONCAT(username, '&', password)) =  ?";
        pool.query(query,[authenSignature], (error,results) =>{
            var response;
            if (error) {
                response = {
                    result: false,
                    message: error.message
                };
            } else {
                if (results.length) {
                    var payload = {
                        user_id: results[0].user_id, username: results[0].username,
                        role_id: results[0].role_id, role_name: results[0].role_name
                    };
                    const accessToken = jwt.sign(payload, "MySecretKey");
                    response =  { results: true, data: { access_token: accessToken, account_info: payload}};
                } else {
                    response = { result: false, message: "Username หรือ Password ไม่ถูกต้อง"}
                }
            }
            res.json(response)
        });
    }
});

app.post("/login", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    pool.query("SELECT * FROM users WHERE username = ? AND password = MD5(?)", [username, password], function(error, results, fields){
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }

        if (results.length) {
            res.json({
                result: true
            });
        } else {
            res.json({
                result:false,
                message: "ไม่พบ Username หรือ Password ไม่ถูกต้อง"
            });
        }
    });
});

app.post('/home', (req, res) =>{
    let {username} = req.body

    pool.query("SELECT * FROM users WHERE username = ?", [username], function(error, results, fields){
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }

        if (results.length) {
            res.json({
                result: true,
                data:results[0].role_id
            });
        } else {
            res.json({
                result:false,
                message: "ไม่พบ Username หรือ Password ไม่ถูกต้อง"
            });
        }
    });
})

app.post("/api/register/account", async (req, res) => {
    const input = req.body;
    try {
        var result = await Account.createAccount(pool,
            input.cust_fname, input.cust_lname, input.cust_tel, 
            input.cust_address, input.cust_gender, input.cust_birthdate,
            input.email,input.user_id);

        res.json({
            result:true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/register/user", async (req, res) => {
    const input = req.body;
    try {
            var result = await Users.createUser(pool,input.username,
                input.password,
                input.role_id);

        res.json({
            result:true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/register/user", async (req, res) => {

    pool.query("SELECT * FROM users", function(error, results, fields){
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }

        if (results.length) {
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result:false,
                message: "ไม่พบผู้ใช้งาน"
            });
        }
    });
});

app.get("/api/customer/:user_id",async (req, res) =>{
    const user_id = req.params.user_id;

    try {
        var result = await Customer.getByUserId(pool,user_id);
        res.json({
            result: true,
            data: result
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/account/editprofile", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Customer.UpdateProfile(pool,
            input.firstname,
            input.lastname,
            input.tel,
            input.address,
            input.gender,
            input.birthDate,
            input.email,
            input.custId);
        
        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/users", (req, res) =>{
    pool.query("SELECT a.user_id, a.username, a.password ,b.role_id, b.role_name "
                + "FROM users a JOIN roles b ON a.role_id = b.role_id ", function(error, results, fields){
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }

        if (results.length) {
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result:false,
                message: "ไม่พบผู้ใช้งาน"
            });
        }
    });
});

app.post("/api/user/add", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Users.createUser(pool,
            input.username, input.password,
            input.role_id);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/user/update", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Users.updateUser(pool,
            input.user_id,
            input.username,
            input.password,
            input.role_id,
            input.status);
        
        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/user/delete", checkAuth, async (req, res) => {
    const input = req.body;
    
    try {
        var result = await Users.deleteUser(pool, input.user_id);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/user/:user_id", async (req, res) => {
    const user_id = req.params.user_id;

    try {
        var result = await Users.getByUserId(pool, user_id);

        res.json({
            result: true,
            data: result
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});


app.post("/api/role/add", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Roles.createRole(pool,
            input.role_name);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/roles",checkAuth, async (req, res) => {

    pool.query("SELECT * FROM roles", function(error, results, fields){
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }

        if (results.length) {
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result:false,
                message: "ไม่พบประเภทผู้ใช้งาน"
            });
        }
    });
});

app.post("/api/role/update", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Roles.updateRole(pool,
            input.role_id,input.role_name);
        
        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/role/delete", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Roles.deleteRole(pool,
            input.role_id);
        
        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/role/:role_id", async (req, res) => {
    const role_id = req.params.role_id;

    try {
        var result = await Roles.getByRoleId(pool, role_id);

        res.json({
            result: true,
            data: result
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/service/add", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Service.createService(pool,
            input.service_name,input.cost_service,
            input.cost_deposit,input.time_spent,input.room_type_id);

        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/service",async (req, res) => {
    pool.query("SELECT * FROM service a JOIN room_type b ON a.room_type_id = b.room_type_id", function(error, results, fields){
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }
        if (results.length) {
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result:false,
                message: "ไม่พบบริการของคลินิก"
            });
        }
    });
});

app.post("/api/service/update", checkAuth, async (req, res) => {
    const input = req.body;


    try {
        var result = await Service.updateService(pool,
            input.service_id,
            input.service_name,input.cost_service,
            input.cost_deposit,input.time_spent,input.room_type_id);
        
        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/service/delete", checkAuth, async (req, res) => {
    const input = req.body;

    try {
        var result = await Service.deleteService(pool,
            input.service_id);
        
        res.json({
            result: true
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/service/:service_id", async (req, res) => {
    const service_id = req.params.service_id;

    try {
        var result = await Service.getByServiceId(pool, service_id);

        res.json({
            result: true,
            data: result
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
})


app.post("/api/service/upload/:service_id", checkAuth, (req, res) => {
    var service_id = req.params.service_id;
    var fileName;

    var storage = multer.diskStorage({
        destination: (req, file, cp) =>{
            cp(null, "images");
        },
        filename: (req, file, cp) => {
            fileName = "service" + service_id +"-"+file.originalname;
            cp(null, fileName);
        }
    });

    var upload = multer({ storage: storage}).single('file');

    upload(req, res, async (err) => {
        if (err) {
            res.json({
                result: false,
                message: err.message
            });
        } else {
            var result = Service.uploadImage(pool, service_id, fileName);

            res.json({
                result: true,
                data: fileName
            });
        }
    });
});

app.get('/api/emp_types',(req, res) => {
    pool.query("SELECT * FROM emp_type",(err, results, fields) => {
        if(err){
            res.json({
                result: false,
                message: err.message
            });
        }
        if(results.length){
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result: false,
                message: "ไม่พบประเภทพนักงาน"
            });
        }
    });
});

app.post('/api/emp_types/add',async(req, res) => {
    const input = req.body;

    try{
        var result = await EmployeeTypes.createEmptypes(pool,input.emp_position_name);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/emp_types/update',async(req, res) => {
    const input = req.body;

    try{
        var result = await EmployeeTypes.updateEmptypes(pool,input.emp_position_id, input.emp_position_name);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/emp_types/delete',async(req, res) => {
    const input = req.body;

    try{
        var result = await EmployeeTypes.deleteEmptypes(pool,input.emp_position_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/emp_types/:emp_position_id', async(req, res) => {
    const emp_position_id = req.params.emp_position_id;

    try{
        var result = await EmployeeTypes.getByEmp_position_id(pool,emp_position_id);
        res.json({
            result: true,
            data: result
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/room_type',(req, res) => {
    pool.query("SELECT * FROM room_type",(err, results, fields) => {
        if(err){
            res.json({
                result: false,
                message: err.message
            });
        }
        if(results.length){
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result: false,
                message: "ไม่พบประเภทห้องรักษา"
            });
        }
    });
});

app.post('/api/room_type/add',async(req, res) => {
    const input = req.body;

    try{
        var result = await RoomTypes.createRoomtypes(pool,input.room_type_name);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/room_type/update',async(req, res) => {
    const input = req.body;

    try{
        var result = await RoomTypes.updateRoomtypes(pool,input.room_type_id, input.room_type_name);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/room_type/delete',async(req, res) => {
    const input = req.body;

    try{
        var result = await RoomTypes.deleteRoomtypes(pool,input.room_type_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/room_type/:room_type_id', async(req, res) => {
    const room_type_id = req.params.room_type_id;

    try{
        var result = await RoomTypes.getByroom_type_id(pool,room_type_id);
        res.json({
            result: true,
            data: result
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/pets',(req, res) => {
    pool.query("SELECT * FROM pets",(err, results, fields) => {
        if(err){
            res.json({
                result: false,
                message: err.message
            });
        }
        if(results.length){
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result: false,
                message: "ไม่พบสัตว์เลี้ยง"
            });
        }
    });
});

app.post('/api/pets/add',async(req, res) => {
    const input = req.body;

    try{
        var result = await Pets.createPet(pool,
            input.pet_name,input.pet_type,
            input.pet_species,input.pet_gender,
            input.pet_age_year,input.pet_age_month,
            input.cust_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/pets/update',async(req, res) => {
    const input = req.body;

    try{
        var result = await Pets.updatePet(pool,
            input.pet_id,
            input.pet_name,input.pet_type,
            input.pet_species,input.pet_gender,
            input.pet_age_year,input.pet_age_month,
            input.cust_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/pets/delete',async(req, res) => {
    const input = req.body;

    try{
        var result = await Pets.deletePet(pool,input.pet_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/pets/:pet_id', async(req, res) => {
    const pet_id = req.params.pet_id;

    try{
        var result = await Pets.getByPetId(pool,pet_id);
        res.json({
            result: true,
            data: result
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/listpets/:user_id',async(req, res) => {
    const user_id = req.params.user_id;
    try{

        var result = await Customer.getByUserId(pool,user_id)
        let cust_id = result[0].cust_id
        var result2 = await Pets.getListPets(pool,cust_id);

        res.json({
            result: true,
            data: result2
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});


app.get('/api/room',(req, res) => {
    pool.query("SELECT * FROM rooms",(err, results, fields) => {
        if(err){
            res.json({
                result: false,
                message: err.message
            });
        }
        if(results.length){
            res.json({
                result: true,
                data: results
            });
        } else {
            res.json({
                result: false,
                message: "ไม่พบข้อมูลห้องรักษา"
            });
        }
    });
});

app.post('/api/room/add',async(req, res) => {
    const input = req.body;

    try{
        var result = await Room.createRoom(pool,input.room_name,input.room_type_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/room/update',async(req, res) => {
    const input = req.body;

    try{
        var result = await Room.updateRoom(pool,input.room_id, input.room_name,input.room_type_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post('/api/room/delete',async(req, res) => {
    const input = req.body;

    try{
        var result = await Room.deleteRoom(pool,input.room_id);
        res.json({
            result: true
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/room/:room_id', async(req, res) => {
    const room_id = req.params.room_id;
    try{
        var result = await Room.getByroom_id(pool,room_id);
        res.json({
            result: true,
            data: result
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});


app.listen(port, () => {
    console.log("Running");
});

