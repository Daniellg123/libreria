const express = require('express');
const router = express.Router();
const pool = require('../database');
const jwt = require('jsonwebtoken');

router.get('/', verify, (req, res) => {
    jwt.verify(req.token, 'secretKey', async (error, authData) => {
        if (error) {
            res.send('No tienes permisos');
        } else {
            try {
                const data = await pool.query('SELECT * FROM books INNER JOIN users ON users.id = books.users_id WHERE books.users_id = ?', [authData.user.id]);
                res.send(data);
            } catch (error) {
                res.send(error);
            }
        }
    });
});

router.post('/', verify, (req, res) => {
    const { isbn, title, author, release_date } = req.body;

    jwt.verify(req.token, 'secretKey', async (error, authData) => {
        if (error) {
            res.send('No tienes permisos');
        } else {
            const newBook = { isbn, title, author, release_date, users_id: authData.user.id, user_id: authData.user.id };
            try {
                await pool.query('INSERT INTO books SET ?', [newBook]);
            } catch (error) {
                res.send('Ups, algo salió mal, revisa los datos');
            }
        }
    });

    res.send('Se registró correctamente');
});

router.delete('/', verify, (req, res) => {
    const { id } = req.body;
    jwt.verify(req.token, 'secretKey', async (error, authData) => {
        if (error) {
            res.send('No tienes permisos');
        } else {
            try {
                await pool.query('DELETE FROM books WHERE id = ?', [id]);
            } catch (error) {
                res.send('Ups, algo salió mal, revisa los datos');
            }
            res.send('Se eliminó correctamente');
        }
    });

});

function verify(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[0];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;