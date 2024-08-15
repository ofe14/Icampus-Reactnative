import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Button, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SIZES, COLORS } from '../../constants';

const covenantUniversityRegion = {
  latitude: 6.6744,
  longitude: 3.1606,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const covenantUniversityBounds = {
  northEast: {
    latitude: 6.6850,
    longitude: 3.1800,
  },
  southWest: {
    latitude: 6.6650,
    longitude: 3.1400,
  },
};

const locations = [
  {
    title: 'Peter hall',
    description: 'Male Hostel',
    latitude: 6.66844,
    longitude: 3.15452,
  },
  {
    title: 'Daniel hall',
    description: 'Male Hostel',
    latitude: 6.6718,
    longitude: 3.15257,
  },
  {
    title: 'Joseph hall',
    description: 'Male hostel',
    latitude: 6.67069,
    longitude:3.15306,
  },
  {
    title: 'Paul hall',
    description: 'Main Library',
    latitude: 6.67053,
    longitude: 3.1538,
  },
  {
    title: 'John hall',
    description: 'Main Library',
    latitude: 6.66929,
    longitude:3.15332,
  },
  {
    title: 'Dorcas hall',
    description: 'Female hostel',
    latitude:6.67188,
    longitude: 3.15695,
  },
  {
    title: 'Lydia hall',
    description: 'Female hostel',
    latitude:6.6722,
    longitude: 3.1545,
  },
  {
    title: 'Mary hall',
    description: 'Female hostel',
    latitude: 6.67193,
    longitude:3.15559,
  },
  {
    title: 'Deborah hall',
    description: 'Female hostel',
    latitude: 6.671,
    longitude: 3.15581,
  },
  {
    title: 'Esther hall',
    description: 'Female hostel',
    latitude: 6.66961,
    longitude: 3.15552,
  },
  {
    title: 'CMSS/CLDS',
    description: 'College of Development sudies',
    latitude: 6.67182,
    longitude: 3.16037,
  },
  {
    title: 'CST',
    description: 'College of Science and Technolofy',
    latitude: 6.67343,
    longitude: 3.15895,
  },
  {
    title: 'COE(MECH)',
    description: 'Department of Mechanical engineering',
    latitude:6.67333,
    longitude:3.16292,
  },
  {
    title: 'COE(CIVIL)',
    description: 'Department of Civil engineering',
    latitude:6.67461,
    longitude:3.16261,
  },
  {
    title: 'COE(EIE)',
    description: 'Department of Electrical and Electrical infromation engineering',
    latitude:6.6758,
    longitude:3.16251,
  },
  {
    title: 'COE(CHEM)',
    description: 'Department of Chemical and Petroleum Engineering',
    latitude:6.674,
    longitude:3.15736,
  },
  {
    title: 'Lecture Theatre',
    description: 'Lecture Theatre 1 & 2',
    latitude:6.67443,
    longitude:3.15914,
  },
  {
    title: 'University Library',
    description: 'Covenant university centre for learning',
    latitude: 6.67044,
    longitude: 3.15699,
  },
  {
    title: 'University Chapel',
    description: 'Covenant University Chapel',
    latitude:6.66994,
    longitude:3.1583,
  },
  {
    title: 'Cafeteria 1',
    description: 'Cafeteria 1',
    latitude: 6.66941,
    longitude: 3.15409,
  },
  {
    title: 'Cafeteria 2',
    description: 'Cafeteria 2',
    latitude: 6.67254,
    longitude:3.16191,
  },
  {
    title: 'Cucrid',
    description: 'Covenant University Centre for Research Innovation and Discovery',
    latitude: 6.67301,
    longitude:3.16105,
  },
  {
    title: 'Senate Building',
    description: 'Senate Building',
    latitude:6.67334,
    longitude:3.16039,
  },
  {
    title: 'Guest House',
    description: 'Covenant University Guest house',
    latitude:6.67301,
    longitude:3.16105,
  },
];

const GOOGLE_MAPS_APIKEY =process.env.GOOGLE_API_KEY;  

const Map_screen = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [startLocationLabel, setStartLocationLabel] = useState("Select Start Location");
  const [endLocationLabel, setEndLocationLabel] = useState("Select End Location");
  const [mapType, setMapType] = useState("standard");
  const mapRef = useRef(null);

  useEffect(() => {
    if (startLocation) {
      const location = locations.find(loc => loc.latitude === startLocation.latitude && loc.longitude === startLocation.longitude);
      if (location) {
        setStartLocationLabel(location.title);
      }
    }
  }, [startLocation]);

  useEffect(() => {
    if (endLocation) {
      const location = locations.find(loc => loc.latitude === endLocation.latitude && loc.longitude === endLocation.longitude);
      if (location) {
        setEndLocationLabel(location.title);
      }
    }
  }, [endLocation]);

  const handleRegionChange = (region) => {
    const { latitude, longitude } = region;
    const { northEast, southWest } = covenantUniversityBounds;

    if (latitude > northEast.latitude || latitude < southWest.latitude ||
      longitude > northEast.longitude || longitude < southWest.longitude) {
      mapRef.current.animateToRegion({
        latitude: covenantUniversityRegion.latitude,
        longitude: covenantUniversityRegion.longitude,
        latitudeDelta: covenantUniversityRegion.latitudeDelta,
        longitudeDelta: covenantUniversityRegion.longitudeDelta,
      }, 1000);
    }
  };

  const setCamera = () => {
    mapRef.current.animateCamera({
      center: {
        latitude: covenantUniversityRegion.latitude,
        longitude: covenantUniversityRegion.longitude,
      },
      pitch: 45,
      heading: 0,
      altitude: 2000,
      zoom: 17,
    });
  };

  const onSetRoute = () => {
    if (startLocation && endLocation) {
      mapRef.current.fitToCoordinates(
        [startLocation, endLocation],
        {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          animated: true,
        }
      );
    }
  };

  const onMapTypeChange = (itemValue) => {
    setMapType(itemValue);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={covenantUniversityRegion}
        onMapReady={setCamera}
        onRegionChangeComplete={handleRegionChange}
        mapType={mapType}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
            description={location.description}
          />
        ))}
        {startLocation && endLocation && (
          <MapViewDirections
            origin={startLocation}
            destination={endLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="#0000FF"
            mode="WALKING" // Set mode to walking
            optimizeWaypoints={true} // Optimize the route
            onError={(errorMessage) => {
              console.error(errorMessage);
            }}
            onReady={result => {
              console.log(result); // Log the result to debug
              setDistance(result.distance);
              setDuration(result.duration);
            }}
          />
        )}
      </MapView>
      <ScrollView style={styles.pickerContainer}>

        <Text>Start Location</Text>
        <Picker
          selectedValue={startLocation}
          style={styles.picker}
          onValueChange={(itemValue) => setStartLocation(itemValue)}
        >
          <Picker.Item label={startLocationLabel} value={null} />
          {locations.map((location, index) => (
            <Picker.Item
              key={index}
              label={location.title}
              value={{ latitude: location.latitude, longitude: location.longitude }}
            />
          ))}
        </Picker>
        <Text>End Location</Text>
        <Picker
          selectedValue={endLocation}
          style={styles.picker}
          onValueChange={(itemValue) => setEndLocation(itemValue)}
        >
          <Picker.Item label={endLocationLabel} value={null} />
          {locations.map((location, index) => (
            <Picker.Item
              key={index}
              label={location.title}
              value={{ latitude: location.latitude, longitude: location.longitude }}
            />
          ))}
        </Picker>
        <Text>Map Type</Text>
        <Picker
          selectedValue={mapType}
          style={styles.picker}
          onValueChange={onMapTypeChange}
        >
          <Picker.Item label="Standard" value="standard" />
          <Picker.Item label="Satellite" value="satellite" />
          <Picker.Item label="Hybrid" value="hybrid" />
          <Picker.Item label="Terrain" value="terrain" />
        </Picker>
        <Button title="Set Route" onPress={onSetRoute} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  infoBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor:COLORS.covenant,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
});

export default Map_screen;
