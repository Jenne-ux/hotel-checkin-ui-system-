// screens/Dashboard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainLayout from "./MainLayout";

const { width } = Dimensions.get("window");
const isLargeScreen = width >= 1024;

const Dashboard = ({ navigation }) => {
  const stats = [
    { title: "Check-ins", value: "24", icon: "log-in-outline", color: "#10B981" },
    { title: "Active Visitors", value: "12", icon: "people-outline", color: "#F59E0B" },
    { title: "Room Occupancy", value: "85%", icon: "bed-outline", color: "#2563EB" },
    { title: "Pending Approvals", value: "7", icon: "time-outline", color: "#EF4444" },
  ];

  const recentActivities = [
    { id: 1, title: "Room 204 Checked out", subtitle: "Jose Santino", time: "12 mins ago", icon: "log-out-outline", color: "#10B981" },
    { id: 2, title: "New Check-in: Juan Tamad", subtitle: "Deluxe Suite", time: "45 mins ago", icon: "book-outline", color: "#3B82F6" },
    { id: 3, title: "Maintenance Required", subtitle: "Room 412", time: "2 hours ago", icon: "construct-outline", color: "#F59E0B" },
  ];

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const occupancyData = [65, 72, 78, 82, 85, 88, 92, 90, 86, 84, 82, 78];
  const maxOccupancy = Math.max(...occupancyData);

  return (
    <MainLayout currentScreen="Dashboard" navigation={navigation}>
      <View style={styles.content}>
        <Text style={styles.mainDashboardTitle}>Dashboard</Text>

        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.twoColumnLayout}>
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>Occupancy Trends (Last 12 Months)</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartWrapper}>
                <View style={styles.yAxis}>
                  {[100,90,80,70,60,50,40,30,20,10].map(v => <Text key={v} style={styles.yLabel}>{v}</Text>)}
                </View>
                <View style={styles.barsContainer}>
                  {occupancyData.map((value, i) => (
                    <View key={i} style={styles.barWrapper}>
                      <View style={[styles.bar, { height: (value / maxOccupancy) * 160 }]} />
                      <Text style={styles.barLabel}>{months[i]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View All Activity</Text></TouchableOpacity>
            </View>
            {recentActivities.map(activity => (
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
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: { padding: isLargeScreen ? 32 : 20 },
  mainDashboardTitle: { fontSize: 28, fontWeight: "bold", color: "#1F2937", marginBottom: 24 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 32 },
  statCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, flex: isLargeScreen ? 1 : 0, width: isLargeScreen ? "auto" : "48%", minWidth: isLargeScreen ? 200 : "auto", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  statIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  statValue: { fontSize: 32, fontWeight: "bold", color: "#1F2937", marginBottom: 4 },
  statTitle: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#1F2937", marginBottom: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  viewAllText: { fontSize: 14, color: "#2563EB", fontWeight: "500" },
  twoColumnLayout: { flexDirection: isLargeScreen ? "row" : "column", gap: 24, marginBottom: 32 },
  leftColumn: { flex: isLargeScreen ? 1.5 : 1 },
  rightColumn: { flex: 1 },
  chartCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  chartWrapper: { flexDirection: "row", height: 200 },
  yAxis: { width: 35, justifyContent: "space-between", paddingRight: 8 },
  yLabel: { fontSize: 10, color: "#9CA3AF" },
  barsContainer: { flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  barWrapper: { alignItems: "center", flex: 1 },
  bar: { width: isLargeScreen ? 32 : 24, backgroundColor: "#2563EB", borderRadius: 8, marginBottom: 8, minHeight: 4 },
  barLabel: { fontSize: 10, color: "#6B7280", marginTop: 4 },
  activityItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  activityIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 16 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: "600", color: "#1F2937", marginBottom: 4 },
  activitySubtitle: { fontSize: 13, color: "#6B7280" },
});

export default Dashboard;