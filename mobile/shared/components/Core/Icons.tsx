import React from 'react';
import {
    Ionicons,
    Feather,
    FontAwesome5,
    FontAwesome,
    AntDesign,
    MaterialIcons,
    SimpleLineIcons,
    MaterialCommunityIcons,
    Octicons,
} from '@expo/vector-icons';
import { TextProps } from 'react-native';
import { Colours, Sizes } from '../../styles/Styles';

const DEFAULT_PROPS = {
    size: Sizes.ICON_SIZE_MD,
    color: Colours.DARK,
    suppressHighlighting: true,
};

interface IconProps extends TextProps {
    color?: string;
    size?: number;
    iconStyle?: any;
    backgroundColor?: string;
    borderRadius?: number;
    onPress?: (params: any) => void;
}

export const GearsIcon = (props: IconProps) => <Ionicons name="settings" {...DEFAULT_PROPS} {...props} />;
export const BackIcon = (props: IconProps) => <Ionicons name="chevron-back" {...DEFAULT_PROPS} {...props} />;
export const ForwardIcon = (props: IconProps) => <Ionicons name="chevron-forward" {...DEFAULT_PROPS} {...props} />;
export const CloseIcon = (props: IconProps) => <Ionicons name="close" {...DEFAULT_PROPS} {...props} />;
export const CheckmarkCircleIcon = (props: IconProps) => <Ionicons name="checkmark-circle" {...DEFAULT_PROPS} {...props} />;
export const PlusIcon = (props: IconProps) => <Ionicons name="add" {...DEFAULT_PROPS} {...props} />;
export const SearchIcon = (props: IconProps) => <Ionicons name="search" {...DEFAULT_PROPS} {...props} />;
export const MoreVerticalIcon = (props: IconProps) => <Feather name="more-vertical" {...DEFAULT_PROPS} {...props} />;
export const MoreHorizontalIcon = (props: IconProps) => <Feather name="more-horizontal" {...DEFAULT_PROPS} {...props} />;
export const InboxIcon = (props: IconProps) => <FontAwesome5 name="inbox" {...DEFAULT_PROPS} {...props} />;
export const RestaurantIcon = (props: IconProps) => <Ionicons name="restaurant" {...DEFAULT_PROPS} {...props} />;
export const RocketIcon = (props: IconProps) => <AntDesign name="rocket1" {...DEFAULT_PROPS} {...props} />;
export const IdCardIcon = (props: IconProps) => <AntDesign name="idcard" {...DEFAULT_PROPS} {...props} />;
export const LogoutIcon = (props: IconProps) => <MaterialIcons name="logout" {...DEFAULT_PROPS} {...props} />;
export const StarIcon = (props: IconProps) => <FontAwesome name="star" {...DEFAULT_PROPS} {...props} />;
export const StarOIcon = (props: IconProps) => <FontAwesome name="star-o" {...DEFAULT_PROPS} {...props} />;
export const BellIcon = (props: IconProps) => <FontAwesome name="bell" {...DEFAULT_PROPS} {...props} />;
export const StarHalfIcon = (props: IconProps) => <FontAwesome name="star-half-full" {...DEFAULT_PROPS} {...props} />;
export const DeliveryIcon = (props: IconProps) => <FontAwesome5 name="truck" {...DEFAULT_PROPS} {...props} />;
export const TakeoutIcon = (props: IconProps) => <FontAwesome5 name="walking" {...DEFAULT_PROPS} {...props} />;
export const DineInIcon = (props: IconProps) => <FontAwesome5 name="utensils" {...DEFAULT_PROPS} {...props} />;
export const ReservableIcon = (props: IconProps) => <FontAwesome5 name="calendar-check" {...DEFAULT_PROPS} {...props} />;
export const HeartIcon = (props: IconProps) => <AntDesign name="heart" {...DEFAULT_PROPS} {...props} />;
export const HeartOIcon = (props: IconProps) => <AntDesign name="hearto" {...DEFAULT_PROPS} {...props} />;
export const ChatIcon = (props: IconProps) => <Ionicons name="chatbox-ellipses" {...DEFAULT_PROPS} {...props} />;
export const ChatOIcon = (props: IconProps) => <Ionicons name="chatbox-ellipses-outline" {...DEFAULT_PROPS} {...props} />;
export const CalendarIcon = (props: IconProps) => <AntDesign name="calendar" {...DEFAULT_PROPS} {...props} />;
export const ClockIconO = (props: IconProps) => <AntDesign name="clockcircleo" {...DEFAULT_PROPS} {...props} />;
export const MapIcon = (props: IconProps) => <Ionicons name="map" {...DEFAULT_PROPS} {...props} />;
export const MapOIcon = (props: IconProps) => <Ionicons name="map-outline" {...DEFAULT_PROPS} {...props} />;
export const ProfileIcon = (props: IconProps) => <Ionicons name="person" {...DEFAULT_PROPS} {...props} />;
export const FeedbackIcon = (props: IconProps) => <Ionicons name="chatbubble-ellipses" {...DEFAULT_PROPS} {...props} />;
export const ProfileOIcon = (props: IconProps) => <Ionicons name="person-outline" {...DEFAULT_PROPS} {...props} />;
export const EditIcon = (props: IconProps) => <AntDesign name="edit" {...DEFAULT_PROPS} {...props} />;
export const PhoneIcon = (props: IconProps) => <FontAwesome name="phone" {...DEFAULT_PROPS} {...props} />;
export const InfoIcon = (props: IconProps) => <Ionicons name="information-circle-outline" {...DEFAULT_PROPS} {...props} />;
export const CreateIcon = (props: IconProps) => <Ionicons name="create-outline" {...DEFAULT_PROPS} {...props} />;
export const PersonAddIcon = (props: IconProps) => <Ionicons name="person-add" {...DEFAULT_PROPS} {...props} />;
export const LeaveIcon = (props: IconProps) => <Ionicons name="exit-outline" {...DEFAULT_PROPS} {...props} />;
export const AliwangwangIcon = (props: IconProps) => <AntDesign name="aliwangwang" {...DEFAULT_PROPS} {...props} />;
export const AppleLogoIcon = (props: IconProps) => <AntDesign name="apple1" {...DEFAULT_PROPS} {...props} />;
export const GoogleLogo = (props: IconProps) => <AntDesign name="google" {...DEFAULT_PROPS} {...props} />;
export const GroupIcon = (props: IconProps) => <MaterialIcons name="group" {...DEFAULT_PROPS} {...props} />;
export const LockIcon = (props: IconProps) => <SimpleLineIcons name="lock" {...DEFAULT_PROPS} {...props} />;
export const MapPinIcon = (props: IconProps) => <MaterialCommunityIcons name="map-marker" {...DEFAULT_PROPS} {...props} />;
export const InviteUserIcon = (props: IconProps) => <MaterialIcons name="person-add" {...DEFAULT_PROPS} {...props} />;
export const CompassIcon = (props: IconProps) => <Ionicons name="compass" {...DEFAULT_PROPS} {...props} />;
export const CompassOIcon = (props: IconProps) => <Ionicons name="compass-outline" {...DEFAULT_PROPS} {...props} />;
export const TwitterIcon = (props: IconProps) => <AntDesign name="twitter" {...DEFAULT_PROPS} {...props} />;
export const FacebookIcon = (props: IconProps) => <AntDesign name="facebook-square" {...DEFAULT_PROPS} {...props} />;
export const InstagramIcon = (props: IconProps) => <AntDesign name="instagram" {...DEFAULT_PROPS} {...props} />;
export const YoutubeIcon = (props: IconProps) => <AntDesign name="youtube" {...DEFAULT_PROPS} {...props} />;
export const LinkedinIcon = (props: IconProps) => <AntDesign name="linkedin-square" {...DEFAULT_PROPS} {...props} />;
export const GithubIcon = (props: IconProps) => <AntDesign name="github" {...DEFAULT_PROPS} {...props} />;
export const RulerIcon = (props: IconProps) => <MaterialCommunityIcons name="ruler" {...DEFAULT_PROPS} {...props} />;
export const WineOIcon = (props: IconProps) => <Ionicons name="wine-outline" {...DEFAULT_PROPS} {...props} />;
export const BeerOIcon = (props: IconProps) => <Ionicons name="beer-outline" {...DEFAULT_PROPS} {...props} />;
export const DumbbellIcon = (props: IconProps) => <FontAwesome5 name="dumbbell" {...DEFAULT_PROPS} {...props} />;
export const HumanIcon = (props: IconProps) => <MaterialCommunityIcons name="human" {...DEFAULT_PROPS} {...props} />;
export const EyeIcon = (props: IconProps) => <Ionicons name="eye" {...DEFAULT_PROPS} {...props} />;
export const CakeIcon = (props: IconProps) => <MaterialIcons name="cake" {...DEFAULT_PROPS} {...props} />;
export const FlagIcon = (props: IconProps) => <MaterialCommunityIcons name="flag" {...DEFAULT_PROPS} {...props} />;
export const WeedIcon = (props: IconProps) => <MaterialCommunityIcons name="cannabis" {...DEFAULT_PROPS} {...props} />;
export const PrayerIcon = (props: IconProps) => <MaterialCommunityIcons name="hands-pray" {...DEFAULT_PROPS} {...props} />;
export const WorkIcon = (props: IconProps) => <MaterialCommunityIcons name="briefcase" {...DEFAULT_PROPS} {...props} />;
export const EducationIcon = (props: IconProps) => <Ionicons name="school" {...DEFAULT_PROPS} {...props} />;
export const SmokingIcon = (props: IconProps) => <MaterialCommunityIcons name="smoking" {...DEFAULT_PROPS} {...props} />;
export const ArrowRightIcon = (props: IconProps) => <AntDesign name="arrowright" {...DEFAULT_PROPS} {...props} />;
export const GPSIcon = (props: IconProps) => <MaterialIcons name="gps-fixed" {...DEFAULT_PROPS} {...props} />;
export const WarningIcon = (props: IconProps) => <FontAwesome name="warning" {...DEFAULT_PROPS} {...props} />;
export const ExclamationIcon = (props: IconProps) => <AntDesign name="exclamationcircle" {...DEFAULT_PROPS} {...props} />;
export const FestivalIcon = (props: IconProps) => <MaterialIcons name="festival" {...DEFAULT_PROPS} {...props} />;
export const DeleteIcon = (props: IconProps) => <AntDesign name="delete" {...DEFAULT_PROPS} {...props} />;

