import { FlatList, Text, View } from "react-native";
import React from "react";
import OrderListItem from "@/components/OrderListItem";
import { useMyOrderList } from "@/api/orders";
import Spinner from "@/components/Spinner";

const OrdersScreen = () => {
    const { data: orders, isLoading, error } = useMyOrderList();

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <Text>Failed to fetch orders</Text>;
    }

    return orders?.length === 0 ? (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Text style={{ fontSize: 18 }}>No orders found</Text>
        </View>
    ) : (
        <FlatList
            data={orders}
            renderItem={({ item }) => <OrderListItem order={item} />}
            contentContainerStyle={{ gap: 10, padding: 10 }}
        />
    );
};

export default OrdersScreen;
