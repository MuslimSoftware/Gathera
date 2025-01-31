import React from 'react';
import { StyleSheet, View } from 'react-native';
import Checkbox from 'expo-checkbox';
import { UserListItem } from './UserListItem';
import { Colours, Sizes } from '../../styles/Styles';
interface SelectableUserListItemProps {
    profile: any;
    onSelected: () => void;
}

export const SelectableUserListItem = ({ profile, onSelected }: SelectableUserListItemProps) => {
    const [isSelected, setIsSelected] = React.useState(false);

    const handlePress = () => {
        onSelected();
        setIsSelected(!isSelected);
    };

    // checkbox react native
    return (
        <UserListItem profile={profile} onPress={handlePress} disableNavigation>
            <View style={styles.checkboxWrapper}>
                <Checkbox
                    style={styles.checkbox}
                    value={isSelected}
                    onValueChange={(value: boolean) => {
                        onSelected();
                        setIsSelected(value);
                    }}
                    color={isSelected ? Colours.PRIMARY : Colours.GRAY}
                />
            </View>
        </UserListItem>
    );
};

const styles = StyleSheet.create({
    checkboxWrapper: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkbox: {
        width: 25,
        height: 25,
        borderWidth: 1.5,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
    },
});
