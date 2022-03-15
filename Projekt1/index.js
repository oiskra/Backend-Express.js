var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Hello World');
});
app.get('/:op/:num1/:num2', function (req, res) {
    var operation = req.params.op;
    var num1 = parseInt(req.params.num1);
    var num2 = parseInt(req.params.num2);
    var result;
    switch (operation) {
        case 'add':
            result = num1 + num2;
            break;
        case 'substract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            result = num1 / num2;
            break;
    }
    res.send(result.toString());
});
app.listen(3000);
