import { StyleSheet } from 'react-native';
import { COLORS } from "../../theme";

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        fontSize: 18,
        marginLeft: 15,
        marginTop: 10,
        color: COLORS.SECONDARY
    },
    muted: {
        fontSize: 11,
        color: COLORS.INFO,
        marginLeft: 15
    },
    inputsContainer: {
        marginBottom: 15,
    },
    block: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 25,
        backgroundColor: COLORS.BACKGROUND,
    },
    moreLine: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: COLORS.DEFAULT,
        height: 2,
        width: '70%'
    },
    moreButtom: {
        backgroundColor: COLORS.DEFAULT,
        borderRadius: 10,
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;
