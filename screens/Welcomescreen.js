import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen({navigation}) {
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;
  
  // Animation for screen entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Button pulse animation (loop)
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
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.poweredBox}>
          <Text style={styles.poweredText}>Powered by</Text>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Animated Center Content */}
      <Animated.View 
        style={[
          styles.centerContent, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={styles.title}>Welcome to</Text>
        <View style={styles.brandRow}>
          <Text style={styles.brandBlue}>PRO</Text>
          <Text style={styles.brandGray}>SERV</Text>
          <Text style={styles.hotelText}>Hotel</Text>
        </View>
        <Text style={styles.subtitle}>Experience seamless hospitality.</Text>
        <Text style={styles.subtitle}>Please touch below to begin.</Text>
      </Animated.View>

      {/* Animated Start Button */}
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Rooms")}
        >
          <Animated.View
            style={[styles.startButton, { transform: [{ scale: buttonPulseAnim }] }]}
          >
            <Ionicons name="finger-print" size={70} color="white" />
            <Text style={styles.startText}>TOUCH TO START</Text>
            <Text style={styles.startSub}>Self Check-in</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Visitor Button */}
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.visitorButton}
          onPress={() => navigation.navigate("Visitors")}
        >
          <Ionicons name="people" size={26} color="#1B2A41" />
          <Text style={styles.visitorText}>Visitor Registration</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    paddingBottom: 40,
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
  centerContent: {
    alignItems: "center",
    marginTop: 10,
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
    marginTop: 30,
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
    marginTop: 40,
    marginBottom: 40,
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
});