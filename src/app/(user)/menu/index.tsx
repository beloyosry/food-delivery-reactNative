import { FlatList, Text, View } from "react-native";
import ProductListItem from "@components/ProductListItem";
import { useProductList } from "@/api/products";
import Spinner from "@/components/Spinner";

export default function MenuScreen() {
    const { error, data: products, isLoading } = useProductList();

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <Text>Failed to fetch products</Text>;
    }

    return (
        <View>
            <FlatList
                data={products}
                renderItem={({ item }) => <ProductListItem product={item} />}
                numColumns={2}
                contentContainerStyle={{ gap: 10, padding: 10 }}
                columnWrapperStyle={{ gap: 10 }}
            />
        </View>
    );
}