// INTERESTS
export const RunningIcon = (props: IconProps) => <FontAwesome5 name="running" {...DEFAULT_PROPS} {...props} />;
export const YogaIcon = (props: IconProps) => <FontAwesome5 name="spa" {...DEFAULT_PROPS} {...props} />;
export const PilatesIcon = (props: IconProps) => <FontAwesome5 name="swimmer" {...DEFAULT_PROPS} {...props} />;
export const HikingIcon = (props: IconProps) => <FontAwesome5 name="hiking" {...DEFAULT_PROPS} {...props} />;
export const GamingIcon = (props: IconProps) => <FontAwesome5 name="gamepad" {...DEFAULT_PROPS} {...props} />;
export const TravelingIcon = (props: IconProps) => <FontAwesome5 name="plane" {...DEFAULT_PROPS} {...props} />;
export const SportsIcon = (props: IconProps) => <FontAwesome5 name="football-ball" {...DEFAULT_PROPS} {...props} />;
export const BooksIcon = (props: IconProps) => <FontAwesome5 name="book" {...DEFAULT_PROPS} {...props} />;
export const FoodIcon = (props: IconProps) => <FontAwesome5 name="hamburger" {...DEFAULT_PROPS} {...props} />;
export const ArtIcon = (props: IconProps) => <FontAwesome5 name="paint-brush" {...DEFAULT_PROPS} {...props} />;
export const TechnologyIcon = (props: IconProps) => <FontAwesome5 name="laptop" {...DEFAULT_PROPS} {...props} />;
export const FashionIcon = (props: IconProps) => <FontAwesome5 name="tshirt" {...DEFAULT_PROPS} {...props} />;
export const PhotographyIcon = (props: IconProps) => <FontAwesome5 name="camera-retro" {...DEFAULT_PROPS} {...props} />;
export const CarIcon = (props: IconProps) => <FontAwesome5 name="car" {...DEFAULT_PROPS} {...props} />;
export const MeditationIcon = (props: IconProps) => <MaterialCommunityIcons name="meditation" {...DEFAULT_PROPS} {...props} />;
export const PoliticsIcon = (props: IconProps) => <FontAwesome5 name="landmark" {...DEFAULT_PROPS} {...props} />;
export const PetsIcon = (props: IconProps) => <FontAwesome5 name="dog" {...DEFAULT_PROPS} {...props} />;
export const HistoryIcon = (props: IconProps) => <FontAwesome5 name="monument" {...DEFAULT_PROPS} {...props} />;
export const CookingIcon = (props: IconProps) => <FontAwesome5 name="utensils" {...DEFAULT_PROPS} {...props} />;
export const ScienceIcon = (props: IconProps) => <FontAwesome5 name="flask" {...DEFAULT_PROPS} {...props} />;

