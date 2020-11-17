module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define("author", {
      name: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    });
  
    return Author;
  };
  