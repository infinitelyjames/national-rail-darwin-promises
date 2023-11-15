# Do not use, code is not currently stable


### Introduction
A fork of [national-rail-darwin](https://github.com/d5039m/national-rail-darwin) which replaces callbacks with JS promises. This package also replaces deprecated code and packages, and refractors the codebase to use JS Class syntax and other ES6+ improvements.

`national-rail-darwin-promises` aims to give you json object representations of the SOAP responses from National Rail's Darwin api. Details of the api can be found [here](http://lite.realtime.nationalrail.co.uk/openldbws/). You will need to get an API token to access Darwin, this requires registration. You can signup at [http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/](http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/).

Currently only CRS codes are supported, a future update will allow full station names to be used. You can find a complete list of CRS codes on the [ National Rail website](http://www.nationalrail.co.uk/stations_destinations/48541.aspx).

### Installation

```
npm install national-rail-darwin-promises
```

### Usage

All 11 requests exposed by the Darwin api are available in `national-rail-darwin`
- getDepartureBoard(crsCode, options)
- getArrivalsBoard(crsCode, options)
- getArrivalsBoardWithDetails(crsCode, options)
- getArrivalsDepartureBoard(crsCode, options)
- getArrivalsDepartureBoardWithDetails(crsCode, options)
- getServiceDetails(serviceId)
- getNextDeparture(crsCode, destinationCrsCode, options)
- getNextDepartureWithDetails(crsCode, destinationCrsCode, options)
- getDepartureBoardWithDetails(crsCode, options)
- getFastestDeparture(crsCode, destinationCrsCode, options)
- getFastestDepartureWithDetails(crsCode, destinationCrsCode, options)

Additional functions
- getStationDetails(Station)


Your api token can either be provided when the client is created or picked up from the environment variable `DARWIN_TOKEN`.

```
  var Rail = require('national-rail-darwin')
  var rail = new Rail() // or -> new Rail(DARWIN_TOKEN)
```

### Options

Some functions take an options object. See the specific method definitions for details of these.

### Methods

All methods return arrays of basic service objects of the form:
```
{
  sta: '23:57',
  eta: 'On time',
  std: '23:57',
  etd: 'On time',
  platform: '2',
  delayReason: null,
  origin: {
    name:<stationname>,
    crs:<crsCode>
  },
  destination: {
    name:<stationname>,
    crs:<crsCode>
  },
  length: '5',
  serviceId: 'xxxxxxxxxxxxxxxx+xx/xxx=='
}
```

#### getDepartureBoard
```javascript
rail.getDepartureBoard('WAT', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```

Gets all public departures for the supplied station within 2 hours.
Options:
'destination': Only show trains that call at the supplied station.
'rows': Maximum number of services to retrieve (1 - 149).

#### getArrivalsBoard

```javascript
rail.getArrivalsBoard('PUT', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```

Similar to getDepartureBoard but shows arrivals within the next two hours.
Options:
'destination': Only show trains that have called at the supplied station.
'rows': Maximum number of services to retrieve.

#### getArrivalsBoardWithDetails

```javascript
rail.getArrivalsBoardWithDetails('PUT', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Adds service details including previous calling points to the getArrivalsBoardResult.
Options:
'destination': Only show trains that have called at the supplied station.
'rows': Maximum number of services to retrieve.

#### getArrivalsDepartureBoard

```javascript
rail.getArrivalsDepartureBoard('PUT', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Returns all public arrivals and departures for the supplied CRS code within 2 hours.
Options:
'destination': Only show trains that have called at the supplied station.
'rows': Maximum number of services to retrieve.

#### getArrivalsDepartureBoardWithDetails

```javascript
rail.getArrivalsDepartureBoardWithDetails('PUT', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Returns array of train services with both previous and subsequent calling points included for each service.
Options:
'destination': Only show trains that have called at the supplied station.
'rows': Maximum number of services to retrieve.

#### getServiceDetails
```javascript
rail.getServiceDetails('SERVICE ID')
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```

Gets detailed information about a particular service relative to the station that generated the serviceId. ServiceId is returned from other calls such as getDepartureBoard or getNextDeparture. The object returns includes all calling points of the service requested. The data is only available while the particular service is showing on the station departure board. This is normally for up to two minutes after the service is expected to depart.

#### getNextDeparture
```javascript
rail.getNextDeparture(crsCode, destinationCrsCode, {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Returns the next train leaving from supplied station calling at the destination CRS Code.

#### getNextDepartureWithDetails
```javascript
rail.getNextDepartureWithDetails(crsCode, destinationCrsCode, {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Returns the next train leaving from supplied station calling at the destination CRS Code within two hours including subsequent calling points.

#### getDepartureBoardWithDetails
```javascript
rail.getDepartureBoardWithDetails('WAT', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Adds a list of future calling points to the standard departure board response.
'destination': Only show trains that call at the supplied station.
'rows': Maximum number of services to retrieve.

#### getFastestDeparture
```javascript
rail.getFastestDeparture('from', 'destination crs', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Returns the service with the earliest arrival time at the destination station leaving from the supplied station.

#### getFastestDepartureWithDetails
```javascript
rail.getFastestDepartureWithDetails('from', 'destination crs', {})
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Same response as getFastestDeparture but includes service details such as previous and subsequent calling points.

#### getStationDetails
```javascript
rail.getStationDetails('Leeds')
    .then((result) => {
        // Do stuff 
    })
    .catch((error) => {
        // Handle errors
    });
```
Look up station details including CRSCode from the full station name
