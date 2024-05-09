import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const { width, height } = Dimensions.get("window");

export default function Findph({ navigation }) {
  return (
    <View style={styles.main}>
      <Pressable
        style={styles.view1}
        onPress={() => navigation.navigate("Dashboared")}
      >
        <Text style={styles.title}>Find pharmacy</Text>
      </Pressable>
      <View style={styles.view2}>
        <Text style={styles.text1}>Find pharmacies near you</Text>
        <Text style={styles.text2}>
          Please enter your location or allow access to your device to find
          pharmacies near you
        </Text>
      </View>
      <View style={styles.view3}>
        <Pressable
          style={styles.groupContainer}
          onPress={() => navigation.navigate("Pharmacies")}
        >
          <Text style={styles.loginText}>Enter your address</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: 428,
    height: 926,
    backgroundColor: "white",
  },
  view1: {
    width: "100%",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    padding: 50,
  },
  title: {
    fontWeight: "700",
    fontSize: width * 0.08,
    textAlign: "center",
    textTransform: "capitalize",
    color: "#003F5F",
  },
  view2: {
    justifyContent: "center",
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
    alignItems: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
  },
  text1: {
    fontSize: width * 0.06,
    marginBottom: height * 0.02,
  },
  text2: {
    fontSize: width * 0.035,
    textAlign: "center",
    color: "grey",
  },
  view3: {
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
  },
  groupContainer: {
    height: height * 0.06,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.05,
    width: width * 0.8,
    borderColor: "#105FD3",
  },
  loginText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#105FD3",
  },
});
