import React,{ useEffect, useState,useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity,Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Select } from "native-base";
import { Button } from "native-base";
import { NativeBaseProvider, Box ,CheckIcon ,FormControl,WarningOutlineIcon,Center,Modal,showModal,VStack,HStack,showModal2,Radio,showModal3,setShowModal,Skeleton} from "native-base";
import { Camera, CameraType } from "expo-camera";

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import HomeScreen from "./componets/HomeScreen";
import FirstPage from "./componets/FirstPage";
import LoginPage from "./componets/LoginPage";


import Pharmacies from "./componets/pharmacies";
import Findph from "./componets/findph";

import ResetPassword from "./componets/ResetPassword";
import axios from "axios";
import Dashboared from "./componets/dashboared";
import Sign from "./componets/sign";

import Prescription from "./componets/prescription";
import Profile from "./componets/profile";
import Reminder from "./componets/reminder";
import Displayrescription from "./componets/displaypresc";
import Insertreminder from "./componets/insertreminder";
import NewDash from "./componets/NewDash";
import * as Device from "expo-device";
import Reports from "./componets/reports";
import Alternative from "./componets/alternative";



const Stack = createNativeStackNavigator();

function App() {
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="Welcome"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FirstPage"
          component={FirstPage}
          options={{
            headerShown: false,
           
          }}
        />
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sign"
          component={Sign}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pharmacies"
          component={Pharmacies}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="findph"
          component={Findph}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewDash"
          component={NewDash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Prescription"
          component={Prescription}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reminder"
          component={Reminder}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Displayrescription"
          component={Displayrescription}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Insertreminder"
          component={Insertreminder}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reports"
          component={Reports}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Alternative"
          component={Alternative}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;
