import { StyleSheet } from 'react-native';
import { COLORS } from "../../theme";

const styles = StyleSheet.create({
    lateralButtonContainer: {
        width: '100%',
        borderTopColor: COLORS.BLACK,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.BLACK,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    lateralButton: {
        backgroundColor: COLORS.BACKGROUND,
        paddingVertical: 10,
    },
    lateralButtonText: {
        color: '#eee',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600'
    }
});

export default styles;
