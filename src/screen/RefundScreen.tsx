import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  Size16,
  Size20,
  Size8,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';

const RefundScreen = () => {
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Refund Policy" />
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

          <AppText
            text="Thank you for choosing Tribalshandi.ai. We value your trust and strive to provide the best services. Please read our refund policy carefully before making any purchases."
            textStyle={styles.sectionContent}
          />

          <View style={styles.sectionWrapper}>
            <AppText
              text="1. Subscription and Payments"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text="• Tribalshandi.ai offers both free and premium memberships.
• Premium membership fees are charged based on the plan selected."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="2. Eligibility for Refunds"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text="Refunds are only applicable in the following cases:"
              textStyle={styles.sectionContent}
            />
            <AppText
              text="• You were charged incorrectly due to a technical error.
• Duplicate payments were made for the same subscription.
• Your account was suspended or terminated without violating our Terms of Service."
              textStyle={styles.sectionContent}
            />
            <AppText
              text="No refunds will be issued for:"
              textStyle={styles.sectionContent}
            />
            <AppText
              text="• Change of mind after purchasing a subscription.
• Inability to find a match or dissatisfaction with matches.
• Non-usage of the service after purchase."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="3. Refund Request Process"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text="• To request a refund, contact our support team at support@tribalshandi.ai
• Provide transaction details, reason for refund, and any supporting documents.
• Refund requests must be submitted within 7 days of the transaction date."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText text="4. Processing Time" textStyle={styles.sectionTitle} />
            <AppText
              text="• Refunds will be processed within 10-15 business days after approval.
• The amount will be credited to the original payment method."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="5. Chargebacks & Disputes"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text="• If you initiate a chargeback without contacting us first, your account may be suspended.
• We encourage users to resolve issues directly with our support team."
              textStyle={styles.sectionContent}
            />
          </View>

          <View style={styles.sectionWrapper}>
            <AppText
              text="6. Changes to This Policy"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text="• Tribalshandi.ai reserves the right to update this refund policy at any time.
• Changes will be communicated on our App."
              textStyle={styles.sectionContent}
            />
          </View>

          <AppText
            text="For any questions or concerns, please contact us at Support@tribalshandi.ai"
            textStyle={styles.sectionContent}
          />
        </View>
      </ScrollView>
    </AppSafeView>
  );
};

export default RefundScreen;

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
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
