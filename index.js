const url = require('url')
const request = require('request')

module.exports = (req, res) => {
	if(req.url === '/favicon.ico')
		res.end()
	else {
		res.setHeader('Access-Control-Allow-Origin', '*')
		const cnpj = url.parse(req.url, true).query.cnpj
		request(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
			(error, response, body) => {
				if(error) {
					setTimeout(request(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
						(error, response, body) => {
							if(error)
								res.end(error) //after two attemps it sends the error
							else
								res.end(body)		
						}
					), 10000) //try again in 10 seconds
				}
				else
					res.end(body) //body can contain error message regarding incorrect API usage, like 'invalid CNPJ'
			}
		)
	}
}