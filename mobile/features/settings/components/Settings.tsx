import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import {
    BellIcon,
    FeedbackIcon,
    LogoutIcon,
    PrivacyIcon,
    ProfileIcon,
    StarIcon,
    SupportIcon,
    TermsOfUseIcon,
} from '../../../shared/components/Core/Icons';
import ListItemButton from '../../../shared/components/Buttons/ListItemButton';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { SubscriptionType } from '../../../gathera-lib/enums/user';
import { openContactInAppBrowser, openPrivacyInAppBrowser, openTermsInAppBrowser } from '../../../shared/utils/gatheraWebsite';

export const Settings = () => {
    const {
        user: { subscription },
        logoutAsync,
    } = getAuthContextValues();
    const { navigateToScreen } = useNavigate();

    return (
        <HeaderPageLayout title="Settings" hasTopMargin>
            <ScrollView contentContainerStyle={styles.listContent}>
                {subscription === SubscriptionType.FREE && (
                    <View style={styles.section}>
                        <Text style={styles.headerText}>Upgrade</Text>
                        <View style={styles.itemsWrapper}>
                            <ListItemButton
                                labelText="Get Gathera Premium"
                                icon={<StarIcon color={Colours.PRIMARY} />}
                                onPress={() => navigateToScreen('Subscription')}
                            />
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.headerText}>Manage</Text>
                    <View style={styles.itemsWrapper}>
                        {subscription !== SubscriptionType.FREE && (
                            <ListItemButton labelText="Subscription" icon={<StarIcon />} onPress={() => navigateToScreen('ManageSubscription')} />
                        )}
                        <ListItemButton labelText="Notifications" icon={<BellIcon />} onPress={() => navigateToScreen('NotificationsSettings')} />
                        <ListItemButton labelText="Account" icon={<ProfileIcon />} onPress={() => navigateToScreen('Account')} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.headerText}>Support</Text>
                    <View style={styles.itemsWrapper}>
                        <ListItemButton labelText="Privacy Policy" icon={<PrivacyIcon />} onPress={openPrivacyInAppBrowser} />
                        <ListItemButton labelText="Terms of Use" icon={<TermsOfUseIcon />} onPress={openTermsInAppBrowser} />
                        <ListItemButton labelText="Contact Support" icon={<SupportIcon />} onPress={openContactInAppBrowser} />
                        <ListItemButton labelText="Feedback" icon={<FeedbackIcon />} onPress={() => navigateToScreen('Feedback')} />
                    </View>
                </View>

                <ListItemButton
                    labelText="Sign Out"
                    onPress={logoutAsync}
                    icon={<LogoutIcon color={Colours.RED} />}
                    labelStyle={styles.signOutText}
                    hideArrow
                />
            </ScrollView>
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: '600',

        marginHorizontal: 15,
    },
    listContent: {
        paddingVertical: 10,
        gap: 15,
    },
    itemsWrapper: {
        gap: 5,
    },
    section: {
        gap: 5,
    },
    signOutText: {
        color: Colours.RED,
    },
});
