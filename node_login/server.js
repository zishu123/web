var express    = require("express");
var routes = require('./routes/route');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(routes);
app.listen(5000 , ()=>{
    console.log('server running on port no 5000')
})