import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { forwardRef } from "react";

type ButtonProps = {
    text: string;
    isDisabled?: boolean;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
    ({ text, isDisabled, ...pressableProps }, ref) => {
        return (
            <Pressable
                ref={ref}
                {...pressableProps}
                disabled={isDisabled}
                style={[styles.container, isDisabled && styles.disabled]}>
                <Text style={styles.text}>{text}</Text>
            </Pressable>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.tint,
        padding: 15,
        alignItems: "center",
        borderRadius: 100,
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
    },
    disabled: {
        backgroundColor: Colors.light.tint,
        opacity: 0.5,
    },
});

export default Button;
