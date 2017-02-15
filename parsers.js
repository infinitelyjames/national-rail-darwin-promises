var xmldoc = require('xmldoc')

function parseLocation (location) {
  return {
    name: location.childNamed('lt4:locationName').val,
    crs: location.childNamed('lt4:crs').val
  }
}

function parseArrivalsBoardResponse (soapResponse) {
  var board = extractResponseObject(soapResponse, 'GetArrivalBoardResponse')
        .childNamed('GetStationBoardResult')
        .childNamed('lt5:trainServices')
  var trains = []
  board.eachChild(function (service) {
    trains.push(parseStandardService(service))
  })
  return {'trainServices': trains}
}

function parseArrivalsBoardWithDetails (soapResponse) {
  var board = extractResponseObject(soapResponse, 'GetArrBoardWithDetailsResponse')
        .childNamed('GetStationBoardResult')
        .childNamed('lt5:trainServices')
  var trains = []

  board.eachChild(function (service) {
    var train = parseStandardService(service)
    service.eachChild(function (element) {
      switch (element.name) {
        case 'lt5:previousCallingPoints':
          var previousCallingPoints = element.childNamed('lt4:callingPointList')
          train.previousCallingPoints = parseCallingPointList(previousCallingPoints)
          break
      }
    })
    trains.push(train)
  })

  return {'trainServices': trains}
}

function parseArrivalsDepartureBoard (soapResponse) {
  var board = extractResponseObject(soapResponse, 'GetArrivalDepartureBoardResponse')
        .childNamed('GetStationBoardResult')
        .childNamed('lt5:trainServices')
  var trains = []
  board.eachChild(function (service) {
    trains.push(parseStandardService(service))
  })
  return {'trainServices': trains}
}

function parseArrivalsDepartureBoardWithDetails (soapResponse) {
  var board = extractResponseObject(soapResponse, 'GetArrDepBoardWithDetailsResponse')
        .childNamed('GetStationBoardResult')
        .childNamed('lt5:trainServices')
  var trains = []

  board.eachChild(function (service) {
    var train = parseStandardService(service)
    service.eachChild(function (element) {
      switch (element.name) {
        case 'lt5:previousCallingPoints':
          var previousCallingPoints = element.childNamed('lt4:callingPointList')
          train.previousCallingPoints = parseCallingPointList(previousCallingPoints)
          break
        case 'lt5:subsequentCallingPoints':
          var subsequentCallingPoints = element.childNamed('lt4:callingPointList')
          train.subsequentCallingPoints = parseCallingPointList(subsequentCallingPoints)
          break
      }
    })
    trains.push(train)
  })

  return {'trainServices': trains}
}

function parseServiceIdResponse (soapResponse) {
  var serviceXml = extractResponseObject(soapResponse, 'GetServiceDetailsResponse')
        .childNamed('GetServiceDetailsResult')
  var service = parseStandardService(serviceXml)

  serviceXml.eachChild(function (element) {
    switch (element.name) {
      case 'lt4:previousCallingPoints':
        var previousCallingPoints = element.childNamed('lt4:callingPointList')
        service.previousCallingPoints = parseCallingPointList(previousCallingPoints)
        break
      case 'lt4:subsequentCallingPoints':
        var subsequentCallingPoints = element.childNamed('lt4:callingPointList')
        service.subsequentCallingPoints = parseCallingPointList(subsequentCallingPoints)
        break
    }
  })

  return {'serviceDetails': service}
}

function parseCallingPointList (soapCallingPointList) {
  var callingPoints = []
  soapCallingPointList.eachChild(function (child) {
    var callingPoint = {}
    child.eachChild(function (element) {
      switch (element.name) {
        case 'lt4:length':
          callingPoint.length = element.val
          break
        case 'lt4:crs':
          callingPoint.crs = element.val
          break
        case 'lt4:locationName':
          callingPoint.locationName = element.val
          break
        case 'lt4:st':
          callingPoint.st = element.val
          break
        case 'lt4:et':
          callingPoint.et = element.val
          break
      }
    })
    callingPoints.push(callingPoint)
  })
  return callingPoints
}

function extractResponseObject (soapMessage, response) {
  var parsed = new xmldoc.XmlDocument(soapMessage)
  return parsed.childNamed('soap:Body').childNamed(response)
}

function parseDepartureBoardResponse (soapResponse) {
  var board = extractResponseObject(soapResponse, 'GetDepartureBoardResponse')
        .childNamed('GetStationBoardResult')
        .childNamed('lt5:trainServices')
  var trains = []

  board.eachChild(function (service) {
    trains.push(parseStandardService(service))
  })
  return {'trainServices': trains}
}

function parseDepartureBoardWithDetailsResponse (soapResponse) {
  var board = extractResponseObject(soapResponse, 'GetDepBoardWithDetailsResponse')
        .childNamed('GetStationBoardResult')
        .childNamed('lt5:trainServices')
  var trains = []
  board.eachChild(function (service) {
    var train = parseStandardService(service)
    service.eachChild(function (element) {
      switch (element.name) {
        case 'lt5:subsequentCallingPoints':
          var subsequentCallingPoints = element.childNamed('lt4:callingPointList')
          service.subsequentCallingPoints = parseCallingPointList(subsequentCallingPoints)
          break
      }
    })
    trains.push(train)
  })
  return {'trainServices': trains}
}

