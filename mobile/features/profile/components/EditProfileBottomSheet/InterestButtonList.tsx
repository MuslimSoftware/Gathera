import { Interest } from '../../../../types/Interest';
import { ProfileInterestButton } from './ProfileInterestButton';

interface InterestButtonListProps {
    interests: Set<Interest>;
    userInterests: Set<string>;
    handleInterestPress?: (interest: string) => boolean;
    selectedInterestsMemo: Set<string>;
}

export const InterestButtonList = ({ interests, userInterests, handleInterestPress }: InterestButtonListProps) => {
    const interestArray = Array.from(interests);

    return (
        <>
            {interestArray.map((interest: Interest) => {
                const hasBeenSelected = userInterests.has(interest.name);
                return (
                    <ProfileInterestButton
                        key={interest.name}
                        interest={interest}
                        hasBeenSelected={hasBeenSelected}
                        handleInterestPress={handleInterestPress}
                    />
                );
            })}
        </>
    );
};
