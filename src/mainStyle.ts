import { StyleSheet } from 'react-native';
import { COLORS } from "./theme";

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.BACKGROUND,
        flex: 1,
    },
    plusButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -25,
        right: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.DEFAULT,
    },
    totalContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    total: {
        fontWeight: "600",
        fontSize: 22,
        color: "#ddd",
        marginLeft: 10
    },
    title: {
        color: "#eee",
        fontWeight: "bold",
        fontSize: 16,
    },
    paragraph: {
        color: "#eee",
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 21
    }
});

export default styles;

