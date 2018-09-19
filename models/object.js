/**
* File : ./models/object.js
* Tanggal Dibuat : 2018-9-7 12:33:57
* Penulis : sirius
*/

export default (sequelize, DataTypes) => {

    const Object = sequelize.define("object", {
        type: DataTypes.STRING(191),
        fields: DataTypes.JSON
    }, {
        underscored: true
    });

    Object.associate = (models) => {
        let { Object_data } = models;
        Object.hasMany(Object_data);
    }

    return Object;

}