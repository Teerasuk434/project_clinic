const { connect } = require("http2");
var mysql = require("mysql");

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "my-product",
    connectionLimit: 10
});

// pool.connect();

var name = 'P';
var email = 'parker.p@gmail.com';

pool.query('SELECT * FROM users WHERE first_name LIKE ? AND email = ?',['%'+ name  + '%',email],(error, results, fields) => {
    if (error) throw error;

    console.log(results);
});

// connection.end();