import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

type PlaceSuggestion = {
    placeId: string;
    description: string;
};

type SelectedPlace = {
    name: string;
    latitude: number;
    longitude: number;
};

export function PlacesScreen() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [place, setPlace] = useState<SelectedPlace | null>(null);
    const [savedPlaces, setSavedPlaces] = useState<SelectedPlace[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const searchPlaces = (text: string) => {
        setQuery(text);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (text.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    "https://places.googleapis.com/v1/places:autocomplete",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Goog-Api-Key": API_KEY,
                        },
                        body: JSON.stringify({
                            input: text,
                            languageCode: "es",
                            includedRegionCodes: ["ar"],
                        }),
                    }
                );

                const data = await response.json();

                if (data.suggestions) {
                    const mapped: PlaceSuggestion[] = data.suggestions
                        .filter((item: any) => item.placePrediction)
                        .map((item: any) => ({
                            placeId: item.placePrediction.placeId,
                            description: item.placePrediction.text?.text ?? "",
                        }));
                    setSuggestions(mapped);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Error buscando lugares:", error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const selectPlace = async (suggestion: PlaceSuggestion) => {
        setQuery(suggestion.description);
        setSuggestions([]);

        try {
            setLoading(true);
            const response = await fetch(
                `https://places.googleapis.com/v1/places/${suggestion.placeId}`,
                {
                    method: "GET",
                    headers: {
                        "X-Goog-Api-Key": API_KEY,
                        "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
                    },
                }
            );

            const details = await response.json();

            if (details.location) {
                setPlace({
                    name: details.displayName?.text ?? suggestion.description,
                    latitude: details.location.latitude,
                    longitude: details.location.longitude,
                });
            }
        } catch (error) {
            console.error("Error obteniendo detalles del lugar:", error);
        } finally {
            setLoading(false);
        }
    };

    const savePlace = () => {
        if (!place) return;
        setSavedPlaces((prev) => [...prev, place]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar un lugar..."
                        placeholderTextColor="#888"
                        value={query}
                        onChangeText={searchPlaces}
                    />
                    {loading && <ActivityIndicator size="small" style={styles.loader} />}
                </View>

                {suggestions.length > 0 && (
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.placeId}
                        keyboardShouldPersistTaps="handled"
                        style={styles.suggestionsList}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.suggestionItem}
                                onPress={() => selectPlace(item)}
                            >
                                <Text style={styles.suggestionText} numberOfLines={1}>
                                    {item.description}
                                </Text>
                            </Pressable>
                        )}
                    />
                )}
            </View>

            <MapView
                style={styles.map}
                region={
                    place
                        ? {
                            latitude: place.latitude,
                            longitude: place.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }
                        : {
                            latitude: -34.6037,
                            longitude: -58.3816,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }
                }
            >
                {place && (
                    <Marker
                        coordinate={{
                            latitude: place.latitude,
                            longitude: place.longitude,
                        }}
                        title={place.name}
                    />
                )}
                {savedPlaces.map((saved, index) => (
                    <Marker
                        key={`${saved.name}-${index}`}
                        coordinate={{
                            latitude: saved.latitude,
                            longitude: saved.longitude,
                        }}
                        title={saved.name}
                    />
                ))}
            </MapView>

            <View style={styles.buttonContainer}>
                <Button
                    title="Guardar lugar"
                    onPress={savePlace}
                    disabled={!place}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        position: "absolute",
        top: 10,
        left: 10,
        right: 10,
        zIndex: 10,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 8,
        paddingHorizontal: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        height: 40,
        color: "#000000",
        fontSize: 14,
    },
    loader: {
        marginLeft: 8,
    },
    suggestionsList: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 140,
        elevation: 4,
    },
    suggestionItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e0e0e0",
    },
    suggestionText: {
        color: "#222222",
        fontSize: 13,
    },
    map: {
        flex: 1,
    },
    buttonContainer: {
        padding: 8,
    },
});
