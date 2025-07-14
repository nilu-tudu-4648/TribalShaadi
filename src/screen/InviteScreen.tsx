import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import AppSafeView from '../components/AppSafeView';
import { Size16 } from '../constants/Sizes';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants/AppColors';

const InviteScreen = () => {

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Invite" titleStyle={{ color: COLORS.white }} arrowColor={COLORS.white} />
      <View style={{ gap: Size16 }}>
        <AppText
          text="Help Your Friends Find Their Match!"
          style={styles.title}
        />

        <AppText
          text="Do you know someone looking for their life partner? Invite them to join TribalShaadi and help them connect with like-minded people from their community."
          style={styles.description}
        />

        <AppButton
          title="Invite"
          onPress={() => {}}
          buttonStyle={styles.inviteButton}
          textStyle={styles.inviteButtonText}
        />
      </View>
    </AppSafeView>
  );
};

export default InviteScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C084FC', // Light purple
    // padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  inviteButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
