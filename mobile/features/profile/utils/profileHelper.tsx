import {
    AquariusIcon,
    AriesIcon,
    CakeIcon,
    CancerIcon,
    CapricornIcon,
    CloseIcon,
    DumbbellIcon,
    EducationIcon,
    GeminiIcon,
    HumanIcon,
    LeoIcon,
    LibraIcon,
    PiscesIcon,
    PoliticsIcon,
    PrayerIcon,
    RulerIcon,
    SagitariusIcon,
    ScorpioIcon,
    SmokingIcon,
    TaurusIcon,
    VirgoIcon,
    WeedIcon,
    WineOIcon,
    WorkIcon,
    ZodiacIcon,
} from '../../../shared/components/Core/Icons';
import { Sizes, Colours } from '../../../shared/styles/Styles';
import { ReactNode } from 'react';
import { capitalizeAllWords } from '../../../shared/utils/uiHelper';

export interface FormattedDetail {
    label: string;
    value: string;
    icon?: ReactNode;
}

/**
 * Formats detail document from backend to be displayed in profile
 * @param detail IDetail
 * @see enum Detail
 * @returns { label: string, value: string, icon: ReactNode}: FormattedDetail
 */
export const getFormattedDetail = (detail: any) => {
    let icon = null;
    switch (detail.detail) {
        case 'height':
            icon = <RulerIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'education':
            icon = <EducationIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'fitness':
            icon = <DumbbellIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'weed':
            icon = <WeedIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'alcohol':
            icon = <WineOIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'smoke':
            icon = <SmokingIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'politics':
            icon = <PoliticsIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'zodiac':
            icon = <ZodiacIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'religion':
            icon = <PrayerIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'gender':
            icon = <HumanIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'age':
            icon = <CakeIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} style={{ paddingVertical: 3 }} />;
            break;
        case 'work':
            icon = <WorkIcon size={Sizes.ICON_SIZE_XS} color={Colours.GRAY} />;
            break;
        case 'nationality':
            if (!Array.isArray(detail.value)) break;
            icon = '';
            const nationalities = detail.value.join(' / ');
            detail.value = nationalities;
            break;
        default:
            icon = <CloseIcon />;
            break;
    }

    const formattedDetail: FormattedDetail = { label: detail.detail, value: capitalizeAllWords(detail.value), icon: icon };

    return formattedDetail;
};

/**
 * Gets the icon for the given zodiac sign
 * @param zodiac
 * @returns icon
 */
export const getZodiacIcon = (zodiac: string, setIconDark: boolean) => {
    const color = setIconDark ? Colours.DARK : Colours.PRIMARY;
    switch (zodiac) {
        case 'Aries':
            return <AriesIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Taurus':
            return <TaurusIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Gemini':
            return <GeminiIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Cancer':
            return <CancerIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Leo':
            return <LeoIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Virgo':
            return <VirgoIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Libra':
            return <LibraIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Scorpio':
            return <ScorpioIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Sagitarius':
            return <SagitariusIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Capricorn':
            return <CapricornIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Aquarius':
            return <AquariusIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        case 'Pisces':
            return <PiscesIcon size={Sizes.ICON_SIZE_MD} color={color} />;
        default:
            return null;
    }
};

/**
 * Gets nationalities
 * @returns nationalities with emoji
 */
