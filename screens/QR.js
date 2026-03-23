import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import PaymentSuccessful from "./PaymentSuccessful"; // Import the PaymentSuccessful component

const { width } = Dimensions.get("window");

const QRPaymentModal = ({ visible, onClose, paymentDetails, onPaymentSuccess }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    roomType,
    cleanNights,
    cleanTotal,
    tax,
    finalTotal,
    fullName,
    roomNumber,
    floor,
    checkIn,
    checkOut,
  } = paymentDetails || {};

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
      setShowSuccessModal(false); // Reset success modal when main modal closes
    }
  }, [visible]);

  const formatCurrency = (amount) => {
    return `₱${Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const generateQRData = () => {
    return JSON.stringify({
      transactionId: `TXN${Date.now()}`,
      amount: finalTotal,
      roomType,
      roomNumber,
      guestName: fullName,
      checkIn,
      checkOut,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSimulatePayment = () => {
    // Close the QR modal first
    onClose();
    
    // Show success modal after a tiny delay for better UX
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <>
      {/* QR Payment Modal */}
      <Modal transparent visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.popupContainer,
              {
                transform: [
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#666" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Ionicons name="scan-outline" size={40} color="#2563EB" />
              <Text style={styles.title}>Scan to Pay</Text>
              <Text style={styles.subtitle}>
                Scan using your mobile wallet.
              </Text>
            </View>

            <View style={styles.qrContainer}>
              <QRCode
                value={generateQRData()}
                size={180}
                color="#000"
                backgroundColor="#fff"
              />
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>PAYMENT SUMMARY</Text>

              <View style={styles.row}>
                <Text style={styles.label}>
                  {roomType} ({cleanNights} Nights)
                </Text>
                <Text style={styles.value}>{formatCurrency(cleanTotal)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Taxes & Fees</Text>
                <Text style={styles.value}>{formatCurrency(tax)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(finalTotal)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.simulateButton}
              onPress={handleSimulatePayment}
            >
              <Text style={styles.simulateButtonText}>
                Simulate Payment
              </Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              This is a simulation. No payment will be charged.
            </Text>
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
            roomNumber: roomNumber || "202",
            floor: floor || "2",
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
};

export default QRPaymentModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  qrContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryTitle: {
    fontWeight: "700",
    color: "#2563EB",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: "#4B5563",
    fontSize: 14,
  },
  value: {
    fontWeight: "500",
    fontSize: 14,
    color: "#1F2937",
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
    fontWeight: "700",
    fontSize: 16,
    color: "#1F2937",
  },
  totalValue: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2563EB",
  },
  simulateButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  simulateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 8,
  },
});