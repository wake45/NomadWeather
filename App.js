import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState} from "react";
import { View, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons'

const { height , width:SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  "Clouds" : "cloudy",
  "Clear" : "day-sunny",
  "Rain" : "rain",
  "Snow" : "snow",
  "Atmosphere" : "cloudy-gusts",
  "Drizzle" : "rains",
  "Thunderstorm" : "lightning",
}

//console.log(SCREEN_WIDTH);
//console.log(height);

export default function App() {
  const [gu, setGu] = useState();
  const [city, setCity] = useState("Loading....");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync(); 
    if(!granted){
      setOk(false);
    } 
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false})
    console.log(location);
    setCity(location[0].region);
    setGu(location[0].district);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
    //console.log(json.daily);
    //console.log(permission); //허가받은지 확인 canAskAgain granted
  }
  useEffect(() =>{
    getWeather();
  } , [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
      <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.guName}>{gu}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ?
        <View style={styles.day}>
          <ActivityIndicator color="white" size="large"/>
        </View>
        :
        days.map((day, index) =>
        <View key={index} style={styles.day}>
          <View style={{flexDirection:"row", alignItems:"flex-end", justifyContent:"space-between", width:"100%", paddingRight:"15%"}}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)} ℃</Text>
            <Fontisto name={icons[day.weather[0].main]} size={68} color="white"/>
          </View>
          
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>)
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex : 1,
    backgroundColor : "#FFBE0A"
  },
  city:{
    flex : 2,
    justifyContent : "center",
    alignItems : "center",
  },
  cityName:{
    fontSize : 55,
    fontWeight : 500,
    color : "white"
  },
  guName:{
    marginTop : 10,
    fontSize : 35,
    fontWeight : 500,
    color : "white"
  },
  weather:{

  },
  day:{
    width : SCREEN_WIDTH,
    marginLeft : 2
    //alignItems : "center",
  },
  temp:{
    fontSize: 75,
    color : "white"
  },
  description:{
    marginTop : -20,
    marginLeft : 7,
    fontSize : 40,
    color : "white"
  },
  tinyText : {
    fontSize : 15,
    marginLeft : 10,
    color : "white"
  }
})