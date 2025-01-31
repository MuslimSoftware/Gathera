import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { LoadingSkeleton } from '../../../../shared/components/Core/LoadingSkeleton';

interface BioProps {
    display_name?: string;
    bio?: string;
}

const ProfileBio: React.FC<BioProps> = ({ display_name, bio }) => {
    return (
        <View style={styles.profileBio}>
            <Text style={styles.nameText}>{display_name}</Text>
            {bio && bio.trim() !== '' && <Text style={styles.bioText}>{bio}</Text>}
        </View>
    );
};

export const ProfileBioSkeleton = ({ hasError }: { hasError?: boolean }) => {
    return (
        <View style={styles.profileBio}>
            <LoadingSkeleton hasError={hasError} style={{ height: 20, width: 150 }} />
            <LoadingSkeleton hasError={hasError} style={{ height: 20, width: '75%', marginTop: 3 }} />
        </View>
    );
};

export default ProfileBio;

const styles = StyleSheet.create({
    profileBio: {
        width: '100%',
        gap: 5,
        maxHeight: 200,
    },
    nameText: {
        fontSize: Sizes.FONT_SIZE_LG,
        color: Colours.DARK,
        fontWeight: '600',
    },
    bioText: {
        width: '100%',
        fontSize: 14,
        color: Colours.DARK,
    },
});
