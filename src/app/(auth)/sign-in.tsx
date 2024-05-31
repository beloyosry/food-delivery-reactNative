import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";

const SignInScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert(error.message);

        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Sign in",
                }}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="jon@gmail.com"
                style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="******"
                secureTextEntry
                style={styles.input}
            />

            <Button
                isDisabled={loading || !email || !password}
                onPress={signInWithEmail}
                text="Sign in"
            />
            <Link href="/sign-up" style={styles.textButton}>
                Create account
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10,
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    label: {
        color: "gray",
        fontSize: 16,
    },
    textButton: {
        alignSelf: "center",
        fontWeight: "bold",
        color: Colors.light.tint,
        marginVertical: 10,
    },
});

export default SignInScreen;
