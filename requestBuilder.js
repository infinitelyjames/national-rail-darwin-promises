const templates = require('./templates.js');

class RequestBuilder {
  static applyOptions(requestXML, options) {
    let xml = requestXML;
    const optionDefaults = {
      timeOffset: [0, 'INT'],
      timeWindow: [120, 'INT'],
      rows: [15, 'INT'],
      destination: ['', 'TEXT'],
    };

    Object.keys(optionDefaults)
      .forEach((key) => {
        let value = optionDefaults[key][0];
        if (options && options[key]) {
          if (optionDefaults[key][1] === 'INT') {
            value = parseInt(options[key], 10);
          } else {
            value = options[key];
          }
        }
        xml = xml.replace(`$$${key.toUpperCase()}$$`, value);
      });

    return xml;
  }

  static getDepartureBoardRequest(station, options) {
    let requestXML = this.applyOptions(templates.departureBoard, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getDepartureBoardWithDetails(station, options) {
    let requestXML = this.applyOptions(templates.departureBoardWithDetails, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getArrivalsBoard(station, options) {
    let requestXML = this.applyOptions(templates.arrivalsBoard, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getArrivalsBoardWithDetails(station, options) {
    let requestXML = this.applyOptions(templates.arrivalsBoardWithDetails, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getArrivalsDepartureBoard(station, options) {
    let requestXML = this.applyOptions(templates.arrivalsDepartureBoard, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getArrivalsDepartureBoardWithDetails(station, options) {
    let requestXML = this.applyOptions(templates.arrivalsDepartureBoardWithDetails, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getServiceDetails(serviceId) {
    const requestXML = templates.serviceDetails.replace('$$SERVICEID$$', serviceId);
    return requestXML;
  }

  static getNextDeparture(station, destination, options) {
    const opts = options;
    opts.destination = destination;
    let requestXML = this.applyOptions(templates.nextDeparture, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getNextDepartureWithDetails(station, destination, options) {
    const opts = options;
    opts.destination = destination;
    let requestXML = this.applyOptions(templates.nextDepartureWithDetails, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getArrival(station, destination, options) {
    const opts = options;
    opts.destination = destination;
    let requestXML = this.applyOptions(templates.nextArrival, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getFastestDeparture(station, destination, options) {
    const opts = options;
    opts.destination = destination;
    let requestXML = this.applyOptions(templates.fastestDeparture, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }

  static getFastestDepartureWithDetails(station, destination, options) {
    const opts = options;
    opts.destination = destination;
    let requestXML = this.applyOptions(templates.fastestDepartureWithDetails, options);
    requestXML = requestXML.replace('$$FROM$$', station);
    return requestXML;
  }
}

module.exports = RequestBuilder;
