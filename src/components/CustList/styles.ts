import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  itemContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemDescription: {
    fontWeight: "600",
    fontSize: 16,
    color: "#ddd",
  },
  itemPrice: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
});

export default styles;