function parseNextDestinationResponse (response) {
  var board = extractResponseObject(response, 'GetNextDeparturesResponse')
        .childNamed('DeparturesBoard')
        .childNamed('lt5:departures')
        .childNamed('lt5:destination')
  var trains = []

  board.eachChild(function (service) {
    trains.push(parseStandardService(service))
  })

  return {'trainServices': trains}
}

function parseNextDepartureWithDetailsResponse (response) {
  var board = extractResponseObject(response, 'GetNextDeparturesWithDetailsResponse')
        .childNamed('DeparturesBoard')
        .childNamed('lt5:departures')
        .childNamed('lt5:destination')
  var trains = []

  board.eachChild(function (service) {
    var train = parseStandardService(service)
    service.eachChild(function (element) {
      switch (element.name) {
        case 'lt5:subsequentCallingPoints':
          var subsequentCallingPoints = element.childNamed('lt4:callingPointList')
          service.subsequentCallingPoints = parseCallingPointList(subsequentCallingPoints)
          break
      }
    })
    trains.push(train)
  })

  return {'trainServices': trains}
}

function parseNextArrivalResponse (response) {
  var board = extractResponseObject(response, 'GetArrivalBoardResponse')
        .childNamed('GetStationBoardResult')
        .childNamed('lt5:trainServices')
  var trains = []

  board.eachChild(function (service) {
    trains.push(parseStandardService(service))
  })
  return {'trainServices': trains}
}

function parseFastestDeparture (response) {
  var board = extractResponseObject(response, 'GetFastestDeparturesResponse')
        .childNamed('DeparturesBoard')
        .childNamed('lt5:departures')
        .childNamed('lt5:destination')
  var trains = []
  board.eachChild(function (service) {
    trains.push(parseStandardService(service))
  })
  return {'trainServices': trains}
}

function parseFastestDepartureWithDetails (response) {
  var board = extractResponseObject(response, 'GetFastestDeparturesWithDetailsResponse')
        .childNamed('DeparturesBoard')
        .childNamed('lt5:departures')
        .childNamed('lt5:destination')
  var trains = []

  board.eachChild(function (service) {
    var train = parseStandardService(service)
    service.eachChild(function (element) {
      switch (element.name) {
        case 'lt5:subsequentCallingPoints':
          var subsequentCallingPoints = element.childNamed('lt4:callingPointList')
          service.subsequentCallingPoints = parseCallingPointList(subsequentCallingPoints)
          break
      }
    })
    trains.push(train)
  })
  return {'trainServices': trains}
}

function parseStandardService (service) {
  var train = {}
  service.eachChild(function (element) {
    switch (element.name) {
      case 'lt4:generatedAt':
        service.generatedAt = element.val
        break
      case 'lt4:std':
        train.std = element.val
        break
      case 'lt4:etd':
        train.etd = element.val
        break
      case 'lt4:sta':
        train.sta = element.val
        break
      case 'lt4:eta':
        train.eta = element.val
        break
      case 'lt4:platform':
        train.platform = element.val
        break
      case 'lt4:delayReason':
        train.delayReason = element.val
        break
      case 'lt4:serviceID':
        train.serviceId = element.val
        break
      case 'lt4:length':
        train.length = element.val
        break
      case 'lt4:operator':
        train.operator = element.val
        break
      case 'lt4:operatorCode':
        service.operatorCode = element.val
        break
      case 'lt5:rsid':
        service.rsid = element.val
        break
      case 'lt5:origin':
        var origin = element.childNamed('lt4:location')
        train.origin = parseLocation(origin)
        break
      case 'lt5:destination':
        var destin = element.childNamed('lt4:location')
        train.destination = parseLocation(destin)
        break
    }
  })
  return train
}

module.exports.parseArrivalsBoardWithDetails = parseArrivalsBoardWithDetails
module.exports.parseArrivalsDepartureBoard = parseArrivalsDepartureBoard
module.exports.parseArrivalsDepartureBoardWithDetails = parseArrivalsDepartureBoardWithDetails
module.exports.parseDepartureBoardResponse = parseDepartureBoardResponse
module.exports.parseDepartureBoardWithDetailsResponse = parseDepartureBoardWithDetailsResponse
module.exports.parseServiceIdResponse = parseServiceIdResponse
module.exports.parseArrivalsBoardResponse = parseArrivalsBoardResponse
module.exports.parseNextDestinationResponse = parseNextDestinationResponse
module.exports.parseNextDepartureWithDetailsResponse = parseNextDepartureWithDetailsResponse
module.exports.parseNextArrivalResponse = parseNextArrivalResponse
module.exports.parseFastestDeparture = parseFastestDeparture
module.exports.parseFastestDeparturesWithDetail = parseFastestDepartureWithDetails
