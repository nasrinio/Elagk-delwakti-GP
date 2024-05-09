import React, { useState,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  params,
} from "react-native";
import {
  NativeBaseProvider,
  Select,
  service,
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
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import { BASE_URL } from "./config";

import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

export default function Findpharmacy({ navigation }) {
 const [cityName, onChangeCity] = useState("");
 const [medicineName, onChangeMedicine] = useState("");
 const [pharmacies, setPharmacies] = useState([]);
 const [loading, setLoading] = useState(false);
 const [governates, setGovernates] = useState([]);
 const [selectedGovernate, setSelectedGovernate] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineInfo, setMedicineInfo] = useState([]);
  


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
  

 useEffect(() => {
   // Function to fetch governates data
   const fetchGovernates = async () => {
     try {
       const response = await axios.get(`${BASE_URL}/governate/`);
       setGovernates(response.data.governates);
     } catch (error) {
       console.error("Error fetching governates:", error);
     }
   };

   // Call the fetchGovernates function when component mounts
   fetchGovernates();
 }, []);

 const fetchCitiesByGovernate = async (selectedGovernate) => {
   try {
     const response = await axios.post(`${BASE_URL}/city/citiesOfGov`, {
       governateName: selectedGovernate.name,
     });

     console.log(response.data);

     if (response.status === 200) {
       setCities(response.data.cities);
       return response.data.cities;
     } else {
       throw new Error("Failed to fetch cities");
     }
   } catch (error) {
     console.error("Error fetching cities:", error);
     throw new Error("Failed to fetch cities");
   }
 };

 // display pharmacies info
const fetchPharmacies = async () => {
  try {
    setLoading(true);

    console.log(cityName, selectedMedicine.name); // Ensure you are receiving the selected city and medicine correctly

    const response = await axios.post(`${BASE_URL}/pharmacy/findPharmacies`, {
      cityName: cityName,
      medicineName: selectedMedicine, // Use selectedMedicine instead of medicineName
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    if (response.status === 200) {
      const receivedPharmacies = response.data.pharmacies || response.data;

      if (receivedPharmacies && Array.isArray(receivedPharmacies)) {
        setPharmacies(receivedPharmacies);
      } else {
        throw new Error("Invalid pharmacies data format");
      }
    } else {
      throw new Error("Failed to fetch pharmacies");
    }
  } catch (error) {
    console.error("Error:", error);
    Alert.alert(
      "Error",
      error.message || "An unexpected error occurred. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  const renderItem = ({ item }) => (
    <View style={styles.phinfo}>
      <View style={styles.phinfo1}>
        <Image style={styles.logo} source={{ uri: item.logo.secure_url }} />
      </View>
      <View style={styles.phinfo2}>
        <Text style={styles.text}>{item.pharmacyName}</Text>
        <View style={styles.phinfo3}>
          <Text style={styles.text2}> {item.phoneNumber}</Text>
          <Text style={styles.text3}>
            {item.operatingHours}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <NativeBaseProvider>
      <View style={styles.logoPageContainer}>
        <View style={styles.dashboardContainer}>
          <Pressable onPress={() => navigation.navigate("NewDash")}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color="grey"
              marginRight="15"
            />
          </Pressable>
          <Text style={styles.title1}>Find Pharmacies</Text>
        </View>

        <View style={styles.inputs}>
          <Select
            style={{
              backgroundColor: "white",
              marginBottom: 10,
              color: "black",
              width: 200,
            }}
            selectedValue={selectedGovernate}
            minWidth="200"
            borderColor={"#003F5F"}
            accessibilityLabel="Choose Governate"
            placeholder="Choose Governate"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => {
              setSelectedGovernate(itemValue);
              fetchCitiesByGovernate(itemValue);
            }}
          >
            {governates.map((governate) => (
              <Select.Item
                key={governate._id}
                label={governate.name}
                value={governate} // Pass the governate object as value
              />
            ))}
          </Select>

          {/* Select for cities */}
          <Select
            selectedValue={cityName}
            style={{
              backgroundColor: "white",
              marginBottom: 10,
              color: "black",
          
            }}
            minWidth="200"
            accessibilityLabel="Choose City"
            placeholder="Choose City"
            borderColor={"#003F5F"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(itemValue) => onChangeCity(itemValue)}
          >
            {/* Map over the cities data and render Select.Item for each city */}
            {cities.map((city) => (
              <Select.Item
                key={city._id}
                label={city.name}
                value={city.name} // Assuming city name is the value you want to use
              />
            ))}
          </Select>

          <Select
            selectedValue={selectedMedicine}
            style={{
              backgroundColor: "white",
              marginBottom: 10,
              color: "black",
              borderColor: "#003F5F",
            }}
            borderColor={"#003F5F"}
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
                value={medicine.medicineName}
              />
            ))}
          </Select>
          <Pressable style={styles.groupContainer} onPress={fetchPharmacies}>
            <Text style={styles.loginText}>Find</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#003F5F"
          />
        ) : (
          <FlatList
            data={pharmacies}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  logoPageContainer: {
    width: 428,
    height: 926,
    backgroundColor: "white",
    position: "relative",
  },
  dashboardContainer: {
    width: "100%",
    justifyContent: "space-around",
    width: "100%",
    flexDirection: "row",
    padding: 50,
    alignItems: "center",
  },
  title1: {
    fontWeight: "700",
    fontSize: width * 0.08,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#003F5F",
  },
  inputs: {
    width: "70%",
    height: 150,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
    marginLeft: 70,
  },
  input: {
    height: height * 0.05,
    justifyContent: "center",
    width: "70%",
    borderColor: "#003F5F",
    borderBottomWidth: 2,
    paddingHorizontal: width * 0.03,
    marginBottom: 10,
  },
  phinfo: {
    width: "90%",
    height: 150,
    flexDirection: "row",
    top: height * 0.15,
    marginLeft: "5%",
    marginRight: "5%",
    borderColor: "#003F5F",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "#003F5F",
  },
  phinfo1: {
    width: "40%",
  },
  phinfo2: {
    width: "60%",
  },
  icon: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  text: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.5,
    color: "white",
    marginLeft: 10,
  },
  phinfo3: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 70,
  },
  text2: {
    color: "white",
    marginRight: 10,
  },
  text3: {
    color: "white",
    marginRight: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groupContainer: {
    height: 70,

    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",

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
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 20,
  },
});
