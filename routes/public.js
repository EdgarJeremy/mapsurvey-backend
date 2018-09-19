/**
 * Public routes
 */
import bcrypt from "bcrypt";
import { requiredPost } from "../middlewares/validator/request_fields";
import { a } from "../middlewares/wrapper/request_wrapper";
import { withSocket } from '../middlewares/validator/auth';

function route(app, models, socketListener) {
    let router = app.get("express").Router();
    router.use(withSocket());

    /**
     * Router disini..
     */

    router.post("/login", requiredPost(["username", "password"]), a(async (req, res) => {
        const body = req.body;
        const user = await models.User.findOne({
            include: [{ model: models.Token }],
            where: { username: body.username }
        });
        if(user) {
            if (bcrypt.compareSync(body.password, user.password)) {
                /** Invalidate old tokens */
                req.invalidateAllToken(user);
                delete user.dataValues.tokens;
                user.socketid = req.socketid;
                socketListener.addUser(user);
                /** Generate new tokens */
                const userToken = await req.generateUserToken(user.id);
                res.setStatus(res.OK);
                res.setData({
                    user,
                    token: userToken.token,
                    refreshToken: userToken.refreshToken
                });
                res.go();
            } else {
                res.setStatus(res.GAGAL);
                res.setMessage("Username / Password salah");
                res.go();
            }
        } else {
            res.setStatus(res.GAGAL);
            res.setMessage("Username / Password salah");
            res.go();
        }
    }));

    router.get("/check", (req, res) => {
        if(req.user) {
            req.user.socketid = req.socketid;
            socketListener.addUser(req.user);
        }
        console.log('cek');
        res.setStatus(req.user ? res.OK : res.GAGAL);
        res.setData(req.user);
        res.setMessage("Session habis");
        res.go();
    });

    router.get("/logout", (req, res) => {
        if(req.user) {
            req.invalidateAllToken(req.user);
            socketListener.removeUser(req.socketid);
        }
        res.set("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
        res.set("x-access-token", "");
        res.set("x-refresh-token", "");
        res.setStatus(res.OK);
        res.setData("Berhasil logout");
        res.go();
    });

    return router;
}

module.exports = route;
