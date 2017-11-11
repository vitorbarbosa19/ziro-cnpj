require('dotenv').config()
const url = require('url')
const axios = require('axios')

module.exports = (req, res) => {
	//set header to allow cross origin
	res.setHeader('Access-Control-Allow-Origin', '*')
	//stop annoying browser favicon request
	if(req.url === '/favicon.ico')
		res.end()
	//receive parsed query param CNPJ
	const cnpj = url.parse(req.url, true).query.cnpj
	axios({
		url: `https://www.receitaws.com.br/v1/cnpj/${cnpj}/days/60`,
		method: 'get',
		headers: {
			'Authorization': `Bearer ${process.env.TOKEN}`
		}
	})
	.then( (response) => {
		res.end(JSON.stringify(response.data))
	})
	.catch( (error) => {
		//remove the request property which contains circular structure so that JSON.stringify can work
		delete error.response.request
		res.end(JSON.stringify(error.response))
	})
}