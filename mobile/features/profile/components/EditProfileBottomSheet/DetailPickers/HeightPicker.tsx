import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import DetailPickerLayout from './DetailPickerLayout';
import { RulerIcon } from '../../../../../shared/components/Core/Icons';
import { Colours, Sizes } from '../../../../../shared/styles/Styles';
import { TextButton } from '../../../../../shared/components/Buttons/TextButton';
import { upsertDetail } from '../../../utils/upsertDetail';
import { getAuthContextValues } from '../../../../../shared/context/AuthContext';
import ValueWheelPicker from '../../../../../shared/components/Core/ValueWheelPicker';

export const HeightPicker = ({ navigation, route }: any) => {
    const { accessToken } = getAuthContextValues();
    const { currentSelection } = route.params;
    const [height, setHeight] = React.useState<string>(currentSelection ? currentSelection : '5\'8"');

    const handleConfirm = async () => {
        const details = await upsertDetail('height', height, accessToken);
        navigation.navigate({ name: 'ProfileEditSection', params: { details } });
    };

    const possibleHeights = Array.from({ length: 8 }, (_, i) => {
        const height = `${i + 1}'`;
        const inches = Array.from({ length: 12 }, (_, i) => `${i}"`);
        return inches.map((inch) => `${height}${inch}`);
    }).flat();
    return (
        <DetailPickerLayout question='What is your height?' icon={<RulerIcon size={Sizes.ICON_SIZE_XL} color={Colours.PRIMARY} />}>
            <View style={styles.globalWrapper}>
                <View style={styles.heightValue}>
                    <Text style={styles.heightText}>{height}</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <View style={styles.heightScrollerHeader}>
                        <TextButton label='Cancel' textStyle={{ fontSize: Sizes.FONT_SIZE_MD }} onPress={() => navigation.goBack()} />
                        <TextButton label='Confirm' textStyle={{ color: Colours.PRIMARY, fontSize: Sizes.FONT_SIZE_MD }} onPress={handleConfirm} />
                    </View>
                    <ValueWheelPicker setValue={setHeight} values={possibleHeights} />
                </View>
            </View>
        </DetailPickerLayout>
    );
};

const styles = StyleSheet.create({
    globalWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heightValue: {
        width: '90%',
        paddingVertical: 15,
        borderWidth: 2,
        borderColor: Colours.PRIMARY_TRANSPARENT_75,
        borderRadius: Sizes.BORDER_RADIUS_MD,
    },
    heightText: {
        fontSize: Sizes.FONT_SIZE_LG,
        fontWeight: '400',
        textAlign: 'center',
    },
    inputWrapper: {
        width: '100%',
        height: '60%',
        justifyContent: 'center',
    },
    heightScroller: {
        flex: 1,
        backgroundColor: Colours.WHITE,
    },
    heightScrollerHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colours.GRAY_LIGHT,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 5,
        marginBottom: 10,
    },
});
