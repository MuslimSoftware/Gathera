import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppScreen from "./screens/AppScreen";
import AuthStack from "./screens/AuthStack";
import { Colours } from "./shared/styles/Styles";
import {
    AuthProvider,
    getAuthContextValues
} from "./shared/context/AuthContext";
import { useAndroidNavBarColor } from "./shared/hooks/useAndroidNavBarColor";
import { FallBack } from "./features/FallBack";
import ErrorBoundary from "react-native-error-boundary";
import { SplashScreen } from "./screens/SplashScreen";
import { PlaceBottomSheetProvider } from "./shared/context/PlaceBottomSheetContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MapProvider } from "./shared/context/MapContext";
import { useFetchUpdate } from "./shared/hooks/useFetchUpdate";
import { useAnalytics } from "./shared/hooks/useAnalytics";

const Screen = () => {
    const { isLoggedIn, isLoading, error } = getAuthContextValues();
    useAndroidNavBarColor(isLoggedIn ? Colours.WHITE : Colours.PRIMARY_DARK);

    if (isLoading || error) return <SplashScreen error={error} />;
    if (!isLoggedIn) return <AuthStack />;
    return (
        <PlaceBottomSheetProvider>
            <MapProvider>
                <AppScreen />
            </MapProvider>
        </PlaceBottomSheetProvider>
    );
};

const App = () => {
    const handleError = (error: Error, stackTrace: string) => {
        console.log("ErrorBoundary", error, stackTrace);
    };

    useAnalytics();
    useFetchUpdate();

    return (
        <AuthProvider>
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <ErrorBoundary
                        onError={handleError}
                        FallbackComponent={FallBack}
                    >
                        <Screen />
                    </ErrorBoundary>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </AuthProvider>
    );
};

export default App;
