import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Backdrop } from '../../Sheets/Backdrop';
import { LockIcon } from '../Icons';
import { GetPremiumButton } from './GetPremiumButton';
import { Sizes, Colours } from '../../../styles/Styles';

export const LockedOverlay = () => {
    return (
        <>
            <View style={styles.upsellContainer}>
                <View style={styles.upsellCard}>
                    <LockIcon size={50} />
                    <View style={styles.upsellRight}>
                        <Text style={styles.upsellText}>
                            Get <Text style={styles.boldText}>Gathera Premium </Text>
                            to unlock this feature
                        </Text>
                        <GetPremiumButton />
                    </View>
                </View>
            </View>
            <Backdrop />
        </>
    );
};

const styles = StyleSheet.create({
    upsellContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    upsellCard: {
        marginTop: -200,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
        padding: 20,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        backgroundColor: Colours.WHITE,
        borderWidth: 1,
        borderColor: Colours.GRAY_LIGHT,
        ...Platform.select({
            ios: {
                shadowColor: Colours.BLACK,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    upsellRight: { gap: 10, width: '75%' },
    upsellText: { fontSize: Sizes.FONT_SIZE_MD, textAlign: 'center' },
    boldText: {
        fontWeight: 'bold',
        color: Colours.PREMIUM,
    },
});
