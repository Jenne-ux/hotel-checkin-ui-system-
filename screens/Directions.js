import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function Directions({ navigation, route }) {
  const { roomNumber = "206", floor = "4th Floor" } = route.params || {};
  
  // Get the floor number from the floor string
  const getFloorNumber = (floorString) => {
    const match = floorString.match(/\d+/);
    return match ? parseInt(match[0]) : 4;
  };

  const floorNum = getFloorNumber(floor);
  
  // Generate room numbers based on floor (10 rooms per floor)
  const generateRoomsForFloor = () => {
    const rooms = [];
    const baseNumber = floorNum * 100;
    for (let i = 1; i <= 10; i++) {
      rooms.push((baseNumber + i).toString());
    }
    return rooms;
  };

  const floorRooms = generateRoomsForFloor();

  // Split rooms into left and right columns (4 left, 6 right)
  const leftColumnRooms = floorRooms.slice(0, 4); // First 4 rooms (201,202,203,204)
  const rightColumnRooms = floorRooms.slice(4, 10); // Last 6 rooms (205,206,207,208,209,210)

  // Debug logging
  console.log('Selected room:', roomNumber);
  console.log('Left column rooms:', leftColumnRooms);
  console.log('Right column rooms:', rightColumnRooms);

  // Determine which side the room is on
  const getRoomSide = () => {
    if (leftColumnRooms.includes(roomNumber)) {
      return "left";
    } else if (rightColumnRooms.includes(roomNumber)) {
      return "right";
    }
    return "left";
  };

  const roomSide = getRoomSide();

  // Get room position index
  const getRoomPosition = () => {
    if (roomSide === "left") {
      return leftColumnRooms.indexOf(roomNumber) + 1; // 1-4 for left side
    } else {
      return rightColumnRooms.indexOf(roomNumber) + 1; // 1-6 for right side
    }
  };

  const roomPosition = getRoomPosition();

  // Get the last two digits of the room number
  const getLastTwoDigits = () => {
    const roomNumInt = parseInt(roomNumber);
    return roomNumInt % 100;
  };

  const lastTwoDigits = getLastTwoDigits();

  // Determine if this is the 9th or 10th room (rooms 209, 210, 309, 310, etc.)
  const isNinthRoom = () => {
    return lastTwoDigits === 9;
  };

  const isTenthRoom = () => {
    return lastTwoDigits === 10 || lastTwoDigits === 0;
  };

  const isSpecialRoom = () => {
    return isNinthRoom() || isTenthRoom();
  };

  // Determine turn direction based on room position
  const getTurnDirection = () => {
    // Rooms 9 and 10 are in front of elevator - go straight
    if (isTenthRoom() || isNinthRoom()) {
      return "straight";
    }
    // All other rooms turn left
    return "left";
  };

  // Get turn icon based on direction
  const getTurnIcon = () => {
    if (isTenthRoom() || isNinthRoom()) {
      return "arrow-up";
    }
    return "arrow-back";
  };

  // Get turn text based on direction
  const getTurnText = () => {
    if (isTenthRoom() || isNinthRoom()) {
      return "Go straight";
    }
    return "Turn left";
  };

  // Get position text based on room location
  const getPositionText = () => {
    if (isTenthRoom()) return "tenth";
    if (isNinthRoom()) return "ninth";
    
    if (roomPosition === 1) return "first";
    if (roomPosition === 2) return "second";
    if (roomPosition === 3) return "third";
    if (roomPosition === 4) return "fourth";
    if (roomPosition === 5) return "fifth";
    if (roomPosition === 6) return "sixth";
    if (roomPosition === 7) return "seventh";
    if (roomPosition === 8) return "eighth";
    return "ninth";
  };

  // Get location text based on room position
  const getLocationText = () => {
    if (isTenthRoom() || isNinthRoom()) {
      return "straight ahead";
    }
    return "on the left";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* DESTINATION */}
        <View style={styles.destinationContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="business-outline" size={26} color="#2563EB" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.destinationLabel}>DESTINATION</Text>
              <Text style={styles.destinationText}>
                Room {roomNumber} ● {floor}
              </Text>
            </View>
          </View>
        </View>

        {/* MAP CARD */}
        <View style={styles.mapCard}>
          <View style={styles.mapArea}>
            {/* LEFT ROOMS - Rooms 1-4 */}
            <View style={styles.leftColumn}>
              {leftColumnRooms.map((room, index) => {
                const isActive = room === roomNumber;
                return (
                  <View 
                    key={room} 
                    style={[
                      styles.roomBox,
                      isActive && styles.activeRoom
                    ]}
                  >
                    <View style={styles.roomDoor} />
                    <Text 
                      style={[
                        styles.roomText,
                        isActive && styles.activeRoomText
                      ]}
                    >
                      {room}
                    </Text>
                    {isActive && (
                      <View style={styles.redLocationIcon}>
                        <Ionicons name="location" size={16} color="#FF4444" />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* RIGHT ROOMS - Rooms 5-10 */}
            <View style={styles.rightColumn}>
              {rightColumnRooms.map((room, index) => {
                const isActive = room === roomNumber;
                return (
                  <View
                    key={room}
                    style={[
                      styles.roomBox,
                      isActive && styles.activeRoom,
                    ]}
                  >
                    <View style={styles.roomDoor} />
                    <Text
                      style={[
                        styles.roomText,
                        isActive && styles.activeRoomText,
                      ]}
                    >
                      {room}
                    </Text>
                    {isActive && (
                      <View style={styles.redLocationIcon}>
                        <Ionicons name="location" size={16} color="#FF4444" />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* IMPROVED HALLWAY DESIGN */}
            <View style={styles.hallwayContainer}>
              {/* Main hallway strip */}
              <View style={styles.hallway} />
              
              {/* Hallway center line */}
              <View style={styles.hallwayCenterLine} />
              
              {/* Hallway markers */}
              <View style={[styles.hallwayMarker, { top: 50 }]} />
              <View style={[styles.hallwayMarker, { top: 150 }]} />
              <View style={[styles.hallwayMarker, { top: 250 }]} />
              <View style={[styles.hallwayMarker, { top: 350 }]} />
            </View>

            {/* ELEVATORS - Updated with circles */}
            <View style={styles.elevatorTop}>
              <View style={styles.elevatorCircle}>
                <MaterialCommunityIcons
                  name="elevator"
                  size={24}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.elevatorText}>ELEVATORS</Text>
            </View>

            <View style={styles.elevatorBottom}>
              <View style={styles.elevatorCircle}>
                <MaterialCommunityIcons
                  name="elevator"
                  size={24}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.elevatorText}>ELEVATORS</Text>
            </View>

            {/* YOU ARE HERE */}
            <View style={styles.youHere}>
              <View style={styles.youHereCircle}>
                <Ionicons name="location" size={22} color="#fff" />
              </View>
              <Text style={styles.youHereLabel}>YOU ARE HERE</Text>
            </View>
          </View>

          {/* DYNAMIC STEPS */}
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsTitle}>DIRECTIONS</Text>
            
            <View style={styles.stepCard}>
              <View style={styles.stepIconContainer}>
                <Ionicons name="walk" size={22} color="#2563EB" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Step 1</Text>
                <Text style={styles.stepDescription}>Walk straight from the lobby towards the elevator bank</Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepIconContainer}>
                <Ionicons name="arrow-up" size={22} color="#2563EB" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Step 2</Text>
                <Text style={styles.stepDescription}>Take the elevator to {floor}</Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepIconContainer}>
                <Ionicons name={getTurnIcon()} size={22} color="#2563EB" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Step 3</Text>
                <Text style={styles.stepDescription}>
                  {getTurnText()} when you exit the elevator
                </Text>
              </View>
            </View>

            <View style={[styles.stepCard, styles.stepCardActive]}>
              <View style={[styles.stepIconContainer, styles.stepIconActive]}>
                <Ionicons name="flag" size={22} color="#fff" />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitleActive}>Step 4 - Your Destination</Text>
                <Text style={styles.stepDescriptionActive}>
                  Room {roomNumber} is {getLocationText()}, 
                  the {getPositionText()} room
                </Text>
              </View>
            </View>
          </View>

          {/* TIP */}
          <View style={styles.tipContainer}>
            <Ionicons name="information-circle" size={18} color="#2563EB" />
            <Text style={styles.tipText}>
              Your room is <Text style={styles.tipHighlight}>highlighted in blue</Text> with a <Text style={[styles.tipHighlight, {color: '#FF4444'}]}>red marker</Text>
            </Text>
          </View>
        </View>

        {/* FINISH */}
        <TouchableOpacity
          style={styles.finishButton}
          onPress={() => navigation.navigate("NewCheckin")}
        >
          <Text style={styles.finishText}>Finish</Text>
          <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },

  header: {
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
  },

  poweredText: { fontSize: 12, color: "#555" },

  logo: { width: 120, height: 30 },

  destinationContainer: { padding: 20 },

  destinationLabel: { fontSize: 12, color: "#6B7280", letterSpacing: 1 },

  destinationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
  },

  mapCard: {
    margin: 13,
    padding: 13,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  mapArea: {
    height: 400,
    position: "relative",
    marginTop: 1,
  },

  leftColumn: {
    position: "absolute",
    left: 70,
    top: 5,
  },

  rightColumn: {
    position: "absolute",
    right: 40,
    top: 5,
  },

  hallwayContainer: {
    position: "absolute",
    left: "46%",
    width: 55,
    height: "98%",
    top: 10,
    alignItems: "center",
  },

  hallway: {
    position: "absolute",
    width: 30,
    height: "100%",
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },

  hallwayCenterLine: {
    position: "absolute",
    width: 4,
    height: "100%",
    backgroundColor: "#9CA3AF",
    opacity: 0.5,
  },

  hallwayMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    opacity: 0.3,
    left: -10,
  },

  roomBox: {
    width: 75,
    height: 55,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  roomDoor: {
    position: "absolute",
    width: 18,
    height: 4,
    backgroundColor: "#9CA3AF",
    borderRadius: 2,
    top: 12,
    alignSelf: "center",
  },

  activeRoom: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  activeRoomText: {
    color: "#fff",
    fontWeight: "bold",
  },

  roomText: { 
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
    marginTop: 12,
  },

  redLocationIcon: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },

  elevatorTop: {
    position: "absolute",
    left: 30,
    top: 260,
    alignItems: "center",
  },

  elevatorBottom: {
    position: "absolute",
    left: 30,
    bottom: 20,
    alignItems: "center",
  },

  elevatorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2563EB",
    shadowColor: "#9CA3AF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  elevatorText: { 
    fontSize: 9, 
    color: "#555", 
    marginTop: 4,
    fontWeight: "600",
  },

  youHere: {
    position: "absolute",
    left: 78,
    bottom: 55,
    alignItems: "center",
  },

  youHereCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  youHereLabel: {
    fontSize: 9,
    marginTop: 3,
    fontWeight: "600",
    color: "#2563EB",
  },

  stepsContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },

  stepsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 15,
    letterSpacing: 1,
  },

  stepCard: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  stepCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
    borderWidth: 2,
  },

  stepIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  stepIconActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },

  stepTitleActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 4,
  },

  stepDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2c3e50",
    lineHeight: 20,
  },

  stepDescriptionActive: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
    lineHeight: 20,
  },

  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  tipText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 8,
    flex: 1,
  },

  tipHighlight: {
    color: "#2563EB",
    fontWeight: "600",
  },

  finishButton: {
    backgroundColor: "#2563EB",
    margin: 20,
    padding: 16,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  finishText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});