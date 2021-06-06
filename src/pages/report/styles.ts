import { StyleSheet } from 'react-native';
import Theme from "../../Theme";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 30,
    },
    price: {
        fontSize: 22,
        color: '#444',
        fontWeight: '600',
    },
    order: {
        fontSize: 60,
        color: Theme.COLORS.HOTLINE,
        fontWeight: '700',
    },
    footerText: {
        fontSize: 16,
        color: '#444',
        fontWeight: '600',
    }
});

export default styles;
