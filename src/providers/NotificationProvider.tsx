import { registerForPushNotificationsAsync } from "@/lib/notifications";
import {
    PropsWithChildren,
    createContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { ExpoPushToken } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();

    const { profile } = useAuth();

    const [notification, setNotification] =
        useState<Notifications.Notification>();
    const NotificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const savePushToken = async (newToken: string | undefined) => {
        setExpoPushToken(newToken);

        if (!newToken) return;

        await supabase
            .from("profiles")
            .update({ expo_push_token: newToken })
            .eq("id", profile.id);
    };

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            savePushToken(token);
        });

        NotificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(response);
                }
            );

        return () => {
            if (NotificationListener.current) {
                Notifications.removeNotificationSubscription(
                    NotificationListener.current
                );
            }

            if (responseListener.current) {
                Notifications.removeNotificationSubscription(
                    responseListener.current
                );
            }
        };
    }, []);

    console.log("Push token: ", expoPushToken);
    console.log("notification:", notification);

    return <>{children}</>;
};

export default NotificationProvider;
