import Spinner from "@/components/Spinner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Link, Redirect } from "expo-router";
import { View, Button } from "react-native";

const profileScreen = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    if (!session) {
        return <Redirect href={"/sign-in"} />;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
            <Link
                style={{
                    backgroundColor: "green",
                    padding: 15,
                    alignItems: "center",
                    borderRadius: 100,
                    marginVertical: 10,
                    fontSize: 16,
                    fontWeight: "600",
                    color: "white",
                    textAlign: "center",
                }}
                href={"/"}>
                Dashboard
            </Link>
            <Button
                onPress={async () => await supabase.auth.signOut()}
                title="Sign out"
            />
        </View>
    );
};

export default profileScreen;
