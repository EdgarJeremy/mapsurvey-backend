/**
* File : ./models/object_data.js
* Tanggal Dibuat : 2018-9-7 12:36:27
* Penulis : sirius
*/

export default (sequelize, DataTypes) => {

    const Object_data = sequelize.define("object_data", {
        field_values: DataTypes.JSON,
        latitude: DataTypes.DOUBLE,
        longitude: DataTypes.DOUBLE,
        image: DataTypes.TEXT('long')
    }, {
        underscored: true
    });

    Object_data.associate = (models) => {
        let { Object, User } = models;
        Object_data.belongsTo(User);
        Object_data.belongsTo(Object);
    }

    return Object_data;

}