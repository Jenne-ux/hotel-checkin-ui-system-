import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const rooms = [
  {
    id: "1",
    title: "Standard Room",
    price: "₱2,000",
    numericPrice: 2000,
    description: "Smart, simple comfort for everyday stays.",
    image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    features: [
      { icon: "wifi", label: "Free WiFi", type: "Ionicons" },
      { icon: "users", label: "1–2 guests", type: "FontAwesome5" },
    ],
  },
  {
    id: "2",
    title: "Deluxe King Room",
    price: "₱3,500",
    numericPrice: 3500,
    description: "Elevated space with a sleek, relaxing vibe.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    features: [
      { icon: "wifi", label: "Free WiFi", type: "Ionicons" },
      { icon: "city", label: "City View", type: "MaterialCommunityIcons" },
      { icon: "users", label: "2–3 guests", type: "FontAwesome5" },
    ],
  },
  {
    id: "3",
    title: "Executive Suite",
    price: "₱5,000",
    numericPrice: 5000,
    description: "Premium space designed for work and relaxation.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    features: [
      { icon: "star-circle", label: "Premium Desk", type: "MaterialCommunityIcons" },
      { icon: "bathtub", label: "Spa Bath", type: "MaterialCommunityIcons" },
      { icon: "wifi", label: "Free WiFi", type: "Ionicons" },
      { icon: "users", label: "3 guests", type: "FontAwesome5" },
    ],
  },
  {
    id: "4",
    title: "Penthouse",
    price: "₱10,000",
    numericPrice: 10000,
    description: "Top-floor luxury with panoramic views.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
    features: [
      { icon: "star-circle", label: "Premium Desk", type: "MaterialCommunityIcons" },
      { icon: "bathtub", label: "Spa Bath", type: "MaterialCommunityIcons" },
      { icon: "wifi", label: "Free WiFi", type: "Ionicons" },
      { icon: "food-variant", label: "Breakfast", type: "MaterialCommunityIcons" },
      { icon: "city", label: "City View", type: "MaterialCommunityIcons" },
      { icon: "coffee", label: "Espresso Mach.", type: "MaterialCommunityIcons" },
      { icon: "users", label: "4–8 guests", type: "FontAwesome5" },
    ],
  },
  {
    id: "5",
    title: "Twin Room",
    price: "₱3,000",
    numericPrice: 3000,
    description: "Modern comfort with two stylish beds.",
    image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061",
    features: [
      { icon: "wifi", label: "Free WiFi", type: "Ionicons" },
      { icon: "city", label: "City View", type: "MaterialCommunityIcons" },
      { icon: "users", label: "2 guests", type: "FontAwesome5" },
    ],
  },
];

const renderIcon = (feature) => {
  if (feature.type === "Ionicons")
    return <Ionicons name={feature.icon} size={16} color="#555" />;
  if (feature.type === "MaterialCommunityIcons")
    return <MaterialCommunityIcons name={feature.icon} size={16} color="#555" />;
  if (feature.type === "FontAwesome5")
    return <FontAwesome5 name={feature.icon} size={14} color="#555" />;
};

const RoomCard = ({ item }) => {
  const navigation = useNavigation();
  const scale = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>
            {item.price}
            <Text style={styles.night}> / Night</Text>
          </Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.featuresRow}>
          {item.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              {renderIcon(feature)}
              <Text style={styles.featureText}>{feature.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Details", { room: item })}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Select Room →</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function Rooms() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A78C5" />

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

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoomCard item={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Text style={styles.headerSubtitle}>Choose Your Perfect Stay</Text>
              <Text style={styles.headerTitle}>Room Types Available</Text>
              <View style={styles.headerLine} />
              <Text style={styles.headerDescription}>
                {rooms.length} luxurious room types waiting for you
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },
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
  
  // Improved header for Room Types
  headerContainer: {
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: width * 0.05,
  },
  headerContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  headerLine: {
    width: 60,
    height: 3,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    marginBottom: 12,
  },
  headerDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 25,
    marginHorizontal: width * 0.05,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: width * 0.55,
  },
  content: {
    padding: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  night: {
    fontSize: 13,
    fontWeight: "normal",
    color: "#64748B",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 4,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
    marginBottom: 6,
  },
  featureText: {
    marginLeft: 5,
    fontSize: 13,
    color: "#475569",
  },
  button: {
    marginTop: 14,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});