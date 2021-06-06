/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
import { COLORS } from "../../theme";

const styles = StyleSheet.create({
  inputBlock: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  label: {
    fontWeight: '700',
    color: '#bbb',
    fontSize: 17,
    marginBottom: 8,
    marginLeft: 5
  },
  input: {
    paddingBottom: 3,
    paddingHorizontal: 5,
    color: "#ccc",
    paddingTop: 5,
    margin: 0,
    borderRadius: 15,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    fontSize: 16,
    backgroundColor: COLORS.INPUT
  },
  switchBlock: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10
  }
});

export default styles;
