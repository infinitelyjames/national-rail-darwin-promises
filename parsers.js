const xmldoc = require('xmldoc');

class Parsers {
  static parseArrivalsBoardResponse(soapResponse) {
    const board = this.getTrainServicesBoard(soapResponse, 'GetArrivalBoardResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        trains.push(this.parseStandardService(service));
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseArrivalsBoardWithDetails(soapResponse) {
    const board = this.getTrainServicesBoard(soapResponse, 'GetArrBoardWithDetailsResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        const train = this.parseStandardService(service);
        service.eachChild((element) => {
          if (element.name === 'lt7:previousCallingPoints') {
            const previousCallingPoints = element.childNamed('lt7:callingPointList');
            train.previousCallingPoints = this.parseCallingPointList(previousCallingPoints);
          }
        });
        trains.push(train);
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseArrivalsDepartureBoard(soapResponse) {
    const board = this.getTrainServicesBoard(soapResponse, 'GetArrivalDepartureBoardResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        trains.push(this.parseStandardService(service));
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseArrivalsDepartureBoardWithDetails(soapResponse) {
    const board = this.getTrainServicesBoard(soapResponse, 'GetArrDepBoardWithDetailsResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        const train = this.parseStandardService(service);
        service.eachChild((element) => {
          if (element.name === 'lt7:previousCallingPoints') {
            const previousCallingPoints = element.childNamed('lt7:callingPointList');
            train.previousCallingPoints = this.parseCallingPointList(previousCallingPoints);
          } else if (element.name === 'lt7:subsequentCallingPoints') {
            const subsequentCallingPoints = element.childNamed('lt7:callingPointList');
            train.subsequentCallingPoints = this.parseCallingPointList(subsequentCallingPoints);
          }
        });
        trains.push(train);
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseServiceDetails(soapResponse) {
    const serviceXml = this.extractResponseObject(soapResponse, 'GetServiceDetailsResponse')
      .childNamed('GetServiceDetailsResult');
    const service = this.parseStandardService(serviceXml);
    serviceXml.eachChild((element) => {
      if (element.name === 'lt7:previousCallingPoints') {
        const previousCallingPoints = element.childNamed('lt7:callingPointList');
        service.previousCallingPoints = this.parseCallingPointList(previousCallingPoints);
      }
      if (element.name === 'lt7:subsequentCallingPoints') {
        const subsequentCallingPoints = element.childNamed('lt7:callingPointList');
        service.subsequentCallingPoints = this.parseCallingPointList(subsequentCallingPoints);
      }
    });

    return { serviceDetails: service };
  }

  static parseDepartureBoardResponse(soapResponse) {
    const board = this.getTrainServicesBoard(soapResponse, 'GetDepartureBoardResponse');
    const trains = [];
    try {
      board.eachChild((service) => {
        trains.push(this.parseStandardService(service));
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseDepartureBoardWithDetailsResponse(soapResponse) {
    const board = this.getTrainServicesBoard(soapResponse, 'GetDepBoardWithDetailsResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        const train = this.parseStandardService(service);
        service.eachChild((element) => {
          if (element.name === 'lt7:subsequentCallingPoints') {
            const subsequentCallingPoints = element.childNamed('lt7:callingPointList');
            train.subsequentCallingPoints = this.parseCallingPointList(subsequentCallingPoints);
          }
        });
        trains.push(train);
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseNextDepartureResponse(response) {
    const board = this.getDepartureBoardDestination(response, 'GetNextDeparturesResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        trains.push(this.parseStandardService(service));
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseNextDepartureWithDetailsResponse(response) {
    const board = this.getDepartureBoardDestination(response, 'GetNextDeparturesWithDetailsResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        const train = this.parseStandardService(service);
        service.eachChild((element) => {
          if (element.name === 'lt7:subsequentCallingPoints') {
            const subsequentCallingPoints = element.childNamed('lt7:callingPointList');
            train.subsequentCallingPoints = this.parseCallingPointList(subsequentCallingPoints);
          }
        });
        trains.push(train);
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static parseFastestDeparture(response) {
    const board = this.getDepartureBoardDestination(response, 'GetFastestDeparturesResponse');
    const trains = [];

    try {
      board.eachChild((service) => {
        trains.push(this.parseStandardService(service));
      });
    } catch (e) {
      console.error(e);
    }
    return { trainServices: trains };
  }

  static parseFastestDepartureWithDetails(response) {
    const board = this.getDepartureBoardDestination(response, 'GetFastestDeparturesWithDetailsResponse');
    const trains = [];
    try {
      board.eachChild((service) => {
        const train = this.parseStandardService(service);
        service.eachChild((element) => {
          if (element.name === 'lt7:subsequentCallingPoints') {
            const subsequentCallingPoints = element.childNamed('lt7:callingPointList');
            train.subsequentCallingPoints = this.parseCallingPointList(subsequentCallingPoints);
          }
        });
        trains.push(train);
      });
    } catch (e) {
      console.error(e);
    }

    return { trainServices: trains };
  }

  static getTrainServicesBoard(response, responseType) {
    const board = this.extractResponseObject(response, responseType)
      .childNamed('GetStationBoardResult')
      .childNamed('lt7:trainServices');
    return board;
  }

  static parseStandardService(service) {
    const train = {};
    const s = service;
    service.eachChild((element) => {
      let origin;
      let destin;

      switch (element.name) {
        case 'lt4:generatedAt':
        case 'lt7:generatedAt':
          s.generatedAt = element.val;
          break;
        case 'lt4:std':
        case 'lt7:std':
          train.std = element.val;
          break;
        case 'lt4:etd':
        case 'lt7:etd':
          train.etd = element.val;
          break;
        case 'lt4:sta':
        case 'lt7:sta':
          train.sta = element.val;
          break;
        case 'lt4:eta':
        case 'lt7:eta':
          train.eta = element.val;
          break;
        case 'lt4:platform':
        case 'lt7:platform':
          train.platform = element.val;
          break;
        case 'lt4:delayReason':
        case 'lt7:delayReason':
          train.delayReason = element.val;
          break;
        case 'lt4:serviceID':
        case 'lt7:serviceID':
          train.serviceId = element.val;
          break;
        case 'lt4:length':
        case 'lt7:length':
          train.length = element.val;
          break;
        case 'lt4:operator':
        case 'lt7:operator':
          train.operator = element.val;
          break;
        case 'lt4:operatorCode':
        case 'lt7:operatorCode':
          train.operatorCode = element.val;
          break;
        case 'lt5:rsid':
        case 'lt7:rsid':
          train.rsid = element.val;
          break;
        case 'lt5:origin':
        case 'lt7:origin':
          origin = element.childrenNamed('lt4:location');
          train.origin = [];
          origin.forEach((loc) => {
            train.origin.push(this.parseLocation(loc));
          })
          break;
        case 'lt5:destination':
        case 'lt7:destination':
          destin = element.childrenNamed('lt4:location');
          train.destination = [];
          destin.forEach((loc) => {
            train.destination.push(this.parseLocation(loc));
          });
          break;
        default:
          break;
      }
    });
    return train;
  }

  static parseCallingPointList(soapCallingPointList) {
    const callingPoints = [];
    soapCallingPointList.eachChild((child) => {
      const callingPoint = {};
      child.eachChild((element) => {
        switch (element.name) {
          case 'lt7:length':
            callingPoint.length = element.val;
            break;
          case 'lt7:crs':
            callingPoint.crs = element.val;
            break;
          case 'lt7:locationName':
            callingPoint.locationName = element.val;
            break;
          case 'lt7:st':
            callingPoint.st = element.val;
            break;
          case 'lt7:et':
            callingPoint.et = element.val;
            break;
          default:
            break;
        }
      });
      callingPoints.push(callingPoint);
    });
    return callingPoints;
  }

  static extractResponseObject(soapMessage, response) {
    const parsed = new xmldoc.XmlDocument(soapMessage);
    return parsed.childNamed('soap:Body')
      .childNamed(response);
  }

  static parseLocation(location) {
    return {
      name: location.childNamed('lt4:locationName').val,
      crs: location.childNamed('lt4:crs').val,
    };
  }

  static getDepartureBoardDestination(response, responseType) {
    const board = this.extractResponseObject(response, responseType)
      .childNamed('DeparturesBoard')
      .childNamed('lt7:departures')
      .childNamed('lt7:destination');

    return board;
  }
}

module.exports = Parsers;
