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



export default function Reports({ navigation }) {
  const [medicationAdherenceData, setMedicationAdherenceData] = useState(null);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reminderMedicines, setReminderMedicines] = useState([]);
  const [nonReminderMedicines, setNonReminderMedicines] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
   const [selectedMedicineIndex, setSelectedMedicineIndex] = useState(null);
useEffect(() => {
  const fetchPrescriptionRequiredMedicines = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        const response = await axios.get(
          `${BASE_URL}/prescription/prescriptionRequired`,
          {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
            },
          }
        );

        console.log("API Response:", response.data);

        // Extract the prescriptionRequiredMedicines from the response
        const prescriptionRequiredMedicines =
          response.data.prescriptionRequiredMedicines;

        if (!prescriptionRequiredMedicines) {
          throw new Error(
            "Prescription required medicines not found in response."
          );
        }

        // Update state with the fetched data
        setPrescriptionData(prescriptionRequiredMedicines);
        setLoading(false); // Set loading to false once data is fetched
      }
    } catch (error) {
      // If there's an error, log it and set prescription data to null
      console.error(
        "An error occurred while fetching prescription required medicines:",
        error
      );
      setPrescriptionData(null);
      setLoading(false); // Set loading to false in case of error
    }
  };

  fetchPrescriptionRequiredMedicines(); // Call the fetchData function when the component mounts
}, []);
  useEffect(() => {
    const fetchReminderMedicines = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          const response = await axios.get(`${BASE_URL}/reminder/whichRemind`, {
            headers: {
              Authorization: `elagk__ ${storedToken}`,
            },
          });

       

          // Handle the response data here
          const { reminderMedicines, nonReminderMedicines } = response.data;


          // Set the state with the received data
        setReminderMedicines(response.data.remindedMedicines);
        setNonReminderMedicines(response.data.nonRemindedMedicines);
      
        }
      } catch (error) {
        console.error("An error occurred during the request:", error);
      }
    };

    fetchReminderMedicines();
  }, []);

  useEffect(() => {
    const fetchMedicationAdherenceReport = async () => {
      try {
        // Retrieve the token from AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          const response = await axios.get(
            `${BASE_URL}/reminder/adherenceReport`,
            {
              headers: {
                Authorization: `elagk__ ${storedToken}`,
              },
            }
          );
                //  console.log(response.data);

          if (response.data.totalReminders !== undefined) {
            // Successfully fetched medication adherence report
            setMedicationAdherenceData(response.data);
            // console.log(response.data);
          } else {
            console.error(
              "Error fetching medication adherence report:",
              response.data.message
            );
          }
        }
      } catch (error) {
        console.error("An error occurred during the request:", error);
      }
    };

    fetchMedicationAdherenceReport();
  }, []);
  useEffect(() => {
    if (medicationAdherenceData) {
      const interval = setInterval(() => {
        // Increase the displayed percentage gradually, but stop at the actual percentage
        if (displayedPercentage < medicationAdherenceData.adherencePercentage) {
          setDisplayedPercentage((prevPercentage) =>
            Math.min(
              prevPercentage + 1,
              medicationAdherenceData.adherencePercentage
            )
          );
        } else {
          clearInterval(interval);
        }
      }, 100); // Decreased interval duration for faster animation

      return () => clearInterval(interval);
    }
  }, [medicationAdherenceData, displayedPercentage]);
    const handleMoreInfoClick = (index) => {
      // Toggle the selected medicine index to show/hide the details
      setSelectedMedicineIndex((prevIndex) =>
        prevIndex === index ? null : index
      );
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
          <Text style={styles.title}>your Reports</Text>
        </View>
        <View style={styles.reports}>
          <View style={styles.reportcontainer}>
            {medicationAdherenceData ? (
              <>
                <Progress.Circle
                  size={175}
                  indeterminate={false}
                  progress={displayedPercentage / 100} // Convert displayed percentage to a value between 0 and 1
                  showsText={true}
                  formatText={() => `${displayedPercentage.toFixed(2)}%`}
                  indeterminateAnimationDuration={1000}
                  thickness={16}
                  color={"white"}
                />
                <Text style={styles.reporttext}>Adherence Percentage</Text>
                <Text style={styles.reporttext}>
                  Total Prescriptions: {medicationAdherenceData.totalReminders}
                </Text>
                <Text style={styles.reporttext}>
                  Adherent Medications: {medicationAdherenceData.takenReminders}
                </Text>
              </>
            ) : (
              <HStack space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                <Heading color="primary.500" fontSize="md">
                  Loading
                </Heading>
              </HStack>
            )}
          </View>
        </View>

        <View style={styles.reminderreport}>
          {/* Render the medicine names */}
          <Text style={styles.reporttext}>
            Prescribed medicines that have a reminder:
          </Text>
          <View style={styles.reportmed}>
            {reminderMedicines.map((medicine, index) => (
              <Text key={index} style={styles.reporttext2}>
                {medicine.medicineName}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.reminderreport}>
          <Text style={styles.reporttext}>
            Prescribed medicines that don't have a reminder:
          </Text>
          <View style={styles.reportmed}>
            {nonReminderMedicines.map((medicine, index) => (
              <Text key={index} style={styles.reporttext2}>
                {medicine.medicineName}
              </Text>
            ))}
          </View>
        </View>
     <View style={styles.reminderreport}>
  <Text style={styles.reporttext}>
    Prescribed medicines that require a prescription:
  </Text>
  <View style={styles.reportmed}>
    {prescriptionData ? (
      prescriptionData.map((medicine, index) => (
        <View key={index}>
          <TouchableOpacity onPress={() => handleMoreInfoClick(index)}>
            <Text
              style={{
                color: "#003F5F",
                marginBottom: 10,
                fontSize: 20,
              }}
            >
             {medicine.medicineName}
            </Text>
          </TouchableOpacity>
          {selectedMedicineIndex === index && (
            <View style={styles.req}>
              <Text style={{ color: "white", marginBottom: 10 }}>
                Active Ingredient: {medicine.activeIngredient}
              </Text>
              <Text style={{ color: "white", marginBottom: 10 }}>
                Side Effects:
              </Text>
              {medicine.sideEffects.map((sideEffect, sideEffectIndex) => (
                <Text
                  key={sideEffectIndex}
                  style={{ color: "white", marginBottom: 10 }}
                >
                  {sideEffect}
                </Text>
              ))}
              <Text style={{ color: "white", marginBottom: 10 }}>
                Usage Instruction: {medicine.usageInstruction}
              </Text>
              <Text style={{ color: "white", marginBottom: 10 }}>
                Concentration: {medicine.concentration}
              </Text>
            </View>
          )}
        </View>
      ))
    ) : (
      <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel="Loading posts" />
        <Heading color="primary.500" fontSize="md">
          Loading
        </Heading>
      </HStack>
    )}
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
    fontSize: 35,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#003F5F",
  },
  reports: {
    width: "80%",
    height: "auto",
    marginLeft: "10%",
    marginRight: "10%",
    flexDirection: "row",

    alignItems: "center",
    padding: 30,
    alignSelf: "center",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    backgroundColor: "#003F5F",
  },
  reportcontainer: {
    width: "90%",
    height: "auto",
    textAlign: "center",
    marginLeft: "17%",
    marginRight: "5%",
    flexDirection: "column",
  },
  reporttext: {
    marginTop: 10,
    fontSize: 20,
    color: "white",
  },
  reporttext2: {
    marginTop: 10,
    fontSize: 20,
    color: "#003F5F",
  },
  reminderreport: {
    width: "80%",
    height: "auto",
    marginLeft: "10%",
    marginRight: "10%",
    flexDirection: "column",

    padding: 30,
    alignSelf: "center",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    backgroundColor: "#003F5F",
    marginTop: 20,
  },
  reportmed: {
    backgroundColor: "white",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    padding: 20,
    marginTop: 10,
  },
  requirepresc: {
    marginTop: 10,
  },
  req: {
    backgroundColor: "#003F5F",
    borderRadius: 15,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    elevation: 10,
    color: "white",
    padding: 20,
    marginTop: 10,
    marginBottom:10,
  },
});
