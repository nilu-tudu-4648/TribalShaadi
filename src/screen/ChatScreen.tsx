import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import AppSafeView from '../components/AppSafeView'
import AppText from '../components/AppText'
import { COLORS } from '../constants/AppColors'
import { fontSize28, fontSize16, fontSize14, Size16, Size12, Size8 } from '../constants/Sizes'
import { ChatIcon } from '../components/svg/SvgIcons'
import FONT_FAMILY from '../constants/Fonts'

const ChatScreen = () => {
  // Sample conversation data
  const conversations = [
    {
      id: 1,
      name: 'User A',
      message: 'Send a message',
      profileImage: require('../assets/images/Male.png'),
      isNew: true,
    },
  ]

  const renderConversationItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.conversationItem}>
      <Image source={item.profileImage} style={styles.profileImage} />
      <View style={styles.conversationContent}>
        <AppText text={item.name} textStyle={styles.userName} />
        <AppText text={item.message} textStyle={styles.messageText} />
      </View>
      {item.isNew && (
        <View style={styles.newButton}>
          <AppText text="New" textStyle={styles.newButtonText} />
        </View>
      )}
    </TouchableOpacity>
  )

  return (
    <AppSafeView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <AppText text="Connections" textStyle={styles.headerTitle} />
        </View>

        {/* Conversations Section */}
        <View style={styles.conversationsSection}>
          <View style={styles.conversationHeader}>
            <ChatIcon width={24} height={24} color={COLORS.black} />
            <AppText text="Conversations" textStyle={styles.sectionTitle} />
          </View>

          {/* Conversations List */}
          <View style={styles.conversationsList}>
            {conversations.map(renderConversationItem)}
          </View>
        </View>
      </ScrollView>
    </AppSafeView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingVertical: Size16,
    marginBottom: Size16,
  },
  headerTitle: {
    fontSize: fontSize28,
    fontWeight: '800',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_EXTRA_BOLD,
  },
  conversationsSection: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Size16,
    gap: Size8,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  conversationsList: {
    gap: Size12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Size16,
    paddingHorizontal: Size8,
    backgroundColor: COLORS.white,
    borderRadius: Size12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Size16,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: Size8 / 2,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  messageText: {
    fontSize: fontSize14,
    color: COLORS.textGrey,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
  },
  newButton: {
    backgroundColor: COLORS.violet,
    paddingHorizontal: Size16,
    paddingVertical: Size8,
    borderRadius: Size16,
  },
  newButtonText: {
    fontSize: fontSize14,
    color: COLORS.white,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
})