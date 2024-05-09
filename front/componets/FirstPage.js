import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function FirstPage({ navigation }) {
  return (
    <View style={styles.logoPageContainer}>
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

      {/* Group 290 */}

      <Pressable
        style={styles.groupContainer}
        onPress={() => navigation.navigate("LoginPage")}
      >
        <Text style={styles.loginText}>Login</Text>
        {/* Create account */}
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Sign")}>
        <Text style={styles.createAccountText}>dont have an account</Text>
      </Pressable>
    </View>
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
});
