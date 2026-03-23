import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const floorList = ["Floor 2", "Floor 3", "Floor 4", "Floor 5", "Floor 6", "Floor 7"];

const roomsData = [
  { id: "201", name: "CITY SKYLINE VIEW", floor: "Floor 2", status: "available" },
  { id: "202", name: "", floor: "Floor 2", status: "occupied" },
  { id: "203", name: "COURTYARD VIEW", floor: "Floor 2", status: "available" },
  { id: "204", name: "GARDEN VIEW", floor: "Floor 2", status: "available" },
  { id: "205", name: "", floor: "Floor 2", status: "occupied" },
  { id: "206", name: "", floor: "Floor 2", status: "occupied" },
  { id: "207", name: "GARDEN VIEW", floor: "Floor 2", status: "available" },
  { id: "208", name: "GARDEN VIEW", floor: "Floor 2", status: "available" },
  { id: "209", name: "GARDEN VIEW", floor: "Floor 2", status: "occupied" },
  { id: "210", name: "GARDEN VIEW", floor: "Floor 2", status: "available" },
  { id: "301", name: "POOL VIEW", floor: "Floor 3", status: "occupied" },
  { id: "302", name: "GARDEN VIEW", floor: "Floor 3", status: "available" },
  { id: "303", name: "CITY VIEW", floor: "Floor 3", status: "available" },
  { id: "304", name: "MOUNTAIN VIEW", floor: "Floor 3", status: "occupied" },
  { id: "305", name: "", floor: "Floor 3", status: "occupied" },
  { id: "306", name: "GARDEN VIEW", floor: "Floor 3", status: "available" },
  { id: "307", name: "OCEAN VIEW", floor: "Floor 3", status: "available" },
  { id: "308", name: "", floor: "Floor 3", status: "occupied" },
  { id: "309", name: "COUNTYARD VIEW", floor: "Floor 3", status: "available" },
  { id: "310", name: "GARDEN VIEW", floor: "Floor 3", status: "available" },
  { id: "401", name: "SKYLINE VIEW", floor: "Floor 4", status: "available" },
  { id: "402", name: "CITY VIEW", floor: "Floor 4", status: "available" },
  { id: "403", name: "COURTYARD VIEW", floor: "Floor 4", status: "available" },
  { id: "404", name: "", floor: "Floor 4", status: "occupied" },
  { id: "405", name: "GARDEN VIEW", floor: "Floor 4", status: "available" },
  { id: "406", name: "NEAR MAIN LOBBY", floor: "Floor 4", status: "available" },
  { id: "407", name: "", floor: "Floor 4", status: "occupied" },
  { id: "408", name: "", floor: "Floor 4", status: "occupied" },
  { id: "409", name: "GARDEN VIEW", floor: "Floor 4", status: "available" },
  { id: "410", name: "GARDEN VIEW", floor: "Floor 4", status: "available" },
  { id: "501", name: "CITY SKYLINE VIEW", floor: "Floor 5", status: "available" },
  { id: "502", name: "CITY SKYLINE VIEW", floor: "Floor 5", status: "occupied" },
  { id: "503", name: "", floor: "Floor 5", status: "occupied" },
  { id: "504", name: "GARDEN VIEW", floor: "Floor 5", status: "available" },
  { id: "505", name: "GARDEN VIEW", floor: "Floor 5", status: "available" },
  { id: "506", name: "NEAR MAIN LOBBY", floor: "Floor 5", status: "available" },
  { id: "507", name: "", floor: "Floor 5", status: "occupied" },
  { id: "508", name: "", floor: "Floor 5", status: "occupied" },
  { id: "509", name: "NEAR MAIN LOBBY", floor: "Floor 5", status: "availabLe" },
  { id: "510", name: "NEAR MAIN LOBBY", floor: "Floor 5", status: "available" },
  { id: "601", name: "CITY SKYLINE VIEW", floor: "Floor 6", status: "available" },
  { id: "602", name: "GARDEN VIEW", floor: "Floor 6", status: "available" },
  { id: "603", name: "COURTYARD VIEW", floor: "Floor 6", status: "available" },
  { id: "604", name: "GARDEN VIEW", floor: "Floor 6", status: "available" },
  { id: "605", name: "", floor: "Floor 6", status: "occupied" },
  { id: "606", name: "", floor: "Floor 6", status: "occupied" },
  { id: "607", name: "GARDEN VIEW", floor: "Floor 6", status: "available" },
  { id: "608", name: "COURTYARD VIEW", floor: "Floor 6", status: "available" },
  { id: "609", name: "", floor: "Floor 6", status: "occupied" },
  { id: "610", name: "COURTYARD VIEW", floor: "Floor 6", status: "available" },
  { id: "701", name: "COURTYARD VIEW", floor: "Floor 7", status: "occupied" },
  { id: "702", name: "GARDEN VIEW", floor: "Floor 7", status: "available" },
  { id: "703", name: "CITY SKYLINE VIEW", floor: "Floor 7", status: "occupied" },
  { id: "704", name: "GARDEN VIEW", floor: "Floor 7", status: "available" },
  { id: "705", name: "", floor: "Floor 7", status: "occupied" },
  { id: "706", name: "", floor: "Floor 7", status: "occupied" },
  { id: "707", name: "GARDEN VIEW", floor: "Floor 7", status: "available" },
  { id: "708", name: "COURTYARD VIEW", floor: "Floor 7", status: "available" },
  { id: "709", name: "COURTYARD VIEW", floor: "Floor 7", status: "available" },
  { id: "710", name: "COURTYARD VIEW", floor: "Floor 7", status: "available" },
];

