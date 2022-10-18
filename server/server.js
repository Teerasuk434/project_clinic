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
const Employee = require('./libs/Employee');
const Appointment = require('./libs/Appointment')
const Schedule = require('./libs/Schedule')

const port = 8080;
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use('/images', express.static('images'));
app.use('/images/pets', express.static('images/pets'));


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

    let sql;

    if(req.body.checkGoogle){
        sql = "SELECT a.user_id, a.username, a.role_id, b.role_name "
        + "FROM users a JOIN roles b ON a.role_id = b.role_id WHERE MD5(username) =  ?";
    }else {
        sql = "SELECT a.user_id, a.username, a.role_id, b.role_name "
        + "FROM users a JOIN roles b ON a.role_id = b.role_id WHERE MD5(CONCAT(username, '&', password)) =  ?";
    }

    if (decoded) {
        pool.query(sql,[authenSignature], (error,results) =>{
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
        var result = await Account.isDuplicate(pool, input.username);

        if(!result){
            var result_user = await Users.createUser(pool,input.username,input.password,input.role_id);

            if(result_user){
                await Account.createAccount(pool,
                    input.cust_fname, input.cust_lname, input.cust_tel, 
                    input.cust_address, input.cust_gender, input.cust_birthdate,
                    input.email,result_user.insertId);
            }

            res.json({
                result: true
            });
        }else{
            res.json({
                result:false,
                message: "ชื่อผู้ใช้งานนี้มีในระบบแล้ว"
            })
        }
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/account/google_account", async (req, res) => {
    const input = req.body;
    try {
        var result = await Users.createUserGoogle(pool,input.username,input.role_id);

        if(result){
            await Account.createGoogleAccount(pool,
                input.cust_fname, 
                input.cust_lname,
                input.email,
                result.insertId);
        }
        res.json({
            result: true,
            user_id:result.insertId
        });

    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get("/api/account/:username",async (req, res) =>{
    const username = req.params.username;

    try {
        var result = await Users.getByUserName(pool,username);

        res.json({
            result: result
        });
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
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

app.post('/api/account/appointments/:user_id',async(req, res) => {
    const user_id = req.params.user_id;
    try{

        var result = await Customer.getByUserId(pool,user_id)
        let cust_id = result[0].cust_id
        var result2 = await Appointment.getListAppointment(pool,cust_id);

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

app.post('/api/account/history-appointment/:user_id',async(req, res) => {
    const user_id = req.params.user_id
    console.log(user_id)
    try{
        var result = await Customer.getByUserId(pool,user_id)
        let cust_id = result[0].cust_id

        var result2 = await Appointment.getHistoryAppointment(pool,cust_id);

        res.json({
            result: true,
            data:result2
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/account/edit-appointment", checkAuth, async (req, res) => {
    const input = req.body;
    console.log(input)

    try {
        var result = await Appointment.updateAppointment(pool,
            input.pet_id,
            input.symtoms,
            input.payment_image,
            input.status_id, 
            input.appoint_id);
        
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

app.post("/api/account/checkpassword", checkAuth, async (req, res) =>{
    const input = req.body;
    try {
        var result = await Appointment.checkPassword(pool,input.user_id,input.password)
        let check_pwd_status = false;
        if(result.length){
            check_pwd_status = true;
        }
        res.json({
            result:true,
            data: check_pwd_status
        })
    } catch (ex) {
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/account/reset-password", checkAuth, async (req, res) =>{
    const input = req.body;
    try {
        var result = await Users.updatePassword(pool,input.password,input.user_id)

        res.json({
            result:true
        })
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
    console.log(input)
    try {

        var result = await Users.isDuplicate(pool, input.username, null);

        if(!result){
            await Users.createUser(pool,
                input.username, input.password,
                input.role_id);

            res.json({
                result: true
            });
        }else{
            res.json({
                result:false,
                message: "ชื่อบริการนี้มีในระบบแล้ว"
            })
        }
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

        var result = await Users.isDuplicate(pool, input.username, input.user_id);

        if(!result){
            await Users.updateUser(pool,
                input.user_id,
                input.username,
                input.password,
                input.role_id,
                input.status);
            res.json({
                result: true
            });
        }else{
            res.json({
                result:false,
                message: "ชื่อบริการนี้มีในระบบแล้ว"
            })
        }
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
        var result = await Roles.isDuplicate(pool,input.role_name);

        if(!result){
            await Roles.createRole(pool,
                input.role_name);
            res.json({
                result: true
            });
        } else {
            res.json({
                result: false,
                message: "ชื่อประเภทผู้ใช้ซ้ำ"
            });
        }
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
        var result = await Roles.isDuplicate(pool,input.role_name, input.role_id);

         if(!result){
            await Roles.updateRole(pool,
            input.role_id,input.role_name);
        res.json({
            result: true
        });
    }else {
        res.json({
            result:false,
            message: "ชื่อประเภทผู้ใช้ซ้ำ"
        })
    }
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
        var result = await Service.isDuplicate(pool, input.service_name, null);

        if(!result) {
            await Service.createService(pool,
                input.service_name,input.cost_service,
                input.cost_deposit,input.time_spent,
                input.room_type_id,input.service_image);

            res.json({
                result: true
            });
        }else{
            res.json({
                result:false,
                message: "ชื่อบริการนี้มีในระบบแล้ว"
            })
        }

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

        var result = await Service.isDuplicate(pool, input.service_name, input.service_id);

        if(!result) {
            await Service.updateService(pool,
                input.service_id,
                input.service_name,input.cost_service,
                input.cost_deposit,input.time_spent,
                input.room_type_id,input.service_image);

            res.json({
                result: true
            });
        }else{
            res.json({
                result:false,
                message: "ชื่อบริการนี้มีในระบบแล้ว"
            })
        }
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

        var result = await Service.isUsed(pool,input.service_id);

        if(!result){
            await Service.deleteService(pool,input.service_id);
        
            res.json({
                result: true
            });
        }else{
            res.json({
                result:false,
                message: "ข้อมูลนี้มีการใช้งานอยู่"
            });
        }
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

        var result = await EmployeeTypes.isDuplicate(pool,
            input.emp_position_name,null);
        
        if(!result) {
            await EmployeeTypes.createEmptypes(pool,
                input.emp_position_name);
            res.json({
                result: true
            });
        }else{
            res.json({
                result: false,
                message: "ชื่อประเภทพนักงานซ้ำ"
            });
        }
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
        var result = await EmployeeTypes.isDuplicate(pool,
            
            input.emp_position_name,
            input.emp_position_id);

        if(!result){
            await EmployeeTypes.updateEmptypes(pool,
                input.emp_position_id, 
                input.emp_position_name);
            res.json({
                result: true
            });
        } else{
            res.json({
                result: false,
                message: "ชื่อประเภทพนักงานซ้ำ"
            });
        }
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
        var result = await EmployeeTypes.isUsed(pool,
            input.emp_position_id);
            console.log(result)
        if(!result){
            await EmployeeTypes.deleteEmptypes(pool,input.emp_position_id);
            res.json({
                result: true
            });
        }else{
            res.json({
                result: false,
                message: "ข้อมูลนี้มีการใช้งานอยู่"
            });
        }
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
        var result = await RoomTypes.isDuplicate(pool, input.room_type_name, null);

        if(!result) {
            await RoomTypes.createRoomtypes(pool,
                input.room_type_name);

            res.json({
                result: true
            });
        } else {
            res.json({
                result: false,
                message: "ชื่อประเภทห้องรักษาซ้ำ"
            });
        }
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
        var result = await RoomTypes.isDuplicate(pool, input.room_type_name,input.room_type_id, null);
        if(!result){
            await RoomTypes.updateRoomtypes(pool, input.room_type_name,input.room_type_id);
            res.json({
                result: true
            });
        } else{
            res.json({
                result: false,
                message: "ชื่อประเภทห้องรักษาซ้ำ"
            })
        }
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
        var result = await RoomTypes.isUsed(pool,input.room_type_id);

        if(!result){await RoomTypes.deleteRoomtypes(pool,input.room_type_id);
        res.json({
            result: true
        });
    
        }else{
            res.json({
                result: false,
                message: "ข้อมูลนี้มีการใช้งานอยู่"
            });
        }
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
            input.pet_age_year,input.pet_age_month,input.image,
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

app.post("/api/pets/upload/:pet_id", checkAuth, (req, res) => {
    var pet_id = req.params.pet_id;
    var fileName;

    var storage = multer.diskStorage({
        destination: (req, file, cp) =>{
            cp(null, "images/pets");
        },
        filename: (req, file, cp) => {
            let fileNames = file.originalname.split('.');
            fileName = "pets-" + pet_id +"-"+"."+fileNames[1];
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
            console.log(fileName)
            var result = Pets.uploadImage(pool, pet_id, fileName);

            res.json({
                result: true,
                data: fileName
            });
        }
    });
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
    pool.query(`SELECT rooms.room_id, rooms.room_name , room_type.room_type_id , room_type.room_type_name 
    FROM rooms  JOIN room_type 
    ON rooms.room_type_id = room_type.room_type_id`,(err, results, fields) => {
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
        var result = await Room.isDuplicate(pool, input.room_name, null);

        if(!result) {
            await Room.createRoom(pool,
                input.room_name,
                input.room_type_id);
            res.json({
                result: true
            });
        } else {
            res.json({
                result: false,
                message: "ชื่อห้องซ้ำ"
            });
        }
         
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
        var result = await Room.isDuplicate(pool, input.room_name, null);
        
        if(!result){
            var result = await Room.updateRoom(pool,input.room_id, input.room_name,input.room_type_id);
            res.json({
                result: true
            });
        }else {
            res.json({
                result: false,
                message: "ชื่อห้องซ้ำ"
            });
        }
        
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
        var result = await Room.isUsed(pool,input.room_id);
        if(!result){
            await Room.deleteRoom(pool,input.room_id);
        res.json({
            result: true
        });
        }else{
            res.json({
                result: false,
                message: "ข้อมูลนี้มีการใช้งานอยู่"
            });
        }
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

app.post('/api/room/room_types',async(req, res) => {
    const input = req.body;

    try{
        var result = await Room.getByRoomType(pool,input.room_type_id);
        res.json({
            result: true,
            data:result
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.get('/api/schedules',(req, res) => {
    pool.query("SELECT a.*,b.emp_fname,b.emp_lname FROM schedules a JOIN employee b ON a.emp_id = b.emp_id",(err, results, fields) => {
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
                message: "ไม่พบตารางงาน"
            });
        }
    });
});

app.post('/api/schedules/emp/:emp_id',(req,res) => {
    const emp_id  = req.params.emp_id
    let where;
    const sql = `SELECT a.*,b.emp_fname,b.emp_lname,d.service_name,e.room_name
                    FROM schedules a JOIN employee b ON a.emp_id = b.emp_id
                    JOIN appointment c ON a.appoint_id = c.appoint_id
                    JOIN service d ON c.service_id = d.service_id
                    JOIN rooms e ON a.room_id = e.room_id `

    
    if(emp_id == 0){
        where = "ORDER BY a.date";
        
        pool.query(sql + where,(err, results, fields) => {
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
                    message: "ไม่พบตารางงาน"
                });
            }
        });

    }else if(emp_id >0){
        where = "WHERE a.emp_id = ? ORDER BY a.date"

        pool.query(sql + where,[emp_id],(err, results, fields) => {
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
                    message: "ไม่พบตารางงาน"
                });
            }
        });
    }
    
});

app.post('/api/schedules/emp_available',(req, res) => {
    const input = req.body;

    pool.query("SELECT * FROM employee WHERE emp_id NOT IN (SELECT emp_id FROM schedules WHERE date = ? AND time = ? AND time_end = ?)", [input.date,input.time,input.time_end], function(error, results, fields){
        if (error) {
            res.json({
                result: false,
                message: error.message
            });
        }

        if (results.length) {
            res.json({
                result: true,
                data:results
            });
        } else {
            res.json({
                result:false,
                message: "ไม่พบพนักงานที่ว่าง"
            });
        }
    });
});

// app.post('/api/schedules/appointment',async(req, res) => {
//     const input = req.body;

//     try{
//         var result = await Schedule.addSchedule(pool,input.appoint_id);

//         res.json({
//             result: true,
//             data:result
//         });
//     }catch(ex){
//         res.json({
//             result: false,
//             message: ex.message
//         });
//     }
// });


app.post('/api/schedules/add',async(req, res) => {
    const input = req.body;
    try{
        var result = await Schedule.addSchedule(pool,
            input.emp_id,
            input.appoint_id,
            input.room_id,
            input.appoint_date,
            input.appoint_time,
            input.appoint_time_end);

        if(result){
            var result2 = await Appointment.updateStatus(pool,input.appoint_status,input.appoint_id,input.appoint_note);
        }

        console.log(result2)
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

app.post('/api/schedules/edit',async(req, res) => {
    const input = req.body;
    try{
        var result = await Schedule.addSchedule(pool,
            input.emp_id,
            input.appoint_id,
            input.room_id,
            input.appoint_date,
            input.appoint_time,
            input.appoint_time_end);

        if(result){
            var result2 = await Appointment.updateStatus(pool,input.appoint_status,input.appoint_id,input.appoint_note);
        }

        console.log(result2)
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
   
app.get('/api/req_appointment',(req, res) => {
    pool.query(`SELECT  
    a.appoint_id,
    a.symtoms,
    a.date,
    a.time,
    a.time_end,
    a.payment_image,
    a.status_id,
    a.note,
    b.*,
    c.cust_fname,
    c.cust_lname,
    c.cust_tel,
    c.email,
    d.service_id,
    d.service_name,
    d.cost_deposit,
    d.time_spent,
    e.*,
    f.status_name
    FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
    JOIN customer_information c ON b.cust_id = c.cust_id
    JOIN service d ON a.service_id = d.service_id
    JOIN rooms e ON a.room_id = e.room_id
    JOIN appoint_status f ON a.status_id = f.status_id
    WHERE a.status_id = 1 OR a.status_id = 3
    GROUP BY a.appoint_id`,(err, results, fields) => {
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
                message: "ไม่พบการนัดหมาย"
            });
        }
    });
});

app.get('/api/appointment',(req, res) => {
    pool.query(`SELECT  
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
    f.status_name   
    FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
    JOIN customer_information c ON b.cust_id = c.cust_id
    JOIN service d ON a.service_id = d.service_id
    JOIN rooms e ON a.room_id = e.room_id
    JOIN appoint_status f ON a.status_id = f.status_id
    WHERE a.status_id = 1 OR a.status_id = 2 OR a.status_id = 3
    GROUP BY a.appoint_id`,(err, results, fields) => {
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
                message: "ไม่พบการนัดหมาย"
            });
        }
    });
});

app.get('/api/all-appointments',(req, res) => {
    pool.query(`SELECT  
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
    h.emp_id,
   	CONCAT(h.emp_fname," ",h.emp_lname) AS employee_fullname
    FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
    JOIN customer_information c ON b.cust_id = c.cust_id
    JOIN service d ON a.service_id = d.service_id
    JOIN rooms e ON a.room_id = e.room_id
    JOIN appoint_status f ON a.status_id = f.status_id
    JOIN schedules g ON a.appoint_id = g.appoint_id
    JOIN employee h ON h.emp_id = g.emp_id
    GROUP BY a.appoint_id`,(err, results, fields) => {
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
                message: "ไม่พบการนัดหมาย"
            });
        }
    });
});

app.get('/api/appointment/accept',(req, res) => {
    pool.query(`SELECT  
    a.*,
    b.*,
    c.cust_fname,
    c.cust_lname,
    d.service_name,
    d.cost_deposit,
    d.time_spent,
    e.*,
    f.status_name ,
    h.emp_id,
   	CONCAT(h.emp_fname," ",h.emp_lname) AS employee_fullname
    FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
    JOIN customer_information c ON b.cust_id = c.cust_id
    JOIN service d ON a.service_id = d.service_id
    JOIN rooms e ON a.room_id = e.room_id
    JOIN appoint_status f ON a.status_id = f.status_id
    JOIN schedules g ON a.appoint_id = g.appoint_id
    JOIN employee h ON h.emp_id = g.emp_id
    WHERE a.status_id = 2
    GROUP BY a.appoint_id
    ORDER BY a.date , a.time , a.appoint_id`,(err, results, fields) => {
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
                message: "ไม่พบการนัดหมายที่อนุมัติ"
            });
        }
    });
});


app.post('/api/appointment/service',checkAuth,(req, res) => {
    const input = req.body;
    console.log(input)
    const sql = `SELECT a.*,
                b.*,
                c.cust_fname,
                c.cust_lname,
                d.service_name,
                d.cost_deposit,
                d.time_spent,
                e.*,
                f.status_name,
                CONCAT(h.emp_fname, " ", h.emp_lname) AS employee_fullname
                FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
                JOIN customer_information c ON b.cust_id = c.cust_id
                JOIN service d ON a.service_id = d.service_id
                JOIN rooms e ON a.room_id = e.room_id
                JOIN appoint_status f ON a.status_id = f.status_id
                JOIN schedules g ON a.appoint_id = g.appoint_id 
                JOIN employee h ON g.emp_id = h.emp_id `;

    if (input.service_id == 0) {
        pool.query(sql, (error, results) => {
            if (error) {
                res.json({
                    result: false,
                    message: error.message
                });
            } else {
                res.json({
                    result: true,
                    data: results
                });
            }
        });
    } else {
        let WHERE;

        if(input.dateRange == 2){
            WHERE = "WHERE a.date BETWEEN DATE_FORMAT(?,'%Y-%m-%d') AND LAST_DAY(?) AND a.service_id = ? AND a.status_id = 5 GROUP BY a.appoint_id"
            pool.query(sql + WHERE,
                [input.date,input.date,input.service_id], (error, results) => {
                    console.log(sql+WHERE)
                    if (error) {
                        res.json({
                            result: false,
                            message: error.message
                        });
                    } else {
                        res.json({
                            result: true,
                            data: results
                        });
                    }
                });
        }else {
            WHERE =  "WHERE a.date = ? AND a.service_id = ? AND a.status_id = 5 GROUP BY a.appoint_id"
            pool.query(sql + WHERE,
                [input.date,input.service_id], (error, results) => {
                    if (error) {
                        res.json({
                            result: false,
                            message: error.message
                        });
                    } else {
                        res.json({
                            result: true,
                            data: results
                        });
                    }
                });
        }

        
    }
});


app.post("/api/report/byservice", checkAuth, async (req, res) => {
    let input = req.body

    try{

        var result = await Appointment.getReportByService(pool,input.service_id,input.dateRange);
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

app.get('/api/history_appoint',(req, res) => {
    pool.query(`SELECT  
    a.appoint_id,
    a.symtoms,
    a.date,
    a.time,
    a.time_end,
    a.payment_image,
    a.status_id,
    a.note,
    b.*,
    c.cust_fname,
    c.cust_lname,
    c.cust_tel,
    c.email,
    d.service_id,
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
    WHERE a.status_id = 4 OR a.status_id = 5 OR a.status_id = 6
    GROUP BY a.appoint_id`,(err, results, fields) => {
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
                message: "ไม่พบการนัดหมาย"
            });
        }
    });
});


app.get('/api/appoint_status',(req, res) => {
    pool.query(`SELECT * FROM appoint_status`,(err, results, fields) => {
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
                message: "ไม่พบข้อมูลสถานะการนัดหมาย"
            });
        }
    });
});

app.post('/api/appointment/add',async(req, res) => {
    const input = req.body;
    try{
        var result = await Appointment.addAppointment(pool,
            input.symtoms,
            input.date,
            input.time,
            input.time_end,
            input.appoint_status,
            input.note,
            input.pet_id,
            input.service_id,
            input.room_id);

        res.json({
            result: true,
            appoint_id:result.insertId
        });
    }catch(ex){
        res.json({
            result: false,
            message: ex.message
        });
    }
});

app.post("/api/appointment/upload/:appoint_new_id", checkAuth, (req, res) => {
    var appoint_new_id = req.params.appoint_new_id;
    var fileName;

    var storage = multer.diskStorage({
        destination: (req, file, cp) =>{
            cp(null, "images");
        },
        filename: (req, file, cp) => {
            let fileNames = file.originalname.split('.');
            fileName = "appoint_payment-" + appoint_new_id +"."+fileNames[1];
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
            var result = Appointment.uploadImage(pool, appoint_new_id, fileName);
            res.json({
                result: true,
                data: fileName
            });
        }
    });
});

app.post('/api/req_appointment/update',async(req, res) => {
    const input = req.body;
    try{
        var result = await Appointment.updateStatus(pool,input.appoint_status,input.appoint_id,input.appoint_note);
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

app.get('/api/emp',(req, res) => {
    pool.query("SELECT a.*,b.emp_position_name FROM employee a JOIN emp_type b ON a.emp_position_id = b.emp_position_id",(err, results, fields) => {
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
                message: "ไม่พบข้อมูลพนักงาน"
            });
        }
    });
});

app.post('/api/emp/add',async(req, res) => {
    const input = req.body;

    console.log("route add employee");

    try{
        var result = await Employee.createEmployee(pool,
            input.emp_fname,
            input.emp_lname,
            input.emp_address,
            input.emp_tel,
            input.emp_salary,
            input.emp_position_id,
            input.user_id,
            input.username,
            input.password);
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

app.post('/api/emp/update',async(req, res) => {
    const input = req.body;

    try{
        var result = await Employee.updateEmployee(pool,
            input.emp_fname,
            input.emp_lname,
            input.emp_address,
            input.emp_tel, 
            input.emp_salary,
            input.emp_position_id,
            input.emp_id,
            input.username,
            input.password);
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

app.post('/api/emp/delete',async(req, res) => {
    const input = req.body;

    try{
        var result = await Employee.deleteEmployee(pool,input.emp_id);
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

app.get('/api/emp/:emp_id', async(req, res) => {
    const emp_id = req.params.emp_id;
    try{
        var result = await Employee.getByEmpId(pool,emp_id);
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

 
app.post('/api/payment/upload/:appoint_id', checkAuth, (req, res) => {
    var appoint_id = req.params.appoint_id;
    var fileName;

    var storage = multer.diskStorage({
        destination: (req, file, cp) =>{
            cp(null, "images");
        },
        filename: (req, file, cp) => {
            let fileNames = file.originalname.split('.');
            fileName = "appoint_payment_edit-" + appoint_id +"."+fileNames[1];
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
            res.json({
                result: true,
                data: fileName
            });
        }
    });

    
});

app.post('/api/schedules/find-appoint', async(req, res) => {
    const appoint_id = req.params.appoint_id;
    try{
        var result = await Schedule.findByAppointment(pool,appoint_id);
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

app.post("/api/report2/byappointment", checkAuth, async (req, res) => {
    
    let input = req.body
    console.log(input)
    try {
        var result = await Appointment.getCountAppointmentByAppointment(pool, input.dateRange);

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

app.post('/api/appointment/allservice',checkAuth,(req, res) => {
    const input = req.body;
    console.log(input)
    const sql = `SELECT a.*,
                b.*,
                c.cust_fname,
                c.cust_lname,
                d.service_name,
                d.cost_deposit,
                d.time_spent,
                e.*,
                f.status_name,
                CONCAT(h.emp_fname, " ", h.emp_lname) AS employee_fullname
                FROM appointment a JOIN pets b ON a.pet_id = b.pet_id 
                JOIN customer_information c ON b.cust_id = c.cust_id
                JOIN service d ON a.service_id = d.service_id
                JOIN rooms e ON a.room_id = e.room_id
                JOIN appoint_status f ON a.status_id = f.status_id
                JOIN schedules g ON a.appoint_id = g.appoint_id 
                JOIN employee h ON g.emp_id = h.emp_id `;

    if (input.service_name == "") {
        pool.query(sql, (error, results) => {
            if (error) {
                res.json({
                    result: false,
                    message: error.message
                });
            } else {
                res.json({
                    result: true,
                    data: results
                });
            }
        });
    } else {
        let WHERE;

        if(input.dateRange == 0){
            WHERE = "WHERE WEEKOFYEAR(a.date)=WEEKOFYEAR(CURDATE()) AND d.service_name = ? AND a.status_id = 5 GROUP BY a.appoint_id"
            pool.query(sql + WHERE,
                [input.service_name], (error, results) => {
                    console.log(sql+WHERE)
                    if (error) {
                        res.json({
                            result: false,
                            message: error.message
                        });
                    } else {
                        res.json({
                            result: true,
                            data: results
                        });
                    }
                });
        }else if(input.dateRange == 1){
            WHERE =  "WHERE a.date BETWEEN DATE_FORMAT(CURDATE() ,'%Y-%m-01') AND LAST_DAY(CURDATE()) AND d.service_name = ? AND a.status_id = 5 GROUP BY a.appoint_id"
            pool.query(sql + WHERE,
                [input.service_name], (error, results) => {
                    console.log(sql+ WHERE)

                    if (error) {

                        res.json({
                            result: false,
                            message: error.message
                        });
                    } else {
                        res.json({
                            result: true,
                            data: results
                        });
                    }
                });
        }else if(input.dateRange == 2){
            WHERE =  "WHERE a.date > DATE_SUB(NOW(), INTERVAL 1 YEAR) AND a.status_id = 5 AND d.service_name = ? GROUP BY a.appoint_id"
            pool.query(sql + WHERE,
                
                [input.service_name], (error, results) => {
                    
                    if (error) {
                        console.log(sql+ WHERE)
                        res.json({
                            result: false,
                            message: error.message
                        });
                    } else {
                        res.json({
                            result: true,
                            data: results
                        });
                    }
                });
        }
    }
});

app.listen(port, () => {
    console.log("Running");
});

