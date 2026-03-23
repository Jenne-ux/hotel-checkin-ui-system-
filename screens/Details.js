import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function RoomDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { room } = route.params;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(null); // No default check-in
  const [checkOut, setCheckOut] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const price = parseInt(room.price.replace(/[₱,]/g, ""));

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      day: date.getDate(),
      weekday: date.toLocaleString("en-US", { weekday: "long" }),
    };
  };

  const renderIcon = (feature) => {
    if (feature.type === "Ionicons")
      return <Ionicons name={feature.icon} size={18} color="#000" />;
    if (feature.type === "MaterialCommunityIcons")
      return <MaterialCommunityIcons name={feature.icon} size={18} color="#000" />;
    if (feature.type === "FontAwesome5")
      return <FontAwesome5 name={feature.icon} size={16} color="#000" />;
  };

  const generateRange = (startStr, endStr) => {
    const range = {};
    let start = new Date(startStr);
    const end = new Date(endStr);

    while (start <= end) {
      const date = start.toISOString().split("T")[0];
      if (date === startStr) {
        range[date] = { 
          startingDay: true, 
          color: "#2563EB", 
          textColor: "white" 
        };
      } else if (date === endStr) {
        range[date] = { 
          endingDay: true, 
          color: "#2563EB", 
          textColor: "white" 
        };
      } else {
        range[date] = { 
          color: "#BFDBFE", 
          textColor: "#1E3A5F" 
        };
      }
      start.setDate(start.getDate() + 1);
    }
    return range;
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;

    // Case 1: No check-in selected
    if (!checkIn) {
      // First click - set as check-in only
      setCheckIn(selectedDate);
      setCheckOut(null);
      setMarkedDates({
        [selectedDate]: { 
          startingDay: true, 
          endingDay: true, 
          color: "#2563EB", 
          textColor: "white" 
        }
      });
      return;
    }

    // Case 2: Check-in selected, no check-out
    if (checkIn && !checkOut) {
      if (selectedDate < checkIn) {
        // Selected date is before check-in - set as new check-in
        setCheckIn(selectedDate);
        setMarkedDates({
          [selectedDate]: { 
            startingDay: true, 
            endingDay: true, 
            color: "#2563EB", 
            textColor: "white" 
          }
        });
      } else if (selectedDate > checkIn) {
        // Selected date is after check-in - set as check-out and create range
        setCheckOut(selectedDate);
        setMarkedDates(generateRange(checkIn, selectedDate));
      }
      return;
    }

    // Case 3: Both check-in and check-out selected
    if (checkIn && checkOut) {
      // Reset: set new check-in, clear check-out
      setCheckIn(selectedDate);
      setCheckOut(null);
      setMarkedDates({
        [selectedDate]: { 
          startingDay: true, 
          endingDay: true, 
          color: "#2563EB", 
          textColor: "white" 
        }
      });
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return null;
    const [sy, sm, sd] = checkIn.split("-").map(Number);
    const [ey, em, ed] = checkOut.split("-").map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);
    const nights = (end - start) / (1000 * 60 * 60 * 24);
    return { nights, total: nights * price };
  };

  const totals = calculateTotal();
  const checkInDisplay = formatDisplayDate(checkIn);
  const checkOutDisplay = formatDisplayDate(checkOut);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A78C5" />

      {/* HEADER LIKE ROOMS */}
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ROOM IMAGE AND INFO */}
        <View style={styles.roomCard}>
          <Image source={{ uri: room.image }} style={styles.roomImage} />
          <View style={styles.roomInfo}>
            <Text style={styles.roomTitle}>{room.title}</Text>
            <Text style={styles.roomDesc}>{room.description}</Text>
            <View style={styles.featureList}>
              {room.features.slice(0, 7).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  {renderIcon(feature)}
                  <Text style={styles.featureText}>{feature.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.perNight}>PER NIGHT</Text>
              <Text style={styles.priceAmount}>{room.price}</Text>
            </View>
          </View>
        </View>

        {/* CALENDAR */}
        <View style={styles.calendarBox}>
          <Calendar
            markingType={"period"}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            minDate={todayStr}
            enableSwipeMonths={true}
            theme={{
              calendarBackground: "#fff",
              todayTextColor: "#2563EB",
              arrowColor: "#2563EB",
              monthTextColor: "#111",
              textMonthFontSize: 20,
              textMonthFontWeight: "bold",
              textDayHeaderFontSize: 12,
              textDayHeaderFontWeight: "600",
              dayTextColor: "#111",
              textDayFontSize: 16,
              textDayFontWeight: "500",
              disabledArrowColor: "#ccc",
              textDisabledColor: "#CBD5E1",
            }}
          />
        </View>

        {/* CHECK-IN / CHECK-OUT */}
        <View style={styles.dateRow}>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabelTop}>CHECK-IN</Text>
            {checkInDisplay ? (
              <>
                <Text style={styles.dateMain}>{checkInDisplay.month} {checkInDisplay.day}</Text>
                <Text style={styles.dateWeekday}>{checkInDisplay.weekday}</Text>
              </>
            ) : (
              <Text style={styles.datePlaceholder}>Select check-in date</Text>
            )}
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateLabelTop}>CHECK-OUT</Text>
            {checkOutDisplay ? (
              <>
                <Text style={styles.dateMain}>{checkOutDisplay.month} {checkOutDisplay.day}</Text>
                <Text style={styles.dateWeekday}>{checkOutDisplay.weekday}</Text>
              </>
            ) : (
              <Text style={styles.datePlaceholder}>Select check-out date</Text>
            )}
          </View>
        </View>

        {/* TOTAL SUMMARY */}
        {totals && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              {totals.nights} night{totals.nights > 1 ? "s" : ""} × {room.price}
            </Text>
            <Text style={styles.summaryTotal}>₱{totals.total.toLocaleString()}</Text>
          </View>
        )}

        {/* BUTTONS */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Back to Room Types</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmBtn, !totals && styles.confirmBtnDisabled]}
            disabled={!totals}
            onPress={() =>
              navigation.navigate("Floors", {
                roomType: room.title,
                roomPrice: price,
                checkIn: checkIn,
                checkOut: checkOut,
                nights: totals?.nights,
                totalPrice: totals?.total
              })
            }
          >
            <Text style={styles.confirmText}>Confirm Stay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 40 },
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
  roomCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  roomImage: {
    width: width * 0.45,
    minHeight: 200,
  },
  roomInfo: {
    flex: 1,
    padding: 14,
  },
 roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  roomDesc: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 10,
  },
  featureList: {
    gap: 6,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
  },
  perNight: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563EB",
  },
  calendarBox: {
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  dateCard: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 16,
    minHeight: 90,
    justifyContent: "center",
  },
  dateLabelTop: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateMain: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
  },
  dateWeekday: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  datePlaceholder: {
    fontSize: 15,
    color: "#CBD5E1",
    fontStyle: "italic",
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 14,
    color: "#475569",
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 8,
  },
  backBtn: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 30,
    width: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  backBtnText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  confirmBtn: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 30,
    width: "45%",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmBtnDisabled: { 
    backgroundColor: "#2563EB",
    opacity: 0.7,
  },
  confirmText: { 
    color: "#fff", 
    fontWeight: "600",
    fontSize: 14,
  },
});