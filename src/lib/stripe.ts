import { Alert } from "react-native";
import { supabase } from "./supabase";
import {
    initPaymentSheet,
    presentPaymentSheet,
} from "@stripe/stripe-react-native";

const fetchPaymentSheetParams = async (amount: number) => {
    const { data, error } = await supabase.functions.invoke("payment-sheet", {
        body: { amount },
    });

    if (data) {
        return data;
    }

    Alert.alert(
        "Error fetching payment sheet params for these reasons: ",
        error.message
    );

    console.log(
        "Error fetching payment sheet params for these reasons: ",
        error.message
    );
    return {};
};

export const initializePaymentSheet = async (amount: number) => {
    console.log("initializing payment sheet, for: ", amount);

    const { paymentIntent, publishablekey } = await fetchPaymentSheetParams(
        amount
    );

    // if (!paymentIntent || !publishablekey) return;

    await initPaymentSheet({
        merchantDisplayName: "Food Ordering",
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
            name: "Jane Doe",
        },
    });
};

export const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
        Alert.alert(error.message);
        console.log(error.message);
        return false;
    }
    return true;
};
