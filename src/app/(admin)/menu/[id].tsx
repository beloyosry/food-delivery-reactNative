import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import { defaultPizzaImage } from "@/constants/Images";
import { useState } from "react";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useProduct } from "@/api/products";
import Spinner from "@/components/Spinner";
import RemoteImage from "@/components/RemoteImage";

const ProductDetailsScreen = () => {
    const { id: idString } = useLocalSearchParams();

    const id = (idString && parseFloat(idString as string)) || 0;

    const { data: product, error, isLoading } = useProduct(id);

    const { addItem } = useCart();
    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

    const addToCart = () => {
        if (!product) return;
        addItem(product, selectedSize);

        router.push("/cart");
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (error || !product) {
        return <Text>Failed to fetch products</Text>;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Menu",
                    headerRight: () => (
                        <Link
                            href={`/(admin)/menu/create?id=${product.id}`}
                            asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name="pencil"
                                        size={25}
                                        color={Colors.light.tint}
                                        style={{
                                            marginRight: 15,
                                            opacity: pressed ? 0.5 : 1,
                                        }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Stack.Screen options={{ title: product.name }} />
            <RemoteImage
                path={product.image}
                fallback={defaultPizzaImage}
                style={styles.image}
            />

            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    image: {
        width: "100%",
        aspectRatio: 1,
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ProductDetailsScreen;
