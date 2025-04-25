'use strict';

import { DataTypes, Sequelize } from "sequelize";
const { Model} = require('sequelize');
import db from '.'

module.exports = (sequelize:Sequelize, DataTypes:any) => {
  class staff extends Model {
    
    static associate(models: { student: any; }) {
      staff.hasMany(models.student,{
        foreignKey:'staff_id'
      });
    }
  }

  staff.init({
    id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    staffName: {
      type:DataTypes.STRING,
      allowNull:true
    },
    role: {
      type:DataTypes.STRING,
      allowNull:true
    },
    experience: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'staff',
    tableName:'staffs',
    timestamps:false
  });
  return staff;
};