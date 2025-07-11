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

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route: any, focused: boolean) => {
  const iconColor = focused ? COLORS.white : COLORS.navBarInactive;
  switch (route.name) {
    case 'Home':
      return <HomeIcon color={iconColor} width={Size25} height={Size25} />;
    case 'Interests':
      return <HeartIcon color={iconColor} width={Size25} height={Size20} />;
    case 'Chat':
      return <ChatIcon color={iconColor} width={Size20} height={Size20} />;
    case 'Account':
      return <AccountIcon color={iconColor} width={Size25} height={Size20} />;
    default:
      return null;
  }
};

function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color: _color, size: _size }) =>
          getTabBarIcon(route, focused),
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Interests" component={InterestScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
