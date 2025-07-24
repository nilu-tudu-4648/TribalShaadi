import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, { useEffect } from 'react';
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
  Size4,
  Size50,
  Size25,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import { ConversationIcon } from '../components/svg/SvgIcons2';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import NotifiNumberChip from '../components/chips/NotifiNumberChip';
import { useDispatch, useSelector } from 'react-redux';
import {
  friendRequestAcceptUrl,
  getAcceptedProposalByIdUrl,
  getAllChatHistoryByUserIdUrl,
  getUserChatListUrl,
  imageUrl,
} from '../constants/functions';
import {
  getAllChatHistoryByUserIdApi,
  getUserChatListApi,
} from '../store/reducers/chatReducer';
import {
  friendRequestAcceptApi,
  getAcceptedProposalByIdApi,
} from '../store/reducers/chatReducer';

const ChatScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const {
    allChatHistoryByUserId,
    acceptedProposalById,
  } = useSelector((state: any) => state.entities.chatReducer);
  const dispatch = useDispatch();
  console.log('allChatHistoryByUserId', allChatHistoryByUserId);
  console.log('acceptedProposalById', acceptedProposalById);
  useEffect(() => {
    dispatch(
      getAcceptedProposalByIdApi(`${getAcceptedProposalByIdUrl}/${user.id}`),
    );
    dispatch(
      getUserChatListApi(getUserChatListUrl, {
        startIndex: '1',
        fetchRecord: '10',
      }),
    );
    dispatch(
      getAllChatHistoryByUserIdApi(getAllChatHistoryByUserIdUrl, {
        userId: user.id,
      }),
    );
  }, [dispatch, user?.id]);
  const acceptFriendRequest = (item: any) => {
    try {
      dispatch(
        friendRequestAcceptApi(friendRequestAcceptUrl, {
          chatId: item.chatId,
        }),
      );
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

  const renderConversationItem = (item: any) => (
    <TouchableOpacity
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
          text={item.firstName + ' ' + `${item.lastName ?? ''}`}
          textStyle={styles.userName}
        />
        <AppText text={item.message} textStyle={styles.messageText} />
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
          bottom: Size4,
          gap: Size4,
        }}
      >
        <AppText
          text={'10:00'}
          textStyle={{ color: COLORS.textSecondary, fontSize: fontSize14 }}
        />
        <NotifiNumberChip number={1} style={{ position: 'relative' }} />
      </View>
    </TouchableOpacity>
  );

  return (
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
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: COLORS.borderLight4 }} />
        )}
        contentContainerStyle={styles.conversationsList}
        style={styles.flatListContainer}
      />
    </AppSafeView>
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
  },
  userName: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  messageText: {
    fontSize: fontSize14,
    color: COLORS.textGrey,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
  },
  newButton: {
    backgroundColor: COLORS.red,
  },
  newButtonText: {
    fontSize: fontSize14,
    color: COLORS.violet,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
});
