import React from "react";
import { View, Text, Image, StyleSheet,Pressable } from "react-native";

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.logoPageContainer}>
      {/* Icon Only 1 */}
      <Image
        source={require("../assets/icon only 2.png")}
        style={styles.icon}
      />

      {/* Text Only 1 */}
      <Image
        source={require("../assets/text only 2.png")}
        style={styles.text}
      />

      {/* Snap! Crackle! Medicine Is Now! */}
      <Pressable  onPress={() => navigation.navigate('FirstPage')}>
   
        <Text style={styles.logoText}>Snap! Crackle! Medicine Is Now!</Text>
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
  icon: {
    position: "absolute",
    width: 185,
    height: 185,
    left: 124,
    top: 290,
  },
  text: {
    position: "absolute",
    width: 300,
    height: 60.67,
    left: 67,
    top: 493,
  },
  logoText: {
    position: "absolute",
    width: 361,
    height: 69,
    left: 34,
    top: 567,

    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 25,
    lineHeight: 31,
    textAlign: "center",
    color: "#FFFFFF",
  },
});

