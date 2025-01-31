import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import DetailPickerLayout from './DetailPickerLayout';
import { WorkIcon } from '../../../../../shared/components/Core/Icons';
import { TextInput } from 'react-native-gesture-handler';
import { Sizes, Colours } from '../../../../../shared/styles/Styles';
import { upsertDetail } from '../../../utils/upsertDetail';
import { getAuthContextValues } from '../../../../../shared/context/AuthContext';
import { TextButton } from '../../../../../shared/components/Buttons/TextButton';

export const WorkPicker = ({ navigation, route }: any) => {
    const { accessToken } = getAuthContextValues();
    const { currentSelection } = route.params;
    const [jobTitle, setJobTitle] = React.useState(currentSelection ? currentSelection : '');
    // const [workplace, setWorkplace] = React.useState('');

    const handleConfirm = async () => {
        const details = await upsertDetail('work', jobTitle, accessToken);
        navigation.navigate({ name: 'ProfileEditSection', params: { details } });
    };

    const onChange = (text: string) => {
        // Remove special characters and numbers, limit to 25 characters
        text = text.replace(/[^a-zA-Z ]/g, '');
        text = text.substring(0, 35);
        setJobTitle(text);
    };

    return (
        <DetailPickerLayout question='What is your job title?' icon={<WorkIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}>
            <View style={styles.globalWrapper}>
                <TextInput style={styles.textInput} placeholder='Job Title' value={jobTitle} onChangeText={onChange} />

                {/* <TextInput style={styles.textInput} placeholder='Workplace' value={workplace} onChangeText={(text: string) => setWorkplace(text)} /> */}
                <TextButton label='Confirm' textStyle={{ fontSize: Sizes.FONT_SIZE_MD, color: Colours.PRIMARY }} onPress={handleConfirm} />
            </View>
        </DetailPickerLayout>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        flex: 1,
        paddingHorizontal: '10%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 20,
    },
    textInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colours.PRIMARY_TRANSPARENT_50,
        borderRadius: Sizes.BORDER_RADIUS_MD,
        fontSize: Sizes.FONT_SIZE_LG,
        color: Colours.DARK,
    },
});
