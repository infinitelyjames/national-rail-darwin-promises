var parsers = require('./parsers.js')
var fs = require('fs')
var fileContent = fs.readFileSync('./exampleResponses/serviceDetails.xml', 'UTF-8')

var parsedResult = parsers.parseServiceIdResponse(fileContent)

console.log(parsedResult)
