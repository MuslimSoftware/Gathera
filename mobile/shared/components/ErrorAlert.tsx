import { Alert, StyleSheet } from "react-native";

interface ErrorAlertProps {
    title: string;
    message: string;
}

const ErrorAlert = (title: string, message: string) =>
    Alert.alert(title, message);

export default ErrorAlert;

const styles = StyleSheet.create({});
