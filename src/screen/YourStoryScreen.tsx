
import React from 'react'
import { StyleSheet } from 'react-native'
import AppSafeView from '../components/AppSafeView'
import AppHeader from '../components/AppHeader'
import { COLORS } from '../constants/AppColors'

const YourStoryScreen = () => {
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Your Story" />
    </AppSafeView>
  )
}

export default YourStoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
})
