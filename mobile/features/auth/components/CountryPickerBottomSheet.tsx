import { StyleSheet, View } from 'react-native';
import React from 'react';
import { CountryButton, CountryPicker } from 'react-native-country-codes-picker';

interface CountryPickerBottomSheetProps {
    showCountryPicker: boolean;
    setShowCountryPicker: (show: boolean) => void;
    setCountryCode: (code: string) => void;
}

export const CountryPickerBottomSheet = React.memo(({ showCountryPicker, setShowCountryPicker, setCountryCode }: CountryPickerBottomSheetProps) => {
    const ListHeaderComponent = ({ countries, lang, onPress }: any) => {
        return (
            <View
                style={{
                    paddingBottom: 20,
                }}
            >
                {countries?.map((country: any, index: any) => {
                    return <CountryButton key={index} item={country} name={country?.name?.[lang || 'en']} onPress={() => onPress(country)} />;
                })}
            </View>
        );
    };

    return (
        <CountryPicker
            show={showCountryPicker}
            popularCountries={['US', 'CA']}
            ListHeaderComponent={ListHeaderComponent}
            onBackdropPress={() => {
                setShowCountryPicker(false);
            }}
            style={{
                // Styles for whole modal [View]
                modal: {
                    height: 500,
                },
                // Styles for modal backdrop [View]
                backdrop: {},
                // Styles for bottom input line [View]
                line: {},
                // Styles for list of countries [FlatList]
                itemsList: {},
                // Styles for input [TextInput]
                textInput: {
                    height: 50,
                    borderRadius: 0,
                },
                // Styles for country button [TouchableOpacity]
                countryButtonStyles: {
                    height: 50,
                },
                // Styles for search message [Text]
                searchMessageText: {},
                // Styles for search message container [View]
                countryMessageContainer: {},
                // Flag styles [Text]
                flag: {},
                // Dial code styles [Text]
                dialCode: {},
                // Country name styles [Text]
                countryName: {},
            }}
            pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setShowCountryPicker(false);
            }}
            lang={'en'}
        />
    );
});

const styles = StyleSheet.create({});
