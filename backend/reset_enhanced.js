const Article = require('./src/models/Article');
const sequelize = require('./src/config/database');

async function reset() {
    await sequelize.authenticate();
    await Article.update({ content_enhanced: null }, { where: {} });
    console.log("Reset content_enhanced to null");
}
reset();
