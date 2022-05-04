const express = require('express');
const router = express.Router();
const pool = require('../database');
const encryp = require('../helpers/encryp');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (user[0]) {
        let passwordDb = user[0].password;
        let comparation = await encryp.matchPassword(password, passwordDb);
        console.log(comparation)
        if (comparation) {
            jwt.sign({ user: user[0] }, 'secretKey', { expiresIn: '24h' }, (err, token) => {
                res.json({
                    token
                });
            });
        } else {
            res.send('Datos incorrectos')
        }
    } else {
        res.send('Datos Incorrectos');
    }
})

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (name === '' || email === '' || password === '') {
        res.send('Datos faltantes');
    } else {
        let passwordEncrypt = await encryp.encryptPassword(password);
        const newUser = { name, email, password: passwordEncrypt }
        try {
            await pool.query('INSERT INTO users SET ?', [newUser]);
        } catch (error) {
            res.send('Ups, algo salió mal');
        }

        res.send('Registrado correctamente');
    }
})

module.exports = router;