export default function Floors({ navigation, route }) {
  const routeParams = route.params || {};
  const { roomType, roomPrice, checkIn, checkOut, nights, totalPrice } = routeParams;

  const [selectedFloor, setSelectedFloor] = useState("Floor 2");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const selectRoom = (room) => {
    if (room.status === "occupied") return;
    setSelectedRoom(room.id);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const filteredRooms = roomsData.filter((room) => room.floor === selectedFloor);

  const renderRoom = ({ item }) => {
    const isSelected = selectedRoom === item.id;
    const isOccupied = item.status === "occupied";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => selectRoom(item)}
        disabled={isOccupied}
        style={styles.roomTouchable}
      >
        <Animated.View
          style={[
            styles.roomCard,
            isSelected && styles.selectedRoom,
            isOccupied && styles.occupiedRoom,
            isSelected && { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.roomHeader}>
            <Text style={styles.roomNumber}>{item.id}</Text>
            {isOccupied ? (
              <Ionicons name="lock-closed-outline" size={20} color="#c5c5c5" />
            ) : (
              <MaterialCommunityIcons name="door" size={22} color="#2563EB" />
            )}
          </View>
          {isOccupied ? (
            <Text style={styles.occupiedText}>Occupied</Text>
          ) : (
            <Text style={styles.roomName}>{item.name || "Standard Room"}</Text>
          )}
          {isSelected && (
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER WITH LOGO */}
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

      {/* FLOOR TABS */}
      <View style={styles.floorTabs}>
        {floorList.map((floor) => (
          <TouchableOpacity
            key={floor}
            style={[styles.floorButton, selectedFloor === floor && styles.activeFloor]}
            onPress={() => {
              setSelectedFloor(floor);
              setSelectedRoom(null);
            }}
          >
            <Text style={[styles.floorText, selectedFloor === floor && { color: "white" }]}>
              {floor}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ROOM GRID */}
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoom}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTTOM BUTTONS - Updated to match Info screen */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, !selectedRoom && styles.confirmBtnDisabled]}
          disabled={!selectedRoom}
          onPress={() =>
            navigation.navigate("Info", {
              roomType,
              roomPrice,
              checkIn,
              checkOut,
              nights,
              totalPrice,
              roomNumber: selectedRoom,
              floor: selectedFloor,
            })
          }
        >
          <Text style={styles.confirmText}>Confirm & Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },

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

  floorTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },

  floorButton: {
    backgroundColor: "#e6e9ef",
    padding: 10,
    borderRadius: 18,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },

  activeFloor: { backgroundColor: "#2563EB" },

  floorText: { fontWeight: "600", color: "#555" },

  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  roomTouchable: { width: "48%" },

  roomCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },

  selectedRoom: { 
    borderColor: "#2563EB", 
    backgroundColor: "#EFF6FF" 
  },

  occupiedRoom: { backgroundColor: "#f1f1f1" },

  roomHeader: { flexDirection: "row", justifyContent: "space-between" },

  roomNumber: { fontSize: 24, fontWeight: "bold" },

  roomName: { fontSize: 12, marginTop: 6, color: "#68758a" },

  occupiedText: { color: "red", marginTop: 6 },

  checkBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#2563EB",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 38,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#fff",
  },

  backBtn: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 30,
    width: "40%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  backBtnText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 16,
  },

  confirmBtn: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 30,
    width: "55%",
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
    fontSize: 16,
  },
});