import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { useOrderDetails } from "@/api/orders";
import Spinner from "@/components/Spinner";
import { useUpdateOrderSubscription } from "@/api/orders/Subscriptions";

const OrderDetailsScreen = () => {
    const { id: idString } = useLocalSearchParams();

    const id = (idString && parseFloat(idString as string)) || 0;

    const { data: order, isLoading, error } = useOrderDetails(id);

    useUpdateOrderSubscription(id);

    if (isLoading) {
        return <Spinner />;
    }

    if (error || !order) {
        return <Text>Failed to fetch order</Text>;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Order #${id}` }} />
            <OrderListItem order={order} />

            <FlatList
                data={order.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                contentContainerStyle={{ gap: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        gap: 10,
    },
});

export default OrderDetailsScreen;
