import React, { useEffect, useState } from "react";
import { Text, View, SectionList } from "react-native";
import styles from './styles';
import { COLORS } from "../../theme";
import { FlatList, RectButton } from "react-native-gesture-handler";
import { convertDate, toCashBR } from "../../functools";
import { expenseEntity } from "../../types";

interface custListProps {
  custs: expenseEntity[];
  onPress(cust: expenseEntity): void;
  header?: React.ReactComponentElement<any>;
}

const CustList:React.FC<custListProps> = ({ custs, header, onPress }) => {
    const [ reorganizedCusts, setReorganizedCusts ] = useState(reorganize(custs));

    function reorganize(c: expenseEntity[]): {title: string, data: expenseEntity[]}[] {
        let dates = c.map(expense => expense.createdAt.toDateString());
        dates = dates.filter((este, i) => dates.indexOf(este) === i)
            .sort((a, b) => new Date(a) < new Date(b) ? 1 : -1);
        let newCusts: {title: string, data: expenseEntity[]}[] = [];

        dates.forEach(date => {
            newCusts.push({
                title: convertDate(new Date(date), "date"),
                data: c.filter(expense => expense.createdAt.toDateString() === date),
            })
        })

        return newCusts;
    }

    useEffect(() => {
        setReorganizedCusts(reorganize(custs));
    }, [ custs ]);

    return (
        <>
            <SectionList
                sections={reorganizedCusts}
                ListHeaderComponent={header}
                keyExtractor={item => item.id}
                renderItem={({ item }: {item: expenseEntity}) => <Item item={item} onTouch={() => onPress(item)} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={{
                        alignSelf: 'center',
                        color: '#ddd',
                        fontSize: 14,
                        marginTop: 8,
                        marginBottom: 3,
                    }}>{title}</Text>
                )}
            /></>
    );
}

interface itemProps {
  item: expenseEntity;
  onTouch(): void;
}


const Item:React.FC<itemProps> = ({ onTouch, item }) => (
  <View style={{
    borderBottomColor: COLORS.DEFAULT,
    borderBottomWidth: 1,
  }}>
    <RectButton style={styles.itemContainer} onPress={onTouch}>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>{toCashBR(item.value)}</Text>
    </RectButton>
  </View>
);

export default CustList;
