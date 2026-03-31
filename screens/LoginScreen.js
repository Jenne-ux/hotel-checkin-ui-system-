import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';
const isLargeScreen = width >= 1024;
const isTablet = width >= 768 && width < 1024;

// Custom Keyboard Component with blue highlight on click
const CustomKeyboard = ({ visible, onClose, onKeyPress, value = '', maxLength = 50, type = 'alphabetic' }) => {
  const [inputValue, setInputValue] = useState(value);
  const [shiftActive, setShiftActive] = useState(false);
  const [symbolsActive, setSymbolsActive] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);

  useEffect(() => {
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
    if (symbolsActive) return numericSymbolsKeys;
    if (shiftActive) return alphabeticUpperKeys;
    return alphabeticLowerKeys;
  };

  const handleKeyPress = (key) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    let newValue = inputValue;

    switch (key) {
      case '⌫':
        newValue = inputValue.slice(0, -1);
        break;
      case 'space':
        if (inputValue.length < maxLength) newValue = inputValue + ' ';
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
        if (inputValue.length < maxLength) newValue = inputValue + key;
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

// Custom TextInput Component with Label
const CustomTextInput = ({ 
  label,
  placeholder, 
  value, 
  onChangeText, 
  icon, 
  keyboardType = 'alphabetic', 
  error = null,
  secureTextEntry = false,
  onFocus,
  onBlur,
  focused = false
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyPress = (newValue, isSubmitted) => {
    setInternalValue(newValue);
    onChangeText(newValue);
    if (isSubmitted) setIsKeyboardVisible(false);
  };

  const handleFocus = () => {
    setIsKeyboardVisible(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  const getDisplayText = () => {
    if (!internalValue) return placeholder;
    if (secureTextEntry && !showPassword) {
      return '•'.repeat(internalValue.length);
    }
    return internalValue;
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        focused && styles.inputFocused, 
        error && styles.inputError
      ]}>
        <Ionicons name={icon} size={20} color={focused ? "#2563EB" : "#9CA3AF"} />
        <TouchableOpacity
          activeOpacity={0.7}
          style={{ flex: 1 }}
          onPress={handleFocus}
        >
          <Text style={[
            styles.inputText,
            !internalValue && styles.placeholderText
          ]}>
            {getDisplayText()}
          </Text>
        </TouchableOpacity>
        {secureTextEntry && internalValue && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#9CA3AF" 
            />
          </TouchableOpacity>
        )}
      </View>
      
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
      />
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors, setErrors] = useState({});
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          navigation.replace("Dashboard");
        } else {
          Alert.alert("Error", "Invalid admin credentials\nUsername: admin\nPassword: admin123");
        }
      }, 1000);
    }
  };

  const handleGuestAccess = () => {
    navigation.replace("Welcome");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      <View style={styles.backgroundGradient} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            
            {/* Main Card Container - Two columns on web, single on mobile */}
            <View style={styles.cardContainer}>
              {/* Logo Section - Left side on web, top on mobile */}
              <Animated.View style={[styles.logoSection, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.logoCircle}>
                  <Ionicons name="business-outline" size={isLargeScreen ? 60 : 50} color="#2563EB" />
                </View>
                <View style={styles.brandContainer}>
                  <Text style={styles.brandPro}>PRO</Text>
                  <Text style={styles.brandServ}>SERV</Text>
                  <Text style={styles.brandHotel}>Hotel</Text>
                </View>
                <View style={styles.dividerLight} />
                <Text style={styles.tagline}>Providing Excellent Service to Clients</Text>
              </Animated.View>

              {/* Login Form Section - Right side on web, bottom on mobile */}
              <Animated.View style={[styles.loginSection, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.cardTitle}>Login</Text>
                <View style={styles.titleUnderline} />

                <CustomTextInput
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) setErrors({...errors, username: null});
                  }}
                  icon="person-outline"
                  keyboardType="alphabetic"
                  error={errors.username}
                  focused={focusedInput === 'username'}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                />

                <CustomTextInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({...errors, password: null});
                  }}
                  icon="lock-closed-outline"
                  keyboardType="numeric"
                  secureTextEntry={true}
                  error={errors.password}
                  focused={focusedInput === 'password'}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />

                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity 
                  style={styles.guestButton}
                  onPress={handleGuestAccess}
                  activeOpacity={0.8}
                >
                  <Ionicons name="people-outline" size={22} color="#2563EB" />
                  <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>
                    Demo: admin / admin123
                  </Text>
                </View>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#2563EB",
    opacity: 0.95,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: isLargeScreen ? 60 : 40,
    paddingHorizontal: isLargeScreen ? 20 : 16,
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: isLargeScreen ? 1000 : (isTablet ? 700 : width - 40),
    maxWidth: 1100,
    flexDirection: isLargeScreen ? "row" : "column",
    backgroundColor: "#fff",
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  logoSection: {
    flex: isLargeScreen ? 1 : 0,
    backgroundColor: "#F8FAFF",
    padding: isLargeScreen ? 48 : 40,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: isLargeScreen ? 1 : 0,
    borderBottomWidth: isLargeScreen ? 0 : 1,
    borderColor: "#E5E7EB",
  },
  logoCircle: {
    width: isLargeScreen ? 120 : 90,
    height: isLargeScreen ? 120 : 90,
    borderRadius: isLargeScreen ? 60 : 45,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  brandPro: {
    fontSize: isLargeScreen ? 42 : 34,
    fontWeight: "bold",
    color: "#0d3ca1",
    letterSpacing: 0.5,
  },
  brandServ: {
    fontSize: isLargeScreen ? 42 : 34,
    fontWeight: "bold",
    color: "#8A8A8A",
    letterSpacing: 0.5,
  },
  brandHotel: {
    fontSize: isLargeScreen ? 42 : 34,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  dividerLight: {
    width: 60,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  tagline: {
    fontSize: isLargeScreen ? 14 : 12,
    color: "#9CA3AF",
    textAlign: "center",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  loginSection: {
    flex: isLargeScreen ? 1 : 0,
    padding: isLargeScreen ? 48 : 32,
  },
  cardTitle: {
    fontSize: isLargeScreen ? 32 : 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: isLargeScreen ? 16 : 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  inputFocused: {
    borderColor: "#2563EB",
    borderWidth: 2,
    backgroundColor: "#fff",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputText: {
    flex: 1,
    fontSize: isLargeScreen ? 16 : 15,
    color: "#1F2937",
    marginLeft: 12,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: "#2563EB",
    paddingVertical: isLargeScreen ? 18 : 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: isLargeScreen ? 18 : 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#9CA3AF",
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: "500",
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isLargeScreen ? 16 : 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#2563EB",
    backgroundColor: "#fff",
    gap: 10,
  },
  guestButtonText: {
    fontSize: isLargeScreen ? 16 : 15,
    fontWeight: "600",
    color: "#2563EB",
  },
  footerContainer: {
    marginTop: 24,
    paddingTop: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: isLargeScreen ? 12 : 11,
    color: "#9CA3AF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
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

export default LoginScreen;