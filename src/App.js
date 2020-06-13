import React from 'react';
import PropTypes from 'prop-types';
import './texas-map-app.css';
import Tabletop from 'tabletop';
import MarkerClusterer from '@google/markerclusterer';

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
        script.src = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";
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
      const markerClusterer = new MarkerClusterer(map, markers, {
       imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
       gridSize: 30
      });

      const geocoder = new google.maps.Geocoder()

      data.map( row => {
        geocoder.geocode( { 'address': row.City}, function (results, status) {
          console.log('City', row.City);
          if (status == 'OK') {
            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              label: row.City
            });
            markerClusterer.addMarker(marker);
            console.log('MarkerClusterer', markerClusterer);
          }
        });
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
