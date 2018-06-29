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
	if (cnpj.length === 14) {
		axios.get(`https://ws.hubdodesenvolvedor.com.br/v2/cnpj/?cnpj=${cnpj}&token=${process.env.TOKEN}`)
			.then( (response) => {
				console.log(response.data.result)
				if (response.data.result) {
					const result = response.data.result
					const str = result.numero_de_inscricao
					result.cnpj = `${str.substr(0,2)}.${str.substr(2,3)}.${str.substr(5,3)}/${str.substr(8,4)}-${str.substr(12,2)}`
					result.atividade_principal = [result.atividade_principal]
					result.status = response.data.return
					res.end(JSON.stringify(result))
				} else {
					response.data.status = 'ERROR'
					throw response.data
				}
			})
			.catch( (error) => {
				console.log(error)
				res.end(JSON.stringify(error))
			})
	} else {
		res.end(JSON.stringify({ status: 'ERROR', message: 'Parâmetro CNPJ inválido'}))
	}
}