var Sequelize = require ("sequelize");
var sequelize = new Sequelize(null, null, null, {
    dialect:"sqlite",

    storage: __dirname + "/../database.sqlite"
});

var Url = sequelize.define("url", {
    url: {
        type: Sequelize.STRING,
        field: "url"
    },
    desc: {
        type: Sequelize.STRING,
        field:"desc"
    }
});

module.exports = {
    sequelize: sequelize,
    Url: Url
}
