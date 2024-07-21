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
		conn.data['users'].get('*', (result) => {
			console.log(result)
		})

		conn.data['users'].insert({ id: 8, login: 'Remuru' }, 'id, login')

		conn.data['users'].get('*', (res) => {
			console.log(res)
		})
	})
	.catch((err) => {
		console.error(err)
	})
