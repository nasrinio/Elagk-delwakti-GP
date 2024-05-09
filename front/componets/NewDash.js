import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";
import {
  NativeBaseProvider,
  Box,
  CheckIcon,
  FormControl,
  WarningOutlineIcon,
  Center,
  Modal,
  showModal,
  VStack,
  HStack,
  showModal2,
  Radio,
  showModal3,
  setShowModal,
  Skeleton,
  Spinner,
  Heading,
} from "native-base";

import { BASE_URL } from "./config";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faKitMedical, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPrescription } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";


import { useNavigation } from "@react-navigation/native";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

library.add(faArrowRight);

library.add(faCalendarDays);

library.add(faUser);

library.add(faPrescription);

library.add(faMagnifyingGlass);
library.add(faBell);
library.add(faPhone);
library.add(faPen);
library.add(faCheck);

export default function NewDash({ navigation }) {
  // const [records, onChangeRecords] = useState("");
  // const [prescriptions, setPrescriptions] = useState([]);


  const logOut = async () => {
  try {
    // Retrieve the token from AsyncStorage
    const storedToken = await AsyncStorage.getItem('token');
    
    if (storedToken) {
      // Send a request to the logout endpoint
      const response = await axios.get(`${BASE_URL}/auth/logout`, {
        // Optionally, you can send the token as a parameter or in the request body
        headers: {
          Authorization: `elagk__ ${storedToken}`,
        },
      });
console
      // Check if logout was successful
      if (response.data.message === 'Logout done') {
        // Clear the token from AsyncStorage
        await AsyncStorage.removeItem('token');
        // Navigate back to login screen
        navigation.navigate('LoginPage');
        // Optionally, navigate to the login screen or perform any other action
        Alert.alert('Logout', 'You have been logged out successfully.');
      } else {
        // Handle errors
        Alert.alert('Error', 'Failed to logout. Please try again later.');
      }
    } else {
      // Token not found in AsyncStorage, handle the case where the user is not authenticated
      Alert.alert('Error', 'You are not logged in.');
    }
  } catch (error) {
    // Handle network errors or other exceptions
    Alert.alert('Error', 'An error occurred. Please try again later.');
    console.error('An error occurred during logout:', error);
  }
};

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Retrieve the token from AsyncStorage
  //       const storedToken = await AsyncStorage.getItem("token");
  //       // const secureUrl = myObject && myObject.secure_url;
  //       if (storedToken) {
  //         const response = await axios.get(`${BASE_URL}/prescription/`, {
  //           headers: {
  //             Authorization: `elagk__ ${storedToken}`,
  //           },
  //         });

  //         if (response.data.message === "Success") {
  //           setPrescriptions(response.data.prescriptions);
  //         } else {
  //           console.error(
  //             "Error fetching prescriptions:",
  //             response.data.message
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       console.error("An error occurred during the request:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Retrieve the token from AsyncStorage
  //       const storedToken = await AsyncStorage.getItem("token");

  //       if (storedToken) {
  //         const response = await axios.get(
  //           `${BASE_URL}/prescription/ `, // Adjust the API endpoint
  //           {
  //             headers: {
  //               Authorization: `elagk__ ${storedToken}`,
  //             },
  //           }
  //         );

  //         if (response.data.message === "Success") {
  //           setPrescriptions(response.data.prescriptions);
  //         } else {
  //           console.error(
  //             "Error fetching prescriptions:",
  //             response.data.message
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       console.error("An error occurred during the request:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  const [profileInformation, setProfileInformation] = useState(null);

  // to display the user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          const response = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
            },
          });

          // console.log(response.data);

          if (response.data.message === "Success") {
            // Set the entire user profile information
            setProfileInformation(response.data.user);
          } else {
            console.error(
              "Error fetching user profile:",
              response.data.message
            );
          }
        }
      } catch (error) {
        console.error("An error occurred during the request:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency arr

  return (
    <NativeBaseProvider>
      <ScrollView style={styles.DashboaredContainer}>
        <View style={styles.titleView}>
          <Image source={require("../assets/dashicon2.png")} />
          <Text style={styles.title}>Elagk Dlwakty</Text>
        </View>
        <View style={styles.Profilecontainer}>
          {profileInformation ? (
            <>
              <Text
                style={{ color: "#3987AF", fontWeight: "bold", fontSize: 20 }}
              >
                Welcome, {profileInformation.userName}!
              </Text>
              <Image
                style={{
                  alignSelf: "center",
                  width: 70,
                  height: 70,
                  marginTop: 10,
                  borderRadius: 100,
                }}
                source={{ uri: profileInformation.profilePicture.secure_url }} // Assuming there's an avatar URL in the profile data
              />
            </>
          ) : (
            <HStack space={2} justifyContent="center">
              <Spinner accessibilityLabel="Loading posts" />
              <Heading color="primary.500" fontSize="md">
                Loading
              </Heading>
            </HStack>
          )}
          <Text style={{ color: "#3987AF", alignSelf: "center" }}>
            active{" "}
            <View
              style={{
                backgroundColor: "green",
                width: 15,
                height: 15,
                borderRadius: "100%",
              }}
            ></View>
          </Text>
          <View>
            {/* <TouchableOpacity onPress={logOut}>
              <Text
                style={{ color: "#3987AF", fontWeight: "bold", fontSize: 15 }}
              >
                Logout
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={styles.advcontainer}>
          <Text style={{ color: "#3987AF", fontWeight: "bold", fontSize: 20 }}>
            Advertisement !
          </Text>
          <View style={styles.adv}>
            <Image
              style={{
                width: 160,
                height: 120,
                borderRadius: 15,
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.3,
                elevation: 10,
              }}
              source={require("../assets/213ece70921d31c5121705fe800fb6aa.jpg")}
            />
            <Image
              style={{
                width: 160,
                height: 120,
                borderRadius: 15,
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.3,
                elevation: 10,
              }}
              source={require("../assets/wen-jie-wang-dm2p-18b-wangwenjie-z-06-01.jpg")}
            />
          </View>
          {/* <View style={styles.adv}>
            <Image
              style={{
                width: 160,
                height: 120,
                borderRadius: 15,
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.3,
                elevation: 10,
              }}
              source={require("../assets/khrisnanda-pradipta-product-advertising-iv-before.jpg")}
            />
            <Image
              style={{
                width: 160,
                height: 120,
                borderRadius: 15,
                shadowOffset: { width: 10, height: 10 },
                shadowOpacity: 0.3,
                elevation: 10,
              }}
              source={require("../assets/advertising-poster-for-cosmetic-product-vector-20382786.jpg")}
            />
          </View> */}
        </View>
        <View style={styles.servicesection}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Our services
          </Text>
          <View style={styles.mainsection}>
            <Pressable
              style={styles.mainbutton}
              onPress={() => navigation.navigate("Prescription")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faPen}
                color="#3987AF"
                size={28}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                insert Prescriptions
              </Text>
            </Pressable>
            <Pressable
              style={styles.mainbutton}
              onPress={() => navigation.navigate("Pharmacies")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faMagnifyingGlass}
                color="#3987AF"
                size={28}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                find
                {"\n"}pharmacies
              </Text>
            </Pressable>
            <Pressable
              style={styles.mainbutton}
              onPress={() => navigation.navigate("Insertreminder")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faCalendarDays}
                color="#3987AF"
                size={28}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                insert reminders
              </Text>
            </Pressable>
          </View>
          <View style={styles.mainsection}>
            <Pressable
              style={styles.mainbutton}
              onPress={() => navigation.navigate("Alternative")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faKitMedical}
                color="#3987AF"
                size={28}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Alternative
                {"\n"}medicine
              </Text>
            </Pressable>
            <Pressable
              style={styles.mainbutton}
              onPress={() => navigation.navigate("Reminder")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faBell}
                color="#3987AF"
                size={28}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                your
                {"\n"}reminders
              </Text>
            </Pressable>
            <Pressable
              style={styles.mainbutton}
              onPress={() => navigation.navigate("Displayrescription")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faPrescription}
                color="#3987AF"
                size={28}
              />
              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                your prescriptions
              </Text>
            </Pressable>
          </View>
          <View style={styles.mainsection}>
            <Pressable
              style={styles.mainbutton1}
              onPress={() => navigation.navigate("Profile")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faUser}
                color="#3987AF"
                size={28}
              />

              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                your profile
              </Text>
            </Pressable>
            <Pressable
              style={styles.mainbutton1}
              onPress={() => navigation.navigate("Reports")}
            >
              <FontAwesomeIcon
                style={styles.icons}
                icon={faPaperclip}
                color="#3987AF"
                size={28}
              />

              <Text
                style={{
                  marginTop: 10,
                  color: "#3987AF",
                  fontSize: 15,
                  textAlign: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                your Reports
              </Text>
            </Pressable>
          </View>
        </View>
        {/* <View style={styles.navbar}>
        

      </View> */}
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  DashboaredContainer: {
    backgroundColor: "#3987AF",
    position: "relative",
    width: 428,
    height: 926,
    paddingBottom: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    textAlign: "center",
  },
  titleView: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 50,
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
    textAlign: "center",
    textTransform: "capitalize",
    color: "white",
  },
  view2: {
    width: "60%",
    marginLeft: "20%",
    marginRight: "20%",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  navigationSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
  },
  navbar: {
    flexDirection: "row",
    border: "1px solid black",
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
    backgroundColor: "#105FD3",
    padding: 20,
    justifyContent: "center",
    borderRadius: 15,
  },
  iconNav: {
    backgroundColor: "white",
    color: "white",
    width: 50,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 14,
  },
  main: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    height: 500,
    // backgroundColor: "white",
    // borderRadius: 15,
    // shadowOffset: { width: 10, height: 10 },
    // shadowOpacity: 0.3,
    // elevation: 10,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  mainsection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",

    marginTop: 10,
  },
  mainbutton: {
    backgroundColor: "white",
    width: 120,
    height: 120,
    borderRadius: 15, // half of width/height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
  },
  mainbutton1: {
    backgroundColor: "white",
    width: "47.5%",
    height: 120,
    borderRadius: 15, // half of width/height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
  },
  icons: {
    fontSize: 50,
  },
  Profilecontainer: {
    backgroundColor: "white",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    height: "auto",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
  },
  advcontainer: {
    backgroundColor: "white",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    height: "auto",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 20,
  },
  adv: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  servicesection: {
    backgroundColor: "#3987AF",
    width: "100%",

    height: "auto",
    borderRadius: 15,

    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 20,
  },
  navbar: {
    flexDirection: "row",
    border: "1px solid black",
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
    height: 75,
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    marginBottom: 30,
  },
});
