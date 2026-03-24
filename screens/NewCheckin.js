import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function NewCheckin({ navigation }) {
  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for the button
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

      {/* Header */}
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

      {/* Success Content */}
      <Animated.View 
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#2563EB" />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Check-In</Text>
        <Text style={styles.successSubtitle}>Successful!</Text>

        <Text style={styles.message}>
          You may now proceed to your assigned room. Please collect your room key at the front desk. For any pending payments or assistance, please proceed to the front desk.
        </Text>
      </Animated.View>

      {/* Tap to Start Another Check-In with Pulse Animation */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Welcome")}
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
          <Text style={styles.startText}>TAP TO START ANOTHER</Text>
          <Text style={styles.startSub}>Check-In</Text>
        </Animated.View>
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
  centerContent: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1B2A41",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2563EB",
    textAlign: "center",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 30,
    lineHeight: 24,
  },
  startButton: {
    width: 300,
    height: 300,
    borderRadius: 160,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
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
    textAlign: "center",
  },
  startSub: {
    fontSize: 16,
    color: "#DDE6F2",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});