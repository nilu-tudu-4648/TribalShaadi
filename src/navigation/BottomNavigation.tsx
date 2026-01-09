import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import AccountScreen from '../screen/AccountScreen';
import ChatScreen from '../screen/ChatScreen';
import InterestScreen from '../screen/InterestScreen';
import {
  HomeIcon,
  HeartIcon,
  ChatIcon,
  AccountIcon,
} from '../components/svg/SvgIcons';
import { COLORS } from '../constants/AppColors';
import { fontSize12, Size20, Size25 } from '../constants/Sizes';
import { View } from 'react-native';
import NotifiNumberChip from '../components/chips/NotifiNumberChip';
import { ROUTES } from '../constants/data';
import { useDispatch, useSelector } from 'react-redux';
import { setHomeTabRefr } from '../store/reducers/userReducer';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (
  route: any,
  focused: boolean,
  proposalsGotByMe: number,
  unreadChatHistory: number,
) => {
  const iconColor = focused ? COLORS.white : COLORS.navBarInactive;
  switch (route.name) {
    case ROUTES.HOME_TAB:
      return <HomeIcon color={iconColor} width={Size25} height={Size25} />;
    case ROUTES.INTEREST:
      return (
        <View>
          <HeartIcon color={iconColor} width={Size25} height={Size20} />
          {proposalsGotByMe > 0 && (
            <NotifiNumberChip number={proposalsGotByMe} />
          )}
        </View>
      );
    case ROUTES.CHAT:
      return (
        <View>
          <ChatIcon color={iconColor} width={Size20} height={Size20} />
          {unreadChatHistory > 0 && (
            <NotifiNumberChip number={unreadChatHistory} />
          )}
        </View>
      );
    case ROUTES.ACCOUNT_TAB:
      return <AccountIcon color={iconColor} width={Size25} height={Size20} />;
    default:
      return null;
  }
};

function BottomNavigation() {
  const { proposalsGotByMe, homeTabRefr } = useSelector(
    (state: any) => state.entities.userReducer,
  );
  const { unreadChatHistory, newUserNumber } = useSelector((state: any) => state.entities.chatReducer);

  const dispatch = useDispatch();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color: _color, size: _size }) =>
          getTabBarIcon(route, focused, proposalsGotByMe.length, unreadChatHistory.length+newUserNumber),
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.navBarInactive,
        headerShown: false,
        tabBarLabelStyle: { fontSize: fontSize12 },
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          backgroundColor: COLORS.black,
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        listeners={() => ({
          tabPress: () => {
            dispatch(setHomeTabRefr(!homeTabRefr));
          },
        })}
        component={HomeScreen}
      />
      <Tab.Screen name={ROUTES.INTEREST} component={InterestScreen} />
      <Tab.Screen name={ROUTES.CHAT} component={ChatScreen} />
      <Tab.Screen name={ROUTES.ACCOUNT_TAB} component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
