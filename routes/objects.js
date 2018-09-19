/**
* File : ./routes/objects.js 
* Tanggal Dibuat : 2018-9-7 12:59:24
* Penulis : sirius
*/
import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import utils from '../core/utils';

function objects(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(onlyAuth());

    // List objects
    router.get('/', a(async (req, res) => {
        let { Object } = models;
        let { limit = 20, offset = 0 } = req.query;
        let objects = await Object.findAndCountAll({
            limit, offset
        });
        res.setStatus(res.OK);
        res.setData(objects);
        res.go();
    }));

    // One object
    router.get('/:id', a(async (req, res) => {
        let { Object } = models;
        let { id } = req.params;
        let object = await Object.findOne({ where: { id } });
        res.setStatus(res.OK);
        res.setData(object);
        res.go();
    }));

    // Save object
    router.post('/', requiredPost(['type', 'fields']), a(async (req, res) => {
        let { Object } = models;
        let { type, fields } = req.body;
        let object = await Object.create({
            type, fields
        });
        res.setStatus(res.OK);
        res.setData(object);
        res.go();
    }));

    // Edit object
    router.put('/:id', requiredPost(['type', 'fields']), a(async (req, res) => {
        let { Object } = models;
        let { id } = req.params;
        let { type, fields } = req.body;
        let object = await Object.update({ type, fields }, { where: { id }});
        res.setStatus(res.OK);
        res.setData(object);
        res.go();
    }));

    // Delete object
    router.delete('/:id', a(async (req, res) => {
        let { Object } = models;
        let { id } = req.params;
        let object = await Object.findOne({ where: { id }});
        if(object) {
            object.destroy();
            res.setStatus(res.OK);
            res.setData(object);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Objek tidak ditemukan');
            res.go();
        }
    }));

    // Object's data list
    router.get('/:id/data', a(async (req, res) => {
        let { Object_data } = models;
        let { id: object_id } = req.params;
        let data = await Object_data.findAll({
            where: { object_id }
        });
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    // Save an object data
    router.post('/:id/data', requiredPost(['latitude', 'longitude', 'image', 'field_values']), a(async (req, res) => {
        let { Object, Object_data } = models;
        let { id: object_id } = req.params;
        let { id: user_id } = req.user;
        let object = await Object.findOne({ where: { id: object_id } });
        if(!utils.compare_object_key(object.fields, req.body.field_values)) {
            res.setStatus(res.GAGAL);
            res.setMessage({
                text: 'Field tidak cocok',
                valid: object.fields
            });
            return res.go();
        }
        let { latitude, longitude, image, field_values } = req.body;
        let data = await Object_data.create({
            latitude, longitude, image, field_values, object_id, user_id
        });
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    // One object's data
    router.get('/:id/data/:data_id', a(async (req, res) => {
        let { Object, Object_data } = models;
        let { id: object_id, data_id: id } = req.params;
        let data = await Object_data.findOne({ where: { object_id, id }});
        res.status(data ? 200 : 404);
        res.setStatus(data ? res.OK : res.GAGAL);
        res.setData(data);
        res.setMessage('Data tidak ditemukan');
        res.go();
    }));

    // Delete one object's data
    router.delete('/:id/data/:data_id', a(async (req, res) => {
        let  { Object, Object_data } = models;
        let { id: object_id, data_id: id } = req.params;
        let data = await Object_data.findOne({ where: { object_id, id }});
        if(data) {
            data.destroy();
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Data tidak ditemukan');
            res.go();
        }
    }));

    // Edit one object's data
    router.put('/:id/data/:data_id', requiredPost(['latitude', 'longitude', 'image', 'field_values']), a(async (req, res) => {
        let { Object, Object_data } = models;
        let { id: object_id, data_id: id } = req.params;
        let { id: user_id } = req.user;
        let object = await Object.findOne({ where: { id: object_id } });
        if(!utils.compare_object_key(object.fields, req.body.field_values)) {
            res.setStatus(res.GAGAL);
            res.setMessage({
                text: 'Field tidak cocok',
                valid: object.fields
            });
            return res.go();
        }
        let { latitude, longitude, image, field_values } = req.body;
        let data = await Object_data.update({
            latitude, longitude, image, field_values, object_id, user_id
        }, { where: { object_id, id }});
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    return router;
}

module.exports = objects;