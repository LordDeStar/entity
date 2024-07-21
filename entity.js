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

	async createDbSets() {
		return new Promise((resolve, reject) => {
			this.conn.query(
				`SELECT TABLE_NAME AS _table FROM information_schema.TABLES WHERE TABLE_SCHEMA = "${this.databaseName}";`,
				async (err, res) => {
					if (err) {
						reject(err)
					} else {
						for (let item of res) {
							this.data[item._table] = new dbSet(this.conn, item._table)
						}
						resolve()
					}
				}
			)
		})
	}
}

module.exports = Connector
