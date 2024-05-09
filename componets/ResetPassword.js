// Import necessary components and libraries
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "./config";

// ResetPassword component
export default function ResetPassword({ navigation }) {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State variables for email and password
  const [url, setUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const extractTokenFromUrl = (url) => {
    // Implement your logic to extract the token from the URL
    return url.split("/").pop();
  };

  // Function to handle resetting password
  const handleResetPassword = async () => {
    // Extract token from URL
    const token = extractTokenFromUrl(url);

    try {
      // Make API request to reset password
      const response = await axios.post(`${BASE_URL}/auth/reset/${token}`, {
        newPassword,
      });
      Alert.alert("Success", response.data.message);
      // Navigate to login page or any other page as needed
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong."
      );
    }
  };
  // Function to handle sending password reset link
  const handleSendLink = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      // Make API request to send password reset link
      const response = await axios.post(`${BASE_URL}/auth/forget`, {
        email,
      });

      // Log the response for debugging
      console.log("Response:", response);

      if (response && response.data) {
        Alert.alert("Success", response.data.message);
        // Navigate to login page after successful link sent
      } else {
        Alert.alert("Error", "Empty response received from server.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong."
      );
    }
  };

  // Render UI
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/icon only 2.png")}
        style={styles.logo}
        resizeMode="cover"
      />
      <Text style={styles.heading}>Snap! Crackle! Medicine Is Now!</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        placeholderTextColor="#FFFFFF"
      />
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="Reset URL"
        keyboardType="url"
        placeholderTextColor="#FFFFFF"
      />
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        secureTextEntry
        placeholderTextColor="#FFFFFF"
      />
      <Pressable style={styles.sendLinkButton} onPress={handleSendLink}>
        <Text style={styles.sendLinkButtonText}>Send Link</Text>
      </Pressable>
      <Pressable style={styles.sendLinkButton} onPress={handleResetPassword}>
        <Text style={styles.sendLinkButtonText}>Reset Password</Text>
      </Pressable>
      <Pressable
        style={styles.backToLoginButton}
        onPress={() => navigation.navigate("LoginPage")}
      >
        <Text style={styles.backToLoginButtonText}>Back to Login</Text>
      </Pressable>
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3987AF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  heading: {
    fontSize: 25,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    backgroundColor: "#3987AF",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  sendLinkButton: {
    width: "80%",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  sendLinkButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3987AF",
  },
  backToLoginButton: {
    width: "80%",
    padding: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
  },
  backToLoginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
