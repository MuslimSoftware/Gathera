import { Text } from 'react-native';
import React from 'react';
import { ProfilePicture } from '../../../../shared/components/MainPictures/ProfilePicture';
import { SubSection } from '../SubSection';
import { UserBorder } from '../../../../gathera-lib/enums/user';
import { getAuthContextValues } from '../../../../shared/context/AuthContext';
import { SubBoldText } from '../SubBoldText';

export const SubBorderFeature = ({ border }: { border: UserBorder }) => {
    const {
        user: { avatar_uri: avatarUri },
    } = getAuthContextValues();
    return (
        <SubSection
            headerText='Unlock Profile Borders'
            subHeaderText={
                <Text>
                    Transform your profile and stand out effortlessly with unlimited access to our exclusive collection of{' '}
                    <SubBoldText>animated borders</SubBoldText>!
                </Text>
            }
        >
            <ProfilePicture uri={avatarUri} size='xxlarge' border={border} />
        </SubSection>
    );
};
