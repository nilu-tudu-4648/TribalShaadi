import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import { fontSize14, fontSize16, Size8, Size16, Size20 } from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';

const FAQScreen = () => {
  const faqData = [
    {
      question: "What is Tribalshaadi.ai?",
      answer: "Tribalshaadi.ai is an Al-powered matchmaking app designed specifically for tribal communities, helping tribal find meaningful connections.\n\nTribalshaadi.ai focuses on serious matchmaking, using advanced AI algorithms to recommend highly compatible matches based on mandatory preferences like:"
    },
    {
      question: "",
      answer: "• Mandatory preferences: Religion, Age, Height, and Marital Status.\n• Flexible preferences: Tribe, Location, Job Type, and Annual Income.\n\nWith features like Al-powered profile verification, strict matchmaking filters, and premium chat options, the app ensures a safe, reliable, and community-focused matchmaking experience."
    },
    {
      question: "How does Tribalshaadi.ai ensure strict matchmaking filters?",
      answer: "We use Al-powered matchmaking, ensuring compatibility based on mandatory preferences like:\n• Religion\n• Age\n• Height\n• Marital Status\n\nWe also consider secondary preferences, including Tribe, Location, Job Type, and Annual Income."
    },
    {
      question: "How do I create an account on Tribalshaadi.ai?",
      answer: "Creating an account on Tribalshaadi.ai is simple and secure:\n1. Download & Install - Get the app from the App Store or Play Store (coming soon).\n2. Sign Up - Register using your phone number.\n3. Verify Your Identity (Al-powered).\n4. Complete Your Profile - Ensures your profile photo is authentic.\n5. Set Your Preferences - Confirm your identity using Aadhaar, PAN, etc.\n6. Set Up Your Profile - Add details like age, religion, tribe, location, education, job, and partner preferences.\n7. Start Matching! - Once approved, browse compatible matches and send interest requests."
    },
    {
      question: "How can I upgrade to premium?",
      answer: "You can upgrade to premium via UPI payments within the app."
    },
    {
      question: "How does the connection system work?",
      answer: "• You send an interest request to someone you like.\n• The recipient can either accept or decline your interest.\n• They accept, you both start chatting."
    },
    {
      question: "What happens if I receive an interest request?",
      answer: "• You can accept or decline the request.\n• Accepting requires a premium subscription.\n• Once accepted, the chat option unlocks."
    },
    {
      question: "How does Tribalshaadi.ai ensure user safety?",
      answer: "• We use multiple security measures:\n• Al-powered Selfie & ID Verification to prevent fake profiles.\n• AWS WAF protection to ensure data security.\n• Al fraud detection alerts to flag suspicious activity."
    },
    {
      question: "Can I report a suspicious profile?",
      answer: "Yes, you can report profiles using the Report Profile option in the app, and our system will take action based on Al fraud detection."
    },
    {
      question: "Is my data secure on Tribalshaadi.ai?",
      answer: "Yes, we use Amazon RDS, S3, and AWS security services to store and protect user data."
    },
    {
      question: "What are the benefits of a premium subscription?",
      answer: "Premium users get access to:\n• Unlimited messaging after mutual acceptance.\n• See all received interest requests."
    },
    {
      question: "Can I delete my account? How?",
      answer: "Yes, you can delete your account permanently from the Account Settings in the app.\n⚠️ Note: This action cannot be undone and will erase all your matches, messages, and profile data."
    },
    {
      question: "Can I send messages to someone without mutual acceptance?",
      answer: "No, both users must accept the interest request before chatting."
    },
    {
      question: "Can I undo an interest request?",
      answer: "No, once an interest request is sent, it cannot be undone. You'll need to wait for the person to accept or decline."
    },
    {
      question: "How can I report a problem or suggest a new feature?",
      answer: "Use our feedback! You can report issues or suggest new features in the Support section of the app."
    }
  ];

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="FAQ" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.faqWrapper}>
          {faqData.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              {item.question !== "" && (
                <AppText 
                  text={item.question}
                  textStyle={styles.questionText}
                />
              )}
              <AppText 
                text={item.answer}
                textStyle={styles.answerText}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </AppSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Size16,
    paddingBottom: Size20,
  },
  faqWrapper: {
    gap: Size16,
  },
  faqItem: {
    gap: Size8,
  },
  questionText: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_BOLD,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 22,
  },
  answerText: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_REGULAR,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default FAQScreen;
