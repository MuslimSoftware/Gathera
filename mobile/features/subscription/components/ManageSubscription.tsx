import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { useRevenueCat } from '../../../shared/hooks/useRevenueCat';
import { Loading } from '../../../shared/components/Core/Loading';
import { openInAppBrowser } from '../../../shared/utils/uiHelper';
import { TextButton } from '../../../shared/components/Buttons/TextButton';
import { Colours, Sizes } from '../../../shared/styles/Styles';

export const ManageSubscription = () => {
    const [customerInfo, setCustomerInfo] = React.useState<any>();
    const { getSubscriptionInfo } = useRevenueCat();

    useEffect(() => {
        getSubscriptionInfo().then((info: any) => {
            setCustomerInfo(info);
        });
    }, []);

    const error = customerInfo?.error;

    if (error) {
        return (
            <Wrapper>
                <Text>{error}</Text>
            </Wrapper>
        );
    }

    if (!customerInfo) {
        return (
            <Wrapper>
                <Loading />
            </Wrapper>
        );
    }

    const showCancelSubscriptionButton = customerInfo.managementURL !== null;

    return (
        <Wrapper>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Gathera Premium</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Subscription Status:</Text>
                    <Text style={styles.subscriptionText}>{customerInfo.activeSubscriptions.length > 0 ? 'Active' : 'Inactive'}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Expiration Date:</Text>
                    <Text style={styles.subscriptionText}>{new Date(customerInfo.latestExpirationDate).toLocaleDateString()}</Text>
                </View>
                {showCancelSubscriptionButton && (
                    <TextButton
                        containerStyle={styles.cancelButton}
                        textStyle={{ color: Colours.GRAY }}
                        onPress={() => openInAppBrowser(customerInfo.managementURL)}
                        label='Cancel Subscription'
                    />
                )}
            </View>
        </Wrapper>
    );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <HeaderPageLayout title='Manage Subscription' hasTopMargin>
            <ScrollView contentContainerStyle={styles.wrapper}>{children}</ScrollView>
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: Colours.WHITE,
        borderRadius: Sizes.BORDER_RADIUS_MD,
        padding: 20,
        elevation: 3, // Android box shadow

        // iOS box shadow
        shadowColor: Colours.BLACK,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colours.DARK,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoText: {
        fontWeight: '600',
        color: Colours.DARK,
    },
    subscriptionText: {
        color: Colours.DARK,
    },
    cancelButton: {
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        borderRadius: Sizes.BORDER_RADIUS_MD,
    },
});
