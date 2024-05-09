import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  map,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./config";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { ScrollView } from "native-base";
import { NativeBaseProvider } from "native-base";
import moment from "moment";

export default function DisplayPrescription({ navigation }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [medicineInfo, setMedicineInfo] = useState([]);
  const [medicines, setMedicines] = useState([]);
    const [selectedMedicineId, setSelectedMedicineId] = useState(null);

    const handleMedicinePress = (medicineId) => {
      setSelectedMedicineId(
        medicineId === selectedMedicineId ? null : medicineId
      );
    };

  
    const handleSubmit = async () => {
      setLoading(true); // Set loading state to true while processing

      // Call the deletePrescription function to delete the prescription
      const success = await deletePrescription(prescriptionId);

      setLoading(false); // Reset loading state after operation completes

      if (success) {
        // Show success message
        Alert.alert("Success", "Prescription deleted successfully");
      } else {
        // Show error message
        Alert.alert("Error", "Failed to delete prescription");
      }
    };
     useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await axios.get(`${BASE_URL}/medicine/`);
           setMedicines(response.data.medicines);
           console.log("Medicines: ", response.data.medicines);
         } catch (error) {
           // Handle error
           console.error("Error fetching medicines:", error.message);
         }
       };

       fetchData();
     }, []);

// a function to display the prescription
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          const response = await axios.get(`${BASE_URL}/prescription/`, {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
            },
          });

          if (response.data.message === "Success") {
            const formattedPrescriptions = response.data.prescriptions.map(
              (prescription) => {
                // Parse and format the createDate field using moment to YYYY-MM-DD format
                const formattedDate = moment(prescription.createDate).format(
                  "YYYY-MM-DD"
                );

                // Return a new object with the formatted createDate
                return {
                  ...prescription,
                  createDate: formattedDate,
                };
              }
            );

            setPrescriptions(formattedPrescriptions);
            console.log(formattedPrescriptions);
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
// a function to get medicine
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
const fetchData = async () => {
     try {
       const storedToken = await AsyncStorage.getItem("token");

       if (storedToken) {
         const response = await axios.get(`${BASE_URL}/prescription/`, {
           headers: {
             Authorization: `elagk__ ${storedToken}`,
           },
         });

         if (response.data.message === "Success") {
           const formattedPrescriptions = response.data.prescriptions.map(
             (prescription) => {
               // Parse and format the createDate field using moment to YYYY-MM-DD format
               const formattedDate = moment(prescription.createDate).format(
                 "YYYY-MM-DD"
               );

               // Return a new object with the formatted createDate
               return {
                 ...prescription,
                 createDate: formattedDate,
               };
             }
           );

           setPrescriptions(formattedPrescriptions);
           console.log(formattedPrescriptions);
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

const handleDeleteSubmit = async (prescriptionId) => {
  try {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      const response = await axios.delete(
        `${BASE_URL}/prescription/?prescriptionId=${prescriptionId}`,
        {
          headers: {
            Authorization: `elagk__ ${storedToken}`,
          },
        }
      );
      if (response.status === 200) {
        // Perform any additional actions after successful deletion
        console.log("Prescription deleted successfully:", response.data);

        // Reload prescriptions after successful deletion
        fetchData();
      } else {
        console.error(
          "Error deleting prescription:",
          response.status,
          response.statusText
        );
        // Handle the case where deletion fails
        // You can return false or throw an error to indicate failure
      }
    }
  } catch (error) {
    console.error("An error occurred during the request:", error);
    // Handle the error appropriately
    // You can return false or throw an error to indicate failure
  }
};

useEffect(() => {
  fetchData();
}, []);

const renderPrescriptionItem = ({ item }) => {
  // Filter prescribed medicines based on prescription ID
  const prescribedMedicinesForPrescription = prescribedMedicines.filter(
    (medicine) => medicine.prescriptionId === item._id
  );

  return (
    <View style={styles.prescriptionItem}>
      {/* <Text style={styles.createdAt}>Prescription ID: {item._id}</Text> */}
      <Text style={styles.prescriptiontitle}> {item.title}</Text>
      <Text style={styles.prescriptiondate}> {item.createDate}</Text>
      <View style={styles.line}></View>
      <View style={styles.presccard1}>
        <View style={styles.cardcontainer}>
          <Text
            style={{
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: 20,
              lineHeight: 24,

              letterSpacing: 0.5,
              color: "#000000",
            }}
          >
            Prescription text:
          </Text>
          <View style={styles.line2}></View>
          <ScrollView style={{ height: 70 }}>
            <Text style={styles.createdAt}>{item.prescriptionText}</Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.presccard}>
        <View style={styles.cardcontainer}>
          <Text
            style={{
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: 20,
              lineHeight: 24,

              letterSpacing: 0.5,
              color: "#000000",
            }}
          >
            Medicine info:
          </Text>
          <View style={styles.line2}></View>
          <ScrollView style={styles.medicineContainer}>
            {item.medicineId.map((medicineId) => {
              // Find the corresponding medicine in the medicines state
              const medicine = medicines.find((med) => med._id === medicineId);
              return (
                <View key={medicineId}>
                  <Text style={styles.medicineTitle}>
                    Medicine Name:{" "}
                    {medicine ? medicine.medicineName : "Unknown Medicine"}
                  </Text>
                  {medicine && (
                    <View style={{ marginLeft: 30 }}>
                      <Text>
                        Active Ingredient: {medicine.activeIngredient}
                      </Text>
                      <Text>Concentration: {medicine.concentration}</Text>
                      <Text>Manufacturer: {medicine.manufacture}</Text>
                      {/* Add more information if needed */}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
        {/* Render prescription image */}
        {item.image && item.image.secure_url && (
          <Image
            style={styles.prescriptionImage}
            source={{ uri: item.image.secure_url }}
            resizeMode="cover"
          />
        )}
      </View>
      {/* Delete button */}
      <TouchableOpacity
        onPress={() => handleDeleteSubmit(item._id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};




  return (
    <NativeBaseProvider>
      <View style={styles.PrescriptionPage} keyboardDismissMode="on-drag">
        <View style={styles.titleSection}>
          <Pressable onPress={() => navigation.navigate("NewDash")}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color="grey"
              marginRight="15"
            />
          </Pressable>

          <Text style={styles.PrescriptionPagetitle}>Your Prescriptions</Text>
        </View>

        <FlatList
          data={prescriptions.concat(prescribedMedicines)}
          renderItem={renderPrescriptionItem}
          keyExtractor={(item) => item._id}
        />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  PrescriptionPage: {
    width: 428,
    height: 928,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  titleSection: {
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 30,
    flexDirection: "row",
  },
  PrescriptionPagetitle: {
    fontSize: 30,
    color: "#003F5F",
    fontWeight: "700",
  },
  prescriptionItem: {
    backgroundColor: "#3987AF",
    padding: 10,
    marginBottom: 20,

    borderRadius: 10,
    color: "#003F5F",

    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
    borderWidth: 4,
    borderColor: "#003F5F",
  },
  prescriptiontitle: {
    fontWeight: "400",
    fontSize: 30,

    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  prescriptiondate: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,

    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  presccard: {
    borderWidth: 4,
    borderColor: "#003F5F",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    backgroundColor: "#D2EDFF",
  },
  presccard1: {
    borderWidth: 4,
    borderColor: "#003F5F",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    backgroundColor: "#D2EDFF",
    height: 150,
    marginBottom: 20,
  },
  cardcontainer: {
    padding: 10,
  },
  line: {
    borderWidth: 3,
    borderColor: "#003F5F",
    marginTop: 10,
    marginBottom: 20,
  },
  line2: {
    borderWidth: 3,
    borderColor: "#003F5F",
    marginTop: 10,
    marginBottom: 20,
    width: 200,
  },
  createdAt: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  medicineContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    height: 80,
  },
  medicineTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  prescriptionImage: {
    height: 200,
    width: "100%",

    borderRadius: 10,
    borderWidth: 4,
    borderWidthBottom: 0,
    borderColor: "#003F5F",
  },
  deleteButton: {
    backgroundColor: "#D2EDFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    textAlign: "center",
    borderWidth: 4,

    borderColor: "#003F5F",
  },
  deleteButtonText: {
    textAlign: "center",
  },
});
