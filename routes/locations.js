/**
* File : ./routes/locations.js 
* Tanggal Dibuat : 2018-9-8 07:25:43
* Penulis : sirius
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { withSocket } from '../middlewares/validator/auth';

function locations(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(withSocket());

    router.get('/', a(async (req, res) => {
        let { Object_data, Object } = models;
        let { id: object_id } = req.params;
        let { q = "", limit = 20, offset = 0 } = req.query;
        let data = await Object_data.findAll({ include: [{ model: Object }]});
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    return router;
}

module.exports = locations;