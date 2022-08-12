const util = require('util');
const express = require("express");
const jwt = require("jsonwebtoken");

const Account = require('./libs/Account');
const Users = require('./libs/Users');
const Roles = require('./libs/Roles');

const app = express();
const port = 8080;
const bodyParser = require('body-parser');

const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var mysql = require('mysql');
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

    console.log(authToken);
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
                message: "ไม่พบ Username"
            });
        }
    });
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
                message: "ไม่พบ Username"
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

app.get("/api/user/search/:data", async (req, res) => {
    const data = req.params.data;
    try {
        var result = await Users.searchUser(pool, data);

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
                message: "ไม่พบ Username"
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
})

app.get("/api/role/search/:data", async (req, res) => {
    const data = req.params.data;
    try {
        var result = await Roles.searchRole(pool, data);

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


app.listen(port, () => {
    console.log("Running");
});