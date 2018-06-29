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
	axios.get(`https://ws.hubdodesenvolvedor.com.br/v2/cnpj/?cnpj=${cnpj}&token=${process.env.TOKEN}`)
	.then( (response) => {
		const result = response.data.result
		const str = result.numero_de_inscricao
		result.cnpj = `${str.substr(0,2)}.${str.substr(2,3)}.${str.substr(5,3)}/${str.substr(8,4)}-${str.substr(12,2)}`
		result.atividade_principal = [result.atividade_principal]
		res.end(JSON.stringify(response.data.result))
	})
	.catch( (error) => {
		res.end(JSON.stringify(error.response))
	})
}