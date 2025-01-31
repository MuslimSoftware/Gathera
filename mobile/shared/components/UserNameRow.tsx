import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../styles/Styles';

interface UserNameRowProps {
    users: any[];
}

const UserNameRow = ({ users }: UserNameRowProps) => {
    return (
        <View style={styles.selectedUsers}>
            {users.map((item: any) => (
                <View key={item._id} style={styles.pill}>
                    <Text style={styles.nameText} numberOfLines={1}>
                        {item.display_name}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export default UserNameRow;

const styles = StyleSheet.create({
    pill: {
        backgroundColor: Colours.PRIMARY_TRANSPARENT_75,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxWidth: '50%',
    },
    nameText: {
        color: Colours.WHITE,
        fontWeight: '500',
    },
    selectedUsers: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
});
