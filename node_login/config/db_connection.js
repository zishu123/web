var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'newlogin'
})
connection.connect(function(err){
    if(!err){
        console.log('Databse is connected.......!!');
    }else{
        console.log("Erro connecting database...!!");
    }
})
module.exports = connection;