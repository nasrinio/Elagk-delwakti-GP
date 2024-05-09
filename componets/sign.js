
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Button,
  
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
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
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "./config";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
   const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  

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
         setProfileImage(imageUrl);
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


 const handleSubmit = async () => {
   // Log values for debugging
   console.log("UserName:", userName);
   console.log("Email:", email);
   console.log("Password:", password);
   console.log("ConfirmPassword:", confirmPassword);
   console.log("PhoneNumber:", phoneNumber);
   console.log("Gender:", gender);
   console.log("Profile Image:", profileImage); // Log the profile image URI

   // Check if any required fields are empty
   if (
     email === "" ||
     password === "" ||
     userName === "" ||
     confirmPassword === "" ||
     phoneNumber === "" ||
     gender === "" ||
     !profileImage // Check if profileImage is not null or empty
   ) {
     alert("All fields are required");
     return;
   }

   try {
     // Create FormData object
     const formData = new FormData();

     // Append user data to FormData
     formData.append("email", email);
     formData.append("password", password);
     formData.append("userName", userName);
     formData.append("confirmPassword", confirmPassword);
     formData.append("phoneNumber", phoneNumber);
     formData.append("gender", gender);

     // Append profile image to FormData
     formData.append("image", {
       uri: profileImage,
       name: "profileImage.jpg", // Adjust the file name as needed
       type: "image/jpg", // Adjust the file type as needed
     });

     // Send POST request using FormData
     const response = await axios.post(`${BASE_URL}/auth/`, formData, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });

     console.log(response.data);

     // Check if sign up was successful
     if (response.data.message === "Done") {
       alert("Sign up successful");
       navigation.navigate("LoginPage"); // Navigate to the Home screen or login screen
     } else {
       alert("Sign up failed: " + response.data.message);
     }
   } catch (error) {
     console.error(error);

     // Handling error response from the server
     if (error.response && error.response.data && error.response.data.message) {
       setErrorMessage(error.response.data.message);
     } else {
       setErrorMessage("An error occurred during sign up");
     }
   }
 };
  return (
    <NativeBaseProvider>
      <ScrollView
        style={styles.logoPageContainer}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.iconContainer}>
          <Image
            source={require("../assets/Elagak Delwakty-logos_transparent 2.png")}
            style={{ width: "100%", height: "40%" }}
            resizeMode="cover"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={(text) => setUsername(text)}
            placeholder={"Username"}
            placeholderTextColor="white"
            clearButtonMode="always"
          />
          <TextInput
            style={errorMessage ? styles.inputWithError : styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder={"Email"}
            keyboardType={"email-address"}
            placeholderTextColor="white"
            clearButtonMode="always"
          />
          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder={"Password"}
            secureTextEntry={true}
            placeholderTextColor="white"
            clearButtonMode="always"
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder={"Confirm Password"}
            secureTextEntry={true}
            placeholderTextColor="white"
            clearButtonMode="always"
          />

          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            placeholder={"Phone Number"}
            keyboardType={"phone-pad"}
            placeholderTextColor="white"
            clearButtonMode="always"
          />
          {/* <TextInput
            style={styles.input}
            value={gender}
            onChangeText={(text) => setGender(text)}
            placeholder={"Gender"}
            placeholderTextColor="white"
            clearButtonMode="always"
          /> */}
          <Select
            selectedValue={setGender}
            style={{ height: 51, backgroundColor: "#3987AF", color: "white" }}
            placeholderTextColor="white"
            accessibilityLabel="Choose Service"
            placeholder="gender"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="10" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Select.Item label="male" value="male" />
            <Select.Item label="female" value="female" />
          </Select>
          <View
            style={{ marginBottom: 20, marginTop: 20, alignItems: "center" }}
          >
            <Button
              color="white"
              title="Select your profile image"
              onPress={handleImagePick}
            />
          </View>
          {profileImage && (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 200, height: 200, marginBottom: 10 }}
            />
          )}
          <View style={styles.footer}>
            <Pressable style={styles.groupContainer} onPress={handleSubmit}>
              <Text style={styles.loginText}>SignUp</Text>
            </Pressable>
            <Pressable>
              <Text
                onPress={() => navigation.navigate("LoginPage")}
                style={styles.createAccountText}
              >
                Have an account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}


const styles = StyleSheet.create({
  logoPageContainer: {
    backgroundColor: "blue",
    position: "relative",
    width: 428,
    height: 926,
    backgroundColor: "#3987AF",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    textAlign: "center",
  },
  iconContainer: {
    marginTop: 70,
    height: 185,
  },
  inputContainer: {
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
  },
  input: {
    height: 40,
    marginBottom: 30,
    padding: 7,
    fontSize: 16,
    borderColor: "white",
    borderBottomWidth: 1,
    backgroundColor: "#3987AF",
    color: "white",
  },
  inputWithError: {
    height: 40,
    marginBottom: 30,
    padding: 7,
    fontSize: 16,
    borderColor: "red",
    borderBottomWidth: 1,
    backgroundColor: "#3987AF",
    color: "white",
  },
  footer: {
    width: "100%",
    alignItems: "center",
  },
  groupContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 5,
    borderRadius: 20,
    textAlign: "center",
    width: 258.82,
    height: 51,
    marginTop: 20,
  },
  loginText: {
    height: 31,
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    color: "#3987AF",
  },
  createAccountText: {
    width: "80%",
    height: 31,
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#FFFFFF",
    marginBottom: 70,
  },
  errorText: {
    color: "red",
  },
});
