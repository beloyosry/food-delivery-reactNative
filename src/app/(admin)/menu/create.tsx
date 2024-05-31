import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/constants/Images";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    useDeleteProduct,
    useInsertProduct,
    useProduct,
    useUpdateProduct,
} from "@/api/products";
import Spinner from "@/components/Spinner";

import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";

const CreateProductScreen = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { id: idString } = useLocalSearchParams();

    const id = (idString && parseFloat(idString as string)) || 0;

    const isUpdating = !!id;

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { data: updatingProduct } = useProduct(id);
    const { mutate: deleteProduct } = useDeleteProduct();

    const router = useRouter();

    useEffect(() => {
        if (updatingProduct) {
            setName(updatingProduct.name);
            setPrice(updatingProduct.price.toString());
            setImage(updatingProduct.image);
        }
    }, [updatingProduct]);

    const resetFields = () => {
        setName("");
        setPrice("");
        setImage(null);
    };

    const validateInput = () => {
        setErrors("");

        if (!name) {
            setErrors("Name is required");
            return false;
        }

        if (!price) {
            setErrors("Price is required");
            return false;
        }
        if (isNaN(parseFloat(price))) {
            setErrors("Price is not a number");
            return false;
        }

        return true;
    };

    const onSubmit = () => {
        if (isUpdating) {
            onUpdate();
        } else {
            onCreate();
        }
    };

    const onCreate = async () => {
        if (!validateInput()) {
            return;
        }
        setIsLoading(true);

        const imagePath = await uploadImage();

        console.log("Creating product: ", { name, price });
        insertProduct(
            { name, price: parseFloat(price), image: imagePath },
            {
                onSuccess: () => {
                    resetFields();
                    router.back();
                    setIsLoading(false);
                },
            }
        );
    };

    const onUpdate = async () => {
        if (!validateInput()) {
            return;
        }

        const imagePath = await uploadImage();

        console.log("Updating product: ", { name, price });

        setIsLoading(true);

        updateProduct(
            { id, name, price: parseFloat(price), image: imagePath },
            {
                onSuccess: () => {
                    resetFields();
                    router.back();
                    setIsLoading(false);
                },
            }
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onDelete = () => {
        console.log("Deleting product: ", { name, price });

        setIsDeleting(true);
        deleteProduct(id, {
            onSuccess: () => {
                router.replace("/(admin)");
                resetFields();
                setIsDeleting(false);
            },
        });
    };

    const confirmDelete = () => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to delete this product?",
            [
                {
                    text: "Cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: onDelete,
                },
            ]
        );
    };

    const uploadImage = async () => {
        if (!image?.startsWith("file://")) {
            return;
        }

        const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: "base64",
        });
        const filePath = `${randomUUID()}.png`;
        const contentType = "image/png";
        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(filePath, decode(base64), { contentType });

        if (data) {
            return data.path;
        }
    };

    const hasChanged =
        updatingProduct &&
        (updatingProduct.name !== name ||
            updatingProduct.price.toString() !== price ||
            updatingProduct.image !== image);

    if (isDeleting) {
        return <Spinner />;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: isUpdating ? "Update Product" : "Create Product",
                }}
            />

            <Image
                source={{ uri: image || defaultPizzaImage }}
                style={styles.image}
            />
            <Text onPress={pickImage} style={styles.textButton}>
                Select Image
            </Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Name"
            />

            <Text style={styles.label}>Price ($)</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                placeholder="9.99"
                keyboardType="numeric"
            />

            <Text style={{ color: "red" }}>{errors}</Text>
            <Button
                onPress={onSubmit}
                text={
                    isLoading ? "Loading..." : isUpdating ? "Update" : "Create"
                }
                isDisabled={
                    isLoading || !name || !price || (isUpdating && !hasChanged)
                }
            />
            {isUpdating && (
                <Text
                    onPress={confirmDelete}
                    style={[styles.textButton, { color: "red" }]}>
                    Delete
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10,
    },
    image: {
        width: "50%",
        aspectRatio: 1,
        alignSelf: "center",
    },
    textButton: {
        alignSelf: "center",
        fontWeight: "bold",
        color: Colors.light.tint,
        marginVertical: 10,
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
});

export default CreateProductScreen;
