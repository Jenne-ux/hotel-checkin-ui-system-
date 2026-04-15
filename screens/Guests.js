// screens/Guests.js
// Now includes EMAIL column + search also covers CHECK-IN and CHECK-OUT dates.
// Fixed layout, no horizontal scroll.
// Filter ranges: All rooms, 201-210, 301-310, 401-410, 501-510, 601-610, 701-710.
// Edit/Delete icons centered in Actions column.
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainLayout from "./MainLayout";

// ---------- EXACT 5 GUESTS (with email) ----------
const initialGuests = [
  { id: 1, name: "Carmel Anne Galos", room: "302", checkin: "Oct 24, 2026", checkout: "Oct 25, 2026", email: "carmelannegalos@gmail.com" },
  { id: 2, name: "Lea Ann Aungon", room: "303", checkin: "Oct 27, 2026", checkout: "Nov 02, 2026", email: "leaaungon@gmail.com" },
  { id: 3, name: "Jessica Ferrancullo", room: "304", checkin: "Nov 03, 2026", checkout: "Nov 10, 2026", email: "jessicaferrancullo@gmail.com" },
  { id: 4, name: "Jean Denise Dalisay", room: "307", checkin: "Oct 22, 2026", checkout: "Oct 25, 2026", email: "jeandalisay@gmail.com" },
  { id: 5, name: "Charlothe Menciano", room: "406", checkin: "Oct 30, 2026", checkout: "Nov 05, 2026", email: "charlothe@gmail.com" },
];

const isRoomInRange = (room, range) => {
  const roomNum = parseInt(room, 10);
  if (isNaN(roomNum)) return false;
  if (range === "all") return true;
  const [start, end] = range.split("-").map(Number);
  return roomNum >= start && roomNum <= end;
};

