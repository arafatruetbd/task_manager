module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("task", {
      title: {
        type: DataTypes.STRING
      },
      details: {
        type: DataTypes.STRING
      }
    });
  
    return Task;
  };
  