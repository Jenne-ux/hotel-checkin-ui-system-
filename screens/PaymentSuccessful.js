import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const MODAL_WIDTH = width * 0.9;
const MODAL_HEIGHT = height * 0.85;

export default function PaymentSuccessful({ visible, onClose, route }) {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const params = route?.params || {};
  const {
    roomType,
    roomNumber,
    floor,
    checkIn,
    checkOut,
    fullName,
  } = params;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) {
        onClose();
      }
    });
  };

  const formatDate = (date) => {
    if (!date) return "";

    try {
      let dateObj;

      if (typeof date === "string" && date.includes("-")) {
        const [year, month, day] = date.split("-").map(Number);
        dateObj = new Date(year, month - 1, day);
      } else if (typeof date === "string" && date.includes("/")) {
        const [month, day, year] = date.split("/").map(Number);
        dateObj = new Date(year, month - 1, day);
      } else if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === "number") {
        dateObj = new Date(date);
      }

      if (dateObj && !isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch (error) {
      console.log("Date parsing error:", error);
    }

    return date?.toString() || "";
  };

  const formatFloor = (floorValue) => {
    if (!floorValue) return "";

    const floorStr = String(floorValue).trim();

    if (floorStr.includes("Floor")) return floorStr;

    if (!isNaN(floorStr)) {
      const floorNum = parseInt(floorStr);

      if (floorNum === 1) return "Ground Floor";

      const lastDigit = floorNum % 10;
      const lastTwoDigits = floorNum % 100;

      let suffix = "th";
      if (lastTwoDigits < 11 || lastTwoDigits > 13) {
        if (lastDigit === 1) suffix = "st";
        else if (lastDigit === 2) suffix = "nd";
        else if (lastDigit === 3) suffix = "rd";
      }

      return `${floorNum}${suffix} Floor`;
    }

    return floorStr;
  };

  const handleViewDirections = () => {
    const formattedFloor = formatFloor(floor) || "4th Floor";
    const roomToUse = roomNumber || "202";

    if (onClose) {
      onClose();
    }

    setTimeout(() => {
      navigation.navigate("Directions", {
        roomNumber: roomToUse,
        floor: formattedFloor,
      });
    }, 300);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.headerContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={70}
                    color="#2563EB"
                  />
                  <Text style={styles.successTitle}>Payment Successful!</Text>
                  <Text style={styles.welcomeText}>
                    Welcome{fullName ? `, ${fullName}` : ""}!
                  </Text>
                </View>

                <View style={styles.staySection}>
                  <Text style={styles.sectionTitle}>YOUR STAY</Text>

                  <View style={styles.roomInfoCard}>
                    <Text style={styles.roomNumber}>
                      Room {roomNumber || "202"}
                    </Text>

                    <Text style={styles.roomType}>
                      {roomType || "Deluxe King Suite"} ●{" "}
                      {formatFloor(floor) || "City View"}
                    </Text>

                    <View style={styles.dateContainer}>
                      <View style={styles.dateRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#2563EB"
                        />
                        <Text style={styles.dateLabel}>Check-In:</Text>
                        <Text style={styles.dateValue}>
                          {formatDate(checkIn) || "February 9, 2026"}
                        </Text>
                      </View>

                      <View style={styles.dateRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#2563EB"
                        />
                        <Text style={styles.dateLabel}>Check-Out:</Text>
                        <Text style={styles.dateValue}>
                          {formatDate(checkOut) || "February 13, 2026"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.keyMessageContainer}>
                  <Ionicons name="key-outline" size={20} color="#2563EB" />
                  <Text style={styles.keyMessageText}>
                    Your room has been successfully assigned.{"\n"}
                    <Text style={styles.keyHighlight}>
                      Please proceed to the Front Desk to collect your room
                      key.
                    </Text>
                  </Text>
                </View>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={handleViewDirections}
                >
                  <View style={styles.directionsButtonContent}>
                    <Ionicons name="map-outline" size={20} color="#fff" />
                    <Text style={styles.directionsButtonText}>
                      View Your Room Directions
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: MODAL_WIDTH,
    maxHeight: MODAL_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 5,
  },
  scrollContent: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: "#6b7280",
  },
  staySection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 4,
  },
  roomInfoCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
  },
  roomNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563EB",
  },
  roomType: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10,
  },
  dateContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 13,
    marginLeft: 8,
    width: 70,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  keyMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d8d7dd",
    padding: 14,
    borderRadius: 12,
  },
  keyMessageText: {
    marginLeft: 10,
    fontSize: 13,
    flex: 1,
  },
  keyHighlight: {
    fontWeight: "600",
  },
  directionsButton: {
    backgroundColor: "#2563EB",
    borderRadius: 25,
    marginTop: 10,
  },
  directionsButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    gap: 6,
  },
  directionsButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

