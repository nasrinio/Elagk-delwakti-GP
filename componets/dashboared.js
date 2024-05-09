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
} from "native-base";

import { BASE_URL } from "./config";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell } from "@fortawesome/free-solid-svg-icons";
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

export default function Dashboared({ navigation }) {
  const [records, onChangeRecords] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");
        // const secureUrl = myObject && myObject.secure_url;
        if (storedToken) {
          const response = await axios.get(`${BASE_URL}/prescription/`, {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
            },
          });

          if (response.data.message === "Success") {
            setPrescriptions(response.data.prescriptions);
          } else {
            console.error(
              "Error fetching prescriptions:",
              response.data.message
            );
          }
        }
      } catch (error) {
        console.error("An error occurred during the request:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");
    
        if (storedToken) {
          const response = await axios.get(
            `${BASE_URL}/prescription/ `, // Adjust the API endpoint
            {
              headers: {
                Authorization: `elagk__ ${storedToken}`,
              },
            }
          );

          if (response.data.message === "Success") {
            setPrescriptions(response.data.prescriptions);
          } else {
            console.error(
              "Error fetching prescriptions:",
              response.data.message
            );
          }
        }
      } catch (error) {
        console.error("An error occurred during the request:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.DashboaredContainer}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Welcome !</Text>
        <Image source={require("../assets/trailing-icon.png")} />
      </View>
      <View style={styles.navigationSection}>
        <View style={styles.navbar}>
          <Pressable
            style={styles.iconNav}
            onPress={() => navigation.navigate("Prescription")}
          >
            <FontAwesomeIcon icon={faPrescription} color="#105FD3" />
          </Pressable>

          <Pressable
            style={styles.iconNav}
            onPress={() => navigation.navigate("Pharmacies")}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} color="#105FD3" />
          </Pressable>
          <Pressable
            style={styles.iconNav}
            onPress={() => navigation.navigate("Profile")}
          >
            <FontAwesomeIcon icon={faUser} color="#105FD3" />
          </Pressable>
          <Pressable
            style={styles.iconNav}
            onPress={() => navigation.navigate("Insertreminder")}
          >
            <FontAwesomeIcon icon={faCalendarDays} color="#105FD3" />
          </Pressable>
        </View>
      </View>
      {/* <View style={styles.view2}>
        <TextInput
          style={styles.input}
          value={records}
          onChangeText={onChangeRecords}
          placeholder={"  search your records"}
          placeholderTextColor="grey"
          clearButtonMode="always"
        />

        <Pressable style={styles.iconButton}>
          <FontAwesomeIcon icon="bell" size={25} color="white" />
        </Pressable>
      </View> */}
      <View style={styles.main}>
        <Pressable
          style={styles.dashbutton}
          onPress={() => navigation.navigate("Displayrescription")}
        >
          <Text
            style={{ color: "#105FD3", marginRight: 15, fontWeight: "bold" }}
          >
            your prescriptions
          </Text>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right" color="#105FD3" />
        </Pressable>
        <Pressable
          style={styles.dashbutton}
          onPress={() => navigation.navigate("Reminder")}
        >
          <Text
            style={{ color: "#105FD3", marginRight: 15, fontWeight: "bold" }}
          >
            your reminders
          </Text>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right" color="#105FD3" />
        </Pressable>
        <Pressable
          style={styles.dashbutton}
          onPress={() => navigation.navigate("")}
        >
          <Text
            style={{ color: "#105FD3", marginRight: 15, fontWeight: "bold" }}
          >
            find pharmacy
          </Text>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right" color="#105FD3" />
        </Pressable>
        <Pressable
          style={styles.dashbutton}
          onPress={() => navigation.navigate("")}
        >
          <Text
            style={{ color: "#105FD3", marginRight: 15, fontWeight: "bold" }}
          >
            your profile
          </Text>
          <FontAwesomeIcon icon="fa-solid fa-arrow-right" color="#105FD3" />
        </Pressable>
      </View>

      {/* <View style={styles.view3}>
        <View
          style={{ backgroundColor: "white", padding: 5, borderRadius: 17 }}
        >
          <View style={styles.view3Container}>
            <Text
              style={{
                fontSize: 25,
                color: "#003F5F",
                marginBottom: 20,
                fontWeight: "700",
              }}
            >
              Asprin
            </Text>
            <View style={styles.view3info}>
              <Text style={{ color: "#003F5F" }}>
                Date{"\n"}
                <Text
                  style={{ marginBottom: 20, color: "#003F5F", fontSize: 20 }}
                >
                  20.04.2023
                </Text>
              </Text>
              <Text style={{ color: "#003F5F" }}>
                Time{"\n"}
                <Text
                  style={{ marginBottom: 20, color: "#003F5F", fontSize: 20 }}
                >
                  16:30
                </Text>
              </Text>
              <Pressable style={styles.icon2styling}>
                <FontAwesomeIcon icon="fa-solid fa-pen" color="#105FD3" />
              </Pressable>
              <Pressable style={styles.icon2styling}>
                <FontAwesomeIcon icon="fa-solid fa-check" color="#105FD3" />
              </Pressable>
            </View>
          </View>
          <View style={styles.view3Container}>
            <Text
              style={{
                fontSize: 25,
                color: "#003F5F",
                marginBottom: 20,
                fontWeight: "700",
              }}
            >
              Asprin
            </Text>
            <View style={styles.view3info}>
              <Text style={{ color: "#003F5F" }}>
                Date{"\n"}
                <Text
                  style={{ marginBottom: 20, color: "#003F5F", fontSize: 20 }}
                >
                  20.04.2023
                </Text>
              </Text>
              <Text style={{ color: "#003F5F" }}>
                Time{"\n"}
                <Text
                  style={{ marginBottom: 20, color: "#003F5F", fontSize: 20 }}
                >
                  16:30
                </Text>
              </Text>
              <Pressable style={styles.icon2styling}>
                <FontAwesomeIcon icon="fa-solid fa-pen" color="#105FD3" />
              </Pressable>
              <Pressable style={styles.icon2styling}>
                <FontAwesomeIcon icon="fa-solid fa-check" color="#105FD3" />
              </Pressable>
            </View>
          </View>
          <View style={styles.view3Container}>
            <Text
              style={{
                fontSize: 25,
                color: "#003F5F",
                marginBottom: 20,
                fontWeight: "700",
              }}
            >
              Asprin
            </Text>
            <View style={styles.view3info}>
              <Text style={{ color: "#003F5F" }}>
                Date{"\n"}
                <Text
                  style={{ marginBottom: 20, color: "#003F5F", fontSize: 20 }}
                >
                  20.04.2023
                </Text>
              </Text>
              <Text style={{ color: "#003F5F" }}>
                Time{"\n"}
                <Text
                  style={{ marginBottom: 20, color: "#003F5F", fontSize: 20 }}
                >
                  16:30
                </Text>
              </Text>
              <Pressable style={styles.icon2styling}>
                <FontAwesomeIcon icon="fa-solid fa-pen" color="#105FD3" />
              </Pressable>
              <Pressable style={styles.icon2styling}>
                <FontAwesomeIcon icon="fa-solid fa-check" color="#105FD3" />
              </Pressable>
            </View>
          </View>
        </View>
      </View> */}
      {/* <View style={styles.view3}>
        <Text style={styles.view3title}>Nearest pharmacy</Text>
        <View
          style={{ backgroundColor: "#89CFF0", padding: 5, borderRadius: 17 }}
        >
          <View style={styles.view4}>
            <Text style={styles.view4title}>
              19010 {"\n"}{" "}
              <Text style={{ fontSize: 15, color: "#003F5F" }}>3 min</Text>
            </Text>
          </View>
          <View style={styles.info1}>
            <Text style={{ color: "#003F5F" }}>1910@gmail.com</Text>
            <Text style={{ color: "#003F5F" }}>01373930</Text>
          </View>
          <View style={styles.info2}>
            <Text style={{ color: "#003F5F" }}>
              Open time{"\n"}
              <Text style={{ marginTop: 50, color: "#003F5F", fontSize: 20 }}>
                9:00 AM
              </Text>
            </Text>
            <Text style={{ color: "#003F5F" }}>
              close time{"\n"}
              <Text style={{ marginTop: 50, color: "#003F5F", fontSize: 20 }}>
                12:00 AM
              </Text>
            </Text>
          </View>
          <View style={styles.info3}>
            <Text style={styles.txt1}>address</Text>
            <Text style={styles.txt2}>Winklergasse 45, 10117 Berlin</Text>
          </View>
          <View style={styles.icon2}>
            <Pressable style={styles.icon2styling}>
              <FontAwesomeIcon icon="fa-solid fa-phone" color="#105FD3" />
            </Pressable>
          </View>
        </View>
      </View> */}
      {/* <View style={styles.view3}>
        <Text style={styles.view3title}>your prescription</Text>
        {prescriptions.map((prescription) => (
          <View
            key={prescription._id}
            style={{
              backgroundColor: "#89CFF0",
              padding: 5,
              borderRadius: 17,
              marginBottom: 30,
            }}
          >
            <View style={styles.view4}>
              <View style={styles.view4info1}>
                <Text
                  style={{
                    fontSize: 25,
                    color: "#003F5F",
                    fontWeight: "700",
                    marginBottom: 20,
                  }}
                >
                  {prescription.title}
                </Text>
                <Text style={{ color: "#003F5F", marginBottom: 20 }}>
                  {prescription.createDate}
                </Text>
                <Text style={{ color: "#003F5F", fontWeight: "700" }}>
                  {" "}
                  2x daily
                </Text>
                <Text style={{ color: "#003F5F", fontWeight: "700" }}>
                  + 4 others
                </Text>
              </View>
            </View>
            <View style={styles.view4info2}>
              <View>
                <Image
                  style={{ width: 330, height: 330 }}
                  source={{ uri: prescription.image.secure_url }}
                />
              </View>

              <Pressable style={styles.icon2styling}>
                <FontAwesomeIcon icon="fa-solid fa-pen" color="#105FD3" />
              </Pressable>
            </View>
          </View>
        ))}
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  DashboaredContainer: {
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
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 50,
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#003F5F",
  },
  view2: {
    width: "60%",
    marginLeft: "20%",
    marginRight: "20%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  input: {
    padding: 0,
    margin: 4, // added margin to mimic gap
    width: 200,
    height: 40,
    backgroundColor: "#FFFFFF",
    shadowColor: "#DADADA",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 14,
  },
  iconButton: {
    backgroundColor: "#105FD3",
    width: 50,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 14,
  },
  view3: {
    backgroundColor: "white",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: 20,
  },
  view3info: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  view3Container: {
    backgroundColor: "#89CFF0",
    width: "100%",

    padding: 30,

    borderRadius: 20,
    marginBottom: 5,
    marginTop: 5,
  },
  view3title: {
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24,
    lineHeight: 32,
    display: "flex",
    alignItems: "center",
    letterSpacing: -0.05,
    color: "#003F5F",
    marginBottom: 10,
  },

  view4title: {
    fontSize: 30,
    color: "#003F5F",
    marginRight: 200,
  },
  info1: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    padding: 10,
    marginRight: 70,
  },
  info2: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    padding: 10,
    marginRight: 70,
  },
  info3: {
    marginLeft: 40,
    flexDirection: "column",
    padding: 10,
  },
  txt1: {
    color: "#003F5F",
  },
  txt2: {
    marginTop: 10,
    color: "#003F5F",
    fontSize: 20,
    fontWeight: 700,
  },
  icon2: {
    justifyContent: "flex-end",
    flexDirection: "row",
    marginRight: 30,
  },
  icon2styling: {
    backgroundColor: "white",
    color: "#105FD3",
    width: 50,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 14,
    marginTop: 40,
  },
  view4: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 20,
  },
  view4info1: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  view4info2: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: 20,
  },
  view4info3: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  prescriptionContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  prescriptionImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  prescriptionDate: {
    fontSize: 16,
    color: "#003F5F",
    fontWeight: "700",
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
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
    height: 400,
    backgroundColor: "#105FD3",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  dashbutton: {
    backgroundColor: "white",
    width: "90%",
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    flexDirection: "row",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    alignItems:'center',
  },

});
