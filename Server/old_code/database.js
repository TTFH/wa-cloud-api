const fs = require("fs");
global.database = require("./database.json"); // {"users":{},"messages":{},"media":{}}

function updateDataBase() {
	const data = JSON.stringify(database);
	fs.writeFileSync("database.json", data);
}

module.exports = { updateDataBase };
