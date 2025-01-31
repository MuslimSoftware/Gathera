import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeightPicker } from './HeightPicker';
import { ExercisePicker } from './ExercisePicker';
import { EducationPicker } from './EducationPicker';
import { AlcoholPicker } from './AlcoholPicker';
import { SmokingPicker } from './SmokingPicker';
import { CannabisPicker } from './CannabisPicker';
import { ZodiacPicker } from './ZodiacPicker';
import { PoliticsPicker } from './PoliticsPicker';
import { WorkPicker } from './WorkPicker';
import { GenderPicker } from './GenderPicker';
import { ReligionPicker } from './ReligionPicker';
import { InterestsPicker } from './InterestsPicker';
import { NationalityPicker } from './NationalityPicker';
import { PrivacyPickerContainer } from '../../../containers/PrivacyPickerContainer';
import { BorderPicker } from './BorderPicker';

const Stack = createNativeStackNavigator();

const DetailPickers = ({ profile, setProfile }: any) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='PrivacyPicker' component={PrivacyPickerContainer} />

            <Stack.Screen name='ReligionPicker' component={ReligionPicker} />
            <Stack.Screen name='HeightPicker' component={HeightPicker} />
            <Stack.Screen name='ExercisePicker' component={ExercisePicker} />
            <Stack.Screen name='EducationPicker' component={EducationPicker} />
            <Stack.Screen name='AlcoholPicker' component={AlcoholPicker} />
            <Stack.Screen name='SmokingPicker' component={SmokingPicker} />
            <Stack.Screen name='CannabisPicker' component={CannabisPicker} />
            <Stack.Screen name='ZodiacPicker' component={ZodiacPicker} />
            <Stack.Screen name='PoliticsPicker' component={PoliticsPicker} />
            <Stack.Screen name='WorkPicker' component={WorkPicker} />
            <Stack.Screen name='GenderPicker' component={GenderPicker} />

            <Stack.Screen name='NationalityPicker'>{(props: any) => <NationalityPicker {...props} setProfile={setProfile} />}</Stack.Screen>
            <Stack.Screen name='InterestsPicker'>
                {(props: any) => <InterestsPicker {...props} profile={profile} setProfile={setProfile} />}
            </Stack.Screen>
            <Stack.Screen name='BorderPicker'>{(props: any) => <BorderPicker {...props} profile={profile} setProfile={setProfile} />}</Stack.Screen>
        </Stack.Navigator>
    );
};

export default DetailPickers;

const styles = StyleSheet.create({});
