import { SetStateAction, createContext, useContext, useState } from 'react';
import { Gender } from '../../gathera-lib/enums/user';

// Fields that should be sent to the sign up API
export interface SignUpFields {
    phone_number: string;
    fname: string;
    lname?: string;
    email?: string;
    is_subscribed_to_emails?: boolean;
    date_of_birth: string;
    gender: Gender | null;
    otp_token: string;
}

export interface SignUpContextProps {
    signUpFields: SignUpFields;
    setSignUpFields: React.Dispatch<SetStateAction<SignUpFields>>;
    otp: string;
    setOtp: React.Dispatch<SetStateAction<string>>;
}

const signUpContextDefaultValues: SignUpContextProps = {
    signUpFields: {
        phone_number: '',
        fname: '',
        is_subscribed_to_emails: true,
        date_of_birth: '',
        gender: null,
        otp_token: '',
    },
    setSignUpFields: () => {},
    otp: '',
    setOtp: () => {},
};

const SignUpContext = createContext(signUpContextDefaultValues);
export const getSignUpContextValues = () => useContext(SignUpContext);

export const SignUpProvider = ({ children }: any) => {
    const [signUpFields, setSignUpFields] = useState<SignUpFields>(signUpContextDefaultValues.signUpFields);
    const [otp, setOtp] = useState<string>('');

    return <SignUpContext.Provider value={{ signUpFields, setSignUpFields, otp, setOtp }}>{children}</SignUpContext.Provider>;
};
