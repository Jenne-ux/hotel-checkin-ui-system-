// screens/MainLayout.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';
const isLargeScreen = width >= 1024;

const MainLayout = ({ children, currentScreen, navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const sidebarAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [isSidebarPermanent, setIsSidebarPermanent] = useState(isLargeScreen);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isWeb) {
      const handleResize = () => {
        const newWidth = window.innerWidth;
        setIsSidebarPermanent(newWidth >= 1024);
        if (newWidth >= 1024) setSidebarVisible(false);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const toggleSidebar = () => {
    if (isSidebarPermanent) return;
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(sidebarAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      setSidebarVisible(false);
    } else {
      Animated.parallel([
        Animated.timing(sidebarAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0.5, duration: 300, useNativeDriver: true }),
      ]).start();
      setSidebarVisible(true);
    }
  };

  const closeSidebar = () => {
    if (!isSidebarPermanent && sidebarVisible) {
      Animated.parallel([
        Animated.timing(sidebarAnim, { toValue: -width, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      setSidebarVisible(false);
    }
  };

  const handleLogout = () => {
    closeSidebar();
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.replace("Login") },
    ]);
  };

  const handleNavigation = (screen) => {
    if (!isSidebarPermanent) closeSidebar();
    navigation.navigate(screen);
  };

  const menuItems = [
    { name: "Dashboard", icon: "grid-outline", screen: "Dashboard", color: "#3B82F6" },
    { name: "Guests", icon: "people-outline", screen: "Guests", color: "#10B981" },
    { name: "Rooms", icon: "bed-outline", screen: "Rooms", color: "#8B5CF6" },
    { name: "Visitors", icon: "person-add-outline", screen: "Visitors", color: "#F59E0B" },
    { name: "Payments", icon: "card-outline", screen: "Payments", color: "#EF4444" },
  ];

  const SidebarContent = () => (
    <>
      <View style={styles.sidebarTopLight}>
        <View style={styles.sidebarLogoContainer}>
          <View style={styles.logoWrapper}>
            <View style={styles.hotelIconCircle}>
              <Ionicons name="business-outline" size={28} color="#2563EB" />
            </View>
            {/* Replace with your actual logo path or remove */}
            <Image source={require("../assets/logo.png")} style={styles.sidebarLogo} resizeMode="contain" />
          </View>
          {!isSidebarPermanent && (
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.sidebarDarkSection}>
        <View style={styles.separatorLine} />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.menuScrollView}>
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={[styles.menuItem, currentScreen === item.screen && styles.activeMenuItem]}
                onPress={() => handleNavigation(item.screen)}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20`, borderRadius: 8, padding: 6 }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.menuText, currentScreen === item.screen && styles.activeMenuText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.settingsButton} onPress={() => handleNavigation("Settings")}>
            <View style={[styles.menuIcon, { backgroundColor: "#374151", borderRadius: 8, padding: 6 }]}>
              <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
            </View>
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {isSidebarPermanent && (
        <View style={styles.permanentSidebar}>
          <SidebarContent />
        </View>
      )}

      <View style={[styles.mainContent, isSidebarPermanent && styles.mainContentWithSidebar]}>
        <View style={styles.header}>
          {!isSidebarPermanent && (
            <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
              <Ionicons name="menu-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitle}>
            <Text style={styles.welcomeText}>Welcome back, Admin</Text>
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#6B7280" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.avatar}>
              <Ionicons name="person-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerBorder} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {children}
        </ScrollView>
      </View>

      {!isSidebarPermanent && (
        <>
          <Animated.View
            style={[styles.overlay, { opacity: overlayAnim, display: sidebarVisible ? "flex" : "none" }]}
          >
            <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={closeSidebar} />
          </Animated.View>
          <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
            <SidebarContent />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FC", flexDirection: "row" },
  permanentSidebar: { width: 280, height: "100%", shadowColor: "#000", shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  mainContent: { flex: 1, backgroundColor: "#F8F9FC" },
  mainContentWithSidebar: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: isLargeScreen ? 32 : 20, paddingTop: isLargeScreen ? 20 : 40, paddingBottom: 12, backgroundColor: "#1F2937" },
  headerBorder: { height: 1, backgroundColor: "#E5E7EB" },
  menuButton: { padding: 8 },
  headerTitle: { flex: 1, marginLeft: isLargeScreen ? 0 : 12 },
  welcomeText: { fontSize: isLargeScreen ? 18 : 16, fontWeight: "600", color: "#e8e1e1" },
  dateText: { fontSize: 12, color: "#bfc8d9", marginTop: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 16 },
  notificationButton: { position: "relative", padding: 8 },
  notificationBadge: { position: "absolute", top: 4, right: 4, backgroundColor: "#EF4444", borderRadius: 10, minWidth: 18, height: 18, justifyContent: "center", alignItems: "center", paddingHorizontal: 4 },
  notificationBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 40 },
  sidebarTopLight: { backgroundColor: "#fafafa", paddingTop: 2 },
  sidebarDarkSection: { backgroundColor: "#1F2937", flex: 1 },
  sidebarLogoContainer: { paddingHorizontal: 24, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoWrapper: { flexDirection: "row", alignItems: "center", gap: 12 },
  hotelIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sidebarLogo: { width: 140, height: 56 },
  closeButton: { padding: 5 },
  separatorLine: { height: 1, backgroundColor: "#374151", marginHorizontal: 20, marginBottom: 16 },
  menuScrollView: { flex: 1 },
  menuContainer: { paddingTop: 10, paddingHorizontal: 16 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8 },
  activeMenuItem: { backgroundColor: "#374151" },
  menuIcon: { width: 36, height: 36, justifyContent: "center", alignItems: "center", marginRight: 12 },
  menuText: { fontSize: 16, color: "#E5E7EB", fontWeight: "500" },
  activeMenuText: { color: "#FFFFFF", fontWeight: "bold" },
  sidebarFooter: { padding: 20, borderTopWidth: 1, borderTopColor: "#374151" },
  settingsButton: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  settingsText: { fontSize: 16, color: "#9CA3AF", marginLeft: 12, fontWeight: "500" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000", zIndex: 998 },
  overlayTouchable: { flex: 1 },
  sidebar: { position: "absolute", top: 0, left: 0, bottom: 0, width: width * 0.75, maxWidth: 320, zIndex: 999, shadowColor: "#000", shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
});

export default MainLayout;