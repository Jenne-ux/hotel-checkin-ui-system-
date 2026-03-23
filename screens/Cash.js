import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Generate a random check-in number
const generateCheckInNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "";
  
  // Format: XXX-000 (e.g., ABC-123)
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  result += "-";
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return result;
};

// Processing Modal Component
const ProcessingModal = ({ visible, onClose, checkInNumber, roomNumber, floor }) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Pulse animation for the number
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [visible]);

  const handleViewDirections = () => {
    onClose();
    // Navigate directly to Directions screen
    setTimeout(() => {
      navigation.navigate("Directions", {
        roomNumber: roomNumber,
        floor: floor,
      });
    }, 300);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.processingContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.processingIcon}>
            <MaterialCommunityIcons name="clock-outline" size={60} color="#2563EB" />
          </View>
          
          <Text style={styles.processingTitle}>Processing Your Check-In</Text>
          
          <Text style={styles.processingSubtitle}>
            Please proceed to the front desk and present your printed receipt with your check-in reference number to complete your payment.
          </Text>
          
          <Animated.View style={[styles.numberContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.checkInNumber}>{checkInNumber}</Text>
          </Animated.View>
          
          <TouchableOpacity style={styles.directionsButton} onPress={handleViewDirections}>
            <Ionicons name="map-outline" size={24} color="#fff" />
            <Text style={styles.directionsButtonText}>View Your Room Directions</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function Cash({ visible, onClose, paymentDetails }) {
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [checkInNumber, setCheckInNumber] = useState("");
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const {
    roomType = "Deluxe Suite",
    cleanNights = 5,
    cleanTotal = 14400,
    tax = 500,
    finalTotal = 14900,
    fullName = "",
    roomNumber = "202",
    floor = "2",
    checkIn = "",
    checkOut = "",
  } = paymentDetails || {};

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
      
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
      
      // Generate a new check-in number when modal opens
      setCheckInNumber(generateCheckInNumber());
    } else {
      scaleAnim.setValue(0);
      slideAnim.setValue(300);
      setPaymentComplete(false);
      setIsProcessing(false);
      setShowProcessingModal(false);
    }
  }, [visible]);

  const formatCurrency = (amount) => {
    return `₱${Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePayAtFrontDesk = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      // Close the cash modal first
      onClose(true);
      
      // Show processing modal after cash modal closes
      setTimeout(() => {
        setShowProcessingModal(true);
      }, 300);
    }, 2000);
  };

  const handleProcessingModalClose = () => {
    setShowProcessingModal(false);
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => onClose(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => onClose(false)}
              disabled={isProcessing}
            >
              <Ionicons name="close-circle" size={28} color="#999" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Pay at Front Desk</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Please proceed to the front desk to complete your payment. Our staff will assist you with your transaction.
            </Text>

            {/* Front Desk Visualization */}
            <View style={styles.frontDeskContainer}>
              {/* Front Desk Screen */}
              <View style={styles.frontDeskScreen}>
                {isProcessing ? (
                  <View style={styles.screenContent}>
                    <MaterialCommunityIcons name="loading" size={48} color="#2563EB" />
                    <Text style={styles.screenTitle}>Processing...</Text>
                    <Text style={styles.screenText}>Please wait while we process your request</Text>
                  </View>
                ) : (
                  <View style={styles.screenContent}>
                    <Text style={styles.amountLabel}>Amount Due</Text>
                    <Text style={styles.amountValue}>{formatCurrency(finalTotal)}</Text>
                  </View>
                )}
              </View>

              {/* Pay at Front Desk Button */}
              <TouchableOpacity
                style={[
                  styles.payButton,
                  (isProcessing || paymentComplete) && styles.payButtonDisabled
                ]}
                onPress={handlePayAtFrontDesk}
                disabled={isProcessing || paymentComplete}
              >
                <View style={styles.payButtonContent}>
                  <Ionicons 
                    name={isProcessing ? "refresh" : "cash-outline"} 
                    size={24} 
                    color="#fff" 
                  />
                  <Text style={styles.payButtonText}>
                    {isProcessing ? 'Processing...' : 'Pay at Front Desk'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Payment Summary */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>PAYMENT SUMMARY</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {roomType} ({cleanNights} Nights)
                </Text>
                <Text style={styles.summaryValue}>{formatCurrency(cleanTotal)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxes & Fees</Text>
                <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Processing Modal */}
      <ProcessingModal
        visible={showProcessingModal}
        onClose={handleProcessingModalClose}
        checkInNumber={checkInNumber}
        roomNumber={roomNumber}
        floor={floor}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  frontDeskContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  frontDeskScreen: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 15,
  },
  screenContent: {
    alignItems: "center",
    width: "100%",
  },
  amountLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 0,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 10,
    marginBottom: 5,
  },
  screenText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  payButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonDisabled: {
    opacity: 0.7,
    backgroundColor: "#9CA3AF",
  },
  payButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#4B5563",
  },
  summaryValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
  
  processingContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 30,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  processingIcon: {
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  processingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  numberContainer: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#2563EB",
    marginBottom: 25,
  },
  checkInNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 2,
  },
  directionsButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  directionsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});