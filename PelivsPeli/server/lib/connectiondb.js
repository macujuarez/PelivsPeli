var mysql = require('mysql');

var mysql_host = process.env.DB_HOST;
var mysql_user = process.env.DB_USER;
var mysql_password = process.env.DB_PASS;
var mysql_port = process.env.DB_PORT;
var mysql_database = process.env.DB_DATABASE;

var connection = mysql.createConnection({
    host     : mysql_host,
    port     : mysql_port,
    user     : mysql_user,
    password : mysql_password,
    database : mysql_database
});

connection.connect();

module.exports = connection;