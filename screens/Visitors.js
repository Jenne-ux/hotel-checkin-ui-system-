import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ApprovedVisit from './ApprovedVisit';
import DenyVisit from './DenyVisit';

const { width } = Dimensions.get('window');

// Enhanced Custom Keyboard Component with blue highlight on click
const CustomKeyboard = ({ visible, onClose, onKeyPress, value = '', maxLength = 50, type = 'alphabetic' }) => {
  const [inputValue, setInputValue] = useState(value);
  const [shiftActive, setShiftActive] = useState(false);
  const [symbolsActive, setSymbolsActive] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Better organized keyboard layouts
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

  // Better organized numbers and common symbols - fits better on screen
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

  // Calculate key width based on number of keys in row
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
          
          {/* Keyboard Header */}
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
          
          {keys.map((row, rowIndex) => {
            const rowKeyWidth = getKeyWidth(row, '');
            return (
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
            );
          })}
          
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

// Custom TextInput with blue outline highlighting - REMOVED THE X BUTTON
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
  focused = false
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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
          {/* X BUTTON REMOVED */}
        </View>
      </TouchableOpacity>
      
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

const ApprovalModal = ({ visible, onClose, onApprove, onDeny, visitorName, personToVisit, purposeOfVisit, idType, idNumber }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlayCenter}>
      <View style={styles.approvalModalContent}>
        <View style={styles.approvalLoadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.approvalLoadingText}>CONTACTING HOST...</Text>
        </View>
        <Text style={styles.approvalMessage}>
          Admin has been notified. Please wait for approval from {personToVisit || 'the host'}.
        </Text>
        <View style={styles.approvalDetailsCard}>
          <Text style={styles.approvalDetailsTitle}>Visitor Details</Text>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>Name:</Text>
            <Text style={styles.approvalDetailValue}>{visitorName || 'Guest'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>Visiting:</Text>
            <Text style={styles.approvalDetailValue}>{personToVisit || 'Host'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>Purpose:</Text>
            <Text style={styles.approvalDetailValue}>{purposeOfVisit || 'Visit'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>ID Type:</Text>
            <Text style={styles.approvalDetailValue}>{idType || 'ID'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>ID Number:</Text>
            <Text style={styles.approvalDetailValue}>{idNumber || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.approvalButtonContainer}>
          <TouchableOpacity style={styles.approvalApproveButton} onPress={onApprove}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.approvalApproveButtonText}>Approve Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approvalDenyButton} onPress={onDeny}>
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.approvalDenyButtonText}>Deny Visit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.approvalNoteText}>Admin: Click Approve after confirming with the host</Text>
      </View>
    </View>
  </Modal>
);

