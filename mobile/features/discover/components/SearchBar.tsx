import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { CloseIcon, SearchIcon } from '../../../shared/components/Core/Icons';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: any;
    autoFocus?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    onCloseBtnPress?: () => void;
    shiftRight?: boolean; // for shifting the search bar to the left of back button
    editable?: boolean;
    style?: any;
    isDummy?: boolean;
}

const SearchBar = ({
    searchQuery,
    setSearchQuery,
    autoFocus = false,
    onFocus,
    shiftRight = false,
    onBlur,
    onCloseBtnPress,
    editable = true,
    style,
    isDummy = false,
}: SearchBarProps) => {
    const handleCloseBtnPress = () => {
        setSearchQuery('');
        onCloseBtnPress && onCloseBtnPress();
    };

    const shiftLeftStyle = shiftRight && {
        width: '90%',
        marginLeft: 'auto',
    };

    const textColor = Colours.GRAY;
    const placeHolderText = 'Search';

    return (
        <View style={[styles.globalWrapper, shiftLeftStyle]}>
            <View style={[styles.wrapper, style]}>
                <SearchIcon color={Colours.GRAY} size={Sizes.ICON_SIZE_SM} />
                {isDummy && <Text style={[styles.searchBarInput, { color: textColor }]}>{placeHolderText}</Text>}
                {!isDummy && (
                    <TextInput
                        placeholder={placeHolderText}
                        placeholderTextColor={textColor}
                        style={styles.searchBarInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType='search'
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onLayout={(event: any) => {
                            if (autoFocus) event.target.focus();
                        }}
                        autoCapitalize='none'
                        autoCorrect={false}
                        editable={editable}
                        maxLength={50}
                    />
                )}

                {searchQuery.length > 0 && <CloseIcon color={Colours.DARK} size={Sizes.ICON_SIZE_SM} onPress={handleCloseBtnPress} />}
            </View>
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    globalWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        height: 40,
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 7.5,
        borderRadius: Sizes.BORDER_RADIUS_MD,
        backgroundColor: Colours.GRAY_LIGHT,
    },
    searchBarInput: {
        color: Colours.DARK,
        flex: 1,
        fontSize: Sizes.FONT_SIZE_MD,
    },
});
