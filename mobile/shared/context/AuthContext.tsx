import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Gender, SubscriptionType } from '../../gathera-lib/enums/user';
import { BACKEND_TIMEOUT_ERROR_MESSAGE, getResponse, normalizeRequestConfig } from '../utils/fetchHookUtils';
import { User } from '../../types/User';
import { getItemSecureAsync, storeItemSecureAsync } from '../utils/authTokens';
import { deleteItemAsync } from 'expo-secure-store';
import { decode } from 'base-64';
import { updateObject } from '../utils/dataHelper';
import { SESSION_EXPIRED_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE, USER_DOES_NOT_EXIST_ERROR_MESSAGE } from '../../gathera-lib/constants/user';

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
    setUser: (user: any) => void;
    accessToken: string;
    loginAsync: (user: any, shouldLogin?: boolean) => Promise<boolean>;
    logoutAsync: () => Promise<void>;
    isLoading: boolean;
    error: string;
}

const defaultUser: User = {
    _id: '',
    phone_number: '',
    email: '',
    fname: '',
    lname: '',
    date_of_birth: new Date(),
    gender: Gender.MALE,
    display_name: '',
    avatar_uri: '',
    bio: '',
    is_public: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    is_subscribed: false,
    expo_push_token: '',
    instagram_username: '',
    subscription: SubscriptionType.FREE,
    border: '',
    details: [],
    interests: [],
};

const AuthContextDefaultValues: AuthContextProps = {
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    accessToken: '',
    loginAsync: async (user: any, shouldLogin?: boolean) => false,
    logoutAsync: async () => {},
    user: defaultUser,
    setUser: (user: any) => {},
    isLoading: true,
    error: '',
};

