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
            text="Effective Date: [Date]"
            textStyle={styles.effectiveDate}
          />

          <View style={styles.sectionWrapper}>
            <AppText 
              text="1. Product Introduction and Platform Agreement"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="By downloading or clicking 'Yes' or 'I Agree' read-time bing platform designed for Indian tribal communities. By downloading or using the app, you accept and are bound by these Terms of Service. If you do not agree to these terms, do not use the app."
              textStyle={styles.sectionContent}
            />
            <AppText 
              text="• You are at least 18 years old.
• You are legally eligible to enter into binding contracts for matrimonial purposes only"
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="2. Updates to Term of Service"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="We may update these Terms from time to time to reflect changes in laws, our services, or platform evolutions. The effective version's date will be displayed above. When we make changes, we'll notify you in advance through app notifications or emails. 

if you continue using Tribalshandi.ai after changes to the terms, you acceptance of the changes and updated terms.

We do not commit an account (non-using and inactive) for period between 6-12 months inactive account may terminate without notice."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="3. User Agreement"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="By creating an account and using Tribalshandi.ai, you agree to:
• Provide accurate and truthful information
• Use the app for matrimonial purposes only
• Follow community guidelines and laws
• You said id there, without our Book without our app or independent user activity.
• Real time and we, and you from responsible use for online app or independent user content."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="4. Our Responsibilities"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="We are committed to provide a secure and reliable matchmaking service. However, we do not guarantee success in finding a match.
• Do not take responsibility for offline meetings or events between users.
• Do not take responsibility for external sources or events because of our services.
• We encourage users to exercise caution when meeting in person."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="5. Prohibited Activities"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="Never post HCT, harassing, or inappropriate content.
Impersonating or providing false or misleading or incomplete profiles.
• Sharing other Content other than our platform.
• using automatic tools or bots to access multiple accounts.
• creating or distributing malicious software.
• Engaging in financial transactions others than our official purchases.
• Violating any other-party related software restrictions.
• Disputes with other users"
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="6. Rights to Access"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="Tribalshandi.ai reserves the right to restrict or limit access to the platform or services at any time.
Access restriction includes time-based or app-based services as it must always operate and user who were abusive
or harass on our policy to reflect our platform eligibility requirement.
Users must not attempt to hack, disrupt, or harass any person based on users malware.
Account with that other or attempt to hack, disrupt, or misuse any platform of our platform related sites
restricted content platform the platform.
We are not responsible for any such problems.
We do not responsible for service third party restricted other abuse unless we have otherwise for our discretion."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="7. Limitation of Liability, Disclaimers and Indemnification"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="• Disclaimer:
We provide our services 'as is' and 'as available', without any warranties or guarantees.
We do not verify every user's background, occupation, contact information or age.
We do not screen users to all or from background information are not be accurate.
Uses interact with third-party content and your information.
Users interact with third-party content."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="8. Indemnification"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="Tribalshaandi.ai, Indemnification: If
You agree to indemnify and hold harmless
Tribalshandi.ai from any claims, damages,
or expense including from:
• Users or content based third-party
content and users who are or app from
• Users interact third-party content and
your app our users.
Users interact third-party content and your
content."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="9. Privacy Policy"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="Your usage is backed with app by agree to our privacy policy which outlines:
• How we collect, store, and process your data

• Data sharing practices

We use consent personal info required with.

We use consent required with to claim."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="10. Governing Law"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="• These Terms are governed by the laws of
[jurisdiction].
• Any disputes will be resolved through
arbitration and dispute and not
litigation.
• Users within the right to claim through this
within this jurisdiction."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText 
              text="11. Other Agreements"
              textStyle={styles.sectionTitle}
            />
            <AppText 
              text="• These Terms may be subject to additional app-specific and software settings (as at users) same effective from all third our business needs and to continue our communications.
• If any provision in these terms are invalid, the remaining agreement between you and Tribalshandi.ai"
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
  sectionContent: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_REGULAR,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  leftButton: {
    width: '100%',
  },
});