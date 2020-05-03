import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import styled from "styled-components";

const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places`;

const PhoneNo = styled.p`
  color: #425af2;
`;

const Wrapper = styled.div`
  display: block;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-template-rows: auto;
  align-items: stretch;
  grid-column-gap: 0.5em;
`;
const Nested = styled.div`
  height: 309px;
  overflow-y: auto;
`;
const MapStyle = styled.div`
  margin: 2% auto;
  width: 100%;
  maxwidth: 800px;
  height: 50vh;
  minheight: 300px;
`;
const Cards = styled.div`
  border: 1px solid #eee;
  box-shadow: 0 2px 6px #bababa;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
`;

const map = {
  googleMap: null,
  marker: null,
  place: null,
};

const NrMap = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: 52.520008,
    longitude: 13.404954,
  });
  const [rec, setRec] = useState([]);
  const [plcDtl, setPlcDtl] = useState([]);

  const googleMapRef = useRef();

  //1
  useLayoutEffect(() => {
    console.log(
      "useLayoutEffect start",
      coordinates,
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
      map.marker,
      map.place,
    );
    const googleMapScript = document.createElement("script");
    googleMapScript.src = url;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener("load", () => {
      map.googleMap = createGoogleMap();
      map.marker = createMarker();
      map.place = places();
    });

    getMyLocation();

    return googleMapScript.removeEventListener("load", () => {
      map.googleMap = null;
      map.marker = null;
      map.place = null;
    });
  }, []);

  //2
  const createGoogleMap = () => {
    console.log(
      "createGoogleMap ini",
      coordinates,
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
      map.marker,
      map.place,
    );
    return new window.google.maps.Map(googleMapRef.current, {
      zoom: 13,
      center: {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      },
      disableDefaultUI: true,
    });
  };

  //3
  const places = () => {
    console.log(
      "places ini",
      coordinates,
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
      map.marker,
      map.place,
    );

    new window.google.maps.places.PlacesService(map.googleMap).nearbySearch(
      {
        location: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        },
        radius: 3000,
        type: ["hospital"],
      },
      (results, status) => {
        if (status !== "OK") return;
        setRec(results);
      },
    );

    console.log(
      "places end",
      coordinates,
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
      map.marker,
      map.place,
    );
  };

  useEffect(() => {
    console.log(
      "placeDetails useEffect",
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
    );
    if (rec && rec.length > 0) {
      placeDetails();
    }
  }, [rec]);

  useEffect(() => {
    console.log(
      "createMarker useEffect",
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
    );
    if (rec && rec.length > 0) {
      createMarker();
    }
  }, [rec]);

  const placeDetails = () => {
    console.log(
      "placeDetails ini",

      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
    );
    const hospitals = [];

    rec.map((place) => {
      let request = {
        placeId: place.place_id,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "opening_hours",
          "geometry",
          "icon",
        ],
      };
      new window.google.maps.places.PlacesService(map.googleMap).getDetails(
        request,
        (req, status) => {
          console.log(status);
          if (status == window.google.maps.places.PlacesServiceStatus.OK) {
            hospitals.push(req);
          }
        },
      );
    });
    console.log("hospitals", hospitals);
    setPlcDtl(hospitals);
  };

  const createMarker = () => {
    console.log(
      "createMarker ini",
      coordinates,
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
      map.marker,
      map.place,
    );
    let image = {
      url: "https://maps.gstatic.com/mapfiles/place_api/icons/doctor-71.png",
      size: new window.google.maps.Size(71, 71),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(17, 34),
      scaledSize: new window.google.maps.Size(25, 25),
    };
    rec.map((e) => {
      new window.google.maps.Marker({
        position: {
          lat: e.geometry.location.lat(),
          lng: e.geometry.location.lng(),
        },
        icon: image,
        animation: window.google.maps.Animation.DROP,
        map: map.googleMap,
      });
    });
    new window.google.maps.Marker({
      position: { lat: coordinates.latitude, lng: coordinates.longitude },
      map: map.googleMap,
    });

    console.log(
      "createMarker end",
      coordinates,
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
      map.marker,
      map.place,
    );
  };

  const getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation;

    if (location) {
      location.getCurrentPosition((position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
    console.log(
      "getMyLocation end",
      coordinates,
      rec,
      plcDtl,
      googleMapRef,
      map.googleMap,
      map.marker,
      map.place,
    );
  };

  return (
    <Wrapper>
      <Nested>
        {plcDtl.map((place) => {
          console.log("cards rerendered");
          return (
            <Cards key={`card-${place.name}`}>
              <h3>{place.name}</h3>
              <p>{place.formatted_address}</p>
              <PhoneNo>{place.formatted_phone_number}</PhoneNo>
            </Cards>
          );
        })}
      </Nested>
      <MapStyle id="google-map" ref={googleMapRef} />
    </Wrapper>
  );
};

export default NrMap;
