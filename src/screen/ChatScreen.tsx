import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Pressable,
  // RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
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
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import { ConversationIcon } from '../components/svg/SvgIcons2';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import NotifiNumberChip from '../components/chips/NotifiNumberChip';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAcceptedProposalByIdUrl,
  getChatHistoryByUserId,
  imageUrl,
  updateProposalIsNewApi,
  updateProposalIsNewUrl,
} from '../constants/functions';

import {
  getAcceptedProposalByIdApi,
  setUnreadChatHistory,
} from '../store/reducers/chatReducer';
import AppChip2 from '../components/chips/AppChip2';
import Loader from '../components/loader/Loader';

const ChatScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const { loader, acceptedProposalById, unreadChatHistory } = useSelector(
    (state: any) => state.entities.chatReducer,
  );
  const dispatch = useDispatch();
  // const [refreshing, setRefreshing] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      dispatch(
        getAcceptedProposalByIdApi(`${getAcceptedProposalByIdUrl}/${user?.id}`),
      );
      const chatHistory = await getChatHistoryByUserId(user.id);
      const filteredChat = chatHistory.filter((chat: any) => {
        return chat.userId !== user.id && chat.isRead === 0;
      });
      dispatch(setUnreadChatHistory(filteredChat));
    } catch (error) {
      console.log('error', error);
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   fetchData();
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 1000);
  // }, [fetchData]);

  const acceptFriendRequest = async (item: any) => {
    try {
      if (item.isNewStatus === 1) {
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
      console.log('error', error);
    }
  };

  const renderConversationItem = (item: any) => {
    // Memoize filtered unread chats for this friendId
    const unreadChatsForFriend = unreadChatHistory.filter(
      (chat: any) => chat.userId === item.friendId && chat.isRead === 0,
    );
    const unreadCount = unreadChatsForFriend.length;
    const latestUnreadChat = unreadChatsForFriend[0];

    // Determine the time to display
    const displayTime = latestUnreadChat?.created_at
      ? new Date(latestUnreadChat.created_at)
      : new Date(item.friendsSince);

    return (
      <Pressable
        key={item.id}
        style={styles.conversationItem}
        onPress={() => acceptFriendRequest(item)}
      >
        <Image
          source={{ uri: imageUrl + item.image }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.conversationContent}>
          <AppText
            text={`${item.firstName} ${item.lastName ?? ''}`}
            textStyle={styles.userName}
          />
          <AppText
            text={item.isNewStatus !== 1 ? item.message : 'Send a message'}
            textStyle={styles.messageText}
          />
        </View>
        {item.isNewStatus !== 1 ? (
          <View style={styles.timeContainer}>
            <AppText
              text={displayTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
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
      </Pressable>
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
          </View>

          {/* Fixed Conversations Section Header */}
          <View style={styles.conversationHeader}>
            <ConversationIcon width={24} height={24} color={COLORS.black} />
            <AppText text="Conversations" textStyle={styles.sectionTitle} />
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
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
          />
        </AppSafeView>
      )}
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
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
    left: Size12,
    gap: Size4,
  },
  userName: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  messageText: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
  },
  newButton: {
    backgroundColor: '#F7F3FF',
    borderRadius: Size25,
    paddingHorizontal: Size16,
    paddingVertical: Size8,
    borderWidth: 1,
    borderColor: COLORS.violet,
  },
  newButtonText: {
    fontSize: fontSize14,
    color: COLORS.violet,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  timeContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    bottom: Size10,
  },
  timeText: {
    color: '#A0A0A0',
    fontSize: fontSize14,
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
});
