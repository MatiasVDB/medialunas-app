import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export function Map() {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -34.6037,
                    longitude: -58.3816,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: -34.6037,
                        longitude: -58.3816,
                    }}
                    title="Buenos Aires"
                    description="Mi primer marcador"
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: "100%",
        height: "100%",
    },
});