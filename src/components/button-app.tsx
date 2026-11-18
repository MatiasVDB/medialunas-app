import { Pressable, StyleSheet, Text } from "react-native";

type ButtonAppProps = {
    title: string;
    onPress: () => void;
};

export function ButtonApp({
    title,
    onPress,
}: ButtonAppProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: '#ff0081'
    },

    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#ffff'
    },
});