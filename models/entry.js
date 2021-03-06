'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Entry.init({
    grantorName: DataTypes.STRING,
    grantorPosition: DataTypes.STRING,
    granteeName: DataTypes.STRING,
    granteePosition: DataTypes.STRING,
    travelDeparture: DataTypes.STRING,
    travelDestination: DataTypes.STRING,
    travelVehicle: DataTypes.STRING,
    travelType: DataTypes.STRING,
    travelReason: DataTypes.TEXT,
    travelArrival: DataTypes.STRING,
    travelArrivalDate: DataTypes.DATEONLY,
    travelDate: DataTypes.DATEONLY,
    travelDateBack: DataTypes.DATEONLY,
    travelLength: DataTypes.INTEGER,
    travelLengthType: DataTypes.INTEGER,
    guarantorName: DataTypes.STRING,
    otherInfo: DataTypes.TEXT,
    numPrefix: DataTypes.STRING,
    numMiddle: DataTypes.STRING,
    numPostfix: DataTypes.STRING,
    numYear: DataTypes.STRING,
    numCombined: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Entry',
  });
  return Entry;
};