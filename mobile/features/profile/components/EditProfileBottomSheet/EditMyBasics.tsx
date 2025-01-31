import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { EducationIcon, FlagIcon, WorkIcon } from '../../../../shared/components/Core/Icons';
import { Sizes } from '../../../../shared/styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { DetailListItem } from './DetailListItem';
import { capitalizeAllWords } from '../../../../shared/utils/uiHelper';

const DETAIL_LIST = [
    {
        icon: <FlagIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Nationality',
        screen: 'NationalityPicker',
    },
    {
        icon: <WorkIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Work',
        screen: 'WorkPicker',
    },
    {
        icon: <EducationIcon size={Sizes.ICON_SIZE_SM} />,
        label: 'Education',
        screen: 'EducationPicker',
    },
];

const getDetailValue = (profile: any, detail: string) => {
    if (Array.isArray(profile.details[detail.toLowerCase()])) return capitalizeAllWords(profile.details[detail.toLowerCase()].join(', '));
    return capitalizeAllWords(profile.details[detail.toLowerCase()] || '');
};

export const EditMyBasics = ({ profile }: any) => {
    const navigation: any = useNavigation();

    return (
        <View style={styles.globalWrapper}>
            <View style={styles.headerWrapper}>
                <Text style={styles.headerText}>My Basics</Text>
            </View>
            <View style={styles.detailListWrapper}>
                {DETAIL_LIST.map((detail, index) => {
                    const value = getDetailValue(profile, detail.label);
                    return (
                        <DetailListItem
                            key={index}
                            icon={detail.icon}
                            label={detail.label}
                            value={value}
                            onPress={() =>
                                navigation.navigate('DetailPickers', {
                                    screen: detail.screen,
                                    params: { currentSelection: value },
                                })
                            }
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        paddingVertical: 10,
        gap: 10,
    },

    headerWrapper: {
        width: '100%',
    },
    headerText: {
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: '500',
    },
    detailListWrapper: {
        gap: 5,
    },
});
