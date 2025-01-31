import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { HeaderPageLayout } from '../../../../shared/layouts/HeaderPageLayout';
import { Ionicons } from '@expo/vector-icons';
import { LongTextInput } from '../../../../shared/components/LabelInputs/LongTextInput';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { useFetch } from '../../../../shared/hooks/useFetch';
import { useNavigate } from '../../../../shared/hooks/useNavigate';

const Feedback = () => {
    const [ratings, setRatings] = useState({
        idea: -1,
        easeOfUse: -1,
    });
    const [feedbackText, setFeedbackText] = useState('' as string);
    const { fetchAsync: sendFeedback, error: sendFeedbackError, isLoading: sendFeedbackIsLoading } = useFetch();
    const { navigateToScreen } = useNavigate();

    const handleRating = (category: any, value: any) => {
        setRatings((prevState) => ({
            ...prevState,
            [category]: value,
        }));
    };

    const submitFeedback = () => {
        sendFeedback(
            {
                url: '/user/feedback',
                method: 'POST',
                body: { ratings, feedbackText },
            },
            () => {
                console.log('Feedback Submitted!', 'Thank you for your feedback.');
            },
        );
        navigateToScreen('MapTab');
    };
    return (
        <HeaderPageLayout title="Feedback" hasTopMargin>
            <View style={styles.globalWrapper}>
                <Text style={styles.description}>Please help us improve Gathera by answering the following questions:</Text>
                <View style={styles.ratingContainer}>
                    <Text style={styles.question}>This app is a good idea</Text>
                    <RatingStars category="idea" value={ratings.idea} onPress={handleRating} />
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={styles.question}>This app is easy to use</Text>
                    <RatingStars category="easeOfUse" value={ratings.easeOfUse} onPress={handleRating} />
                </View>
                <View style={styles.ratingContainer}>
                    <Text style={styles.question}>What would make this app better?</Text>
                    <View style={{ marginTop: -20 }}>
                        <LongTextInput value={feedbackText} onChangeText={setFeedbackText} maxLength={200} />
                    </View>
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
                    <Text style={styles.submitText}>Submit Feedback</Text>
                </TouchableOpacity>
            </View>
        </HeaderPageLayout>
    );
};
const RatingStars = ({ category, value, onPress }: any) => {
    const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

    return (
        <View style={styles.starsContainer}>
            {labels.map((label, index) => (
                <TouchableOpacity key={index} onPress={() => onPress(category, index + 1)} style={styles.starContainer}>
                    <Text style={styles.label}>{label}</Text>
                    <Ionicons
                        name={value == index + 1 ? 'checkmark-circle' : 'ellipse-outline'}
                        size={40}
                        color={value == index + 1 ? Colours.PRIMARY : '#CCCCCC'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};
const styles = StyleSheet.create({
    globalWrapper: {
        flex: 1,
        padding: 15,
        gap: 30,
    },
    description: {
        fontSize: Sizes.FONT_SIZE_MD,
    },
    ratingContainer: {
        gap: 10,
    },
    question: {
        width: '100%',
        fontSize: Sizes.FONT_SIZE_XL,
        fontWeight: '500',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    starContainer: {
        width: '20%',
        height: 75,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        marginBottom: 5,
    },
    submitButton: {
        backgroundColor: Colours.PRIMARY,
        padding: 12,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Feedback;
