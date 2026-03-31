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
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import QRPaymentModal from "./QR";
import Card from "./Card";
import Cash from "./Cash";

const { width } = Dimensions.get('window');

// Custom Keyboard Component with blue highlight on click
const CustomKeyboard = ({ visible, onClose, onKeyPress, value = '', maxLength = 50, type = 'alphabetic' }) => {
  const [inputValue, setInputValue] = useState(value);
  const [shiftActive, setShiftActive] = useState(false);
  const [symbolsActive, setSymbolsActive] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const alphabeticLowerKeys = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['123', 'space', '⌫', '✓']
  ];

  const alphabeticUpperKeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['123', 'space', '⌫', '✓']
  ];

  const numericSymbolsKeys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['@', '#', '$', '%', '&', '*', '-', '+', '=', '/'],
    ['(', ')', '[', ']', '{', '}', '!', '?', '.', ','],
    ['ABC', 'space', '⌫', '✓']
  ];

  const getCurrentKeys = () => {
    if (symbolsActive) {
      return numericSymbolsKeys;
    }
    if (shiftActive) {
      return alphabeticUpperKeys;
    }
    return alphabeticLowerKeys;
  };

  const handleKeyPress = (key) => {
    // Add highlight effect
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    let newValue = inputValue;

    switch (key) {
      case '⌫':
        newValue = inputValue.slice(0, -1);
        break;
      case 'space':
        if (inputValue.length < maxLength) {
          newValue = inputValue + ' ';
        }
        break;
      case '✓':
        onKeyPress(inputValue, true);
        if (onClose) onClose();
        return;
      case '123':
        setSymbolsActive(true);
        setShiftActive(false);
        return;
      case 'ABC':
        setSymbolsActive(false);
        setShiftActive(false);
        return;
      default:
        if (inputValue.length < maxLength) {
          newValue = inputValue + key;
        }
        break;
    }

    setInputValue(newValue);
    onKeyPress(newValue, false);
  };

  const keys = getCurrentKeys();

  const getKeyWidth = (rowKeys, currentKey) => {
    if (currentKey === 'space') return width / 2.5;
    if (currentKey === '⌫' || currentKey === '✓' || currentKey === '123' || currentKey === 'ABC') return (width - 40) / 6;
    return (width - 40) / rowKeys.length;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.keyboardModalOverlay}>
        <View style={styles.keyboardContainer}>
          <View style={styles.keyboardHandleBar} />
          
          <View style={styles.keyboardHeader}>
            <Text style={styles.keyboardHeaderText}>
              {symbolsActive ? 'Numbers & Symbols' : (shiftActive ? 'UPPERCASE' : 'Lowercase')}
            </Text>
            {!symbolsActive && type !== 'numeric' && (
              <TouchableOpacity onPress={() => setShiftActive(!shiftActive)}>
                <Ionicons 
                  name={shiftActive ? "arrow-up-circle" : "arrow-up-outline"} 
                  size={22} 
                  color={shiftActive ? "#2563EB" : "#666"} 
                />
              </TouchableOpacity>
            )}
          </View>
          
          {keys.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map((key) => {
                let keyStyle = {};
                let textStyle = {};
                const keyWidth = getKeyWidth(row, key);
                const isPressed = pressedKey === key;
                
                if (key === '✓') {
                  keyStyle = [styles.keyboardSubmitKey, isPressed && styles.keyPressed];
                  textStyle = styles.keyboardSubmitKeyText;
                } else if (key === '⌫') {
                  keyStyle = [styles.keyboardBackspaceKey, isPressed && styles.keyPressed];
                  textStyle = styles.keyboardBackspaceKeyText;
                } else if (key === 'space') {
                  keyStyle = [styles.keyboardSpaceKey, isPressed && styles.keyPressed];
                  textStyle = styles.keyboardSpaceKeyText;
                } else if (key === '123' || key === 'ABC') {
                  keyStyle = [styles.keyboardSymbolKey, isPressed && styles.keyPressed];
                  textStyle = styles.keyboardSymbolKeyText;
                } else {
                  keyStyle = [styles.keyboardKey, isPressed && styles.keyPressed];
                  textStyle = styles.keyboardKeyText;
                }
                
                return (
                  <TouchableOpacity
                    key={key}
                    style={[keyStyle, { width: keyWidth }]}
                    onPress={() => handleKeyPress(key)}
                    activeOpacity={0.7}
                  >
                    <Text style={textStyle}>
                      {key === 'space' ? 'Space' : 
                       key === '✓' ? 'Done' : 
                       key === '⌫' ? '⌫' : 
                       key === '123' ? '123' :
                       key === 'ABC' ? 'ABC' : key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.keyboardHideButton}
            onPress={onClose}
          >
            <Text style={styles.keyboardHideButtonText}>Hide Keyboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Custom TextInput Component
const CustomTextInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  iconType = 'Ionicons', 
  keyboardType = 'alphabetic', 
  required = false, 
  error = null, 
  maxLength = 50,
  onFocus,
  onBlur,
  focused = false,
  additionalInfo = null
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleKeyPress = (newValue, isSubmitted) => {
    setInternalValue(newValue);
    onChangeText(newValue);
    if (isSubmitted) {
      setIsKeyboardVisible(false);
    }
  };

  const handleFocus = () => {
    setIsKeyboardVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      friction: 5,
      useNativeDriver: true,
    }).start();
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
    if (onBlur) onBlur();
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={icon} size={20} color={focused ? "#2563EB" : "#8a8a8a"} />;
    }
    return <Ionicons name={icon} size={20} color={focused ? "#2563EB" : "#8a8a8a"} />;
  };

  const renderAdditionalInfo = () => {
    if (!additionalInfo) return null;
    return <Text style={styles.additionalInfo}>{additionalInfo}</Text>;
  };

  return (
    <Animated.View style={[
      styles.inputWrapper,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.asterisk}>*</Text>}
      </Text>
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleFocus}
      >
        <View style={[
          styles.inputContainer, 
          focused && styles.inputFocused, 
          error && styles.inputError
        ]}>
          {renderIcon()}
          <Text style={[
            styles.inputText,
            !internalValue && styles.placeholderText
          ]}>
            {internalValue || placeholder}
          </Text>
        </View>
      </TouchableOpacity>
      
      {renderAdditionalInfo()}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <CustomKeyboard
        visible={isKeyboardVisible}
        onClose={() => {
          setIsKeyboardVisible(false);
          handleBlur();
        }}
        onKeyPress={handleKeyPress}
        value={internalValue}
        type={keyboardType}
        maxLength={maxLength}
      />
    </Animated.View>
  );
};

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
  const [errors, setErrors] = useState({});
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
      setPaymentVisible(true);
    } else {
      Alert.alert("Validation Error", "Please fill in all required fields correctly.");
    }
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
            {/* Full Name - Using custom keyboard */}
            <CustomTextInput
              label="Full Name"
              placeholder="e.g. Juan Tamad"
              value={fullName}
              onChangeText={(text) => { setFullName(text); if (errors.fullName) setErrors({...errors, fullName: null}); }}
              icon="person-outline"
              iconType="Ionicons"
              keyboardType="alphabetic"
              required={true}
              error={errors.fullName}
              focused={focusedInput === 'fullName'}
              onFocus={() => setFocusedInput('fullName')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Nationality - Using custom keyboard */}
            <CustomTextInput
              label="Nationality"
              placeholder="e.g. Filipino"
              value={nationality}
              onChangeText={(text) => { setNationality(text); if (errors.nationality) setErrors({...errors, nationality: null}); }}
              icon="flag-outline"
              iconType="Ionicons"
              keyboardType="alphabetic"
              required={true}
              error={errors.nationality}
              focused={focusedInput === 'nationality'}
              onFocus={() => setFocusedInput('nationality')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Email - Using email keyboard */}
            <CustomTextInput
              label="Email Address"
              placeholder="e.g. juanTamad@email.com"
              value={email}
              onChangeText={(text) => { setEmail(text); if (errors.email) setErrors({...errors, email: null}); }}
              icon="mail-outline"
              iconType="Ionicons"
              keyboardType="email"
              required={true}
              error={errors.email}
              focused={focusedInput === 'email'}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
              additionalInfo="We'll send your confirmation and receipt to this email"
            />

            {/* Phone - Using numeric keyboard */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.phoneContainer}>
                <View style={[styles.countryCode, focusedInput === 'phone' && styles.countryCodeFocused, errors.phone && styles.countryCodeError]}>
                  <Text style={styles.countryCodeText}>+63</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ flex: 1 }}
                  onPress={() => setFocusedInput('phone')}
                >
                  <View style={[
                    styles.phoneInputContainer,
                    focusedInput === 'phone' && styles.phoneInputContainerFocused,
                    errors.phone && styles.phoneInputContainerError
                  ]}>
                    <Text style={[
                      styles.phoneInputText,
                      !phone && styles.phonePlaceholderText
                    ]}>
                      {phone || "9123456789"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Custom keyboard for phone */}
            <CustomKeyboard
              visible={focusedInput === 'phone'}
              onClose={() => setFocusedInput(null)}
              onKeyPress={(newValue, isSubmitted) => {
                setPhone(newValue);
                if (errors.phone) setErrors({...errors, phone: null});
                if (isSubmitted) setFocusedInput(null);
              }}
              value={phone}
              type="numeric"
              maxLength={10}
            />

            {/* Government ID Type - Dropdown */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Government-Issued ID Type <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.idType && styles.inputError]}
                onPress={() => setIdTypeModalVisible(true)}
              >
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8a8a8a" />
                <Text style={idType ? styles.dropdownButtonText : styles.dropdownPlaceholder}>
                  {idType || "Select ID type"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
              {errors.idType && <Text style={styles.errorText}>{errors.idType}</Text>}
            </View>

            {/* ID Number - Using custom keyboard */}
            <CustomTextInput
              label="ID / Passport Number"
              placeholder="e.g. P12345678"
              value={idNumber}
              onChangeText={(text) => { setIdNumber(text); if (errors.idNumber) setErrors({...errors, idNumber: null}); }}
              icon="card-account-details-outline"
              iconType="MaterialCommunityIcons"
              keyboardType="alphabetic"
              required={true}
              error={errors.idNumber}
              focused={focusedInput === 'idNumber'}
              onFocus={() => setFocusedInput('idNumber')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Checkbox */}
            <View style={styles.checkboxWrapper}>
              <TouchableOpacity
                onPress={() => { setAgreed(!agreed); if (errors.agreed) setErrors({...errors, agreed: null}); }}
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
            {errors.agreed && <Text style={styles.errorText}>{errors.agreed}</Text>}
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
  asterisk: { color: "#FF0000", fontWeight: "bold" },
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  label: { fontWeight: "600", marginBottom: 6, color: "#34495e", fontSize: 16 },
  inputWrapper: { marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fafafa", padding: 12, borderRadius: 8, borderWidth: 2, borderColor: "#e0e0e0", minHeight: 48 },
  inputFocused: { borderColor: "#2563EB", borderWidth: 2, backgroundColor: "#fff", shadowColor: "#2563EB", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  inputError: { borderColor: "#FF0000", borderWidth: 2 },
  inputText: { marginLeft: 10, flex: 1, fontSize: 16, color: "#2c3e50" },
  placeholderText: { color: "#94A3B8" },
  errorText: { color: "#FF0000", fontSize: 12, marginTop: 5, marginLeft: 5 },
  additionalInfo: { fontSize: 11, color: "#7f8c8d", marginTop: 4, marginLeft: 5 },
  phoneContainer: { flexDirection: "row" },
  countryCode: { backgroundColor: "#f0f0f0", padding: 12, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderWidth: 2, borderColor: "#e0e0e0", borderRightWidth: 0, justifyContent: "center", alignItems: "center", minWidth: 60 },
  countryCodeFocused: { borderColor: "#2563EB", borderWidth: 2, borderRightWidth: 0 },
  countryCodeError: { borderColor: "#FF0000", borderWidth: 2, borderRightWidth: 0 },
  countryCodeText: { fontSize: 16, fontWeight: "500", color: "#34495e" },
  phoneInputContainer: { backgroundColor: "#fafafa", padding: 12, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderWidth: 2, borderColor: "#e0e0e0", borderLeftWidth: 0, flex: 1, minHeight: 48, justifyContent: "center" },
  phoneInputContainerFocused: { borderColor: "#2563EB", borderWidth: 2, borderLeftWidth: 0, backgroundColor: "#fff" },
  phoneInputContainerError: { borderColor: "#FF0000", borderWidth: 2, borderLeftWidth: 0 },
  phoneInputText: { fontSize: 16, color: "#2c3e50" },
  phonePlaceholderText: { color: "#94A3B8" },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fafafa' },
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
  // Keyboard styles
  keyboardModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  keyboardContainer: { backgroundColor: '#e8e8e8', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 12, paddingBottom: 20 },
  keyboardHandleBar: { width: 40, height: 4, backgroundColor: '#b0b0b0', borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  keyboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginBottom: 8 },
  keyboardHeaderText: { fontSize: 12, color: '#666', fontWeight: '500' },
  keyboardRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 6 },
  keyboardKey: { marginHorizontal: 2, paddingVertical: 12, paddingHorizontal: 4, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  keyboardKeyText: { fontSize: 18, fontWeight: '500', color: '#333' },
  keyPressed: { 
    backgroundColor: '#2563EB',
    transform: [{ scale: 0.95 }],
  },
  keyboardBackspaceKey: { marginHorizontal: 2, paddingVertical: 12, backgroundColor: '#ffebee', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  keyboardBackspaceKeyText: { fontSize: 22, fontWeight: '600', color: '#d32f2f' },
  keyboardSpaceKey: { marginHorizontal: 2, paddingVertical: 12, backgroundColor: '#f5f5f5', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  keyboardSpaceKeyText: { fontSize: 14, fontWeight: '500', color: '#666' },
  keyboardSubmitKey: { marginHorizontal: 2, paddingVertical: 12, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  keyboardSubmitKeyText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  keyboardSymbolKey: { marginHorizontal: 2, paddingVertical: 12, backgroundColor: '#e3f2fd', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  keyboardSymbolKeyText: { fontSize: 14, fontWeight: '500', color: '#1976d2' },
  keyboardHideButton: { marginTop: 8, paddingVertical: 8, alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, marginHorizontal: 20 },
  keyboardHideButtonText: { fontSize: 14, color: '#666', fontWeight: '500' },
});