import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import AppSafeView from '../components/AppSafeView'
import AppHeader from '../components/AppHeader'
import AppText from '../components/AppText'
import { COLORS } from '../constants/AppColors'
import { fontSize14, fontSize16, Size16, Size20, Size8 } from '../constants/Sizes'
import FONT_FAMILY from '../constants/Fonts'

const TermScreen = () => {
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Terms and Conditions" leftButtonStyle={styles.leftButton} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.contentWrapper}>
          <AppText
            text="Effective Date: 13/11/2025"
            textStyle={styles.effectiveDate}
          />

          <View style={styles.sectionWrapper}>
            <AppText
              text="1. Detailed Introduction"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`Tribalshaadi.ai ("we," "our," or "us") is a matrimony platform designed for individuals seeking serious matrimonial connections. Our services are available through our mobile application ("App"). By accessing or using Tribalshaadi.ai, you acknowledge that:
• You are at least 18 years old.
• You are legally eligible to marry.
• You will use the platform for matrimonial purposes only.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="2. Updates to Term of Service"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`We may modify these Terms from time to time to reflect changes in laws, our services, or business needs.
The latest version will always be available in the App.
If you continue using Tribalshaadi.ai after changes, you accept the updated Terms.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="3. User Agreement"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`By creating an account and using TribalShaadi.ai, you agree to:
• Comply with these Terms.
• Provide accurate and truthful information.
• Not engage in fraudulent, illegal, or abusive activities on the platform.
Violation of these Terms may lead to account suspension or termination.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="4. Our Responsibilities"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`We are committed to providing a secure and reliable matchmaking service. However, we:
• Do not guarantee successful matchmaking.
• Do not verify every user's identity or intentions.
• Do not take responsibility for offline interactions between users.
While we use AI-based recommendations, we encourage users to exercise caution when connecting with others.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="5. Prohibited Activities"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`Users must NOT:
• Provide false, misleading, or incomplete information.
• Harass, abuse, or send inappropriate content to other users.
• Use Tribalshaadi.ai for casual dating, friendships, or business promotions.
• Impersonate another person or create multiple accounts.
• Engage in fraudulent, scam, or illegal activities.
• Post explicit, offensive, or discriminatory content.
Users found engaging in prohibited activities may face permanent account termination.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="6. App, Website, and Content Ownership"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`All content on Tribalshaadi.ai, including logos, text, images, and software, belongs to us.
• Users retain ownership of the content they post but grant us a license to display it for matchmaking purposes.
• Unauthorized copying, distribution, or modification of our content is strictly prohibited.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="7. Right to Access"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`Tribalshaadi.ai reserves the right to restrict or deny access to any user who violates our policies.
• Users must not attempt to hack, disrupt, or misuse our platform.
• Access to certain features may be limited to premium members.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="8. Our Company's Rights"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`We reserve the right to:
• Modify, suspend, or discontinue any part of the service without prior notice.
• Remove or block profiles violating our policies.
• Refuse service to anyone at our discretion.
We do not provide refunds for terminated accounts due to policy violations.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="9. Third-Party Links and Content"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`Tribalshaadi.ai may contain links to third-party websites or services.
• We do not control or endorse third-party content and are not responsible for any issues arising from their use.
• Users interact with third-party content at their own risk.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="10. Limitation of Liability, Disclaimers, and Indemnification"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`⚠️ Disclaimers:
• We provide services "as is" and "as available" without guarantees.
• We do not verify every user's background.
• We are not liable for losses or damages arising from user interactions.

⚠️ Limitation of Liability:
• Our liability is limited to the amount paid (if any) for premium services.
• We are not responsible for any indirect, accidental, or consequential damages.

⚠️ Indemnification:
Users agree to indemnify Tribalshaadi.ai, its owners, and affiliates from any claims or damages resulting from:
• Misuse of the platform.
• Violations of these Terms.
• Disputes with other users.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="11. Privacy Policy"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`By using Tribalshaadi.ai, you agree to our Privacy Policy.
• We collect, store, and process user data securely.
• We do not sell or share personal data without user consent, except where required by law.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="12. Governing Law"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`These Terms are governed by the laws of Jharkhand, India.
• Any disputes will be resolved through arbitration in Jharkhand.
• Users waive the right to class-action lawsuits.`}
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="13. Other Matters"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text={`• If any part of these Terms is found invalid, the rest remain fully enforceable.
• Failure to enforce any provision does not waive our rights.
• These Terms constitute the entire agreement between you and Tribalshaadi.ai.`}
              textStyle={styles.sectionContent}
            />
          </View>
        </View>
      </ScrollView>
    </AppSafeView>
  )
}

export default TermScreen

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
  effectiveDate: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    fontWeight: '600',
    color: COLORS.black,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 22,
  },
  sectionContent: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    fontWeight: '400',
    color: COLORS.black,
    lineHeight: 20,
  },
  leftButton: {
    width: '100%',
  },
});