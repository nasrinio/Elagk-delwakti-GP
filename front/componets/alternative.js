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
  TouchableOpacity,
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
  Button,
  AlertDialog,
  PresenceTransition,
} from "native-base";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Progress from "react-native-progress";


export default function Alternative({ navigation }) {
 
 const [searchTerm, setSearchTerm] = useState("");
 const [medicines, setMedicines] = useState([]);
 const [selectedMedicine, setSelectedMedicine] = useState(null); // Changed to store only one selected medicine
 const [selectedMedicineAlternatives, setSelectedMedicineAlternatives] =
    useState([]);
     const [selectedMedicineAlternative, setSelectedMedicineAlternative] =
       useState([]);
 const [errorMessage, setErrorMessage] = useState("");


  
  const handleSearch = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/medicine/search`, {
        medicineName: searchTerm,
      });

      if (response.status === 200) {
 
        setMedicines(response.data.medicines);
        setErrorMessage("");
      } else {
        setErrorMessage("No medicine found");
      }
    } catch (error) {
      console.error("Error searching medicine:", error);
      setErrorMessage("Failed to search for medicine");
    }
  };

const handleSelectMedicine = async (medicine) => {
  setSelectedMedicine(medicine); // Set the selected medicine
  try {
    const response = await axios.post(
      `${BASE_URL}/medicine/medicineAlternatives?medicineId=${medicine._id}`
    );

    if (response.status === 200) {
      console.log("Data fetched successfully:", response.data);
      setSelectedMedicineAlternatives(response.data.alternatives);
    setSelectedMedicineAlternative(response.data);
      setErrorMessage("");
    } else {
      throw new Error("Failed to get medicine alternatives");
    }
  } catch (error) {
    console.error("Error getting medicine alternatives:", error);
    setErrorMessage("Failed to get medicine alternatives");
  }
};

  return (
    <NativeBaseProvider>
      <ScrollView style={styles.profileContainer}>
        <View style={styles.titleView}>
          <Pressable onPress={() => navigation.navigate("NewDash")}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color="grey"
              marginRight="15"
            />
          </Pressable>
          <Text style={styles.title}>alternative medicine</Text>
        </View>
        <View style={styles.alt}>
          <Text
            style={{
              marginBottom: 20,
              color: "#003F5F",
              fontWeight: 400,
              fontSize: 18,
            }}
          >
            search medicine:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter medicine name"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Pressable style={styles.searchpress} onPress={handleSearch}>
            <Text style={styles.textsearch}> search</Text>
          </Pressable>
          {errorMessage ? <Text>{errorMessage}</Text> : null}
          <FlatList
            data={medicines}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectMedicine(item)}>
                <View style={{ color: "#003F5F" }}>
                  <Text>{item.medicineName}</Text>
                  <Text>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
          <View>
            <Text
              style={{
                marginBottom: 20,
                color: "#003F5F",
                fontWeight: 400,
                fontSize: 18,
              }}
            >
              Selected Medicine:
            </Text>
            {selectedMedicine && (
              <View key={selectedMedicine._id}>
                <Text style={{ color: "#003F5F", fontWeight: "bold" }}>
                  {selectedMedicine.medicineName}
                </Text>
                <Text>{selectedMedicine.description}</Text>
              </View>
            )}
          </View>
          <View style={styles.alternative}>
            <Text
              style={{
                marginBottom: 20,
                color: "white",
                fontWeight: 400,
                fontSize: 18,
              }}
            >
              Alternatives:
            </Text>

            <Text
              style={{
                marginBottom: 20,
                color: "white",
                fontWeight: 400,
                fontSize: 18,
              }}
            >
              Alternatives Count: {selectedMedicineAlternative.alternativeCount}
            </Text>
            {selectedMedicineAlternatives.map((alternative) => (
              <View key={alternative._id}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {alternative.medicineName}
                </Text>
                <Text>{alternative.description}</Text>
                {/* Render other medicine details as needed */}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}
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
    fontSize: 27,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#003F5F",
  },
  alt: {
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    marginLeft: 40,
  },
  input: {
    height: 40,
    marginBottom: 30,
    padding: 7,
    fontSize: 16,
    borderColor: "#003F5F",
    borderBottomWidth: 2,
    width: "80%",
  },
  searchpress: {
    height: 50,

    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "20%",
    backgroundColor: "#003F5F",
    padding: 10,
  },
  textsearch: {
    color: "white",
    textAlign: "center",
    alignItems: "center",
  },
  alternative: {
    backgroundColor: "#003F5F",
    width: "80%",
  
    marginRight: "5%",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    color: "white", 
  },
});