const AuthContext = createContext(AuthContextDefaultValues);
export const getAuthContextValues = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(AuthContextDefaultValues.isLoggedIn);
    const [accessToken, _setAccessToken] = useState<string>(AuthContextDefaultValues.accessToken);
    const [isInitialLoading, _setIsInitialLoading] = useState<boolean>(AuthContextDefaultValues.isLoading);
    const [error, _setError] = useState<string>(AuthContextDefaultValues.error);
    const [user, _setUser] = useState<User>(AuthContextDefaultValues.user);

    const setUser = (user: any) => {
        _setUser((prevUser) => updateObject(prevUser, user));
    };

    const _resetState = () => {
        setIsLoggedIn(AuthContextDefaultValues.isLoggedIn);
        _setAccessToken(AuthContextDefaultValues.accessToken);
        _setIsInitialLoading(false);
        _setError(AuthContextDefaultValues.error);
        setUser(AuthContextDefaultValues.user);
    };

    /**
     * Logs in the user by storing the refresh token in SecureStore and sets the state of the AuthContext.
     * @param user The user object as returned from the login endpoint to store in the state of the AuthContext.
     * @param shouldLogin Whether to set isLoggedIn to true or not. This is useful when we want the user to continue the signup process while having signed up successfully.
     * @returns A promise that resolves to true if the login was successful, and false otherwise.
     */
    const loginAsync = async (user: any, shouldLogin: boolean = true) => {
        const { accessToken, refreshToken } = user;

        if (refreshToken) {
            // store the refresh token in secure storage
            try {
                await storeItemSecureAsync('refreshToken', refreshToken);
            } catch (error) {
                console.log('Error storing refresh token. Logging out...', error);
                await logoutAsync();
                return false;
            }
        }

        delete user.refreshToken;
        delete user.accessToken;

        // login
        setUser(user);
        _setError('');
        _setIsInitialLoading(false);
        if (accessToken) _setAccessToken(accessToken);
        if (shouldLogin) setIsLoggedIn(true);
        return true;
    };

    useEffect(() => {
        const MAX_ATTEMPTS = 3; // maximum number of attempts to check if the user is logged in

        // On load, check if the user is logged in by checking if there is a refresh token stored on the device
        // If there is a refresh token, then the user is logged in --> get a new access token (refresh) & the user object
        // else, the user needs to manually login (phone number + otp)
        const checkIfLoggedInAsync = async (attemptNumber: number = 1) => {
            const refreshToken = await getItemSecureAsync('refreshToken');
            if (!refreshToken) {
                _setIsInitialLoading(false);
                console.log('No refresh token found. User needs to login.');
                return;
            }

            try {
                // get a new access token
                const newAccessToken = await getResponse(normalizeRequestConfig({ url: `/auth/refresh`, method: 'POST' }, true, refreshToken));
                if (!newAccessToken) throw new Error('Server did not return a new access token');

                // get the user object
                const user = await getResponse(normalizeRequestConfig({ url: `/user` }, true, newAccessToken));
                if (!user) throw new Error('Server did not return a user object');

                await loginAsync({ accessToken: newAccessToken, ...user });
            } catch (error: any) {
                if (error.message === BACKEND_TIMEOUT_ERROR_MESSAGE) {
                    console.log('Requests to backend timed out while getting a new access token / user with current refresh token.');
                    _setError(error.message);
                    return;
                } else if (
                    error.message === SESSION_EXPIRED_ERROR_MESSAGE ||
                    error.message === UNAUTHORIZED_ERROR_MESSAGE ||
                    error.message === USER_DOES_NOT_EXIST_ERROR_MESSAGE
                ) {
                    // if the session has expired, the refresh token is invalid/expired, or the user no longer exists then logout
                    console.log('Session expired. Logging out...');
                    await logoutAsync(); // this will clear the refresh token from the device
                    return;
                }

                // happens when something else goes wrong (e.g. server is down, internet connection is lost, etc.)
                console.log(`[ATTEMPT ${attemptNumber}] failed getting a new access token / user.`, error);

                if (attemptNumber >= MAX_ATTEMPTS) {
                    console.log('Max attempts reached.');
                    _setError('Something went wrong. Please try again later.');
                } else {
                    // try again after 3 seconds
                    console.log('Trying again in 5 seconds...');
                    setTimeout(async () => await checkIfLoggedInAsync(attemptNumber + 1), 5000);
                }
            }
        };

        checkIfLoggedInAsync();
    }, []);

    // get the expiration time of the current access token
    const _accessTokenExpirationMS = useMemo(() => {
        if (!accessToken) return 0;

        // decode the access token to get the expiration date
        const decodedAccessToken = JSON.parse(decode(accessToken.split('.')[1]));
        return decodedAccessToken.exp * 1000;
    }, [accessToken]);

    useEffect(() => {
        // Whenever the access token expiration time changes, set a timeout to refresh the access token
        // This will automatically refresh the access token when it will expire with some leeway to account for network latency
        if (isInitialLoading) return;

        // automatically refresh the access token when it will expire with some leeway to account for network latency
        const leewayMS = 1000 * 60 * 2; // 2 minutes
        const timeToRefreshMS = Math.max(5000, _accessTokenExpirationMS - Date.now() - leewayMS); // Minimum of 5 seconds to refresh the access token
        const timeout = setTimeout(async () => await refreshAccessTokenAsync(), timeToRefreshMS);

        // cleanup the timeout on unmount
        return () => clearTimeout(timeout);
    }, [_accessTokenExpirationMS]);

    /**
     * Logs out the user by clearing the stored refresh token from the device. It will send
     * a request to the server to invalidate the current refresh token. This will also reset
     * the state of the AuthContext if the logout was successful.
     * @returns A promise that resolves to true if the logout was successful, and false otherwise.
     */
    const logoutAsync = async (): Promise<void> => {
        const refreshToken = await getItemSecureAsync('refreshToken');
        if (refreshToken) {
            // send a request to the server to invalidate the refresh token
            await getResponse(normalizeRequestConfig({ url: `/auth/logout`, method: 'POST' }, true, refreshToken)).catch(() => {});

            // logout was successful --> clear the refresh token from the device
            await deleteItemAsync('refreshToken');
        }

        _resetState();
    };

    /**
     * Refreshes the access token by sending a request to the server to get a new access token,
     * and sets it in the state of the AuthContext.
     */
    const refreshAccessTokenAsync = async (): Promise<void> => {
        const refreshToken = await getItemSecureAsync('refreshToken').catch(() => {});
        if (!refreshToken) {
            // No refresh token found --> the user must login to get a refresh token
            console.log('Trying to refresh access token, but no refresh token found. Logging out...');
            await logoutAsync();
            return;
        }

        console.log('Refreshing access token with server...');

        try {
            const newAccessToken = await getResponse(normalizeRequestConfig({ url: `/auth/refresh`, method: 'POST' }, true, refreshToken));
            if (!newAccessToken) throw new Error('Server did not return a new access token');
            _setAccessToken(newAccessToken);
            return;
        } catch (error: any) {
            if (error.message === BACKEND_TIMEOUT_ERROR_MESSAGE) {
                console.log('Requests to backend timed out while getting a new access token.');
                _setError(error.message);
                return;
            } else if (error.message === SESSION_EXPIRED_ERROR_MESSAGE || error.message === UNAUTHORIZED_ERROR_MESSAGE) {
                // if the session has expired, or the refresh token is invalid or expired, then logout
                console.log('Session expired. Logging out...');
                await logoutAsync(); // this will clear the refresh token from the device
                return;
            }

            // happens when something else goes wrong (e.g. server is down, internet connection is lost, etc.)
            console.log('Error getting a new access token. Trying again...', error);

            // try again after 3 seconds
            setTimeout(async () => await refreshAccessTokenAsync(), 3000);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                setUser,
                isLoggedIn,
                setIsLoggedIn,
                loginAsync,
                logoutAsync,
                isLoading: isInitialLoading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
