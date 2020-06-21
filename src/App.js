import React from 'react';
import PropTypes from 'prop-types';
import './texas-map-app.css';
import Tabletop from 'tabletop';
import MarkerClusterer from '@google/markerclustererplus';

// Custom clustericon class
//
//

class Map extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fetchedMap: false,
      data: [],
      selectedOption: props.value || 'all',
    }
  }

  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise((resolve) => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          const google = window.google;
          resolve(google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const API = 'AIzaSyDAh7M89BnID8kGVXBrNtxJfD-jjDDFRCg';
        var script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
        script.src = "https://googlemaps.github.io/v3-utility-library/packages/markerclustererplus/dist/markerclustererplus.min.js";
        script.async = true; 
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  componentDidMount() {
    Tabletop.init({
      key: '1-Efe9kHJNuxvoO4pz23ioAE3D_dbugnedqnahVuBMkk',
      //key: '1mOS1wggvyRUOpI-u2VabmnQ1yJPPEgOc2zdZjWxbAwQ',
      callback: googleData => {
        console.log('google sheet data --->', googleData)
        this.setState({ data: googleData });
      },
      simpleSheet: true
    });
  }

  componentDidUpdate() {
    const { fetchedMap, data, selectedOption } = this.state;
    if(!fetchedMap && data.length) {
      this.getMapClusterer();
    }  
  }

  getMapClusterer() {
    var { fetchedMap, data, selectedOption } = this.state;
    this.getGoogleMaps().then((google) => {

      var location = {lat: 30.2672, lng:-97.7431};

      var styledMapType = new google.maps.StyledMapType (
        [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#bdbdbd"
              },
              {
                "visibility": "on"
              },
              {
                "weight": 2
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#bdbdbd"
              },
              {
                "weight": 2
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#bdbdbd"
              },
              {
                "visibility": "on"
              },
              {
                "weight": 1.5
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              },
              {
                "visibility": "simplified"
              },
              {
                "weight": 0.5
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ],
        {name: 'TJI Map'}
      );

      var mapOptions = {
        zoom: 5, 
        minZoom: 5,
        center: location,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ['tji_map']
        }
      };

      const map = new google.maps.Map(document.getElementById('map'), mapOptions);

      map.mapTypes.set('tji_map', styledMapType);
      map.setMapTypeId('tji_map');

      var markers = [];
      var county_markers = [];
      var state_markers = [];
      var federal_markers = [];
      var young_markers = [];
      var middle_age_markers = [];
      var elderly_markers = [];
      var white_markers = [];
      var black_markers = [];
      var hispanic_markers = [];

      var color;
      var county_re = new RegExp("County");
      var state_re = new RegExp("State");
      var fed_re = new RegExp("Federal");
      var white_re = new RegExp("White");
      var black_re = new RegExp("Black");
      var hispanic_re = new RegExp("Hispanic");
      var other_re = new RegExp("Other\|unknown");
      const blue = '#0B5D93';
      const purple = '#634562';
      const red = '#CE2727'


      //Create InfoWindows for each facility
      var infoHash = {};

      data.map( row => {
        var geometry = row.Geolocation.split(",");
        const location = {lat: parseFloat(geometry[0]),lng: parseFloat(geometry[1])}
        //console.log('City location', row.Facility, row.City, row.County, location);
        if(selectedOption === "all") {
          color = blue;
        } else if(selectedOption === "facility") {
          if(county_re.test(row.FacilityType)) {
            color = blue;
          } else if (state_re.test(row.FacilityType)) {
            color = purple;
          } else if (fed_re.test(row.FacilityType)) {
            color = red;
          } else {
            color = blue;
          }
        } else if(selectedOption === "age") {
          if(18 < parseInt(row.Age) < 35) {
            color = blue;
          } else if(34 < parseInt(row.Age) < 65) {
            color = purple;
          } else if(64 < parseInt(row.Age)) {
            color = red;
          } else {
            color = blue;
          }
        } else if(selectedOption === "ethnicity"){
          if(white_re.test(row.Race)) {
            color = blue;
          } else if (black_re.test(row.Race)) {
            color = purple;
          } else if (hispanic_re.test(row.Race)) {
            color = red;
          } else {
            color = blue;
          }
        } else {
          color = blue;
        }
        var marker = new google.maps.Marker({
          position: location,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: color,
            strokeOpacity: 1,
          },
          label: {
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: '15px',
            text: '1'
          },
          info: {
            name: row.Name,
            dod: row.DateofDeath,
            age: row.Age,
            facility: row.Facility,
            facilityType: row.FacilityType,
            city: row.City,
            county: row.County
          }
        });
        if(county_re.test(row.FacilityType)) {
          county_markers.push(marker);
        } else if (state_re.test(row.FacilityType)) {
          state_markers.push(marker);
        } else if (fed_re.test(row.FacilityType)) {
          federal_markers.push(marker);
        } else {
          //markers.push(marker);
        }
        if(selectedOption === "all") {
          markers.push(marker); 
        } else if(selectedOption === "facility") {
          if(county_re.test(row.FacilityType)) {
            county_markers.push(marker);
          } else if (state_re.test(row.FacilityType)) {
          state_markers.push(marker);
          } else if (fed_re.test(row.FacilityType)) {
          federal_markers.push(marker);
          }
        } else if(selectedOption === "age") {
          if(parseInt(row.Age) < 35) {
            young_markers.push(marker);
          } else if(64 < parseInt(row.Age)) {
            elderly_markers.push(marker);
          } else {
            middle_age_markers.push(marker); 
          }
        } else if(selectedOption === "ethnicity"){
          if(white_re.test(row.Race)) {
            white_markers.push(marker);
          } else if (black_re.test(row.Race)) {
            black_markers.push(marker);
          } else if (hispanic_re.test(row.Race)) {
            hispanic_markers.push(marker); 
          }
        } else {
          markers.push(marker); 
        }
      });
      if(selectedOption === "all") {
      const markerClusterer = new MarkerClusterer(map, markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-county'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-county'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-county'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      } else if(selectedOption === "ethnicity") {
      const whiteClusterer = new MarkerClusterer(map, white_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-county'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-county'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-county'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      const blackClusterer = new MarkerClusterer(map, black_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-state'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-state'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-state'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      const hispanicClusterer = new MarkerClusterer(map, hispanic_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-federal'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-federal'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-federal'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      } else if(selectedOption === "age") {
      const youngClusterer = new MarkerClusterer(map, young_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-county'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-county'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-county'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      const middle_ageClusterer = new MarkerClusterer(map, middle_age_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-state'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-state'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-state'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      const elderlyClusterer = new MarkerClusterer(map, elderly_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-federal'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-federal'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-federal'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      } else if(selectedOption === "facility") {
      const countyClusterer = new MarkerClusterer(map, county_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-county'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-county'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-county'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      const stateClusterer = new MarkerClusterer(map, state_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-state'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-state'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-state'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      const federalClusterer = new MarkerClusterer(map, federal_markers, {
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-federal'
          },
          {
            width: 35,
            height: 35,
            className: 'custom-clustericon-federal'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-federal'
          }
        ],
        clusterClass: 'custom-clustericon'
      });
      }

//      map.addListener(countyClusterer, 'clusterclick', function(cluster) {
//        const markers = cluster.getMarkers();
//        var contentString = '<div id="content">'+
//                              '<div id="siteNotice">'+
//                              '</div>'+
//                              '<h1 id="firstHeading" class="firstHeading">' +
//                              markers[0].info.facility +
//                              '</h1>'+
//                              markers[0].info.facilityType + ', ' + markers[0].info.city + ', ' + markers[0].info.county + ' County, TX' +
//                              '<div id="bodyContent"><p>';
//        for(const marker in markers) {
//          contentString = contentString + 
//            '<b>' + markers[0].info.name + '</b>, died on ' + markers[0].info.dod + ' at the age of ' + markers[0].info.age + '</br>';
//        }
//        contentString = contentString + '</p></div></div>';
//        var infowindow = new google.maps.InfoWindow({
//          content: contentString,
//        });
//        infowindow.open(map);
//      });
    });
    this.setState({ fetchedMap: true });
  }

  handleOptionChange(event) {
    this.setState({fetchedMap: false });
    this.setState({selectedOption: event.target.value});
  }

  render () {
    const { fetchedMap, data } = this.state;
    return (
      <div id="map-container">
        <h3>My Google Maps Demo</h3>
        <div id="map" className="map"></div>
        <form>
          <div className="form-check">
            <label>
              <input type="radio" name="all" value="all" checked={this.state.selectedOption === "all"} onChange={this.handleOptionChange.bind(this)} className="form-check-input"/>
              All Deaths
            </label>
          </div>
          <div onChange={this.handleOptionChange.bind(this)} className="form-check">
            <label>
              <input type="radio" name="facility" value="facility" checked={this.state.selectedOption === "facility"} onChange={this.handleOptionChange.bind(this)} className="form-check-input"/>
              By Facility
            </label>
          </div>
          <div onChange={this.handleOptionChange.bind(this)} className="form-check">
            <label>
              <input type="radio" name="age" value="age" checked={this.state.selectedOption === "age"} onChange={this.handleOptionChange.bind(this)} className="form-check-input"/>
              By Age
            </label>
          </div>
          <div onChange={this.handleOptionChange.bind(this)} className="form-check">
            <label>
              <input type="radio" name="ethnicity" value="ethnicity" checked={this.state.selectedOption === "ethnicity"} onChange={this.handleOptionChange.bind(this)} className="form-check-input"/>
              By Ethnicity
            </label>
          </div>
        </form>
      </div>
    );
  }
}

Map.propTypes = {
  db: PropTypes.shape({
    sheet1: PropTypes.arrayOf(PropTypes.object)
  })
};

export default Map;
