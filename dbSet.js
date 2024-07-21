class dbSet {
	constructor(connection, table) {
		this.conn = connection
		this.table = table
		this.get = (fields = '*', handler) => {
			this.conn.query(`SELECT ${fields} FROM ${this.table}`, (err, res) => {
				if (err) throw err
				handler(res)
			})
		}
		//INSERT INTO `testnodejs`.`users` (`id`, `login`) VALUES ('4', 'test');
		this.insert = (entity, fields) => {
			let values = fields.split(', ')
			this.conn.query(
				`INSERT INTO ${this.table} (${values.map((val) => {
					return `${val}`
				})}) VALUES (${values.map((val) => {
					return !isNaN(entity[val]) ? `${entity[val]}` : `"${entity[val]}"`
				})})`,
				(err, res) => {
					if (err) throw err
					console.log('Insert state: OK')
				}
			)
		}
		this.myQuery = (query, handler) => {
			this.conn.query(query, (err, res) => {
				if (err) throw err
				if (!query.toLowerCase().startsWith('insert')) handler(res)
				else console.log('Insert state: OK')
			})
		}
	}
}

module.exports = dbSet
