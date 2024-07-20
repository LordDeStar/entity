const mysql = require('mysql2')
const set = require('./dbSet')
const fs = require('fs')
const dbSet = require('./dbSet')

class Connector {
	constructor(configs) {
		this.conn = mysql.createConnection(configs)
		this.databaseName = configs.database
		this.data = {}
	}

	async createModelFiles() {
		return new Promise((resolve, reject) => {
			this.conn.query(
				`SELECT TABLE_NAME AS _table FROM information_schema.TABLES WHERE TABLE_SCHEMA = "${this.databaseName}";`,
				async (err, res) => {
					if (err) {
						reject(err)
					} else {
						for (let item of res) {
							await this.createModels(item._table)
							this.data[item._table] = new dbSet(this.conn, item._table)
						}
						resolve()
					}
				}
			)
		})
	}
	populateFile(rows) {
		let text = 'constructor(){\n\n\t\t'
		rows.map((row) => {
			text += 'this.' + row.Field + ' = null' + '\n\t\t'
		})
		text += '\n\t}'
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

module.exports = Connector
