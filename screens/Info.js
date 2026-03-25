import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
  Image,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import QRPaymentModal from "./QR";
import Card from "./Card";
import Cash from "./Cash";

export default function Info({ navigation }) {
  const route = useRoute();

  const {
    roomType = "Room",
    roomNumber = "-",
    floor = "-",
    nights = 0,
    roomPrice = 0,
    totalPrice = 0,
    checkIn = "",
    checkOut = "",
  } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idType, setIdType] = useState("");
  const [idTypeModalVisible, setIdTypeModalVisible] = useState(false);
  const idTypes = [
    'Passport',
    'Driver\'s License',
    'National ID',
    'Postal ID',
    'Voter\'s ID',
    'PRC ID',
    'Company ID',
    'Student ID',
    'UMID',
    'Other IDs'
  ];
  const [idNumber, setIdNumber] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [cashVisible, setCashVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const cleanPrice = Number(roomPrice) || 0;
  const cleanNights = Number(nights) || 0;
  const computedRoomTotal = cleanPrice * cleanNights;
  const cleanTotal = Number(totalPrice) || computedRoomTotal;
  const tax = 100;
  const finalTotal = cleanTotal + tax;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const selectIdType = (selectedIdType) => {
    setIdType(selectedIdType);
    setIdTypeModalVisible(false);
  };

  const handleConfirm = () => {
    setPaymentVisible(true);
  };

  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    setPaymentVisible(false);
    setTimeout(() => {
      if (paymentMethod === 'mobile') setQrVisible(true);
      else if (paymentMethod === 'card') setCardVisible(true);
      else if (paymentMethod === 'cash') setCashVisible(true);
    }, 300);
  };

  const handleCardClose = () => setCardVisible(false);
  const handleCashClose = () => setCashVisible(false);
  const handleQRClose = () => setQrVisible(false);

  const renderLabel = (text) => (
    <Text style={styles.label}>{text}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.poweredBox}>
          <Text style={styles.poweredText}>Powered by</Text>
          <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.headerTitle}>Personal Information</Text>
          <Text style={styles.headerSub}>
            Please enter your details exactly as they appear on your identification document.
          </Text>

          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputWrapper}>
              {renderLabel("Full Name")}
              <View style={[styles.inputContainer, focusedInput === 'fullName' && styles.inputFocused]}>
                <Ionicons name="person-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. Juan Tamad"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFocusedInput('fullName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Nationality */}
            <View style={styles.inputWrapper}>
              {renderLabel("Nationality")}
              <View style={[styles.inputContainer, focusedInput === 'nationality' && styles.inputFocused]}>
                <Ionicons name="flag-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. Filipino"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  value={nationality}
                  onChangeText={setNationality}
                  onFocus={() => setFocusedInput('nationality')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              {renderLabel("Email Address")}
              <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputFocused]}>
                <Ionicons name="mail-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. juanTamad@email.com"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputWrapper}>
              {renderLabel("Phone Number")}
              <View style={styles.phoneContainer}>
                <View style={[styles.countryCode, focusedInput === 'phone' && styles.countryCodeFocused]}>
                  <Text style={styles.countryCodeText}>+63</Text>
                </View>
                <TextInput
                  placeholder="9123456789"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  style={[styles.phoneInput, focusedInput === 'phone' && styles.phoneInputFocused]}
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={10}
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Government ID Type */}
            <View style={styles.inputWrapper}>
              {renderLabel("Government-Issued ID Type")}
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIdTypeModalVisible(true)}
              >
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8a8a8a" />
                <Text style={idType ? styles.dropdownButtonText : styles.dropdownPlaceholder}>
                  {idType || "Select ID type"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            {/* ID Number */}
            <View style={styles.inputWrapper}>
              {renderLabel("ID / Passport Number")}
              <View style={[styles.inputContainer, focusedInput === 'idNumber' && styles.inputFocused]}>
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. P12345678"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  value={idNumber}
                  onChangeText={setIdNumber}
                  onFocus={() => setFocusedInput('idNumber')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Checkbox */}
            <View style={styles.checkboxWrapper}>
              <TouchableOpacity
                onPress={() => setAgreed(!agreed)}
                style={{
                  width: 24, height: 24, borderWidth: 2,
                  borderColor: agreed ? "#2563EB" : "#ccc",
                  borderRadius: 4,
                  backgroundColor: agreed ? "#2563EB" : "#fff",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.terms}>
                By signing above, I acknowledge that the information provided is accurate and I agree to the hotel's terms and conditions and privacy policy.
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm & Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ID Type Modal */}
      <Modal animationType="slide" transparent={true} visible={idTypeModalVisible} onRequestClose={() => setIdTypeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select ID Type</Text>
              <TouchableOpacity onPress={() => setIdTypeModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={idTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, idType === item && styles.modalItemSelected]}
                  onPress={() => selectIdType(item)}
                >
                  <Text style={[styles.modalItemText, idType === item && styles.modalItemTextSelected]}>{item}</Text>
                  {idType === item && <Ionicons name="checkmark" size={20} color="#fff" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal animationType="fade" transparent={true} visible={paymentVisible} onRequestClose={() => setPaymentVisible(false)}>
        <Pressable style={styles.modalOverlayCenter} onPress={() => setPaymentVisible(false)}>
          <View style={styles.paymentModalContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setPaymentVisible(false)}>
              <Ionicons name="close-circle" size={30} color="#666" />
            </TouchableOpacity>
            <Text style={styles.paymentTitle}>Select Payment Method</Text>
            <Text style={styles.paymentSubtitle}>Complete your payment securely using credit/debit card, cash, or mobile wallet.</Text>

            <TouchableOpacity style={[styles.paymentOption, selectedPayment === 'card' && styles.paymentOptionSelected]} onPress={() => handlePaymentSelection('card')}>
              <Ionicons name="card-outline" size={24} color={selectedPayment === 'card' ? "#fff" : "#2563EB"} />
              <Text style={[styles.paymentText, selectedPayment === 'card' && styles.paymentTextSelected]}>Credit / Debit Card</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.paymentOption, selectedPayment === 'cash' && styles.paymentOptionSelected]} onPress={() => handlePaymentSelection('cash')}>
              <Ionicons name="wallet-outline" size={24} color={selectedPayment === 'cash' ? "#fff" : "#2563EB"} />
              <Text style={[styles.paymentText, selectedPayment === 'cash' && styles.paymentTextSelected]}>Cash</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.paymentOption, selectedPayment === 'mobile' && styles.paymentOptionSelected]} onPress={() => handlePaymentSelection('mobile')}>
              <Ionicons name="phone-portrait-outline" size={24} color={selectedPayment === 'mobile' ? "#fff" : "#2563EB"} />
              <Text style={[styles.paymentText, selectedPayment === 'mobile' && styles.paymentTextSelected]}>Mobile Payment</Text>
            </TouchableOpacity>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>PAYMENT SUMMARY</Text>
              <View style={styles.row}>
                <Text style={styles.summaryLabel}>Price per Night</Text>
                <Text style={styles.summaryValue}>₱{cleanPrice.toLocaleString()}.00</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.summaryLabel}>Nights</Text>
                <Text style={styles.summaryValue}>{cleanNights}</Text>
              </View>
              <View style={styles.dividerContainer}><View style={styles.divider} /></View>
              <View style={styles.roomTotalRow}>
                <Text style={styles.roomTotalLabel}>Room Total</Text>
                <Text style={styles.roomTotalValue}>₱{cleanTotal.toLocaleString()}.00</Text>
              </View>
              <View style={styles.taxesRow}>
                <Text style={styles.label}>Taxes & Fees <Text style={styles.infoIcon}>ⓘ</Text></Text>
                <Text style={styles.value}>₱{tax}.00</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total Amount</Text>
                <Text style={styles.totalPrice}>₱{finalTotal.toLocaleString()}.00</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      <QRPaymentModal visible={qrVisible} onClose={handleQRClose} paymentDetails={{ roomType, cleanNights, cleanTotal, tax, finalTotal, fullName, roomNumber, floor, checkIn, checkOut }} />
      <Card visible={cardVisible} onClose={handleCardClose} paymentDetails={{ roomType, cleanNights, cleanTotal, tax, finalTotal, fullName, roomNumber, floor, checkIn, checkOut }} />
      <Cash visible={cashVisible} onClose={handleCashClose} paymentDetails={{ roomType, cleanNights, cleanTotal, tax, finalTotal, fullName, roomNumber, floor, checkIn, checkOut }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { width: "100%", height: 80, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "flex-end", paddingRight: 20 },
  poweredBox: { backgroundColor: "#EFE6D7", padding: 10, borderRadius: 10, alignItems: "center" },
  poweredText: { fontSize: 12, color: "#555" },
  logo: { width: 120, height: 30 },
  content: { padding: 16, backgroundColor: '#f5f5f5' },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#2c3e50", marginBottom: 8, marginTop: 10 },
  headerSub: { fontSize: 14, color: "#7f8c8d", marginBottom: 24, lineHeight: 20 },
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  label: { fontWeight: "600", marginBottom: 6, color: "#34495e", fontSize: 16 },
  inputWrapper: { marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fafafa", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e0e0e0" },
  inputFocused: { borderColor: "#2563EB", borderWidth: 2 },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: "#2c3e50" },
  phoneContainer: { flexDirection: "row" },
  countryCode: { backgroundColor: "#f0f0f0", padding: 12, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderWidth: 1, borderColor: "#e0e0e0", borderRightWidth: 0, justifyContent: "center", alignItems: "center", minWidth: 60 },
  countryCodeFocused: { borderColor: "#2563EB", borderWidth: 2, borderRightWidth: 0 },
  countryCodeText: { fontSize: 16, fontWeight: "500", color: "#34495e" },
  phoneInput: { flex: 1, backgroundColor: "#fafafa", padding: 12, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderWidth: 1, borderColor: "#e0e0e0", fontSize: 16, color: "#2c3e50" },
  phoneInputFocused: { borderColor: "#2563EB", borderWidth: 2 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fafafa' },
  dropdownButtonText: { flex: 1, fontSize: 16, color: '#2c3e50', marginLeft: 10 },
  dropdownPlaceholder: { flex: 1, fontSize: 16, color: '#94A3B8', marginLeft: 10 },
  checkboxWrapper: { flexDirection: "row", alignItems: "flex-start", marginTop: 10 },
  terms: { flex: 1, fontSize: 13, color: "#7f8c8d", lineHeight: 18, marginLeft: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, marginBottom: 25, backgroundColor: "#f5f5f5" },
  backBtn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, width: "40%", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#2563EB", height: 48 },
  backBtnText: { color: "#2563EB", fontWeight: "600", fontSize: 16 },
  confirmBtn: { backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, width: "55%", alignItems: "center", justifyContent: "center", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, height: 48 },
  confirmText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalOverlayCenter: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalItemSelected: { backgroundColor: '#2563EB' },
  modalItemText: { fontSize: 16, color: '#2c3e50' },
  modalItemTextSelected: { color: '#fff', fontWeight: '500' },
  closeBtn: { position: "absolute", right: 12, top: 12, zIndex: 1, padding: 4 },
  paymentModalContainer: { width: "90%", maxWidth: 480, backgroundColor: "#fff", borderRadius: 30, padding: 24, alignItems: "center", alignSelf: "center" },
  paymentTitle: { fontSize: 20, fontWeight: "700", marginBottom: 4, marginTop: 10, textAlign: "center", width: "100%", color: "#2c3e50" },
  paymentSubtitle: { color: "#7f8c8d", marginBottom: 10, textAlign: "center", width: "100%" },
  paymentOption: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa", padding: 10, borderRadius: 12, marginBottom: 8, width: "100%", borderWidth: 1, borderColor: "#e0e0e0" },
  paymentOptionSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  paymentText: { marginLeft: 10, fontSize: 18, color: "#2c3e50", fontWeight: "500" },
  paymentTextSelected: { color: "#fff" },
  summaryBox: { marginTop: 10, backgroundColor: "#f8f9fa", padding: 10, borderRadius: 12, width: "100%" },
  summaryTitle: { fontWeight: "700", color: "#2563EB", marginBottom: 15, fontSize: 14, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 5 },
  summaryLabel: { color: "#7f8c8d", fontSize: 14 },
  summaryValue: { color: "#2c3e50", fontSize: 16, fontWeight: "500" },
  dividerContainer: { marginVertical: 15, paddingHorizontal: 5 },
  divider: { height: 1, backgroundColor: "#e0e0e0", width: "100%" },
  roomTotalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 5 },
  roomTotalLabel: { color: "#2c3e50", fontSize: 16, fontWeight: "700" },
  roomTotalValue: { color: "#2c3e50", fontSize: 16, fontWeight: "700" },
  taxesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 5 },
  infoIcon: { fontSize: 12, color: "#95a5a6" },
  value: { fontSize: 14, color: "#2c3e50", fontWeight: "500" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#e0e0e0", paddingHorizontal: 5 },
  totalText: { fontWeight: "700", fontSize: 16, color: "#2c3e50" },
  totalPrice: { fontWeight: "700", color: "#2563EB", fontSize: 16 },
});