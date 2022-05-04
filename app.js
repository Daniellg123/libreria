const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));

app.listen(3000, function () {
    console.log("Running...");
})