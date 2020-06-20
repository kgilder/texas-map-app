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
        //script.src = `https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js`;
        //script.src = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";
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
    const { fetchedMap, data } = this.state;
    if(!fetchedMap && data.length) {
      this.getMapClusterer();
    }  
  }

  getMapClusterer() {
    var { fetchedMap, data } = this.state;
    this.getGoogleMaps().then((google) => {

      var location = {lat: 30.2672, lng:-97.7431};

      var mapOptions = {
        zoom: 5, 
        center: location
      };

      const map = new google.maps.Map(document.getElementById('map'), mapOptions);

      var markers = [];

      data.map( row => {
        var geometry = row.Geolocation.split(",");
        const location = {lat: parseFloat(geometry[0]),lng: parseFloat(geometry[1])}
        //console.log('City location', row.Facility, row.City, row.County, location);
        var marker = new google.maps.Marker({
          position: location,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#0B5D93',
            fillOpacity: 1,
            strokeColor: '#0B5D93',
            strokeOpacity: 1,
          },
          //label: row.Facility
        });
        //markerClusterer.addMarker(marker);
        markers.push(marker);
        //console.log('MarkerClusterer', markerClusterer);
      });
      const markerClusterer = new MarkerClusterer(map, markers, {
        //imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        gridSize: 30,
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-1'
          },
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-2'
          },
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-3'
          }
        ],
        clusterClass: 'custom-clustericon'
      });

    });
    this.setState({ fetchedMap: true });
  }

  render () {
    const { fetchedMap, data } = this.state;
    return (
      <div id="map-container">
        <h3>My Google Maps Demo</h3>
        <div id="map" className="map"></div>
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
