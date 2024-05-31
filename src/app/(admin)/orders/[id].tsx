import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { OrderStatus, OrderStatusList } from "@/types";
import Colors from "@/constants/Colors";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import Spinner from "@/components/Spinner";

const OrderDetailsScreen = () => {
    const { id: idString } = useLocalSearchParams();

    const id = (idString && parseFloat(idString as string)) || 0;

    const { data: order, isLoading, error } = useOrderDetails(id);
    const { mutate: updateOrder } = useUpdateOrder();

    const updateStatus = (status: OrderStatus) => {
        updateOrder({ id: id, updatedFields: { status } });
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (error || !order) {
        return <Text>Failed to fetch order</Text>;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Order #${id}` }} />

            <FlatList
                data={order.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                contentContainerStyle={{ gap: 10 }}
                ListHeaderComponent={() => <OrderListItem order={order} />}
                ListFooterComponent={() => (
                    <>
                        <Text style={{ fontWeight: "bold" }}>Status</Text>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                            {OrderStatusList.map((status) => (
                                <Pressable
                                    key={status}
                                    onPress={() => updateStatus(status)}
                                    style={{
                                        borderColor: Colors.light.tint,
                                        borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginVertical: 10,
                                        backgroundColor:
                                            order.status === status
                                                ? Colors.light.tint
                                                : "transparent",
                                    }}>
                                    <Text
                                        style={{
                                            color:
                                                order.status === status
                                                    ? "white"
                                                    : Colors.light.tint,
                                        }}>
                                        {status}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </>
                )}
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
