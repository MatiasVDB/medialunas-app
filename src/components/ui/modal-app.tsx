import { PlacesScreen } from '@/components/map-component';
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
type ModalAppProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void; // Recibe la cantidad seleccionada
};

export function ModalApp({ visible, onClose, onConfirm }: ModalAppProps) {
    const [quantity, setQuantity] = useState(1);
    const [valoration, setValoration] = useState(0);
    const [stars, setStars] = useState<{ icon: "star" | "star-outline"; value: number }[]>([
        { icon: "star-outline", value: 1 },
        { icon: "star-outline", value: 2 },
        { icon: "star-outline", value: 3 },
        { icon: "star-outline", value: 4 },
        { icon: "star-outline", value: 5 },
    ]);

    const handleConfirm = () => {
        onConfirm(quantity);
        onConfirm(valoration);
        setQuantity(1);
        setValoration(0);
        onClose();
    };

    const handleClose = () => {
        setQuantity(1);
        setValoration(0);
        onClose();
    };

    const updateStarsIcon = (quantiy: number) => {
        setStars((prevStars) =>
        (prevStars.map((star, index) =>
            index <= quantiy
                ? { ...star, icon: "star" }
                : { ...star, icon: "star-outline" }
        )
        ));
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Pressable style={styles.cancelbutton} onPress={handleClose}>
                        <Text>x</Text>
                    </Pressable>

                    <View style={styles.containerElements}>
                        <Text style={styles.title}>Registrar medialunas</Text>
                        {/* Controles del contador */}
                        <View style={styles.containerbuttons}>
                            <Pressable style={styles.pressbutton} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                                <Text style={styles.presbuttontext}>-</Text>
                            </Pressable>

                            <Text>{quantity}</Text>

                            <Pressable style={styles.pressbutton} onPress={() => setQuantity(q => q + 1)}>
                                <Text style={styles.presbuttontext}>+</Text>
                            </Pressable>
                        </View>
                        <Text style={styles.title}>Lugar</Text>
                        <View style={{ width: '90%', height: 200 }}>
                            < PlacesScreen />
                        </View>

                        <Text style={styles.title}>Valoración</Text>
                        <View style={styles.starscontainer}>
                            {stars.map((star) => (
                                <Pressable key={star.value} onPress={() => { setValoration(star.value); updateStarsIcon(star.value - 1) }}>
                                    <Ionicons style={styles.starofficon} name={star.icon}
                                    />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                    {/* Botón para guardar */}
                    {/* <ButtonApp title="Agregar al total" onPress={handleConfirm} /> */}
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    overlay: {
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        backgroundColor: '#008080',
        width: '80%',
        height: '80%',
        borderRadius: 10,
    },

    containerElements: {
        alignItems: 'center',
        gap: 10
    },
    starscontainer: {
        flexDirection: "row",
        gap: 10,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
    },

    cancelbutton: {
        alignItems: "flex-end",
        padding: 10,
    },

    containerbuttons: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 10,
    },

    pressbutton: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        width: 20,
        borderColor: '#ffff',
        borderWidth: 1,
        borderRadius: 5,
    },

    presbuttontext: {
        color: '#ffff',
        fontSize: 25,
    },
    starofficon: {
        color: '#FA4E93',
        fontSize: 24,
    },
});