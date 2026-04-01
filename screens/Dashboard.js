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

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';
const isLargeScreen = width >= 1024;
const isTablet = width >= 768 && width < 1024;

const Dashboard = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const sidebarAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // For web, always show sidebar on large screens
  const [isSidebarPermanent, setIsSidebarPermanent] = useState(isLargeScreen);

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
    ]).start();

    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handle window resize for web
  useEffect(() => {
    if (isWeb) {
      const handleResize = () => {
        const newWidth = window.innerWidth;
        if (newWidth >= 1024) {
          setIsSidebarPermanent(true);
          setSidebarVisible(false);
        } else {
          setIsSidebarPermanent(false);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const toggleSidebar = () => {
    if (!isSidebarPermanent) {
      if (sidebarVisible) {
        Animated.parallel([
          Animated.timing(sidebarAnim, {
            toValue: -width,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        setSidebarVisible(false);
      } else {
        Animated.parallel([
          Animated.timing(sidebarAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(overlayAnim, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        setSidebarVisible(true);
      }
    }
  };

  const closeSidebar = () => {
    if (!isSidebarPermanent && sidebarVisible) {
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setSidebarVisible(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    closeSidebar();
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.replace("Login") },
    ]);
  };

  const handleNavigation = (screen) => {
    if (!isSidebarPermanent) {
      closeSidebar();
    }
    setTimeout(() => {
      if (screen === "Dashboard") {
        navigation.replace("Dashboard");
      } else {
        navigation.navigate(screen);
      }
    }, 300);
  };

  // Stats data without percentage change
  const stats = [
    { title: "Check-ins", value: "24", icon: "log-in-outline", color: "#10B981" },
    { title: "Active Visitors", value: "12", icon: "people-outline", color: "#F59E0B" },
    { title: "Room Occupancy", value: "85%", icon: "bed-outline", color: "#2563EB" },
    { title: "Pending Approvals", value: "7", icon: "time-outline", color: "#EF4444" },
  ];

  const recentActivities = [
    { id: 1, title: "Room 204 Checked out", subtitle: "Jose Santino ", time: "12 mins ago", icon: "log-out-outline", color: "#10B981" },
    { id: 2, title: "New Check-in: Juan Tamad", subtitle: "Deluxe Suite", time: "45 mins ago", icon: "book-outline", color: "#3B82F6" },
    { id: 3, title: "Maintenance Required", subtitle: "Room 412", time: "2 hours ago", icon: "construct-outline", color: "#F59E0B" },
  ];

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const occupancyData = [65, 72, 78, 82, 85, 88, 92, 90, 86, 84, 82, 78];
  const maxOccupancy = Math.max(...occupancyData);

  const menuItems = [
    { name: "Dashboard", icon: "grid-outline", screen: "Dashboard", color: "#3B82F6" },
    { name: "Guests", icon: "people-outline", screen: "Guests", color: "#10B981" },
    { name: "Rooms", icon: "bed-outline", screen: "Rooms", color: "#8B5CF6" },
    { name: "Visitors", icon: "person-add-outline", screen: "Visitors", color: "#F59E0B" },
    { name: "Payments", icon: "card-outline", screen: "Payments", color: "#EF4444" },
  ];

  // Sidebar component
  const SidebarContent = () => (
    <>
      {/* Top Light Gray Section with Logo - Aligned with header */}
      <View style={styles.sidebarTopLight}>
        <View style={styles.sidebarLogoContainer}>
          <View style={styles.logoWrapper}>
            <View style={styles.hotelIconCircle}>
              <Ionicons name="business-outline" size={28} color="#2563EB" />
            </View>
            <Image
              source={require("../assets/logo.png")}
              style={styles.sidebarLogo}
              resizeMode="contain"
            />
          </View>
          {!isSidebarPermanent && (
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dark Section */}
      <View style={styles.sidebarDarkSection}>
        {/* Horizontal Line Separator */}
        <View style={styles.separatorLine} />

        {/* Navigation Menu */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.menuScrollView}>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.screen)}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20`, borderRadius: 8, padding: 6 }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Settings at the bottom */}
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
      {/* Permanent Sidebar for Web/Large Screens */}
      {isSidebarPermanent && (
        <View style={styles.permanentSidebar}>
          <SidebarContent />
        </View>
      )}

      {/* Main Content */}
      <View style={[styles.mainContent, isSidebarPermanent && styles.mainContentWithSidebar]}>
        {/* Header - Narrower */}
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

        {/* Header Border */}
        <View style={styles.headerBorder} />

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Dashboard Title - Added here before stats */}
            <View style={styles.mainDashboardTitleContainer}>
              <Text style={styles.mainDashboardTitle}>Dashboard</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  {/* Percentage change removed */}
                </View>
              ))}
            </View>

            {/* Two Column Layout */}
            <View style={styles.twoColumnLayout}>
              {/* Left Column - Occupancy Trends */}
              <View style={styles.leftColumn}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Occupancy Trends (Last 12 Months)</Text>
                  <View style={styles.chartCard}>
                    <View style={styles.chartWrapper}>
                      <View style={styles.yAxis}>
                        <Text style={styles.yLabel}>100</Text>
                        <Text style={styles.yLabel}>90</Text>
                        <Text style={styles.yLabel}>80</Text>
                        <Text style={styles.yLabel}>70</Text>
                        <Text style={styles.yLabel}>60</Text>
                        <Text style={styles.yLabel}>50</Text>
                        <Text style={styles.yLabel}>40</Text>
                        <Text style={styles.yLabel}>30</Text>
                        <Text style={styles.yLabel}>20</Text>
                        <Text style={styles.yLabel}>10</Text>
                      </View>

                      <View style={styles.barsContainer}>
                        {occupancyData.map((value, index) => (
                          <View key={index} style={styles.barWrapper}>
                            <View
                              style={[
                                styles.bar,
                                { height: (value / maxOccupancy) * 160 },
                              ]}
                            />
                            <Text style={styles.barLabel}>{months[index]}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Right Column - Recent Activity */}
              <View style={styles.rightColumn}>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity>
                      <Text style={styles.viewAllText}>View All Activity</Text>
                    </TouchableOpacity>
                  </View>

                  {recentActivities.map((activity) => (
                    <View key={activity.id} style={styles.activityItem}>
                      <View style={[styles.activityIcon, { backgroundColor: `${activity.color}15` }]}>
                        <Ionicons name={activity.icon} size={24} color={activity.color} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activitySubtitle}>{activity.subtitle} • {activity.time}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Overlay for mobile sidebar */}
      {!isSidebarPermanent && (
        <>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayAnim,
                display: sidebarVisible ? "flex" : "none",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.overlayTouchable}
              activeOpacity={1}
              onPress={closeSidebar}
            />
          </Animated.View>

          {/* Sidebar - Slides over content */}
          <Animated.View
            style={[
              styles.sidebar,
              {
                transform: [{ translateX: sidebarAnim }],
              },
            ]}
          >
            <SidebarContent />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    flexDirection: "row",
  },
  permanentSidebar: {
    width: 280,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  mainContentWithSidebar: {
    flex: 1,
  },
  // Header - Narrower
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: isLargeScreen ? 32 : 20,
    paddingTop: isLargeScreen ? 20 : 40,
    paddingBottom: 18,
    backgroundColor: "#1F2937",
  },
  headerBorder: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    marginLeft: isLargeScreen ? 0 : 12,
  },
  welcomeText: {
    fontSize: isLargeScreen ? 18 : 16,
    fontWeight: "600",
    color: "#e8e1e1",
  },
  dateText: {
    fontSize: 12,
    color: "#bfc8d9",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: isLargeScreen ? 32 : 20,
  },
  // Main Dashboard Title
  mainDashboardTitleContainer: {
    marginBottom: 24,
  },
  mainDashboardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flex: isLargeScreen ? 1 : 0,
    width: isLargeScreen ? "auto" : "48%",
    minWidth: isLargeScreen ? 200 : "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  viewAllText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },
  twoColumnLayout: {
    flexDirection: isLargeScreen ? "row" : "column",
    gap: 24,
    marginBottom: 32,
  },
  leftColumn: {
    flex: isLargeScreen ? 1.5 : 1,
  },
  rightColumn: {
    flex: 1,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartWrapper: {
    flexDirection: "row",
    height: 200,
  },
  yAxis: {
    width: 35,
    justifyContent: "space-between",
    paddingRight: 8,
  },
  yLabel: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: isLargeScreen ? 32 : 24,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    marginBottom: 8,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  // Sidebar Styles - Two Sections
  sidebarTopLight: {
    backgroundColor: "#fafafa",
    paddingTop: 1,
  },
  sidebarDarkSection: {
    backgroundColor: "#1F2937",
    flex: 1,
  },
  sidebarLogoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hotelIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sidebarLogo: {
    width: 140,  // Increased from 120
    height: 56,  // Increased from 48
  },
  closeButton: {
    padding: 5,
  },
  separatorLine: {
    height: 1,
    backgroundColor: "#374151",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  menuScrollView: {
    flex: 1,
  },
  menuContainer: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#E5E7EB",
    fontWeight: "500",
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  settingsText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginLeft: 12,
    fontWeight: "500",
  },
  // Overlay
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 998,
  },
  overlayTouchable: {
    flex: 1,
  },
  // Sidebar
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    maxWidth: 320,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default Dashboard;