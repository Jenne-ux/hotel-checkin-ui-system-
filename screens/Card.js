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
import PaymentSuccessful from "./PaymentSuccessful"; // Import PaymentSuccessful component

const { width } = Dimensions.get("window");

export default function Card({ visible, onClose, paymentDetails }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    } else {
      scaleAnim.setValue(0);
      slideAnim.setValue(300);
      setPaymentComplete(false);
      setIsProcessing(false);
      setShowSuccessModal(false);
    }
  }, [visible]);

  const formatCurrency = (amount) => {
    return `₱${Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleCardTap = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      // Show success modal after payment complete
      setTimeout(() => {
        // Close the card modal first
        onClose(true);
        
        // Show success modal after card modal closes
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 300);
      }, 1000);
    }, 2000);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
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
            <Text style={styles.title}>Credit/Debit Card Payment</Text>
            
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Please insert or tap your card on the card reader below to complete your payment.
            </Text>

            {/* Card Reader Visualization */}
            <View style={styles.cardReaderContainer}>
              {/* Card Reader Base */}
              <View style={styles.cardReaderBase}>
                {/* Screen Display */}
                <View style={styles.readerScreen}>
                  {paymentComplete ? (
                    <>
                      <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                      <Text style={styles.screenText}>Successful</Text>
                    </>
                  ) : isProcessing ? (
                    <>
                      <MaterialCommunityIcons name="loading" size={32} color="#2563EB" />
                      <Text style={styles.screenText}>Processing...</Text>
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons name="credit-card-wireless" size={32} color="#2563EB" />
                      <Text style={styles.screenText}>Ready</Text>
                    </>
                  )}
                </View>

                {/* Card Slot Area */}
                <View style={styles.cardSlotArea}>
                  <View style={styles.cardSlot}>
                    <View style={styles.slotLine} />
                    <View style={styles.slotLine} />
                    <View style={styles.slotLine} />
                  </View>
                  
                  {/* LED Indicators */}
                  <View style={styles.ledContainer}>
                    <View style={[styles.led, { backgroundColor: "#10B981" }]} />
                    <View style={[styles.led, { backgroundColor: "#F59E0B" }]} />
                    <View style={[styles.led, { backgroundColor: "#EF4444" }]} />
                  </View>
                </View>

                {/* Brand Name */}
                <Text style={styles.brandText}>PAYMENT TERMINAL</Text>
              </View>

              {/* Tap to Pay Button */}
              <TouchableOpacity
                style={[
                  styles.tapButton,
                  (isProcessing || paymentComplete) && styles.tapButtonDisabled
                ]}
                onPress={handleCardTap}
                disabled={isProcessing || paymentComplete}
              >
                <View style={styles.tapButtonContent}>
                  <MaterialCommunityIcons 
                    name={isProcessing ? "loading" : "credit-card-wireless"} 
                    size={24} 
                    color="#2563EB" 
                  />
                  <Text style={styles.tapButtonText}>
                    {isProcessing ? 'Processing...' : 'Tap to Pay'}
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
                <View style={styles.taxLabelContainer}>
                  <Text style={styles.summaryLabel}>Taxes & Fees</Text>
                  <Text style={styles.infoIcon}>①</Text>
                </View>
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

      {/* Payment Success Modal */}
      <PaymentSuccessful
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        route={{
          params: {
            roomType,
            roomNumber,
            floor,
            checkIn,
            checkOut,
            fullName,
          }
        }}
        navigation={{
          goBack: handleSuccessModalClose
        }}
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
    fontSize: 22,
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
  cardReaderContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  cardReaderBase: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  readerScreen: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  screenText: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "500",
  },
  cardSlotArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  cardSlot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slotLine: {
    width: 30,
    height: 4,
    backgroundColor: "#475569",
    borderRadius: 2,
  },
  ledContainer: {
    flexDirection: "row",
    gap: 6,
  },
  led: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  brandText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  tapButton: {
    marginTop: 15,
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  tapButtonDisabled: {
    opacity: 0.7,
  },
  tapButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  tapButtonText: {
    color: "#2563EB",
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
  taxLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  infoIcon: {
    fontSize: 12,
    color: "#9CA3AF",
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
});