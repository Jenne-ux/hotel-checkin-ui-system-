import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen({navigation}) {
  // Animation for the start button
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous pulse animation for the start button
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
              <View style={styles.poweredBox}>
                <Text style={styles.poweredText}>Powered by</Text>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

       {/* Welcome Section */}
      <View style={styles.centerContent}>
      <Text style={styles.title}>Welcome to</Text>

      <View style={styles.brandRow}>
        <Text style={styles.brandBlue}>PRO</Text> 
        <Text style={styles.brandGray}>SERV</Text> 
        <Text style={styles.hotelText}>Hotel</Text>
      </View>

        <Text style={styles.subtitle}>
          Experience seamless hospitality.
        </Text>

        <Text style={styles.subtitle}>
          Please touch below to begin.
        </Text>
      </View>

      {/* Touch to Start with Pulse Animation */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Rooms")}
      >
        <Animated.View
          style={[
            styles.startButton,
            {
              transform: [{ scale: buttonPulseAnim }],
            },
          ]}
        >
          <Ionicons name="finger-print" size={70} color="white" />
          <Text style={styles.startText}>TOUCH TO START</Text>
          <Text style={styles.startSub}>Self Check-in</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Visitor Registration */}
      <TouchableOpacity 
        style={styles.visitorButton}
        onPress={() => navigation.navigate("Visitors")}
      >
        <Ionicons name="people" size={26} color="#1B2A41" />
        <Text style={styles.visitorText}>Visitor Registration</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
  },

  header: {
    width: "100%",
    height: 80,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20,
  },

  poweredBox: {
    backgroundColor: "#EFE6D7",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  poweredText: {
    fontSize: 12,
    color: "#555",
  },

  logo: {
    width: 120,
    height: 30,
  },
  
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
  },

  centerContent: {
    alignItems: "center",
    marginTop: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1B2A41",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  brandBlue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0d3ca1",
  },

  brandGray: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#8A8A8A",
  },

  hotelText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1B2A41",
    marginLeft: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },

  startButton: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  startText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },

  startSub: {
    fontSize: 16,
    color: "#DDE6F2",
  },

  visitorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 80,
    backgroundColor: "#E8F0FE",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A78C5",
  },

  visitorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1B2A41",
  },

  brandLogo: {
    width: 180,
    height: 50, 
  },
});