export const getNationalities = (): string[] => {
    return [
        '🇦🇫 Afghanistan',
        '🇦🇱 Albania',
        '🇩🇿 Algeria',
        '🇦🇩 Andorra',
        '🇦🇴 Angola',
        '🇦🇮 Antigua & Barbuda',
        '🇦🇷 Argentina',
        '🇦🇲 Armenia',
        '🇦🇼 Aruba',
        '🇦🇺 Australia',
        '🇦🇹 Austria',
        '🇦🇿 Azerbaijan',
        '🇧🇸 Bahamas',
        '🇧🇭 Bahrain',
        '🇧🇩 Bangladesh',
        '🇧🇧 Barbados',
        '🇧🇾 Belarus',
        '🇧🇪 Belgium',
        '🇧🇿 Belize',
        '🇧🇯 Benin',
        '🇧🇲 Bermuda',
        '🇧🇹 Bhutan',
        '🇧🇴 Bolivia',
        '🇧🇦 Bosnia & Herzegovina',
        '🇧🇼 Botswana',
        '🇧🇷 Brazil',
        '🇧🇳 Brunei',
        '🇧🇬 Bulgaria',
        '🇧🇫 Burkina Faso',
        '🇧🇮 Burundi',
        '🇨🇻 Cabo Verde',
        '🇰🇭 Cambodia',
        '🇨🇲 Cameroon',
        '🇨🇦 Canada',
        '🇨🇫 Central African Republic',
        '🇹🇩 Chad',
        '🇨🇱 Chile',
        '🇨🇳 China',
        '🇨🇴 Colombia',
        '🇰🇲 Comoros',
        '🇨🇬 Congo',
        '🇨🇷 Costa Rica',
        '🇭🇷 Croatia',
        '🇨🇺 Cuba',
        '🇨🇾 Cyprus',
        '🇨🇿 Czech Republic',
        '🇩🇰 Denmark',
        '🇩🇯 Djibouti',
        '🇩🇲 Dominica',
        '🇩🇴 Dominican Republic',
        '🇪🇨 Ecuador',
        '🇪🇬 Egypt',
        '🇸🇻 El Salvador',
        '🇬🇶 Equatorial Guinea',
        '🇪🇷 Eritrea',
        '🇪🇪 Estonia',
        '🇪🇹 Ethiopia',
        '🇫🇯 Fiji',
        '🇫🇮 Finland',
        '🇫🇷 France',
        '🇬🇦 Gabon',
        '🇬🇲 Gambia',
        '🇬🇪 Georgia',
        '🇩🇪 Germany',
        '🇬🇭 Ghana',
        '🇬🇷 Greece',
        '🇬🇩 Grenada',
        '🇬🇹 Guatemala',
        '🇬🇳 Guinea',
        '🇬🇼 Guinea-Bissau',
        '🇬🇾 Guyana',
        '🇭🇹 Haiti',
        '🇭🇳 Honduras',
        '🇭🇺 Hungary',
        '🇮🇸 Iceland',
        '🇮🇳 India',
        '🇮🇩 Indonesia',
        '🇮🇷 Iran',
        '🇮🇶 Iraq',
        '🇮🇪 Ireland',
        '🇮🇱 Israel',
        '🇮🇹 Italy',
        '🇨🇮 Ivory Coast',
        '🇯🇲 Jamaica',
        '🇯🇵 Japan',
        '🇯🇴 Jordan',
        '🇰🇿 Kazakhstan',
        '🇰🇪 Kenya',
        '🇰🇮 Kiribati',
        '🇽🇰 Kosovo',
        '🇰🇼 Kuwait',
        '🇰🇬 Kyrgyzstan',
        '🇱🇦 Laos',
        '🇱🇻 Latvia',
        '🇱🇧 Lebanon',
        '🇱🇸 Lesotho',
        '🇱🇷 Liberia',
        '🇱🇾 Libya',
        '🇱🇮 Liechtenstein',
        '🇱🇹 Lithuania',
        '🇱🇺 Luxembourg',
        '🇲🇬 Madagascar',
        '🇲🇼 Malawi',
        '🇲🇾 Malaysia',
        '🇲🇻 Maldives',
        '🇲🇱 Mali',
        '🇲🇹 Malta',
        '🇲🇭 Marshall Islands',
        '🇲🇷 Mauritania',
        '🇲🇺 Mauritius',
        '🇲🇽 Mexico',
        '🇫🇲 Micronesia',
        '🇲🇩 Moldova',
        '🇲🇨 Monaco',
        '🇲🇳 Mongolia',
        '🇲🇪 Montenegro',
        '🇲🇦 Morocco',
        '🇲🇿 Mozambique',
        '🇲🇲 Myanmar',
        '🇳🇦 Namibia',
        '🇳🇷 Nauru',
        '🇳🇵 Nepal',
        '🇳🇱 Netherlands',
        '🇳🇿 New Zealand',
        '🇳🇮 Nicaragua',
        '🇳🇪 Niger',
        '🇳🇬 Nigeria',
        '🇰🇵 North Korea',
        '🇲🇰 North Macedonia',
        '🇳🇴 Norway',
        '🇴🇲 Oman',
        '🇵🇰 Pakistan',
        '🇵🇼 Palau',
        '🇵🇸 Palestine',
        '🇵🇦 Panama',
        '🇵🇬 Papua New Guinea',
        '🇵🇾 Paraguay',
        '🇵🇪 Peru',
        '🇵🇭 Philippines',
        '🇵🇱 Poland',
        '🇵🇹 Portugal',
        '🇵🇷 Puerto Rico',
        '🇶🇦 Qatar',
        '🇷🇴 Romania',
        '🇷🇺 Russia',
        '🇷🇼 Rwanda',
        '🇰🇳 Saint Kitts & Nevis',
        '🇱🇨 Saint Lucia',
        '🇻🇨 Saint Vincent & The Grenadines',
        '🇼🇸 Samoa',
        '🇸🇲 San Marino',
        '🇸🇹 Sao Tome & Principe',
        '🇸🇦 Saudi Arabia',
        '🇸🇳 Senegal',
        '🇷🇸 Serbia',
        '🇸🇨 Seychelles',
        '🇸🇱 Sierra Leone',
        '🇸🇬 Singapore',
        '🇸🇰 Slovakia',
        '🇸🇮 Slovenia',
        '🇸🇧 Solomon Islands',
        '🇸🇴 Somalia',
        '🇿🇦 South Africa',
        '🇰🇷 South Korea',
        '🇸🇸 South Sudan',
        '🇪🇸 Spain',
        '🇱🇰 Sri Lanka',
        '🇸🇩 Sudan',
        '🇸🇷 Suriname',
        '🇸🇿 Eswatini',
        '🇸🇪 Sweden',
        '🇨🇭 Switzerland',
        '🇸🇾 Syria',
        '🇹🇼 Taiwan',
        '🇹🇯 Tajikistan',
        '🇹🇿 Tanzania',
        '🇹🇭 Thailand',
        '🇹🇱 Timor-Leste',
        '🇹🇬 Togo',
        '🇹🇴 Tonga',
        '🇹🇹 Trinidad & Tobago',
        '🇹🇳 Tunisia',
        '🇹🇷 Turkey',
        '🇹🇲 Turkmenistan',
        '🇹🇻 Tuvalu',
        '🇺🇬 Uganda',
        '🇺🇦 Ukraine',
        '🇦🇪 United Arab Emirates',
        '🇬🇧 United Kingdom',
        '🇺🇸 United States',
        '🇺🇾 Uruguay',
        '🇺🇿 Uzbekistan',
        '🇻🇺 Vanuatu',
        '🇻🇦 Vatican City',
        '🇻🇪 Venezuela',
        '🇻🇳 Vietnam',
        '🇾🇪 Yemen',
        '🇿🇲 Zambia',
        '🇿🇼 Zimbabwe',
    ];
};
