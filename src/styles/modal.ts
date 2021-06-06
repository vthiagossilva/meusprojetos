import { StyleSheet } from 'react-native';
import { COLORS } from "../theme";

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: COLORS.DEFAULT,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    modalBody: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    paragraphContainer: {
        paddingTop: 10,
    }
});

export default styles;
