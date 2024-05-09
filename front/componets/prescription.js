import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Button,
  ScrollView,
  FlatList,
  TouchableOpacity,
  formData,
  Alert,
} from "react-native";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBell,
  faPhone,
  faCheck,
  faPen,
 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { DatePicker } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

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
  Select,
  service,
} from "native-base";
import { BASE_URL } from "./config";
library.add(faBell);
library.add(faPhone);
library.add(faPen);
library.add(faCheck);
library.add(faChevronLeft);

export default function Prescription({ navigation }) {
  const [prescriptionName, setPrescriptionName] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState(new Date()); // Set default value to current date
  const [formData, setFormData] = useState({ startDate: new Date() }); // Initialize formData with startDate

  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [prescriptionText, setPrescriptionText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/medicine/search`, {
        medicineName: searchTerm,
      });

      if (response.status === 200) {
        console.log("Data fetched successfully:", response.data);
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

  const handleSelectMedicine = (medicine) => {
    // Check if the medicine is already selected
    if (!selectedMedicines.find((item) => item._id === medicine._id)) {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const storedToken = await AsyncStorage.getItem("token");

  //       if (storedToken) {
  //         const response = await axios.get(
  //           "http://192.168.1.107:3011/prescription/getAllMedicineNames",
  //           {
  //             headers: {
  //               Authorization: `elagk__ ${storedToken}`,
  //             },
  //           }
  //         );

  //         if (response.status === 200) {
  //           console.log("Data fetched successfully:", response.data);
  //           setMedicineInfo(response.data.medicineInfo);
  //         } else {
  //           console.error(
  //             "Error fetching data:",
  //             response.status,
  //             response.statusText
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       console.error("An error occurred during the request:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // a function to fetch the user's token from AsyncStorage
  useEffect(() => {
    // Retrieve the user's token from AsyncStorage
    const fetchUserToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          // Fetch data or perform actions with the token if needed
        }
      } catch (error) {
        console.error("Error fetching user token:", error);
      }
    };

    fetchUserToken();
  }, []);

  // a function to handle the image picking
  const handleImagePick = async () => {
    try {
      console.log("Requesting media library permissions...");
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission to access media library denied");
        return;
      }

      console.log("Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const imageUrl = result.assets[0].uri;
        setPrescriptionImage(imageUrl);
        console.log("Image URL:", imageUrl);
        setImageURL(result.uri); // Set the URL to the new state variable
        console.log("Image URI:", result.uri);
      } else {
        console.log("Image picking cancelled by user");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // a function to handle the form submission of the prescription data
  const handleSubmit = async () => {
    try {
      console.log("Handling form submission...");
      // Check if prescriptionImage is set
      if (!prescriptionImage) {
        console.error("Please select your image");
        return;
      }

      // Check if selectedMedicines is empty
      if (selectedMedicines.length === 0) {
        console.error("Please select at least one medicine");
        return;
      }

      // Retrieve the user's token from AsyncStorage
      const storedToken = await AsyncStorage.getItem("token");
      console.log("Stored token:", storedToken);

      // Check if token is available
      if (!storedToken) {
        console.error("User token not available");
        return;
      }

      console.log("Preparing form data...");
      // Prepare form data
      const formData = new FormData();
      formData.append("createDate", formatDate(prescriptionDate)); // Format date here
      formData.append("title", prescriptionName);
      formData.append("text", prescriptionText);
      formData.append("image", {
        uri: prescriptionImage,
        name: "prescriptionImage.jpg", // Adjust the file name as needed
        type: "image/jpg", // Adjust the file type as needed
      });
      console.log(formData);
      // Construct query parameters for medicine IDs
      const medicineIdsQueryParam = selectedMedicines
        .map((medicine) => `medicineId=${medicine._id}`)
        .join("&");

      // Make API request to create prescription
      console.log("Sending API request...");
      try {
        const response = await axios.post(
          `${BASE_URL}/prescription/?${medicineIdsQueryParam}`,
          formData,
          {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
              "Content-Type": "multipart/form-data", // Set content type explicitly for FormData
            },
          }
        );

        console.log("Server Response:", response.data);
      } catch (error) {
        console.error("Error creating prescription:", error.message);
        console.log("Response data:", error.response.data); // Log response data
      }

      // Clear the form after successful submission
      console.log("Clearing form...");
      setPrescriptionName("");
      setPrescriptionDate(new Date()); // Reset date to current date
      setPrescriptionImage(null);
      setImageURL(""); // Clear the imageURL state
       Alert.alert("Success", "prescription inserted successfully.");

      // Optionally, navigate to another screen after submission
      // navigation.navigate('SuccessScreen');
    } catch (error) {
      // Handle errors
      console.error("Error handling form submission:", error.message);
      // Add any error handling logic or state updates as needed
    }
  };

  // Function to format date as yyyy-mm-dd
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <NativeBaseProvider>
      <ScrollView style={styles.PrescriptionPage} keyboardDismissMode="on-drag">
    
        <View style={styles.titleSection}>
          <Pressable onPress={() => navigation.navigate("NewDash")}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color="grey"
              marginRight="15"
            />
          </Pressable>

          <Text style={styles.PrescriptionPagetitle}>Insert Prescription</Text>
        </View>

        <View style={styles.prescriptionInput} keyboardDismissMode="on-drag">
          <Text
            style={{
              marginBottom: 20,
              color: "#003F5F",
              fontWeight: 400,
              fontSize: 18,
            }}
          >
            Prescription Name:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="dr. John Doe"
            value={prescriptionName}
            onChangeText={(text) => setPrescriptionName(text)}
          />
          <Text
            style={{
              marginBottom: 20,
              color: "#003F5F",
              fontWeight: 400,
              fontSize: 18,
            }}
          >
            Prescription Date:
          </Text>
          <DateTimePicker
            style={styles.input5}
            value={prescriptionDate} // Set value prop with the initial date value
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || prescriptionDate;
              setPrescriptionDate(currentDate); // Update prescriptionDate state
            }}
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
              search medicine:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter medicine name"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Button title="Search" onPress={handleSearch} />
            {errorMessage ? <Text>{errorMessage}</Text> : null}
            <FlatList
              data={medicines}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectMedicine(item)}>
                  <View style={{ color: "#003F5F" }}>
                    <Text>{item.medicineName}</Text>
                    <Text>{item.description}</Text>
                    {/* Render other medicine details as needed */}
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
                Selected Medicines:
              </Text>
              {selectedMedicines.map((medicine) => (
                <View key={medicine._id}>
                  <Text style={{ color: "#003F5F", fontWeight: "bold" }}>
                    {medicine.medicineName}
                  </Text>
                  <Text>{medicine.description}</Text>
                  {/* Render other medicine details as needed */}
                </View>
              ))}
            </View>
          </View>

          <View
            style={{ marginBottom: 20, marginTop: 20, alignItems: "center" }}
          >
            <Button
              title="Select prescription image"
              onPress={handleImagePick}
            />
          </View>
          {prescriptionImage && (
            <Image
              source={{ uri: prescriptionImage }}
              style={{ width: 200, height: 200, marginBottom: 10 }}
            />
          )}
          {/* Display the image URL */}
          <View style={styles.inputButton}>
            <Pressable style={styles.groupContainer} onPress={handleSubmit}>
              <Text style={styles.loginText}>Save Prescription</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  PrescriptionPage: {
    width: 428,
    height: 926,
    backgroundColor: "white",
  },
  titleSection: {
    width: "100%",
    justifyContent: "space-around",
    width: "100%",
    flexDirection: "row",
    padding: 50,
    alignItems:'center',
  },
  PrescriptionPagetitle: {
    fontSize: 30,
    color: "#003F5F",
    fontWeight: "700",
  },
  prescriptionInput: {
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
  selectStyle: {
    height: 40,
    justifyContent: "center",
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  input1: {
    height: 100,
    justifyContent: "center",
    width: "80%",
    borderColor: "#003F5F",
    borderWidth: 2,

    borderRadius: 8,
    paddingHorizontal: 40,
    marginBottom: 40,
  },

  container: {
    justifyContent: "center",
    backgroundColor: "black",
    width: "100%",
    height: 300,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  capturedImage: {
    flex: 1,
    resizeMode: "cover",
  },
  inputButton: {
    width: "100%",
    justifyContent: "center",
 
    flexDirection: "row",
    padding: 50,
  },
  groupContainer: {
    height: 80,
    
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "76%",
    backgroundColor: "#003F5F",
    padding: 10,
  },
  loginText: {
    height: 31,
   
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    color: "white",
    alignItems: "center",
  },
  input5: {
    height: 40,
    justifyContent: "flex-start",
    width: 150,

    marginBottom: 40,
  },
});
