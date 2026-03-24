import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ApprovedVisit = ({ visible, onClose, visitorName, personToVisit }) => {
  // Add this console log to verify the component renders
  console.log('ApprovedVisit rendered with props:', { visible, visitorName, personToVisit });
  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('ApprovedVisit useEffect - visible:', visible);
    
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={70} color="#2563EB" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Visit Approved!</Text>
          
          {/* Updated Message */}
          <Text style={styles.message}>
            {personToVisit} has been informed of your visit. You may now proceed.
          </Text>

          {/* Visitor Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Visitor: </Text>
              <Text style={styles.visitorName}>{visitorName}</Text>
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Host / Person to Visit: </Text>
              <Text style={styles.visitorName}>{personToVisit}</Text>
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={onClose}>
            <Text style={styles.continueButtonText}>Finish</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#2563EB',
  },
  visitorName: {
    color: '#000000',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ApprovedVisit;