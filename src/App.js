import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './API';
import LogEntryForm from "./LogEntryForm";
import mapboxgl from "mapbox-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

function App() {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({

  })
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7,
    longitude: -95.665,
    zoom: 3
  });
  const [addEntryLocation, setAddEntryLocation] = useState(null);

  const showAddMarkerPopup = (e) => {
    const [ longitude, latitude ] = e.lngLat;
    setAddEntryLocation({ latitude, longitude });
  };

  const getEntries = async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
  }

  const renderRatingStars = (num) => {
    let ratingArr = [];
    const starSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#F3B73E">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>

    for(let i = 1; i <= num; i++) {
      ratingArr.push(starSvg);
    }

    return (
      <>
        {
          ratingArr.map((star,idx) => (
          <span className="star-icon" key={idx}>
            {star}
          </span>
        ))
        }
      </>
    )
  }

  useEffect(() => {
    getEntries();
  }, [])

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map(entry => (
        <React.Fragment key={entry._id}>
          <Marker
            longitude={entry.longitude} 
            latitude={entry.latitude} 
            >
              <svg
                    onClick={() => setShowPopup({ [entry._id]: true })}
                    className="marker yellow"
                    style={{
                      height: `${6 * viewport.zoom}px`,
                      width: `${6 * viewport.zoom}px`,
                    }}
                    version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                    <g>
                      <g>
                        <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                          c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                          c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
                      </g>
                    </g>
                  </svg>
          </Marker>
          {showPopup[entry._id] ? (
            <Popup
              longitude={entry.longitude} 
              latitude={entry.latitude} 
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
              anchor="top"
              >
                <div className="popup">
                  <h3>{entry.title}</h3>
                  <div className="rating">
                    {
                      renderRatingStars(entry.rating)
                    }
                  </div>
                  <p>{entry.comments}</p>
                  <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                  {entry.image ? <img src={entry.image} alt={entry.title} /> : null}
                </div>
              </Popup>
              ) : null}
        </React.Fragment>
          ))}
        {addEntryLocation ? (
          <>
          <Marker
            longitude={addEntryLocation.longitude} 
            latitude={addEntryLocation.latitude} 
            >
              <svg
                    className="marker red"
                    style={{
                      height: `${6 * viewport.zoom}px`,
                      width: `${6 * viewport.zoom}px`,
                    }}
                    version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                    <g>
                      <g>
                        <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                          c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                          c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
                      </g>
                    </g>
                  </svg>
          </Marker>
          <Popup
              longitude={addEntryLocation.longitude} 
              latitude={addEntryLocation.latitude} 
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="top"
              >
                <div className="popup">
                  <LogEntryForm onClose={() => { setAddEntryLocation(null); getEntries() }} location={addEntryLocation} />
                </div>
              </Popup> 
          </>
        ) : null }
    </ReactMapGL>
  );
}

export default App;