const Visitors = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [personToVisit, setPersonToVisit] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [purposeModalVisible, setPurposeModalVisible] = useState(false);
  const purposes = ['Guest Companion', 'Family Visit', 'Business Meeting', 'Delivery', 'Maintenance'];
  const [idType, setIdType] = useState('');
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
    'Other IDs'
  ];
  const [idNumber, setIdNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvedModalVisible, setApprovedModalVisible] = useState(false);
  const [deniedModalVisible, setDeniedModalVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});

  const handleBack = () => navigation.goBack();

  const validateForm = () => {
    let newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!personToVisit.trim()) newErrors.personToVisit = "Person to visit is required";
    if (!purposeOfVisit) newErrors.purposeOfVisit = "Please select a purpose of visit";
    if (!idType) newErrors.idType = "Please select an ID type";
    if (!idNumber.trim()) newErrors.idNumber = "ID number is required";
    if (!agreed) newErrors.agreed = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setApprovalModalVisible(true);
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields and agree to the terms.');
    }
  };

  const handleAdminApprove = () => {
    setApprovalModalVisible(false);
    setApprovedModalVisible(true);
  };

  const handleAdminDeny = () => {
    setApprovalModalVisible(false);
    setDeniedModalVisible(true);
  };

  const handleApprovedClose = () => {
    setApprovedModalVisible(false);
    navigation.navigate('NewVisitorReg');
  };

  const handleTryAgain = () => setDeniedModalVisible(false);

  const handleBackToHome = () => {
    setDeniedModalVisible(false);
    navigation.navigate('Welcome');
  };

  const selectPurpose = (purpose) => {
    setPurposeOfVisit(purpose);
    setPurposeModalVisible(false);
    if (errors.purposeOfVisit) setErrors({...errors, purposeOfVisit: null});
  };

  const selectIdType = (selectedIdType) => {
    setIdType(selectedIdType);
    setIdTypeModalVisible(false);
    if (errors.idType) setErrors({...errors, idType: null});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <View style={styles.header}>
        <View style={styles.poweredBox}>
          <Text style={styles.poweredText}>Powered by</Text>
          <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>Visitor Information</Text>
          <Text style={styles.headerSub}>Please provide your details for visiting</Text>

          <View style={styles.formContainer}>
            {/* Full Name */}
            <CustomTextInput
              label="Full Name"
              placeholder="e.g. Juana Dela Cruz"
              value={fullName}
              onChangeText={(text) => { 
                setFullName(text); 
                if (errors.fullName) setErrors({...errors, fullName: null}); 
              }}
              icon="person-outline"
              iconType="Ionicons"
              keyboardType="alphabetic"
              required={true}
              error={errors.fullName}
              focused={focusedInput === 'fullName'}
              onFocus={() => setFocusedInput('fullName')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Person to Visit */}
            <CustomTextInput
              label="Person to Visit"
              placeholder="Who are you here to see?"
              value={personToVisit}
              onChangeText={(text) => { 
                setPersonToVisit(text); 
                if (errors.personToVisit) setErrors({...errors, personToVisit: null}); 
              }}
              icon="people-outline"
              iconType="Ionicons"
              keyboardType="alphabetic"
              required={true}
              error={errors.personToVisit}
              focused={focusedInput === 'personToVisit'}
              onFocus={() => setFocusedInput('personToVisit')}
              onBlur={() => setFocusedInput(null)}
            />

            {/* Purpose of Visit - Dropdown */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Purpose of Visit <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity
                style={[styles.dropdownButton, focusedInput === 'purpose' && styles.dropdownFocused, errors.purposeOfVisit && styles.inputError]}
                onPress={() => setPurposeModalVisible(true)}
              >
                <Ionicons name="briefcase-outline" size={20} color={focusedInput === 'purpose' ? "#2563EB" : "#8a8a8a"} />
                <Text style={purposeOfVisit ? styles.dropdownButtonText : styles.dropdownPlaceholder}>
                  {purposeOfVisit || "Select Reason"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
              {errors.purposeOfVisit && <Text style={styles.errorText}>{errors.purposeOfVisit}</Text>}
            </View>

            {/* ID Type - Dropdown */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Government-Issued ID Type <Text style={styles.asterisk}>*</Text></Text>
              <TouchableOpacity
                style={[styles.dropdownButton, focusedInput === 'idType' && styles.dropdownFocused, errors.idType && styles.inputError]}
                onPress={() => setIdTypeModalVisible(true)}
              >
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color={focusedInput === 'idType' ? "#2563EB" : "#8a8a8a"} />
                <Text style={idType ? styles.dropdownButtonText : styles.dropdownPlaceholder}>
                  {idType || "Select ID Type"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
              {errors.idType && <Text style={styles.errorText}>{errors.idType}</Text>}
            </View>

            {/* ID Number */}
            <CustomTextInput
              label="ID Number"
              placeholder="e.g. 123-456-789"
              value={idNumber}
              onChangeText={(text) => { 
                setIdNumber(text); 
                if (errors.idNumber) setErrors({...errors, idNumber: null}); 
              }}
              icon="card-account-details-outline"
              iconType="MaterialCommunityIcons"
              keyboardType="numeric"
              required={true}
              error={errors.idNumber}
              maxLength={20}
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
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleContinue}>
              <Text style={styles.confirmText}>Confirm Registration →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Purpose Modal */}
      <Modal animationType="slide" transparent={true} visible={purposeModalVisible} onRequestClose={() => setPurposeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Purpose of Visit</Text>
              <TouchableOpacity onPress={() => setPurposeModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={purposes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, purposeOfVisit === item && styles.modalItemSelected]}
                  onPress={() => selectPurpose(item)}
                >
                  <Text style={[styles.modalItemText, purposeOfVisit === item && styles.modalItemTextSelected]}>{item}</Text>
                  {purposeOfVisit === item && <Ionicons name="checkmark" size={20} color="#fff" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

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

      <ApprovalModal
        visible={approvalModalVisible}
        onClose={() => setApprovalModalVisible(false)}
        onApprove={handleAdminApprove}
        onDeny={handleAdminDeny}
        visitorName={fullName}
        personToVisit={personToVisit}
        purposeOfVisit={purposeOfVisit}
        idType={idType}
        idNumber={idNumber}
      />

      <ApprovedVisit
        visible={approvedModalVisible}
        onClose={handleApprovedClose}
        visitorName={fullName}
        personToVisit={personToVisit}
      />

      <DenyVisit
        visible={deniedModalVisible}
        onTryAgain={handleTryAgain}
        onBackToHome={handleBackToHome}
        visitorName={fullName}
        personToVisit={personToVisit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { width: "100%", height: 80, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "flex-end", paddingRight: 20 },
  poweredBox: { backgroundColor: "#EFE6D7", padding: 10, borderRadius: 10, alignItems: "center" },
  poweredText: { fontSize: 12, color: "#555" },
  logo: { width: 120, height: 30 },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: 30 },
  content: { padding: 16, backgroundColor: '#f5f5f5' },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#2c3e50", marginBottom: 8, marginTop: 10 },
  headerSub: { fontSize: 14, color: "#7f8c8d", marginBottom: 24, lineHeight: 20 },
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 2 },
  label: { fontWeight: "600", marginBottom: 6, color: "#34495e", fontSize: 16 },
  asterisk: { color: "#FF0000", fontWeight: "bold" },
  inputWrapper: { marginBottom: 20 },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fafafa", 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 2, 
    borderColor: "#e0e0e0",
    minHeight: 48,
  },
  inputFocused: { 
    borderColor: "#2563EB", 
    borderWidth: 2,
    backgroundColor: "#fff",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: { borderColor: "#FF0000", borderWidth: 2 },
  inputText: { marginLeft: 10, flex: 1, fontSize: 16, color: "#2c3e50" },
  placeholderText: { color: "#94A3B8" },
  errorText: { color: "#FF0000", fontSize: 12, marginTop: 5, marginLeft: 5 },
  dropdownButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#e0e0e0', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    backgroundColor: '#fafafa',
  },
  dropdownFocused: { 
    borderColor: "#2563EB", 
    borderWidth: 2,
    backgroundColor: "#fff",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownButtonText: { flex: 1, fontSize: 16, color: '#2c3e50', marginLeft: 10 },
  dropdownPlaceholder: { flex: 1, fontSize: 16, color: '#94A3B8', marginLeft: 10 },
  checkboxWrapper: { flexDirection: "row", alignItems: "flex-start", marginTop: 10, marginBottom: 10 },
  terms: { flex: 1, fontSize: 13, color: "#7f8c8d", lineHeight: 18, marginLeft: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 20 },
  backBtn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, width: "40%", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#2563EB", height: 48 },
  backBtnText: { color: "#2563EB", fontWeight: "600", fontSize: 16 },
  confirmBtn: { backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, width: "55%", alignItems: "center", justifyContent: "center", elevation: 2, height: 48 },
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
  approvalModalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '90%', maxWidth: 400, alignItems: 'center', elevation: 5 },
  approvalLoadingContainer: { alignItems: 'center', marginBottom: 16 },
  approvalLoadingText: { fontSize: 16, fontWeight: '600', color: '#2563EB', marginTop: 8 },
  approvalMessage: { fontSize: 14, color: '#7f8c8d', textAlign: 'center', marginBottom: 20 },
  approvalDetailsCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, width: '100%', marginBottom: 20 },
  approvalDetailsTitle: { fontSize: 15, fontWeight: '600', color: '#2563EB', marginBottom: 12, textAlign: 'center' },
  approvalDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  approvalDetailLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  approvalDetailValue: { fontSize: 13, color: '#1E293B', fontWeight: '600' },
  approvalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12, gap: 10 },
  approvalApproveButton: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  approvalApproveButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  approvalDenyButton: { backgroundColor: '#EF4444', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  approvalDenyButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  approvalNoteText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' },
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

export default Visitors;