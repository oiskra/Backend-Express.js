const express = require('express')  
const app = express()  
app.get('/', function (req, res) {  
  res.send('Hello World')  
})

app.get('/:op/:num1/:num2', (req, res) => {
    let operation : string = req.params.op
    let num1 : number = parseInt(req.params.num1)
    let num2 : number = parseInt(req.params.num2)
    let result

    switch(operation) {
        case 'add':
            result = num1 + num2
            break
        case 'substract':
            result = num1 - num2
            break
        case 'multiply':
            result = num1 * num2
            break
        case 'divide':
            result = num1 / num2
            break
    }
    res.send(result.toString())
})
app.listen(3000)  

