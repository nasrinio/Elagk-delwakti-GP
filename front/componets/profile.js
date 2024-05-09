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
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

export default function Profile({navigation}) {
  const [profileInformation, setProfileInformation] = useState(null);


const logOut = async () => {
  try {
    // Retrieve the token from AsyncStorage
    const storedToken = await AsyncStorage.getItem("token");

    if (storedToken) {
      // Send a request to the logout endpoint
      const response = await axios.get(`${BASE_URL}/auth/logout`, {
        // Optionally, you can send the token as a parameter or in the request body
        headers: {
          Authorization: `elagk__ ${storedToken}`,
        },
      });
      console;
      // Check if logout was successful
      if (response.data.message === "Logout done") {
        // Clear the token from AsyncStorage
        await AsyncStorage.removeItem("token");
        // Navigate back to login screen
        navigation.navigate("LoginPage");
        // Optionally, navigate to the login screen or perform any other action
        Alert.alert("Logout", "You have been logged out successfully.");
      } else {
        // Handle errors
        Alert.alert("Error", "Failed to logout. Please try again later.");
      }
    } else {
      // Token not found in AsyncStorage, handle the case where the user is not authenticated
      Alert.alert("Error", "You are not logged in.");
    }
  } catch (error) {
    // Handle network errors or other exceptions
    Alert.alert("Error", "An error occurred. Please try again later.");
    console.error("An error occurred during logout:", error);
  }
};


  // to display the user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          const response = await axios.get(
            `${BASE_URL}/auth/profile`,
            {
              headers: {
                Authorization: `elagk__ ${storedToken}`,
              },
            }
          );

          console.log(response.data);

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
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount

  return (
    <View style={styles.profileContainer}>
      <View style={styles.titleView}>
        <Pressable onPress={() => navigation.navigate("NewDash")}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={30}
            color="grey"
            marginRight="15"
          />
        </Pressable>
        <Text style={styles.title}>your Profile</Text>
      </View>

      <View style={styles.profileView}>
        {profileInformation ? (
          <View style={styles.profileInfo}>
            {profileInformation.profilePicture && (
              <View style={styles.profilePictureView}>
                <View style={styles.profilePicture}>
                  <Image
                    source={{
                      uri: profileInformation.profilePicture.secure_url,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "100%",
                      borderWidth: 10,
                      borderColor: "#003F5F",
                    }}
                  />
                </View>
              </View>
            )}
            <View>
              {/* <Text style={{ color: "#003F5F", fontWeight: "bold" }}>
                User Profile
              </Text> */}
              <View style={styles.info}>
                <Text style={styles.textinfo}>
                  userame: {profileInformation.userName}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.textinfo}>
                  Email: {profileInformation.email}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.textinfo}>
                  Age: {profileInformation.age}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.textinfo}>
                  Gender: {profileInformation.gender}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.textinfo}>
                  Phone Number: {profileInformation.phoneNumber}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.textinfo}>
                  Street Name: {profileInformation.streetName}
                </Text>
              </View>
              <Pressable style={styles.info1} onPress={logOut}>
                <Text style={styles.textinfo1}>
                  Logout
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "blue",
    position: "relative",
    width: 428,
    height: 926,
    backgroundColor: "white",
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
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    padding: 50,
  },
  title: {
    fontWeight: "700",
    fontSize: 35,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#003F5F",
  },
  profileView: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  profileInfo: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "column",
    width: "100%",
  },
  profilePictureView: {
    height: 170,
    width: "40%",
    marginLeft: "25%",
    marginRight: "25%",
    marginBottom: 20,
  },
  info: {
    backgroundColor: "white",
    width: 400,
    height: 50,
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 10,
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  textinfo: {
    fontSize: 20,
    color: "#003F5F",
    fontWeight:'500',
  },
  info1: {
    backgroundColor: "red",
    width: 400,
    height: 50,
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 10,
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  textinfo1: {
    color: "white",
    textAlign: "center",
    fontWeight:"bold",
  }
});


