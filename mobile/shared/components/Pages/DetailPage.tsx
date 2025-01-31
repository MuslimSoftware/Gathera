import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { HeaderPageLayout } from '../../layouts/HeaderPageLayout';
import { StatusBar } from 'expo-status-bar';
import { Colours, Sizes } from '../../styles/Styles';
import { copyToClipboard, getNavigationBarBottomPadding, openInAppBrowser } from '../../utils/uiHelper';
import { CheckmarkCircleIcon, CloseIcon } from '../Core/Icons';
import { DetailPageItem } from './DetailPageItem';
import { LoadingSkeleton } from '../Core/LoadingSkeleton';

interface DetailPageProps {
    title: string;
    details: {
        Address: string;
        Phone: string;
        Website: string;
        'Google Maps': string;
        Services: any;
        'Opening Hours'?: any;
    };
}

export const DetailPage = ({ title, details }: DetailPageProps) => {
    const handleDetailPress = async (name: any, value: any) => {
        switch (name) {
            case 'Website':
                openInAppBrowser(value);
                break;
            case 'Google Maps':
                Linking.openURL(value);
                break;
            case 'Phone':
                const phoneNumber = value.replace(/\D/g, '');
                Linking.openURL(`tel:${phoneNumber}`);
                break;
            case 'Email':
                Linking.openURL(`mailto:${value}`);
                break;
            case 'Address':
                copyToClipboard(value);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <StatusBar style='dark' />
            <HeaderPageLayout hasTopMargin title={title}>
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: getNavigationBarBottomPadding(),
                    }}
                >
                    {details['Address'] && (
                        <DetailPageItem name='Address'>
                            <Text
                                style={styles.valueText}
                                numberOfLines={2}
                                onPress={() => handleDetailPress('Address', details['Address'])}
                                onLongPress={() => copyToClipboard(details['Address'])}
                            >
                                {details['Address']}
                            </Text>
                        </DetailPageItem>
                    )}
                    {details['Phone'] && (
                        <DetailPageItem name='Phone'>
                            <Text
                                style={[styles.valueText, { color: Colours.CLICKABLE_TEXT }]}
                                numberOfLines={2}
                                onPress={() => handleDetailPress('Phone', details['Phone'])}
                                onLongPress={() => copyToClipboard(details['Phone'])}
                            >
                                {details['Phone']}
                            </Text>
                        </DetailPageItem>
                    )}
                    {details['Website'] && (
                        <DetailPageItem name='Website'>
                            <Text
                                style={[styles.valueText, { color: Colours.CLICKABLE_TEXT }]}
                                numberOfLines={2}
                                onPress={() => handleDetailPress('Website', details['Website'])}
                                onLongPress={() => copyToClipboard(details['Website'])}
                            >
                                {details['Website']}
                            </Text>
                        </DetailPageItem>
                    )}
                    {details['Google Maps'] && (
                        <DetailPageItem name='Google Maps'>
                            <Text
                                style={[styles.valueText, { color: Colours.CLICKABLE_TEXT }]}
                                numberOfLines={2}
                                onPress={() => handleDetailPress('Google Maps', details['Google Maps'])}
                                onLongPress={() => copyToClipboard(details['Google Maps'])}
                            >
                                {details['Google Maps']}
                            </Text>
                        </DetailPageItem>
                    )}
                    {details['Services'] && (
                        <DetailPageItem name='Services'>
                            <View style={styles.foodServicesWrapper}>
                                {Object.keys(details['Services']).map((key, index) => {
                                    const isEnabled: boolean = details['Services'][key as any];
                                    if (key == '_id') return null;

                                    const icon: JSX.Element = isEnabled ? (
                                        <CheckmarkCircleIcon color={Colours.GREEN} />
                                    ) : (
                                        <CloseIcon color={Colours.RED} />
                                    );

                                    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

                                    return (
                                        <View key={key} style={styles.foodServiceItem}>
                                            {icon}
                                            <Text style={styles.foodServiceValueText} numberOfLines={2}>
                                                {label}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </DetailPageItem>
                    )}
                    {details['Opening Hours'] && (
                        <DetailPageItem name='Opening Hours'>
                            <View style={styles.hoursWrapper}>
                                {Object.keys(details['Opening Hours']).map((key, index) => {
                                    const hours = details['Opening Hours'][key as any];

                                    return (
                                        <View key={key} style={styles.hourItem}>
                                            <View style={styles.hourItemTextWrapper}>
                                                <Text style={styles.hoursLabel}>{key}</Text>
                                            </View>

                                            <View style={styles.hourTimes}>
                                                <Text style={[styles.valueText, hours.open[0] === 'C' && { fontWeight: '600' }]}>{hours.open}</Text>
                                                {hours.close && (
                                                    <>
                                                        <Text style={styles.valueText}>-</Text>
                                                        <Text style={styles.valueText}>{hours.close}</Text>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </DetailPageItem>
                    )}
                </ScrollView>
            </HeaderPageLayout>
        </>
    );
};

export const DetailPageSkeleton = () => {
    return (
        <HeaderPageLayout hasTopMargin title='Details'>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 10, gap: 10 }}>
                <LoadingSkeleton style={{ width: '95%', height: 50 }} />
                <LoadingSkeleton style={{ width: '95%', height: 50 }} />
                <LoadingSkeleton style={{ width: '95%', height: 50 }} />
            </ScrollView>
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    valueText: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
    },
    foodServiceValueText: {
        fontSize: Sizes.FONT_SIZE_SM,
        fontWeight: '400',
    },
    foodServicesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        paddingVertical: 3,
    },
    foodServiceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        backgroundColor: Colours.GRAY_EXTRA_LIGHT,
    },
    hoursWrapper: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        gap: 5,
    },
    hourItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    hourItemTextWrapper: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
        borderRadius: Sizes.BORDER_RADIUS_LG,
        backgroundColor: Colours.GRAY_EXTRA_LIGHT,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    hoursLabel: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
    },
    hourTimes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
});
