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
        // Close sidebar
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
        // Open sidebar
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

  const stats = [
    { title: "Check-ins", value: "24", change: "+12%", icon: "log-in-outline", color: "#10B981" },
    { title: "Active Visitors", value: "12", change: "-5%", icon: "people-outline", color: "#F59E0B" },
    { title: "Room Occupancy", value: "85%", change: "+2%", icon: "bed-outline", color: "#2563EB" },
    { title: "Pending Approvals", value: "7", change: "0%", icon: "time-outline", color: "#EF4444" },
  ];

  const recentActivities = [
    { id: 1, title: "Room 204 Checked out", subtitle: "Sarah Jenkins", time: "12 mins ago", icon: "log-out-outline", color: "#10B981" },
    { id: 2, title: "New Booking: John Doe", subtitle: "Deluxe Suite", time: "45 mins ago", icon: "book-outline", color: "#3B82F6" },
    { id: 3, title: "Maintenance Required", subtitle: "Room 412", time: "2 hours ago", icon: "construct-outline", color: "#F59E0B" },
    { id: 4, title: "Payment Received", subtitle: "Room 105 - $350", time: "3 hours ago", icon: "card-outline", color: "#8B5CF6" },
    { id: 5, title: "New Visitor Registration", subtitle: "Michael Chen", time: "5 hours ago", icon: "person-add-outline", color: "#10B981" },
  ];

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const occupancyData = [65, 72, 78, 82, 85, 88, 92, 90, 86, 84, 82, 78];
  const maxOccupancy = Math.max(...occupancyData);

  const menuItems = [
    { name: "Dashboard", icon: "grid-outline", screen: "Dashboard" },
    { name: "Guests", icon: "people-outline", screen: "Guests" },
    { name: "Rooms", icon: "bed-outline", screen: "Rooms" },
    { name: "Visitors", icon: "person-add-outline", screen: "Visitors" },
    { name: "Payments", icon: "card-outline", screen: "Payments" },
    { name: "Settings", icon: "settings-outline", screen: "Settings" },
  ];

  // Sidebar component for reuse
  const SidebarContent = () => (
    <>
      <View style={styles.sidebarHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="business-outline" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.logoName}>PROSERV</Text>
            <Text style={styles.logoSubtitle}>Hotel</Text>
          </View>
        </View>
        {!isSidebarPermanent && (
          <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
            <Ionicons name="close-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.screen)}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={22} color="#9CA3AF" />
              </View>
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.sidebarFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
        {/* Header */}
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

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <View style={[styles.statChange, { backgroundColor: stat.change.includes("+") ? "#10B98115" : "#EF444415" }]}>
                    <Text style={[styles.statChangeText, { color: stat.change.includes("+") ? "#10B981" : "#EF4444" }]}>
                      {stat.change}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Two Column Layout for Large Screens */}
            <View style={styles.twoColumnLayout}>
              {/* Left Column - Occupancy Trends */}
              <View style={styles.leftColumn}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Occupancy Trends</Text>
                  <View style={styles.chartCard}>
                    <View style={styles.chartWrapper}>
                      <View style={styles.yAxis}>
                        <Text style={styles.yLabel}>100%</Text>
                        <Text style={styles.yLabel}>75%</Text>
                        <Text style={styles.yLabel}>50%</Text>
                        <Text style={styles.yLabel}>25%</Text>
                        <Text style={styles.yLabel}>0%</Text>
                      </View>

                      <View style={styles.barsContainer}>
                        {occupancyData.map((value, index) => (
                          <View key={index} style={styles.barWrapper}>
                            <View
                              style={[
                                styles.bar,
                                { height: (value / maxOccupancy) * 140 },
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
                      <Text style={styles.viewAllText}>View All</Text>
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

            {/* Additional Stats Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Overview</Text>
              <View style={styles.overviewCards}>
                <View style={styles.overviewCard}>
                  <Ionicons name="calendar-outline" size={32} color="#2563EB" />
                  <Text style={styles.overviewNumber}>156</Text>
                  <Text style={styles.overviewLabel}>Total Bookings</Text>
                  <Text style={styles.overviewTrend}>↑ 12% this month</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Ionicons name="trending-up-outline" size={32} color="#10B981" />
                  <Text style={styles.overviewNumber}>₱245K</Text>
                  <Text style={styles.overviewLabel}>Revenue</Text>
                  <Text style={styles.overviewTrend}>↑ 18% this month</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Ionicons name="people-outline" size={32} color="#F59E0B" />
                  <Text style={styles.overviewNumber}>892</Text>
                  <Text style={styles.overviewLabel}>Total Guests</Text>
                  <Text style={styles.overviewTrend}>This year</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Ionicons name="star-outline" size={32} color="#8B5CF6" />
                  <Text style={styles.overviewNumber}>98%</Text>
                  <Text style={styles.overviewLabel}>Satisfaction Rate</Text>
                  <Text style={styles.overviewTrend}>Based on 342 reviews</Text>
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
    backgroundColor: "#1F2937",
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
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: isLargeScreen ? 32 : 20,
    paddingTop: isLargeScreen ? 40 : 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    marginLeft: isLargeScreen ? 0 : 12,
  },
  welcomeText: {
    fontSize: isLargeScreen ? 20 : 18,
    fontWeight: "600",
    color: "#1F2937",
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
  // Content
  content: {
    padding: isLargeScreen ? 32 : 20,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
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
  statChange: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statChangeText: {
    fontSize: 11,
    fontWeight: "600",
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
    width: 40,
    justifyContent: "space-between",
    paddingRight: 8,
    paddingBottom: 20,
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
  overviewCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  overviewCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flex: isLargeScreen ? 1 : 0,
    minWidth: isLargeScreen ? 200 : (width - 80) / 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  overviewTrend: {
    fontSize: 12,
    color: "#10B981",
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
    backgroundColor: "#1F2937",
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  logoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  logoSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  closeButton: {
    padding: 5,
  },
  menuContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 32,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    marginTop: "auto",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    marginLeft: 12,
    fontWeight: "500",
  },
});

export default Dashboard;