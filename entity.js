const mysql = require('mysql2')
const fs = require('fs')

class Connector {
	constructor(configs) {
		this.conn = mysql.createConnection(configs)
		this.conn.query(
			`SELECT TABLE_NAME AS _table FROM information_schema.TABLES WHERE TABLE_SCHEMA = "${configs.database}";`,
			(err, res) => {
				if (err) throw err
				res.map((item) => {
					this.createModels(item._table)
				})
			}
		)
	}
	populateFile(rows) {
		let text = 'constructor(){\n\t'
		rows.map((row) => {
			text += 'this.' + row.Field + ' = null' + '\n\t'
		})
		text += '}'
		return text
	}
	async createModels(name) {
		const dir = './Models'
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir)
		}
		this.conn.query(`SHOW COLUMNS FROM ${name}`, (err, res) => {
			if (err) throw err
			let text = `class ${name}${
				'{\n\t' + this.populateFile(res)
			}\n}\nmodule.exports = ${name}`
			fs.promises.writeFile(`${dir}/${name}.js`, text)
		})
	}
}

const config = {
	host: 'localhost',
	user: 'root',
	database: 'gr',
	password: '1234',
}
let conn = new Connector(config)
