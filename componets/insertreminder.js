import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert,StyleSheet,Pressable,FlatList,Switch,handleInputChange } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { DatePicker } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker"
import { BASE_URL } from "./config";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

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
  ScrollView,
} from "native-base";
library.add(faChevronLeft);
export default function Insertreminder ({navigation})  {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [medicineInfo, setMedicineInfo] = useState([]);
  const [formData, setFormData] = useState({
    reminderMsg: "",
    startDate: new Date(),
    frequency: "",
    dosage: "",
    duration: "",
    medicineId: "", // Assuming you have a way to select the medicine
  });
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits for month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits for day
    return `${year}-${month}-${day}`;
  }
   const [showDatePicker, setShowDatePicker] = useState(false);

   const handleInputChange = (name, value) => {
     setFormData({ ...formData, [name]: value });
   };

   const handleDateChange = (event, selectedDate) => {
     setShowDatePicker(false);
     if (selectedDate) {
       setFormData({ ...formData, startDate: selectedDate });
     }
   };

   const showDatepicker = () => {
     setShowDatePicker(true);
  };
  
  // function to get med info
    useEffect(() => {
      const fetchData = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("token");

          if (storedToken) {
            const response = await axios.get(
              `${BASE_URL}/prescription/getAllMedicineNames`,
              {
                timeout: 5000,
                headers: {
                  Authorization: `elagk__ ${storedToken}`,
                },
              }
            );

            if (response.status === 200) {
        
              setMedicineInfo(response.data.medicineInfo);
              console.log("Medicine info:", response.data.medicineInfo);
            } else {
              console.error(
                "Error fetching data:",
                response.status,
                response.statusText
              );
            }
          }
        } catch (error) {
          console.error("An error occurred during the request:", error);
        }
      };

      fetchData();
    }, []);
  
  
  
  // a function to get the data of a reminder
const handleSubmit = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("token");
    console.log("Stored token:", storedToken);

    // Check if token is available
    if (!storedToken) {
      console.error("User token not available");
      return;
    }

    // Check if selectedMedicine is set
    if (!selectedMedicine) {
      console.error("No medicine selected");
      return;
    }

    console.log("Preparing form data...");
    // Prepare form data
    const formDataToSend = {
      reminderMsg: formData.reminderMsg || "",
      startDate: formatDate(formData.startDate) || "",
      frequency: formData.frequency ? parseInt(formData.frequency) : "",
      dosage: formData.dosage || "",
      duration: formData.duration || "",
    };

    console.log("Form data:", formDataToSend);

    // Make API request to create reminder
    console.log("Sending API request...");
    try {
      const response = await axios.post(
        `${BASE_URL}/reminder/?medicineId=${selectedMedicine}`,
        
        formDataToSend,
        {
          headers: {
            Authorization: `elagk__ ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      if (response.data.message === "Reminder created successfully") {
        console.log("Reminder created successfully");
        // Optionally, perform any additional actions upon successful creation
         Alert.alert("Success", "Reminder created successfully.");
      } else {
        console.error("Failed to create reminder:", response.data.message);
        // Display an error message to the user
        Alert.alert("Error", "Failed to create reminder. Please try again.");
      }
    } catch (error) {
      console.error("Error creating reminder:", error.message);
      // Display an error message to the user
      Alert.alert("Error", "An error occurred while creating the reminder.");
    }
    // Clear the form after successful submission
    console.log("Clearing form...");
    setFormData({
      reminderMsg: "",
      startDate: new Date(),
      frequency: "",
      dosage: "",
      duration: "",
    });

    // Optionally, navigate to another screen after submission
    // navigation.navigate('SuccessScreen');
  } catch (error) {
    // Handle errors
    console.error("Error handling form submission:", error.message);
    // Add any error handling logic or state updates as needed
  }
};

  return (
    <NativeBaseProvider keyboardDismissMode="on-drag">
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
          <Text style={styles.PrescriptionPagetitle}>Set Reminders</Text>
        </View>

        <View style={styles.reminderData} keyboardDismissMode="on-drag">
          <TextInput
            placeholder="Reminder Message"
            value={formData.reminderMsg}
            onChangeText={(text) => handleInputChange("reminderMsg", text)}
            style={styles.input}
          />
          <Text
            style={{
              marginBottom: 20,
              color: "#003F5F",
              fontWeight: 400,
              fontSize: 18,
            }}
          >
            Start date:
          </Text>
          <DateTimePicker
            style={styles.input1}
            value={formData.startDate} // Set value prop with the initial date value
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || formData.startDate;
              setFormData({ ...formData, startDate: currentDate });
            }}
          />

          <TextInput
            placeholder="Frequency"
            value={formData.frequency}
            onChangeText={(text) => handleInputChange("frequency", text)}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Dosage"
            value={formData.dosage}
            onChangeText={(text) => handleInputChange("dosage", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Duration"
            value={formData.duration}
            onChangeText={(text) => handleInputChange("duration", text)}
            style={styles.input}
          />
          <Box width="80%">
            <Select
              selectedValue={selectedMedicine}
              style={{
                backgroundColor: "white",
                marginBottom: 10,
                color: "black",
              }}
              placeholderTextColor="black"
              accessibilityLabel="Choose Medicine"
              placeholder="Select Medicine"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="10" />,
              }}
              mt={1}
              onValueChange={(itemValue) => setSelectedMedicine(itemValue)}
            >
              {medicineInfo.map((medicine, index) => (
                <Select.Item
                  key={index}
                  label={medicine.medicineName}
                  value={medicine.medicineId}
                />
              ))}
            </Select>
          </Box>
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.loginText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
};
const styles = StyleSheet.create({
  PrescriptionPage: {
    width: 428,
    height: 926,
    backgroundColor: "white",
    position: "relative",
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
  reminderData: {
    width: "80%",
    marginLeft: "15%",
    marginRight: "5%",
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
  input1: {
    height: 40,
    justifyContent: "flex-start",
    width: 150,

    marginBottom: 40,
  },
  button: {
    height: 80,

    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "50%",
    marginLeft: "25%",
    marginRight: "25%",
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
});



