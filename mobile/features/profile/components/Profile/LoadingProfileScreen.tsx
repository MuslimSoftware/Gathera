import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import { TopBar, Info, Bio, ActionButtons, Interests } from "../..";

const LoadingProfileScreen = ({}) => {
    return (
        <View style={styles.pageWrapper}>
            <TopBar loading />
            <ScrollView
                style={styles.contentWrapper}
                contentContainerStyle={styles.contentWrapperStyle}
            >
                <View style={styles.headerSection}>
                    <View style={styles.headerInfo}>
                        <Info loading />
                        <Bio loading />
                    </View>
                    <Interests loading />
                    <ActionButtons loading />
                </View>
            </ScrollView>
        </View>
    );
};

export default LoadingProfileScreen;

const styles = StyleSheet.create({
    pageWrapper: {
        position: "absolute",
        zIndex: 0,
        width: "100%",
        height: "100%",
        alignItems: "center",
    },
    headerSection: {
        width: "90%",
        marginBottom: 25,
        gap: 10,
    },
    contentWrapper: { width: "100%" },
    contentWrapperStyle: {
        alignItems: "center",
    },
    headerInfo: {},
});
