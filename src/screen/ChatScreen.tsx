import { StyleSheet, View, Image, FlatList, Pressable } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppSafeView from '../components/AppSafeView';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import {
  fontSize28,
  fontSize16,
  fontSize14,
  Size16,
  Size12,
  Size8,
  Size14,
  Size50,
  Size25,
  Size10,
  Size4,
  fontSize12,
  fontSize24,
  fontSize20,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import { ConversationIcon } from '../components/svg/SvgIcons2';
import { ASYNC_VARIBLES, ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import NotifiNumberChip from '../components/chips/NotifiNumberChip';
import { useDispatch, useSelector } from 'react-redux';
import {
  baseUrl,
  delay,
  getAcceptedProposalByIdUrl,
  getLatestMessagesByFriend,
  getGalleryImageListUrl,
  getPackageByUserIdUrl,
  getSelectedUserUrl,
  updateProposalIsNewApi,
  updateProposalIsNewUrl,
} from '../constants/functions';

import { getAcceptedProposalByIdApi } from '../store/reducers/chatReducer';
import AppChip2 from '../components/chips/AppChip2';
import Loader from '../components/loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileBottomSheet from '../components/BottomSheets/ProfileBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  getCurrentMatchedUserGalleryImageListApi,
  getSelectedUserApi,
  getSelectedUserPackageApi,
} from '../store/reducers/userReducer';
import { SIZES } from '../constants/Sizes';
import DefenceBottomSheet from '../components/BottomSheets/DefenceBottomSheet';
import { usePostHog } from 'posthog-react-native';
const ChatScreen = () => {
  const navigation = useNavigation();
  const posthog = usePostHog();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const { loader, acceptedProposalById, unreadChatHistory } = useSelector(
    (state: any) => state.entities.chatReducer,
  );
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const profileBottomSheetRef = useRef<BottomSheet>(null);
  const defenceBottomSheetRef = useRef<BottomSheet>(null);
  const { packageByUserId } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const handleCardPress = async (id: string) => {
    try {
      setIsLoading(true);
      dispatch(getSelectedUserApi(`${baseUrl}/${getSelectedUserUrl}?id=${id}`));
      dispatch(
        getSelectedUserPackageApi(`${baseUrl}/${getPackageByUserIdUrl}`, {
          userId: id,
        }),
      );
      dispatch(
        getCurrentMatchedUserGalleryImageListApi(
          `${baseUrl}/${getGalleryImageListUrl}`,
          {
            userId: id,
          },
        ),
      );
      await delay();
      profileBottomSheetRef.current?.snapToIndex(0); // Open the bottom sheet at 50%
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      profileBottomSheetRef.current?.close();
      defenceBottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);
  const acceptFriendRequest = async (item: any) => {
    try {
      if (item.isNewStatus === 1) {
        posthog.capture('chat_opened')
        await updateProposalIsNewApi(updateProposalIsNewUrl, {
          proposalId: item.friendId,
          isNew: false,
        });
        dispatch(
          getAcceptedProposalByIdApi(
            `${getAcceptedProposalByIdUrl}/${user?.id}`,
          ),
        );
      }
      (navigation as any).navigate(ROUTES.STACK, {
        screen: ROUTES.CONVERSATIONS,
        params: {
          userDetails: item,
        },
      });
    } catch (error) {
    }
  };
  // Previews: show the cached copy first, then refresh from the server so the
  // list is filled even if no conversation has been opened on this device.
  const loadLastMessages = useCallback(async () => {
    let cached: any[] = [];
    try {
      const item = await AsyncStorage.getItem(ASYNC_VARIBLES.LAST_MESSAGE);
      const parsed = item ? JSON.parse(item) : [];
      cached = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      cached = [];
    }
    setLastMessage(cached);

    if (!user?.id) return;
    const fromServer = await getLatestMessagesByFriend(user.id);
    if (fromServer.length === 0) return;

    const merged = [...cached];
    fromServer.forEach((serverMsg: any) => {
      const idx = merged.findIndex(
        (m: any) => String(m.friendId) === String(serverMsg.friendId),
      );
      if (idx === -1) {
        merged.push(serverMsg);
      } else if ((merged[idx].timestamp ?? 0) < serverMsg.timestamp) {
        merged[idx] = serverMsg;
      }
    });
    setLastMessage(merged);
    try {
      await AsyncStorage.setItem(
        ASYNC_VARIBLES.LAST_MESSAGE,
        JSON.stringify(merged),
      );
    } catch (e) {}
  }, [user?.id]);

  useEffect(() => {
    loadLastMessages();
    const unsubscribe = (navigation as any).addListener('focus', loadLastMessages);
    return unsubscribe;
  }, [navigation, loadLastMessages]);

  const truncateMessage = (message: string, maxLength: number = 35) => {
    if (!message) return '';
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  };

  const renderConversationItem = (item: any) => {
    // Memoize filtered unread chats for this friendId
    const unreadChatsForFriend = unreadChatHistory.filter(
      (chat: any) => chat.userId === item.friendId && chat.isRead === 0,
    );
    const unreadCount = unreadChatsForFriend.length;
    const latestUnreadChat = unreadChatsForFriend[0];
    const latestMessage = lastMessage?.find(
      (message: any) => String(message.friendId) === String(item.friendId),
    );
    // Determine the time to display
    const displayTime = latestUnreadChat?.created_at
      ? new Date(latestUnreadChat.created_at)
      : new Date(item.friendsSince);

    return (
      <View key={item.id} style={styles.conversationItem}>
        <Pressable onPress={() => handleCardPress(item.friendId)}>
          <Image
            source={{ uri: item.image }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </Pressable>
        <Pressable
          onPress={() => acceptFriendRequest(item)}
          style={styles.conversationContent}
        >
          <AppText
            text={`${item.firstName} ${item.lastName ?? ''}`}
            textStyle={styles.userName}
          />
          <AppText
            text={truncateMessage(
              latestMessage?.message
                ? latestMessage?.message
                : unreadCount > 0
                ? latestUnreadChat?.content
                : item.isNewStatus !== 1
                ? item.message
                : 'Send a message'
            )}
            textStyle={styles.messageText}
          />
        </Pressable>
        {item.isNewStatus !== 1 ? (
          <View style={styles.timeContainer}>
            <AppText
              text={
                latestMessage?.time
                  ? latestMessage?.time
                  : displayTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
              }
              textStyle={styles.timeText}
            />
            {unreadCount > 0 && (
              <NotifiNumberChip
                number={unreadCount}
                style={styles.notificationChip}
              />
            )}
          </View>
        ) : (
          <AppChip2
            title="New"
            style={styles.newButton}
            onPress={() => {}}
            textStyle={styles.newButtonText}
          />
        )}
      </View>
    );
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <AppSafeView style={styles.container}>
          {/* Fixed Header */}
          <View style={styles.header}>
            <AppText text="Connections" textStyle={styles.headerTitle} />
            <Pressable onPress={() => defenceBottomSheetRef.current?.snapToIndex(0)}>
            <Image source={require('../assets/images/defence.png')} style={styles.icon} />
            </Pressable>
          </View>

          {/* Fixed Conversations Section Header */}
          <View style={styles.conversationHeader}>
            <ConversationIcon width={24} height={24} color={COLORS.black} />
            <AppText text="Conversations" textStyle={styles.sectionTitle} />
            <Image source={require('../assets/images/freechat.png')} style={[styles.icon,{width:70}]} />
          </View>

          {/* Scrollable Conversations List */}
          <FlatList
            data={acceptedProposalById}
            renderItem={({ item }) => renderConversationItem(item)}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.conversationsList}
            style={styles.flatListContainer}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <AppText text="Send or accept interests to start. Once there’s a match, your connections will appear here." textStyle={styles.emptyText} />
              </View>
            )}
          />
        </AppSafeView>
      )}
      <ProfileBottomSheet
        bottomSheetRef={profileBottomSheetRef}
        isButtonVisible={false}
        user={user}
        currentUserPackage={packageByUserId}
        report={false}
      />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <Loader />
        </View>
      )}
      <DefenceBottomSheet
        bottomSheetRef={defenceBottomSheetRef}
      />
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingVertical: Size16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: fontSize28,
    fontWeight: '800',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BLACK,
  },
  icon: {
    width: Size25 * 1.5,
    height: Size25 * 1.5,
    resizeMode: 'contain',
  },
  conversationsSection: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size8,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  conversationsList: {
    gap: Size12,
  },
  flatListContainer: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Size14,
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
  },
  profileImage: {
    width: Size50,
    height: Size50,
    borderRadius: Size25,
    right: Size10 * 0.5,
  },
  conversationContent: {
    gap: Size4,
    width: '75%',
    left:10
  },
  userName: {
    fontSize: fontSize20,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  messageText: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    width: '95%',
  },
  newButton: {
    backgroundColor: '#F7F3FF',
    borderRadius: Size25,
    paddingHorizontal: Size16,
    paddingVertical: Size8,
    borderWidth: 1,
    borderColor: COLORS.violet,
    right: Size10 * 2,
  },
  newButtonText: {
    fontSize: fontSize14,
    color: COLORS.violet,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  timeContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    bottom: Size10,
  },
  timeText: {
    color: '#A0A0A0',
    fontSize: fontSize12,
  },
  notificationChip: {
    position: 'absolute',
    top: Size25,
    left: Size25,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.borderLight4,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    height: SIZES.height * 0.7,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize24,
    color: COLORS.disabledText,
    textAlign: 'center',
  },
});
