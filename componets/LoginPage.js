import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, Pressable,errorMessage } from "react-native";

import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config.js";

export default function LoginPage({ navigation }) {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  // login function
  const handleSubmit = async () => {
    console.log(BASE_URL);
   try {
     const response = await axios.post(`${BASE_URL}/auth/login`, {
       email,
       password,
     });

     if (response.data.message === "Login done") {
    const userUpdated = response.data.userUpdated;

    // Extract token from the userUpdated object
    const token = userUpdated.token;
       // Save the token to AsyncStorage
       await AsyncStorage.setItem("token", token);
 

       // Navigate to the dashboard or perform any other actions
     navigation.navigate("NewDash");
     } else {
       alert("Invalid login credentials");
       console.log(response.data.message);
     }
   } catch (error) {
     if (error.response) {
       // The server responded with a status code other than 2xx
       // Extract the error message from the response and set it as errorMessage
       setErrorMessage(
         error.response.data.message || "An error occurred during login"
       );
     } else if (error.request) {
       // The request was made but no response was received
       setErrorMessage(
         "An error occurred during login: No response received from the server"
       );
     } else {
       // Something else happened while setting up the request
       console.log(error.message);
       setErrorMessage("An error occurred during login: " + error.message);
     }
   }
 };

  return (
    <ScrollView style={styles.logoPageContainer} keyboardDismissMode="on-drag">
      {/* icon only 1 */}

      <View style={styles.iconContainer}>
        <Image
          source={require("../assets/icon only 2.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      {/* text only 1 */}
      <View style={styles.textContainer}>
        <Image
          source={require("../assets/text only 2.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      {/* Snap! Crackle! Medicine Is Now! */}
      <Text style={styles.text}>Snap! Crackle! Medicine Is Now!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={errorMessage ? styles.inputWithError : styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder={"email"}
          keyboardType={"email-address"}
          placeholderTextColor="white"
          clearButtonMode="always"
        />
        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        <TextInput
          style={errorMessage ? styles.inputWithError : styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder={"password"}
          keyboardType={"default"}
          secureTextEntry={true}
          placeholderTextColor="white"
          clearButtonMode="always"
        />
        {errorMessage !== "" && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <Pressable
          style={styles.forget}
          onPress={() => navigation.navigate("ResetPassword")}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              justifyContent: "flex-end",
              textAlign: "right",
            }}
          >
            forget?
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.groupContainer} onPress={handleSubmit}>
        <Text style={styles.loginText}>Login</Text>
        {/* Create account */}
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Sign")}>
        <Text style={styles.createAccountText}>dont have an account</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoPageContainer: {
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
  },
  iconContainer: {
    position: "absolute",
    width: 185,
    height: 185,
    left: 121,
    top: 161,
    backgroundColor: "transparent",
  },
  textContainer: {
    position: "absolute",
    width: 300,
    height: 60.67,
    left: 64,
    top: 364,
    backgroundColor: "transparent",
  },
  text: {
    position: "absolute",
    width: 361,
    height: 69,
    left: 31,
    top: 438,

    fontSize: 25,
    lineHeight: 31,
    textAlign: "center",
    color: "#FFFFFF",
  },
  groupContainer: {
    boxSizing: "border-box",
    position: "absolute",
    width: 258.82,
    height: 51,
    left: 86.02,
    top: 697,
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 5,
    borderRadius: 20,
    textAlign: "center",
  },
  loginText: {
    alignItems: "center",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    color: "#3987AF",
  },
  inputContainer: {
    position: "absolute",

    padding: 10,
    width: 361,
    height: 69,
    left: 31,
    top: 500,
  },
  input: {
    height: 40,
    margin: 9,
    padding: 7,
    fontSize: 16,
    borderColor: "white",
    borderBottomWidth: 1,
    backgroundColor: "#3987AF",
    color: "white",
  },
  inputWithError: {
    height: 40,
    margin: 9,
    padding: 7,
    fontSize: 16,
    borderColor: "red",
    borderBottomWidth: 1,
    backgroundColor: "#3987AF",
    color: "white",
  },
  createAccountText: {
    position: "absolute",
    width: 361,
    height: 31,
    left: 34,
    top: 755,

    fontSize: 24,
    lineHeight: 29,
    textAlign: "center",
    textDecorationLine: "underline",
    color: "#FFFFFF",
  },
  forget: {
    color: "white",
    textAlign: "right",
    width: "100%",
    margin: "auto",
  },
  errorText: {
    color: "red",
  },
});
