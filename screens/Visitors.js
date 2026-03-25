import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ApprovedVisit from './ApprovedVisit';
import DenyVisit from './DenyVisit';

const ApprovalModal = ({ visible, onClose, onApprove, onDeny, visitorName, personToVisit, purposeOfVisit, idType, idNumber }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlayCenter}>
      <View style={styles.approvalModalContent}>
        <View style={styles.approvalLoadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.approvalLoadingText}>CONTACTING HOST...</Text>
        </View>
        
        <Text style={styles.approvalMessage}>
          Admin has been notified. Please wait for approval from {personToVisit || 'the host'}.
        </Text>

        <View style={styles.approvalDetailsCard}>
          <Text style={styles.approvalDetailsTitle}>Visitor Details</Text>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>Name:</Text>
            <Text style={styles.approvalDetailValue}>{visitorName || 'Guest'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>Visiting:</Text>
            <Text style={styles.approvalDetailValue}>{personToVisit || 'Host'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>Purpose:</Text>
            <Text style={styles.approvalDetailValue}>{purposeOfVisit || 'Visit'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>ID Type:</Text>
            <Text style={styles.approvalDetailValue}>{idType || 'ID'}</Text>
          </View>
          <View style={styles.approvalDetailRow}>
            <Text style={styles.approvalDetailLabel}>ID Number:</Text>
            <Text style={styles.approvalDetailValue}>{idNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.approvalButtonContainer}>
          <TouchableOpacity style={styles.approvalApproveButton} onPress={onApprove}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.approvalApproveButtonText}>Approve Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approvalDenyButton} onPress={onDeny}>
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.approvalDenyButtonText}>Deny Visit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.approvalNoteText}>Admin: Click Approve after confirming with the host</Text>
      </View>
    </View>
  </Modal>
);

