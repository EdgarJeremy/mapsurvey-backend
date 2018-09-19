export function a(handler) {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch((err) => {
            console.log(err.toString());
            res.status(500);
            res.setStatus(res.GAGAL);
            res.setMessage(err.toString());
            res.go();
        })
    }
}