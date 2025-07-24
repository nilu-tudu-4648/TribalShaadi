
import React from 'react'
import { StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import AppSafeView from '../components/AppSafeView'
import { COLORS } from '../constants/AppColors'

const SupportScreen = () => {
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Support" />
    </AppSafeView>
  )
}

export default SupportScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
})