const Visitors = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [personToVisit, setPersonToVisit] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [purposeModalVisible, setPurposeModalVisible] = useState(false);
  const purposes = ['Guest Companion', 'Family Visit', 'Business Meeting', 'Delivery', 'Maintenance'];
  const [idType, setIdType] = useState('');
  const [idTypeModalVisible, setIdTypeModalVisible] = useState(false);
  const idTypes = [
    'Passport',
    'Driver\'s License',
    'National ID',
    'Postal ID',
    'Voter\'s ID',
    'PRC ID',
    'Company ID',
    'Student ID',
    'Other IDs'
  ];
  const [idNumber, setIdNumber] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [approvedModalVisible, setApprovedModalVisible] = useState(false);
  const [deniedModalVisible, setDeniedModalVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleBack = () => navigation.goBack();

  const handleContinue = () => {
    setApprovalModalVisible(true);
  };

  const handleApprovalClose = () => setApprovalModalVisible(false);

  const handleAdminApprove = () => {
    setApprovalModalVisible(false);
    setApprovedModalVisible(true);
  };

  const handleAdminDeny = () => {
    setApprovalModalVisible(false);
    setDeniedModalVisible(true);
  };

  const handleApprovedClose = () => {
    setApprovedModalVisible(false);
    navigation.navigate('NewVisitorReg');
  };

  const handleTryAgain = () => setDeniedModalVisible(false);

  const handleBackToHome = () => {
    setDeniedModalVisible(false);
    navigation.navigate('Welcome');
  };

  const selectPurpose = (purpose) => {
    setPurposeOfVisit(purpose);
    setPurposeModalVisible(false);
  };

  const selectIdType = (selectedIdType) => {
    setIdType(selectedIdType);
    setIdTypeModalVisible(false);
  };

  const renderLabel = (text) => (
    <Text style={styles.label}>{text}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      <View style={styles.header}>
        <View style={styles.poweredBox}>
          <Text style={styles.poweredText}>Powered by</Text>
          <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Text style={styles.headerTitle}>Visitor Information</Text>
          <Text style={styles.headerSub}>Please provide your details for visiting</Text>

          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputWrapper}>
              {renderLabel("Full Name")}
              <View style={[styles.inputContainer, focusedInput === 'fullName' && styles.inputFocused]}>
                <Ionicons name="person-outline" size={20} color="#8a8a8a" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Juana Dela Cruz"
                  placeholderTextColor="#94A3B8"
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFocusedInput('fullName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Person to Visit */}
            <View style={styles.inputWrapper}>
              {renderLabel("Person to Visit")}
              <View style={[styles.inputContainer, focusedInput === 'personToVisit' && styles.inputFocused]}>
                <Ionicons name="people-outline" size={20} color="#8a8a8a" />
                <TextInput
                  style={styles.input}
                  placeholder="Who are you here to see?"
                  placeholderTextColor="#94A3B8"
                  value={personToVisit}
                  onChangeText={setPersonToVisit}
                  onFocus={() => setFocusedInput('personToVisit')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Purpose of Visit */}
            <View style={styles.inputWrapper}>
              {renderLabel("Purpose of Visit")}
              <TouchableOpacity
                style={[styles.dropdownButton, focusedInput === 'purpose' && styles.dropdownFocused]}
                onPress={() => setPurposeModalVisible(true)}
              >
                <Ionicons name="briefcase-outline" size={20} color="#8a8a8a" />
                <Text style={purposeOfVisit ? styles.dropdownButtonText : styles.dropdownPlaceholder}>
                  {purposeOfVisit || "Select Reason"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            {/* Government ID Type */}
            <View style={styles.inputWrapper}>
              {renderLabel("Government-Issued ID Type")}
              <TouchableOpacity
                style={[styles.dropdownButton, focusedInput === 'idType' && styles.dropdownFocused]}
                onPress={() => setIdTypeModalVisible(true)}
              >
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8a8a8a" />
                <Text style={idType ? styles.dropdownButtonText : styles.dropdownPlaceholder}>
                  {idType || "Select ID Type"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            {/* ID Number */}
            <View style={styles.inputWrapper}>
              {renderLabel("ID Number")}
              <View style={[styles.inputContainer, focusedInput === 'idNumber' && styles.inputFocused]}>
                <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#8a8a8a" />
                <TextInput
                  style={styles.input}
                  value={idNumber}
                  onChangeText={setIdNumber}
                  placeholder="e.g. 123-456-789"
                  placeholderTextColor="#94A3B8"
                  onFocus={() => setFocusedInput('idNumber')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Checkbox */}
            <View style={styles.checkboxWrapper}>
              <TouchableOpacity
                onPress={() => setAgreed(!agreed)}
                style={{
                  width: 24, height: 24, borderWidth: 2,
                  borderColor: agreed ? "#2563EB" : "#ccc",
                  borderRadius: 4,
                  backgroundColor: agreed ? "#2563EB" : "#fff",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.terms}>
                By signing above, I acknowledge that the information provided is accurate and I agree to the hotel's terms and conditions and privacy policy.
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleContinue}>
              <Text style={styles.confirmText}>Confirm Registration →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Purpose Modal */}
      <Modal animationType="slide" transparent={true} visible={purposeModalVisible} onRequestClose={() => setPurposeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Purpose of Visit</Text>
              <TouchableOpacity onPress={() => setPurposeModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={purposes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, purposeOfVisit === item && styles.modalItemSelected]}
                  onPress={() => selectPurpose(item)}
                >
                  <Text style={[styles.modalItemText, purposeOfVisit === item && styles.modalItemTextSelected]}>{item}</Text>
                  {purposeOfVisit === item && <Ionicons name="checkmark" size={20} color="#fff" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* ID Type Modal */}
      <Modal animationType="slide" transparent={true} visible={idTypeModalVisible} onRequestClose={() => setIdTypeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select ID Type</Text>
              <TouchableOpacity onPress={() => setIdTypeModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={idTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, idType === item && styles.modalItemSelected]}
                  onPress={() => selectIdType(item)}
                >
                  <Text style={[styles.modalItemText, idType === item && styles.modalItemTextSelected]}>{item}</Text>
                  {idType === item && <Ionicons name="checkmark" size={20} color="#fff" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <ApprovalModal
        visible={approvalModalVisible}
        onClose={handleApprovalClose}
        onApprove={handleAdminApprove}
        onDeny={handleAdminDeny}
        visitorName={fullName}
        personToVisit={personToVisit}
        purposeOfVisit={purposeOfVisit}
        idType={idType}
        idNumber={idNumber}
      />

      <ApprovedVisit
        visible={approvedModalVisible}
        onClose={handleApprovedClose}
        visitorName={fullName}
        personToVisit={personToVisit}
      />

      <DenyVisit
        visible={deniedModalVisible}
        onTryAgain={handleTryAgain}
        onBackToHome={handleBackToHome}
        visitorName={fullName}
        personToVisit={personToVisit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { width: "100%", height: 80, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "flex-end", paddingRight: 20 },
  poweredBox: { backgroundColor: "#EFE6D7", padding: 10, borderRadius: 10, alignItems: "center" },
  poweredText: { fontSize: 12, color: "#555" },
  logo: { width: 120, height: 30 },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: 30 },
  content: { padding: 16, backgroundColor: '#f5f5f5' },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#2c3e50", marginBottom: 8, marginTop: 10 },
  headerSub: { fontSize: 14, color: "#7f8c8d", marginBottom: 24, lineHeight: 20 },
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  label: { fontWeight: "600", marginBottom: 6, color: "#34495e", fontSize: 16 },
  inputWrapper: { marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fafafa", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e0e0e0" },
  inputFocused: { borderColor: "#2563EB", borderWidth: 2 },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: "#2c3e50" },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fafafa' },
  dropdownFocused: { borderColor: "#2563EB", borderWidth: 2 },
  dropdownButtonText: { flex: 1, fontSize: 16, color: '#2c3e50', marginLeft: 10 },
  dropdownPlaceholder: { flex: 1, fontSize: 16, color: '#94A3B8', marginLeft: 10 },
  checkboxWrapper: { flexDirection: "row", alignItems: "flex-start", marginTop: 10, marginBottom: 10 },
  terms: { flex: 1, fontSize: 13, color: "#7f8c8d", lineHeight: 18, marginLeft: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 20, backgroundColor: "#f5f5f5" },
  backBtn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, width: "40%", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#2563EB", height: 48 },
  backBtnText: { color: "#2563EB", fontWeight: "600", fontSize: 16 },
  confirmBtn: { backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, width: "55%", alignItems: "center", justifyContent: "center", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, height: 48 },
  confirmText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalOverlayCenter: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalItemSelected: { backgroundColor: '#2563EB' },
  modalItemText: { fontSize: 16, color: '#2c3e50' },
  modalItemTextSelected: { color: '#fff', fontWeight: '500' },
  approvalModalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '90%', maxWidth: 400, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  approvalLoadingContainer: { alignItems: 'center', marginBottom: 16 },
  approvalLoadingText: { fontSize: 16, fontWeight: '600', color: '#2563EB', marginTop: 8, letterSpacing: 0.5 },
  approvalMessage: { fontSize: 14, color: '#7f8c8d', textAlign: 'center', marginBottom: 20, lineHeight: 20, paddingHorizontal: 10 },
  approvalDetailsCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, width: '100%', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  approvalDetailsTitle: { fontSize: 15, fontWeight: '600', color: '#2563EB', marginBottom: 12, textAlign: 'center' },
  approvalDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 },
  approvalDetailLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  approvalDetailValue: { fontSize: 13, color: '#1E293B', fontWeight: '600' },
  approvalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12, gap: 10 },
  approvalApproveButton: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  approvalApproveButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  approvalDenyButton: { backgroundColor: '#EF4444', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  approvalDenyButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  approvalNoteText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' },
});

export default Visitors;