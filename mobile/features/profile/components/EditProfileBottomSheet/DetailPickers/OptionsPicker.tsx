import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';
import DetailPickerLayout from './DetailPickerLayout';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { upsertDetail } from '../../../utils/upsertDetail';
import { useNavigation } from '@react-navigation/native';
import { getAuthContextValues } from '../../../../../shared/context/AuthContext';
import { getZodiacIcon } from '../../../utils/profileHelper';
import { ScrollView } from 'react-native-gesture-handler';

interface OptionsPickerProps {
    question: string;
    icon: React.ReactNode;
    options: string[];
    detailName: string;
    currentSelection?: string;
}

const OptionsPicker = ({ question, icon, options, detailName, currentSelection = '' }: OptionsPickerProps) => {
    const navigation: any = useNavigation();
    const { accessToken } = getAuthContextValues();

    const handleOptionPress = async (label: string) => {
        let details = await upsertDetail(detailName, label, accessToken);
        navigation.navigate({ name: 'ProfileEditSection', params: { details } });
    };

    return (
        <DetailPickerLayout question={question} icon={icon}>
            <ScrollView contentContainerStyle={styles.optionsWrapper}>
                {options.map((label: string) => (
                    <Pressable
                        key={label}
                        style={[styles.optionWrapper, currentSelection === label && styles.selected]}
                        onPress={() => handleOptionPress(label)}
                    >
                        {getZodiacIcon(label, currentSelection === label)}
                        <Text style={[styles.optionText, currentSelection === label && styles.textSelected]}>{label}</Text>
                    </Pressable>
                ))}
                <Pressable style={styles.cancelWrapper} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
            </ScrollView>
        </DetailPickerLayout>
    );
};

export default OptionsPicker;

const styles = StyleSheet.create({
    optionsWrapper: {
        padding: 20,
        gap: 20,
    },
    optionWrapper: {
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: Colours.PRIMARY_TRANSPARENT_20,
        borderRadius: Sizes.BORDER_RADIUS_MD,
    },
    selected: {
        backgroundColor: Colours.PRIMARY_LIGHT,
    },
    textSelected: {
        color: Colours.WHITE,
    },
    optionText: {
        color: Colours.DARK,
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
        textAlign: 'center',
    },
    cancelWrapper: {
        width: '100%',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '400',
        color: Colours.GRAY,
    },
});
