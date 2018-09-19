export function onlyAuth() {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            res.setStatus(res.GAGAL);
            res.setMessage("Anda belum login");
            res.go();
        } else {
            next();
        }
    }
}

export function withSocket() {
    return (req, res, next) => {
        const { headers } = req;
        if(headers['x-socket-id']) {
            req.socketid = headers['x-socket-id'];
            next();
        } else {
            res.status(400);
            res.setStatus(res.GAGAL);
            res.setMessage('Tidak bisa terkonek ke socket server');
            res.go();
        }
    }
}