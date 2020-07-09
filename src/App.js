import React from 'react';
import PropTypes from 'prop-types';
import './texas-map-app.css';
import Tabletop from 'tabletop';
import MarkerClusterer from '@google/markerclustererplus';


//
// Cluster Class Methods
//
// getCenter()
//
// getMarkers()
//
// getMap()
//
// getMarkerClusterer()
//
// MarkerClusterer Class Methods
//
// zoomOnClick
//

class Map extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      map: null,
      firstClusterer: null,
      secondClusterer: null, 
      thirdClusterer: null,
      fetchedMap: false,
      data: [],
      selectUpdate: true,
      selectedOption: props.value || 'all',
      firstLegendText: 'Deaths',
      secondLegendText: '',
      thirdLegendText: ''
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

  onMarkerClick(marker){
    this.getGoogleMaps().then((google) => {
      console.log('CLICK', marker, marker.info);
    });
  }

  onClusterClick(cluster){
    this.getGoogleMaps().then((google) => {
      console.log('CLICK', cluster.getCenter(), cluster.getMarkers());
      const markers = cluster.getMarkers();
      var facilities = {}; 
      var contentBodyString = '';
      markers.forEach(marker => {
        console.log('Current Marker', marker);
        if (!(marker.info.facility in facilities)) {
          facilities[marker.info.facility] = marker.info; 
        }
        contentBodyString = contentBodyString + 
          '<b>' + marker.info.name + '</b>, died on ' + marker.info.dod + ' at the age of ' + marker.info.age + '.</br>';
      });
      //var contentHeaderString = '<h1 id="firstHeading" class="firstHeading">';
      var contentHeaderString = '<div id="content">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<h1 id="firstHeading" class="firstHeading">'+
                            'Facilities:'+
                            '</h1>';
      Object.entries(facilities).forEach(facility => {
        console.log('Current Facility', facility); 
        var info = facility[1];
        console.log(info); 
        contentHeaderString = contentHeaderString + 
          '<b>' + info.facility +'</b>, ' 
          + info.facilityType + ', ' 
          + info.city + ', ' 
          + info.county + ' County, TX</br>';
      });
      //contentHeaderString = contentHeaderString + '</h1>' 
      var contentString = contentHeaderString + 
        '<div id="bodyContent"><p>' + 
        '<h1 id="bodyHeading" class="bodyHeading">' +
        'Deaths:' +
        '</h1>' +
        contentBodyString + 
        '</p></div></div>';
      console.log('Content', contentString); 
      var infowindow = new google.maps.InfoWindow({
        position: cluster.getCenter(),
        content: contentString,
      });
      infowindow.open(cluster.getMap());
    });
  }

  componentWillMount() {
    this.getGoogleMaps();
  }

  componentDidMount() {
    console.log("componentDidMount");
    Tabletop.init({
      key: '1-Efe9kHJNuxvoO4pz23ioAE3D_dbugnedqnahVuBMkk',
      callback: googleData => {
        this.setState({ data: googleData });
      },
      simpleSheet: true
    });

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

      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      map.mapTypes.set('tji_map', styledMapType);
      map.setMapTypeId('tji_map');

      const first_style = {
        gridSize: 30,
        zoomOnClick: false,
        minimumClusterSize: 1,
        styles: [
          {
            width: 20,
            height: 20,
            className: 'custom-clustericon-county'
          },
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-county'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-county'
          }
        ],
        clusterClass: 'custom-clustericon'
      };

      const second_style = {
        gridSize: 30,
        zoomOnClick: false,
        minimumClusterSize: 1,
        styles: [
          {
            width: 20,
            height: 20,
            className: 'custom-clustericon-state'
          },
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-state'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-state'
          }
        ],
        clusterClass: 'custom-clustericon'
      };

      const third_style = {
        gridSize: 30,
        zoomOnClick: false,
        minimumClusterSize: 1,
        styles: [
          {
            width: 20,
            height: 20,
            className: 'custom-clustericon-federal'
          },
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-federal'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-federal'
          }
        ],
        clusterClass: 'custom-clustericon'
      };

      var firstClusterer = new MarkerClusterer(map, [], first_style);
      google.maps.event.addListener(firstClusterer, 'click', this.onClusterClick.bind(this));
      var secondClusterer = new MarkerClusterer(map, [], second_style);      
      google.maps.event.addListener(secondClusterer, 'click', this.onClusterClick.bind(this));
      var thirdClusterer = new MarkerClusterer(map, [], third_style);
      google.maps.event.addListener(thirdClusterer, 'click', this.onClusterClick.bind(this));

      this.setState({ map: map,
                      firstClusterer: firstClusterer, 
                      secondClusterer: secondClusterer, 
                      thirdClusterer: thirdClusterer,
                      fetchedMap: true,
                    });
    });
  }

  componentDidUpdate() {
    const { map, firstClusterer, secondClusterer, thirdClusterer, fetchedMap, data, selectedOption, selectUpdate } = this.state;
    console.log("componentDidUpdate", fetchedMap, selectUpdate);
    if(fetchedMap && data.length && selectUpdate) {
      this.getMapClusterer();
      this.setState({ selectUpdate: false });
    }  
  }

  getMapClusterer() {
    var { map, firstClusterer, secondClusterer, thirdClusterer, fetchedMap, data, selectedOption, selectUpdate } = this.state;
    console.log("getMapClusterer", map, firstClusterer, secondClusterer, thirdClusterer);
    this.getGoogleMaps().then((google) => {

      firstClusterer.clearMarkers();
      secondClusterer.clearMarkers(); 
      thirdClusterer.clearMarkers(); 

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
      const red = '#CE2727';
      var firstMarkers = [];
      var secondMarkers = [];
      var thirdMarkers = []; 

      //Create InfoWindows for each facility
      var infoHash = {};

      data.map( row => {
        var geometry = row.Geolocation.split(",");
        const location = {lat: parseFloat(geometry[0]),lng: parseFloat(geometry[1])}
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
            scale: 10,
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 0,
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
        google.maps.event.clearListeners(marker, 'click');
        google.maps.event.addListener(marker, 'click', this.onMarkerClick.bind(this));

        if(selectedOption === "all") {
          firstMarkers.push(marker); 
        } else if(selectedOption === "facility") {
          if(county_re.test(row.FacilityType)) {
            firstMarkers.push(marker);
          } else if (state_re.test(row.FacilityType)) {
            secondMarkers.push(marker);
          } else if (fed_re.test(row.FacilityType)) {
            thirdMarkers.push(marker);
          }
        } else if(selectedOption === "age") {
          if(parseInt(row.Age) < 35) {
            firstMarkers.push(marker);
          } else if(64 < parseInt(row.Age)) {
            thirdMarkers.push(marker);
          } else {
            secondMarkers.push(marker); 
          }
        } else if(selectedOption === "ethnicity"){
          if(white_re.test(row.Race)) {
            firstMarkers.push(marker);
          } else if (black_re.test(row.Race)) {
            secondMarkers.push(marker);
          } else if (hispanic_re.test(row.Race)) {
            thirdMarkers.push(marker); 
          }
        }       

      });

      firstClusterer.addMarkers(firstMarkers, false); 
      secondClusterer.addMarkers(secondMarkers, false); 
      thirdClusterer.addMarkers(thirdMarkers, false); 
      this.setState({ map: map, 
                      firstClusterer: firstClusterer, 
                      secondClusterer: secondClusterer, 
                      thirdClusterer: thirdClusterer,  
                      selectUpdate: false
                    });

    });
  }

  handleOptionChange(event) {
    var selectedOption = event.target.value; 
    if(selectedOption == 'all'){
      var firstLegendText = "Deaths";
    } else if(selectedOption == 'facility') {
      var firstLegendText = "County Facilities Deaths";
      var secondLegendText = "State Facility Deaths";
      var thirdLegendText = "Federal Facility Deaths";
    } else if(selectedOption == 'age') {
      var firstLegendText = "Deaths, Ages Under 35";
      var secondLegendText = "Deaths, Ages 35-65";
      var thirdLegendText = "Deaths, Ages over 65";
    } else if(selectedOption == 'ethnicity') {
      var firstLegendText = "White Deaths";
      var secondLegendText = "Black Deaths";
      var thirdLegendText = "Hispanic Deaths";
    }
    this.setState({ selectedOption: selectedOption,
                    selectUpdate: true,
                    firstLegendText: firstLegendText,
                    secondLegendText: secondLegendText,
                    thirdLegendText: thirdLegendText
                  });
  }

  render () {
    const { map, firstClusterer, secondClusterer, thirdClusterer, fetchedMap, data, selectedOption, firstLegendText, secondLegendText, thirdLegendText } = this.state;
    return (
      <div id="map-container">
        <h3>My Google Maps Demo</h3>
        <div id="map" className="map"></div>
        <div id="form" className="form">
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
          { 1 ? null :
          <div onChange={this.handleOptionChange.bind(this)} className="form-check">
            <label>
              <input type="radio" name="ethnicity" value="ethnicity" checked={this.state.selectedOption === "ethnicity"} onChange={this.handleOptionChange.bind(this)} className="form-check-input"/>
              By Ethnicity
            </label>
          </div>
          }
        </form>
        </div>
        <div id="legend" className="legend">
          <div id="first" className="legend_item">
            <div id="legend-first" className="legend-text">{firstLegendText}</div>
            <div className="icon"><span className="legend-icon-county"></span></div>
          </div>
          { (selectedOption == 'all') ? null:
          <div>
          <div id="second" className="legend_item">
            <div id="legend-second" className="legend-text" >{secondLegendText}</div>
            <div className="icon" ><span  className="legend-icon-state"></span></div>
          </div>
          <div id="third" className="legend_item">
            <div id="legend-third" className="legend-text" >{thirdLegendText}</div>
            <div className="icon" ><span  className="legend-icon-federal"></span></div>
          </div>
          </div>
          }
        </div>
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
