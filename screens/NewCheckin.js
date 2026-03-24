import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function NewCheckin({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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

      <Animated.View style={[styles.centerContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#2563EB" />
        </View>
        <Text style={styles.successTitle}>Check-In</Text>
        <Text style={styles.successSubtitle}>Successful!</Text>
        <Text style={styles.message}>
          Please collect your room key at the front desk. For any pending payments or assistance, please proceed to the front desk.
        </Text>
      </Animated.View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Animated.View
          style={[styles.startButton, { transform: [{ scale: buttonPulseAnim }] }]}
        >
          <Ionicons name="finger-print" size={70} color="white" />
          <Text style={styles.startText}>TAP TO START ANOTHER</Text>
          <Text style={styles.startSub}>Check-In</Text>
        </Animated.View>
      </TouchableOpacity>
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
  iconContainer: {
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1B2A41",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#2563EB",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 30,
    lineHeight: 24,
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
    textAlign: "center",
  },
  startSub: {
    fontSize: 16,
    color: "#DDE6F2",
    textAlign: "center",
  },
});