const Guests = ({ navigation }) => {
  const [guests, setGuests] = useState(initialGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRange, setFilterRange] = useState("all");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const itemsPerPage = 5;

  const filterOptions = [
    { label: "All rooms", value: "all" },
    { label: "Rooms 201–210", value: "201-210" },
    { label: "Rooms 301–310", value: "301-310" },
    { label: "Rooms 401–410", value: "401-410" },
    { label: "Rooms 501–510", value: "501-510" },
    { label: "Rooms 601–610", value: "601-610" },
    { label: "Rooms 701–710", value: "701-710" },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", room: "", checkin: "", checkout: "", email: "" });

  const applyRoomFilter = (list) => {
    if (filterRange === "all") return list;
    return list.filter((g) => isRoomInRange(g.room, filterRange));
  };

  // ✅ Updated search: now includes checkin and checkout dates
  const filteredGuests = applyRoomFilter(
    guests.filter((guest) => {
      const q = searchQuery.toLowerCase();
      return (
        guest.name.toLowerCase().includes(q) ||
        guest.room.includes(q) ||
        guest.email.toLowerCase().includes(q) ||
        guest.checkin.toLowerCase().includes(q) ||
        guest.checkout.toLowerCase().includes(q)
      );
    })
  );

  const totalGuests = filteredGuests.length;
  const totalPages = Math.ceil(totalGuests / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGuests = filteredGuests.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };
  const handleFilterChange = (range) => {
    setFilterRange(range);
    setCurrentPage(1);
    setFilterModalVisible(false);
  };

  const handleDelete = (id, name) => {
    Alert.alert("Delete Guest", `Delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => setGuests(guests.filter((g) => g.id !== id)) },
    ]);
  };

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setEditForm({
      name: guest.name,
      room: guest.room,
      checkin: guest.checkin,
      checkout: guest.checkout,
      email: guest.email,
    });
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (!editForm.name.trim() || !editForm.room.trim()) {
      Alert.alert("Validation", "Name and Room are required.");
      return;
    }
    setGuests(guests.map((g) => (g.id === editingGuest.id ? { ...g, ...editForm } : g)));
    setModalVisible(false);
    setEditingGuest(null);
  };

  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getShowingRange = () => {
    if (totalGuests === 0) return "Showing 0 to 0 of 0 guests";
    const from = startIndex + 1;
    const to = Math.min(startIndex + itemsPerPage, totalGuests);
    return `Showing ${from} to ${to} of ${totalGuests} guests`;
  };

  return (
    <MainLayout currentScreen="Guests" navigation={navigation}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Guests Management</Text>

        <View style={styles.searchFilterRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, room, email, or date..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="filter-outline" size={18} color="#4B5563" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableWrapper}>
          <View style={styles.table}>
            {/* Header with EMAIL column */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colGuest]}>GUEST NAME</Text>
              <Text style={[styles.tableHeaderText, styles.colRoom]}>ROOM</Text>
              <Text style={[styles.tableHeaderText, styles.colDate]}>CHECK-IN</Text>
              <Text style={[styles.tableHeaderText, styles.colDate]}>CHECK-OUT</Text>
              <Text style={[styles.tableHeaderText, styles.colEmail]}>EMAIL</Text>
              <Text style={[styles.tableHeaderText, styles.colActions]}>ACTIONS</Text>
            </View>

            {paginatedGuests.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No guests match</Text>
              </View>
            ) : (
              paginatedGuests.map((guest, idx) => (
                <View key={guest.id} style={[styles.tableRow, idx % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                  <Text style={[styles.tableCell, styles.colGuest, styles.guestName]}>{guest.name}</Text>
                  <Text style={[styles.tableCell, styles.colRoom]}>{guest.room}</Text>
                  <Text style={[styles.tableCell, styles.colDate]}>{guest.checkin}</Text>
                  <Text style={[styles.tableCell, styles.colDate]}>{guest.checkout}</Text>
                  <Text style={[styles.tableCell, styles.colEmail, styles.emailText]} numberOfLines={1}>{guest.email}</Text>
                  <View style={[styles.tableCell, styles.colActions, styles.actionCell]}>
                    <View style={styles.actionContainer}>
                      <TouchableOpacity onPress={() => openEditModal(guest)} hitSlop={8}>
                        <Ionicons name="create-outline" size={18} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(guest.id, guest.name)} hitSlop={8}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.paginationContainer}>
          <Text style={styles.paginationInfo}>{getShowingRange()}</Text>
          <View style={styles.paginationButtons}>
            <TouchableOpacity style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]} onPress={goToPrevPage} disabled={currentPage === 1}>
              <Ionicons name="chevron-back" size={14} color={currentPage === 1 ? "#CBD5E1" : "#4B5563"} />
              <Text style={[styles.pageBtnText, currentPage === 1 && styles.pageBtnTextDisabled]}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>Page {currentPage} of {totalPages || 1}</Text>
            <TouchableOpacity style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]} onPress={goToNextPage} disabled={currentPage === totalPages}>
              <Text style={[styles.pageBtnText, currentPage === totalPages && styles.pageBtnTextDisabled]}>Next</Text>
              <Ionicons name="chevron-forward" size={14} color={currentPage === totalPages ? "#CBD5E1" : "#4B5563"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} transparent animationType="fade" onRequestClose={() => setFilterModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.filterModalCard}>
                <Text style={styles.filterModalTitle}>Filter by Room Range</Text>
                {filterOptions.map((opt) => (
                  <TouchableOpacity key={opt.value} style={[styles.filterOption, filterRange === opt.value && styles.filterOptionActive]} onPress={() => handleFilterChange(opt.value)}>
                    <Text style={styles.filterOptionText}>{opt.label}</Text>
                    {filterRange === opt.value && <Ionicons name="checkmark" size={18} color="#0F172A" />}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.filterCloseBtn} onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.filterCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Ionicons name="person-outline" size={24} color="#1F2937" />
                  <Text style={styles.modalTitle}>Edit Guest Details</Text>
                </View>
                <View style={styles.modalBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput style={styles.textInput} value={editForm.name} onChangeText={(t) => setEditForm({ ...editForm, name: t })} />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Room Number</Text>
                    <TextInput style={styles.textInput} value={editForm.room} onChangeText={(t) => setEditForm({ ...editForm, room: t })} />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Check-in Date</Text>
                    <TextInput style={styles.textInput} value={editForm.checkin} onChangeText={(t) => setEditForm({ ...editForm, checkin: t })} />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Check-out Date</Text>
                    <TextInput style={styles.textInput} value={editForm.checkout} onChangeText={(t) => setEditForm({ ...editForm, checkout: t })} />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput style={styles.textInput} value={editForm.email} onChangeText={(t) => setEditForm({ ...editForm, email: t })} autoCapitalize="none" />
                  </View>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}><Text style={styles.saveBtnText}>Save Changes</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </MainLayout>
  );
};

// ----- STYLES (unchanged, same as your original) -----
const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, backgroundColor: "#F8FAFE" },
  pageTitle: { fontSize: 28, fontWeight: "700", color: "#0A2540", marginBottom: 20, letterSpacing: -0.3 },
  searchFilterRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 28 },
  searchContainer: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 44, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "#E2E8F0", maxWidth: 360 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: "#1E293B", paddingVertical: 4 },
  filterButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 44, borderWidth: 1, borderColor: "#E2E8F0", gap: 6 },
  filterButtonText: { fontSize: 14, fontWeight: "500", color: "#4B5563" },
  tableWrapper: { backgroundColor: "#FFF", borderRadius: 20, borderWidth: 1, borderColor: "#E9EDF2", overflow: "hidden", marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  table: { width: "100%" },
  tableHeader: { flexDirection: "row", backgroundColor: "#F1F5F9", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  tableHeaderText: { fontSize: 12, fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: 0.5 },
  tableRow: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#F0F2F5", alignItems: "center" },
  rowEven: { backgroundColor: "#FFF" },
  rowOdd: { backgroundColor: "#FCFDFF" },
  tableCell: { fontSize: 14, color: "#1E293B", fontWeight: "500" },
  guestName: { fontWeight: "600", color: "#0F172A" },
  emailText: { fontSize: 13, color: "#4B5563" },
  colGuest: { flex: 1.2 },
  colRoom: { flex: 1.7, textAlign: "center" },
  colDate: { flex: 1.1 },
  colEmail: { flex: 1.6 },
  colActions: { flex: 0.4, alignItems: "center", justifyContent: "center" },
  actionCell: { paddingVertical: 0 },
  actionContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 14 },
  emptyRow: { paddingVertical: 48, alignItems: "center" },
  emptyText: { fontSize: 15, color: "#94A3B8", fontWeight: "500" },
  paginationContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 },
  paginationInfo: { fontSize: 14, color: "#5B6E8C", fontWeight: "500", backgroundColor: "#FFF", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 40, borderWidth: 1, borderColor: "#E9EDF2" },
  paginationButtons: { flexDirection: "row", alignItems: "center", gap: 16 },
  pageBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 40, borderWidth: 1, borderColor: "#E2E8F0", gap: 6 },
  pageBtnDisabled: { opacity: 0.5, backgroundColor: "#F9FAFB" },
  pageBtnText: { fontSize: 13, fontWeight: "600", color: "#334155" },
  pageBtnTextDisabled: { color: "#CBD5E1" },
  pageIndicator: { fontSize: 13, fontWeight: "500", color: "#1F2937", backgroundColor: "#F1F5F9", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center" },
  filterModalCard: { width: "85%", maxWidth: 320, backgroundColor: "#FFF", borderRadius: 28, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 15 },
  filterModalTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 16, textAlign: "center" },
  filterOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, borderRadius: 16, marginBottom: 8 },
  filterOptionActive: { backgroundColor: "#F1F5F9" },
  filterOptionText: { fontSize: 15, color: "#1E293B", fontWeight: "500" },
  filterCloseBtn: { marginTop: 16, backgroundColor: "#F3F4F6", paddingVertical: 10, borderRadius: 40, alignItems: "center" },
  filterCloseText: { fontWeight: "600", color: "#4B5563" },
  modalCard: { width: "90%", maxWidth: 460, backgroundColor: "#FFF", borderRadius: 32, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 20 },
  modalHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#F0F2F5", gap: 12 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#0F172A" },
  modalBody: { padding: 24, gap: 18 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#475569", letterSpacing: 0.3 },
  textInput: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#0F172A", backgroundColor: "#FFF" },
  modalFooter: { flexDirection: "row", justifyContent: "flex-end", gap: 12, paddingHorizontal: 24, paddingBottom: 24 },
  cancelBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 40, backgroundColor: "#F1F5F9" },
  cancelBtnText: { fontSize: 14, fontWeight: "600", color: "#475569" },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 40, backgroundColor: "#0F172A" },
  saveBtnText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
});

export default Guests;