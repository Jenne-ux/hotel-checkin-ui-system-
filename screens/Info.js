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
  Alert,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import QRPaymentModal from "./QR";
import Card from "./Card";
import Cash from "./Cash";

export default function Info({ navigation }) {
  const route = useRoute();

  // Get params
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

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Form state
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // ID Type - Modal dropdown
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
  
  // Modal states
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [cashVisible, setCashVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Error states
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  // Calculate totals
  const cleanPrice = Number(roomPrice) || 0;
  const cleanNights = Number(nights) || 0;
  const computedRoomTotal = cleanPrice * cleanNights;
  const cleanTotal = Number(totalPrice) || computedRoomTotal;
  const tax = 100;
  const finalTotal = cleanTotal + tax;

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const selectIdType = (selectedIdType) => {
    setIdType(selectedIdType);
    setIdTypeModalVisible(false);
    if (errors.idType) setErrors({...errors, idType: null});
  };

  const validateForm = () => {
    let newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!nationality.trim()) newErrors.nationality = "Nationality is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (phone.length < 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!idType) newErrors.idType = "Please select an ID type";
    if (!idNumber.trim()) newErrors.idNumber = "ID number is required";
    if (!agreed) newErrors.agreed = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      console.log("Opening payment modal");
      setPaymentVisible(true);
    } else {
      Alert.alert("Validation Error", "Please fill in all required fields correctly.");
    }
  };

  const handlePaymentSelection = (paymentMethod) => {
    console.log("Selected payment method:", paymentMethod);
    setSelectedPayment(paymentMethod);
    
    // Close payment modal first
    setPaymentVisible(false);
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      if (paymentMethod === 'mobile') {
        console.log("Opening QR modal");
        setQrVisible(true);
      } else if (paymentMethod === 'card') {
        console.log("Opening Card modal");
        setCardVisible(true);
      } else if (paymentMethod === 'cash') {
        console.log("Opening Cash modal");
        setCashVisible(true);
      }
    }, 300);
  };

  const handleCardClose = (paymentSuccess = false) => {
    console.log("Closing Card modal, success:", paymentSuccess);
    setCardVisible(false);
    // Removed the alert popup
  };

  const handleCashClose = (paymentSuccess = false) => {
    console.log("Closing Cash modal, success:", paymentSuccess);
    setCashVisible(false);
    // Removed the alert popup
  };

  const handleQRClose = () => {
    console.log("Closing QR modal");
    setQrVisible(false);
  };

  const renderLabel = (text, required = true) => (
    <Text style={styles.label}>
      {text} {required && <Text style={styles.asterisk}>*</Text>}
    </Text>
  );

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.content, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Text style={styles.headerTitle}>Personal Information</Text>
          <Text style={styles.headerSub}>
            Please enter your details exactly as they appear on your identification document.
          </Text>

          {/* Single White Container for all form fields - matching Visitors screen */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputWrapper}>
              {renderLabel("Full Name")}
              <View style={[styles.inputContainer, focusedInput === 'fullName' && styles.inputFocused, errors.fullName && styles.inputError]}>
                <Ionicons name="person-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors({...errors, fullName: null});
                  }}
                  onFocus={() => setFocusedInput('fullName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            {/* Nationality */}
            <View style={styles.inputWrapper}>
              {renderLabel("Nationality")}
              <View style={[styles.inputContainer, focusedInput === 'nationality' && styles.inputFocused, errors.nationality && styles.inputError]}>
                <Ionicons name="flag-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. Filipino"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  value={nationality}
                  onChangeText={(text) => {
                    setNationality(text);
                    if (errors.nationality) setErrors({...errors, nationality: null});
                  }}
                  onFocus={() => setFocusedInput('nationality')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.nationality && <Text style={styles.errorText}>{errors.nationality}</Text>}
            </View>

            {/* Email Address */}
            <View style={styles.inputWrapper}>
              {renderLabel("Email Address")}
              <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputFocused, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. johndoe@email.com"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({...errors, email: null});
                  }}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Phone Number */}
            <View style={styles.inputWrapper}>
              {renderLabel("Phone Number")}
              <View style={styles.phoneContainer}>
                <View style={[styles.countryCode, focusedInput === 'phone' && styles.countryCodeFocused, errors.phone && styles.countryCodeError]}>
                  <Text style={styles.countryCodeText}>+63</Text>
                </View>
                <TextInput
                  placeholder="9123456789"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  style={[styles.phoneInput, focusedInput === 'phone' && styles.phoneInputFocused, errors.phone && styles.phoneInputError]}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors({...errors, phone: null});
                  }}
                  maxLength={10}
                  onFocus={() => setFocusedInput('phone')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Government-Issued ID Type - Dropdown */}
            <View style={styles.inputWrapper}>
              {renderLabel("Government-Issued ID Type")}
              <TouchableOpacity 
                style={[styles.dropdownButton, focusedInput === 'idType' && styles.dropdownFocused, errors.idType && styles.inputError]}
                onPress={() => setIdTypeModalVisible(true)}
                onFocus={() => setFocusedInput('idType')}
                onBlur={() => setFocusedInput(null)}
              >
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8a8a8a" />
                <Text style={idType ? styles.dropdownButtonText : styles.dropdownPlaceholder}>
                  {idType || "Select ID type"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
              {errors.idType && <Text style={styles.errorText}>{errors.idType}</Text>}
            </View>

            {/* ID Number */}
            <View style={styles.inputWrapper}>
              {renderLabel("ID / Passport Number")}
              <View style={[styles.inputContainer, focusedInput === 'idNumber' && styles.inputFocused, errors.idNumber && styles.inputError]}>
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8a8a8a" />
                <TextInput
                  placeholder="e.g. P12345678"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  value={idNumber}
                  onChangeText={(text) => {
                    setIdNumber(text);
                    if (errors.idNumber) setErrors({...errors, idNumber: null});
                  }}
                  onFocus={() => setFocusedInput('idNumber')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}
            </View>

            {/* Checkbox - inside the same container */}
            <View style={styles.checkboxWrapper}>
              <TouchableOpacity
                onPress={() => {
                  setAgreed(!agreed);
                  if (errors.agreed) setErrors({...errors, agreed: null});
                }}
                style={{
                  width: 24,
                  height: 24,
                  borderWidth: 2,
                  borderColor: agreed ? "#2563EB" : "#ccc",
                  borderRadius: 4,
                  backgroundColor: agreed ? "#2563EB" : "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.terms}>
                By signing above, I acknowledge that the information provided is
                accurate and I agree to the hotel's terms and conditions and privacy policy.
              </Text>
            </View>
            {errors.agreed && <Text style={styles.errorText}>{errors.agreed}</Text>}
          </View>

          {/* Buttons - KEPT ORIGINAL DESIGN */}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={idTypeModalVisible}
        onRequestClose={() => setIdTypeModalVisible(false)}
      >
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
                  style={[
                    styles.modalItem,
                    idType === item && styles.modalItemSelected
                  ]}
                  onPress={() => selectIdType(item)}
                >
                  <Text style={[
                    styles.modalItemText,
                    idType === item && styles.modalItemTextSelected
                  ]}>
                    {item}
                  </Text>
                  {idType === item && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={paymentVisible}
        onRequestClose={() => setPaymentVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPaymentVisible(false)}>
          <View style={styles.paymentModalContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setPaymentVisible(false)}>
              <Ionicons name="close-circle" size={30} color="#666" />
            </TouchableOpacity>

            <Text style={styles.paymentTitle}>Select Payment Method</Text>
            <Text style={styles.paymentSubtitle}>
              Complete your payment securely using credit/debit card, cash, or mobile wallet.
            </Text>

            <TouchableOpacity 
              style={[styles.paymentOption, selectedPayment === 'card' && styles.paymentOptionSelected]}
              onPress={() => handlePaymentSelection('card')}
            >
              <Ionicons name="card-outline" size={24} color={selectedPayment === 'card' ? "#fff" : "#2563EB"} />
              <Text style={[styles.paymentText, selectedPayment === 'card' && styles.paymentTextSelected]}>
                Credit / Debit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, selectedPayment === 'cash' && styles.paymentOptionSelected]}
              onPress={() => handlePaymentSelection('cash')}
            >
              <Ionicons name="wallet-outline" size={24} color={selectedPayment === 'cash' ? "#fff" : "#2563EB"} />
              <Text style={[styles.paymentText, selectedPayment === 'cash' && styles.paymentTextSelected]}>
                Cash
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentOption, selectedPayment === 'mobile' && styles.paymentOptionSelected]}
              onPress={() => handlePaymentSelection('mobile')}
            >
              <Ionicons name="phone-portrait-outline" size={24} color={selectedPayment === 'mobile' ? "#fff" : "#2563EB"} />
              <Text style={[styles.paymentText, selectedPayment === 'mobile' && styles.paymentTextSelected]}>
                Mobile Payment
              </Text>
            </TouchableOpacity>

            {/* Payment Summary */}
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
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
              </View>
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

      {/* QR Payment Modal */}
      <QRPaymentModal
        visible={qrVisible}
        onClose={handleQRClose}
        paymentDetails={{
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
        }}
      />

      {/* Card Payment Modal */}
      <Card
        visible={cardVisible}
        onClose={handleCardClose}
        paymentDetails={{
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
        }}
      />

      {/* Cash Payment Modal */}
      <Cash
        visible={cashVisible}
        onClose={handleCashClose}
        paymentDetails={{
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
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
  poweredText: { fontSize: 12, color: "#555" },
  logo: { width: 120, height: 30 },
  content: { 
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: "700", 
    color: "#2c3e50", 
    marginBottom: 8,
    marginTop: 10,
  },
  headerSub: { 
    fontSize: 14, 
    color: "#7f8c8d", 
    marginBottom: 24, 
    lineHeight: 20,
  },
  asterisk: { color: "#FF0000", fontWeight: "bold" },
  
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  label: { 
    fontWeight: "600", 
    marginBottom: 6, 
    color: "#34495e", 
    fontSize: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputFocused: { 
    borderColor: "#2563EB", 
    borderWidth: 2,
  },
  inputError: { borderColor: "#FF0000", borderWidth: 1 },
  errorText: { color: "#FF0000", fontSize: 12, marginTop: 5, marginLeft: 5 },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: "#2c3e50" },
  phoneContainer: { flexDirection: "row" },
  countryCode: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRightWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  countryCodeFocused: { 
    borderColor: "#2563EB", 
    borderWidth: 2, 
    borderRightWidth: 0 
  },
  countryCodeError: { borderColor: "#FF0000", borderWidth: 1, borderRightWidth: 0 },
  countryCodeText: { fontSize: 16, fontWeight: "500", color: "#34495e" },
  phoneInput: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    color: "#2c3e50",
  },
  phoneInputFocused: { 
    borderColor: "#2563EB", 
    borderWidth: 2,
  },
  phoneInputError: { borderColor: "#FF0000", borderWidth: 1 },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  dropdownFocused: { 
    borderColor: "#2563EB", 
    borderWidth: 2,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#94A3B8',
    marginLeft: 10,
  },
  checkboxWrapper: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    marginTop: 10,
  },
  terms: { 
    flex: 1, 
    fontSize: 13, 
    color: "#7f8c8d", 
    lineHeight: 18, 
    marginLeft: 8 
  },
  
  // Button styles - KEPT ORIGINAL DESIGN
  buttonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10, 
    marginBottom: 25,
    backgroundColor: "#f5f5f5",
  },
  backBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
    height: 48,
  },
  backBtnText: { 
    color: "#2563EB", 
    fontWeight: "600", 
    fontSize: 16 
  },
  confirmBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: "55%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 48,
  },
  confirmText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 16 
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  paymentModalContainer: {
    width: "60%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemSelected: {
    backgroundColor: '#2563EB', 
  },
  modalItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  modalItemTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  closeBtn: { position: "absolute", right: 12, top: 12, zIndex: 1, padding: 4 },
  paymentTitle: { fontSize: 22, fontWeight: "700", marginBottom: 5, marginTop: 20, textAlign: "center", width: "100%", color: "#2c3e50" },
  paymentSubtitle: { color: "#7f8c8d", marginBottom: 20, textAlign: "center", width: "100%" },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  paymentOptionSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" }, // Also updated payment selection to match header
  paymentText: { marginLeft: 10, fontSize: 18, color: "#2c3e50", fontWeight: "500" },
  paymentTextSelected: { color: "#fff" },
  summaryBox: { marginTop: 20, backgroundColor: "#f8f9fa", padding: 15, borderRadius: 12, width: "100%" },
  summaryTitle: { fontWeight: "700", color: "#2563EB", marginBottom: 15, fontSize: 14, textAlign: "center" }, // Updated to header blue
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
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 5,
  },
  totalText: { fontWeight: "700", fontSize: 16, color: "#2c3e50" },
  totalPrice: { fontWeight: "700", color: "#2563EB", fontSize: 16 }, 
});

