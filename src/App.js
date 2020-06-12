import React from 'react';
import './texas-map-app.css';

class Map extends React.Component {

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
        const script = document.createElement("script");
        const API = 'AIzaSyDAh7M89BnID8kGVXBrNtxJfD-jjDDFRCg';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
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
    this.getGoogleMaps().then((google) => {
      const austin = {lat: 30.2672, lng:-97.7431};
      const map = new google.maps.Map(
        document.getElementById('map'), {
          zoom: 5, 
          center: austin
        });
      const marker = new google.maps.Marker( {
        position: austin, 
        map: map
      });
    });
  }

  render () {
    return (
      <div id="map-container">
        <h3>My Google Maps Demo</h3>
        <div id="map" className="map"></div>
      </div>
    );
  }
}

function App() {
  return (
    <Map />
  );
}

export default App;
