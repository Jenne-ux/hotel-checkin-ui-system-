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

const DenyVisit = ({ visible, onTryAgain, onBackToHome, visitorName, personToVisit }) => {
  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain(); // This will close modal and stay on Visitors screen
    }
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome(); // This will navigate to Welcome screen
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleTryAgain}
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
          {/* Error Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="close-circle" size={70} color="#EF4444" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Visit Denied</Text>
          
          {/* Message */}
          <Text style={styles.message}>
            Sorry, {personToVisit} is unable to receive visitors at this time.
          </Text>

          {/* Additional Instruction */}
          <View style={styles.instructionCard}>
            <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
            <Text style={styles.instructionText}>
              Please contact {personToVisit} directly to inform them of your arrival. 
              Once they confirm, you can try again.
            </Text>
          </View>

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

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.tryAgainButton} 
              onPress={handleTryAgain}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.tryAgainButtonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backToHomeButton} 
              onPress={handleBackToHome}
            >
              <Ionicons name="home-outline" size={20} color="#2563EB" />
              <Text style={styles.backToHomeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
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
    color: '#EF4444',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    gap: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
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
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  tryAgainButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tryAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToHomeButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  backToHomeButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DenyVisit;