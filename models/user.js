export default (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(191),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(['Administrator', 'Surveyor'])
        }
    }, {
        underscored: true
    });

    User.associate = (models) => {
        let { Token } = models;
        User.hasMany(Token);
    }

    return User;
}