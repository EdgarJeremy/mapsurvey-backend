module.exports = {

    _users: [],
    _io: null,

    listen: function(io) {
        this._io = io;
        this._io.on("connection", (socket) => {
            console.log('Connected', socket.id);
            socket.on("disconnect", () => {
                this.removeUser(socket.id);
            });
            socket.on('move', (info) => {
                let user = this.findUser(socket.id);
                if(user && info) {
                    user.dataValues.location_info = info;
                    this._users.forEach((u) => {
                        if(u.type === 'Administrator') {
                            this.broadcastPoints(u.socketid);
                        }
                    });
                }
            });
            socket.on('ask_points', () => {
                this.broadcastPoints(socket.id);
            });
        });
        let self = this;
        setInterval(function(){
            console.log(self.getPlainUser());
        }, 2000);
    },

    broadcastPoints: function(targetsocketid) {
        let targetSocket = this.findSocket(targetsocketid);
        if(targetSocket)
            targetSocket.emit('update_points', this.getPlainUser());
    },

    getPlainUser: function() {
        return this._users.map((user) => {
            delete user.dataValues.password;
            user.dataValues.socketid = user.socketid;
            return user.dataValues;
        });
    },

    addUser: function(user) {
        if(user.socketid) {
            if(!this.findUser(user.socketid) && !this.findUserById(user.id)) {
                this._users.push(user);
                this.broadcast("receive_all_online", this._users);
                console.log(`Joined : ${user.socketid}`);
            }
        }
    },

    removeUser: function(socketid) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].socketid === socketid) {
                this._users.splice(i, 1);
                this.broadcast("receive_all_online", this._users);
                console.log(`Kicked : ${socketid}`);
            }
        }
        this._users.forEach((u) => {
            if(u.type === 'Administrator') {
                this.broadcastPoints(u.socketid);
            }
        });
    },

    findUser: function(socketid) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].socketid === socketid)
                return this._users[i];
        }
        return false;
    },

    findUserById: function(id) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].id === id) {
                return this._users[i];
            }
        }
        return false;
    },

    findSocket: function(socketid) {
        return this._io.sockets.connected[socketid];
    },

    findSocketById: function(id) {
        for(let i = 0; i < this._users.length; i++) {
            if(this._users[i].id == id) {
                return this._io.sockets.connected[this._users[i].socketid];
            }
        }
        return null;
    },

    broadcast: function(event, data) {
        this._io.emit(event, data);
    }

}