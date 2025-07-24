import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import AppSafeView from '../components/AppSafeView'
import AppHeader from '../components/AppHeader'
import AppText from '../components/AppText'
import { COLORS } from '../constants/AppColors'
import { fontSize14, fontSize16, Size16, Size20, Size8 } from '../constants/Sizes'
import FONT_FAMILY from '../constants/Fonts'

const PrivacyScreen = () => {
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Privacy Policy" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.contentWrapper}>
          <AppText 
            text="Effective Date: [Date]"
            textStyle={styles.effectiveDate}
          />

          <AppText 
            text="Tribalshandi.ai ('we,' 'us,' or 'us') respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, share and protect information when you use our mobile application 'Tribalshandi.ai'."
            textStyle={styles.sectionContent}
          />

          <View style={styles.sectionWrapper}>
            <AppText 
              text="1. Information We Collect"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="When you use our app, we may collect the following types of information:"
              textStyle={styles.sectionContent}
            />

            <View style={styles.subsectionWrapper}>
              <AppText 
                text="1.1 Personal Information"
                textStyle={styles.subsectionTitle}
              />
              <AppText 
                text="• Name, age, gender, religion, tribe, marital status
• Contact details such as email and phone number
• Profile details such as bio, height, eating habits, drinking and smoking preferences
• Uploaded photos and verification documents
• Location details (city, state, district)
• Government-issued IDs for verification purposes"
                textStyle={styles.sectionContent}
              />
            </View>

            <View style={styles.subsectionWrapper}>
              <AppText 
                text="1.2 Profile Information"
                textStyle={styles.subsectionTitle}
              />
              <AppText 
                text="• Profile photos and other uploaded images
• Preferences and filters used to find a match"
                textStyle={styles.sectionContent}
              />
            </View>

            <View style={styles.subsectionWrapper}>
              <AppText 
                text="1.3 Usage Data"
                textStyle={styles.subsectionTitle}
              />
              <AppText 
                text="• Interactions with the app including swipes, chats, and interests sent or received
• Device logs and analytics when you use the app
• Session activity, clicks, and app navigation
• Location preferences in the app, device details, and app navigation"
                textStyle={styles.sectionContent}
              />
            </View>

            <View style={styles.subsectionWrapper}>
              <AppText 
                text="1.4 Payment Information"
                textStyle={styles.subsectionTitle}
              />
              <AppText 
                text="• If you subscribe to premium services, we collect payment details such as billing address from third-party payment gateways
• We do not store sensitive financial information on our credit and debit details"
                textStyle={styles.sectionContent}
              />
            </View>

            <View style={styles.subsectionWrapper}>
              <AppText 
                text="1.5 Location Data"
                textStyle={styles.subsectionTitle}
              />
              <AppText 
                text="• Approximate location (city, state) for better matchmaking
• You can disable location tracking from your device settings"
                textStyle={styles.sectionContent}
              />
            </View>
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="2. How We Use Your Information"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="We use your information to:
• Create and manage your account
• Provide matchmaking services based on your preferences and location
• Facilitate communication between matched users
• Verify profiles to prevent fraud and maintain user safety
• Send notifications, alerts, and promotional offers
• Improve app functionality through analytics and user feedback
• Provide customer support"
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="3. How We Share Your Information"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="We do not sell your data. However, we may share your information:
• With potential matches: Your profile details (except contact information) will be visible to other users based on your privacy settings
• With third-party service providers: We may share data with vendors for analytics, and customer support; they are bound by confidentiality agreements
• For legal compliance: If required by law, we may disclose your information for legal processes or fraud prevention"
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="4. Data Security"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="We implement strict security measures including:
• Encryption of sensitive data during transmission
• Access controls to prevent unauthorized access to your information
• Regular security audits to protect your personal data
• While we have all necessary precautions, no digital platform can guarantee 100% security. Please protect your account by not sharing your credentials."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="5. Your Rights & Choices"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="You have the right to:
• Access and update your personal information from your privacy settings
• Delete your account permanently from app settings
• Control information from your device settings
• Opt-out of marketing messages from notification settings"
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="6. Cookies & Tracking Technologies"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="We use cookies and similar tracking technologies to:
• Remember login sessions
• Improve app performance and recommendations
• Analyze user engagement and enhancements
• You can manage cookie preferences from your device settings"
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="7. Changes to This Privacy Policy"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="We may update this Privacy Policy periodically. Any changes will be reflected in the 'effective date' listed above. We'll notify you of significant updates."
              textStyle={styles.sectionContent}
            />
          </View>
        </View>
      </ScrollView>
    </AppSafeView>
  )
}

export default PrivacyScreen

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
  contentWrapper: {
    gap: Size16,
  },
  sectionWrapper: {
    gap: Size8,
  },
  subsectionWrapper: {
    gap: Size8,
    paddingLeft: Size8,
  },
  effectiveDate: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_BOLD,
    fontWeight: '600',
    color: COLORS.black,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_BOLD,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 22,
  },
  subsectionTitle: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_BOLD,
    fontWeight: '600',
    color: COLORS.black,
    lineHeight: 20,
  },
  sectionContent: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_REGULAR,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
})