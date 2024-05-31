import {
    ActivityIndicator,
    ColorValue,
    StyleProp,
    ViewStyle,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

type SpinnerProps = {
    size?: number | "small" | "large" | undefined;
    color?: ColorValue | undefined;
    style?: StyleProp<ViewStyle>;
};

const Spinner = ({
    size = 50,
    color = Colors.light.tint,
    style = {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
}: SpinnerProps) => {
    return <ActivityIndicator style={style} size={size} color={color} />;
};

export default Spinner;
