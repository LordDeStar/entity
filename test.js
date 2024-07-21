const Connector = require('./entity')
const config = {
	host: 'localhost',
	user: 'root',
	database: 'testnodejs',
	password: '1234',
}
const conn = new Connector(config)
conn
	.createDbSets()
	.then(() => {
		conn.data['users'].myQuery(
			'insert into users (id, login) values (10, "qwerty")'
		)
		conn.data['users'].myQuery('select login from users;', (result) => {
			console.log(result)
		})
	})
	.catch((err) => {
		console.error(err)
	})