// ZODIAC ICONS
export const AriesIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-aries" {...DEFAULT_PROPS} {...props} />;
export const TaurusIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-taurus" {...DEFAULT_PROPS} {...props} />;
export const GeminiIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-gemini" {...DEFAULT_PROPS} {...props} />;
export const CancerIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-cancer" {...DEFAULT_PROPS} {...props} />;
export const LeoIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-leo" {...DEFAULT_PROPS} {...props} />;
export const VirgoIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-virgo" {...DEFAULT_PROPS} {...props} />;
export const LibraIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-libra" {...DEFAULT_PROPS} {...props} />;
export const ScorpioIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-scorpio" {...DEFAULT_PROPS} {...props} />;
export const SagitariusIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-sagittarius" {...DEFAULT_PROPS} {...props} />;
export const CapricornIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-capricorn" {...DEFAULT_PROPS} {...props} />;
export const AquariusIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-aquarius" {...DEFAULT_PROPS} {...props} />;
export const PiscesIcon = (props: IconProps) => <MaterialCommunityIcons name="zodiac-pisces" {...DEFAULT_PROPS} {...props} />;
export const ZodiacIcon = (props: IconProps) => <Octicons name="share-android" {...DEFAULT_PROPS} {...props} />;

export const PrivacyIcon = (props: IconProps) => <Ionicons name="shield-checkmark" {...DEFAULT_PROPS} {...props} />;
export const TermsOfUseIcon = (props: IconProps) => <Ionicons name="document-text" {...DEFAULT_PROPS} {...props} />;
export const SupportIcon = (props: IconProps) => <Ionicons name="help-circle" {...DEFAULT_PROPS} {...props} />;
