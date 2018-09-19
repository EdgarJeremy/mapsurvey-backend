/**
* File : ./routes/users.js 
* Tanggal Dibuat : 2018-9-15 13:39:48
* Penulis : sirius
*/
import bcrypt from 'bcrypt';
import { requiredPost } from '../middlewares/validator/request_fields';
import { a } from '../middlewares/wrapper/request_wrapper';

function users(app, models, socketListener) {
    let router = app.get("express").Router();

    // List users
    router.get('/', a(async (req, res) => {
        let { User } = models;
        let { limit = 20, offset = 0 } = req.query;
        limit = parseInt(limit);
        offset = parseInt(offset);
        let users = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            limit, offset
        });
        res.setStatus(res.OK);
        res.setData(users);
        res.go();
    }));

    // Save user
    router.post('/', requiredPost(['name', 'username', 'type', 'password']), a(async (req, res) => {
        let { User } = models;
        let { name, username, type, password } = req.body;
        let user = await User.create({
            name, username, type,
            password: bcrypt.hashSync(password, 10)
        });
        res.setStatus(res.OK);
        res.setData(user);
        res.go();
    }));

    // Edit user
    router.put('/:id', requiredPost(['name', 'username', 'type']), a(async (req, res) => {
        let { User } = models;
        let { id } = req.params;
        let { name, username, type, password } = req.body;
        let user = await User.findOne({ where: { id }});
        if(user) {
            if(password) {
                password = bcrypt.hashSync(password, 10);
            } else {
                password = undefined;
            }
            user.update({
                name, username, type, password
            });
            res.setStatus(res.OK);
            res.setData(user);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Pengguna tidak ditemukan');
            res.go();
        }
    }));

    // Delete user
    router.delete('/:id', a(async (req, res) => {
        let { User } = models;
        let { id } = req.params;
        let user = await User.findOne({ where: { id }});
        if(user) {
            user.destroy();
            res.setStatus(res.OK);
            res.setData(user);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Pengguna tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = users;