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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Dashboard = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace("Login") }
      ]
    );
  };

  const stats = [
    { title: "Check-ins", value: "24", change: "+12%", icon: "log-in-outline", color: "#10B981" },
    { title: "Active Visitors", value: "12", change: "-5%", icon: "people-outline", color: "#F59E0B" },
    { title: "Room Occupancy", value: "85%", change: "+2%", icon: "bed-outline", color: "#2563EB" },
    { title: "Pending Approvals", value: "7", change: "0%", icon: "time-outline", color: "#EF4444" },
  ];

  const quickActions = [
    { title: "Guests", icon: "person-outline", color: "#2563EB" },
    { title: "Rooms", icon: "bed-outline", color: "#10B981" },
    { title: "Visitors", icon: "people-outline", color: "#F59E0B" },
    { title: "Payments", icon: "card-outline", color: "#8B5CF6" },
  ];

  const recentActivities = [
    { id: 1, title: "Room 204 Checked out", subtitle: "Sarah Jenkins", time: "12 mins ago", icon: "log-out-outline", color: "#10B981" },
    { id: 2, title: "New Booking: John Doe", subtitle: "Deluxe Suite", time: "45 mins ago", icon: "book-outline", color: "#3B82F6" },
    { id: 3, title: "Maintenance Required", subtitle: "Room 412", time: "2 hours ago", icon: "construct-outline", color: "#F59E0B" },
  ];

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const occupancyData = [65, 72, 78, 82, 85, 88, 92, 90, 86, 84, 82, 78];
  const maxOccupancy = Math.max(...occupancyData);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
              </View>
              <TouchableOpacity style={styles.avatar} onPress={handleLogout}>
                <Ionicons name="person-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions Row */}
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionItem}>
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
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
                <View style={[styles.statChange, { backgroundColor: stat.change.includes('+') ? '#10B98115' : '#EF444415' }]}>
                  <Text style={[styles.statChangeText, { color: stat.change.includes('+') ? '#10B981' : '#EF4444' }]}>
                    {stat.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Occupancy Trends Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Occupancy Trends (Last 12 Months)</Text>
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
                          { height: (value / maxOccupancy) * 140 }
                        ]} 
                      />
                      <Text style={styles.barLabel}>{months[index]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
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
          
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -25,
    marginBottom: 20,
  },
  quickActionItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: (width - 60) / 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: "48%",
    marginBottom: 16,
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
    fontSize: 28,
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  viewAllText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
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
    height: 180,
  },
  yAxis: {
    width: 35,
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
    width: (width - 100) / 12,
  },
  bar: {
    width: 28,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
});

export default Dashboard;