import React, { useEffect, useState } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import styles from '../../mainStyle';
import { RectButton } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import getRealm from "../../services/realm";
import { toCashBR } from "../../functools";
import CustList from "../../components/CustList";
import { expenseEntity, mainCategoriesProps } from "../../types";


const MainCustList:React.FC = (props) => {
    const { addListener, navigate } = useNavigation();
    const { params } = useRoute();
    const [ total, setTotal ] = useState(0);
    // @ts-ignore
    const [ mainCategory, setMainCategory ] = useState<mainCategoriesProps>(params.mainCategory);
    const [ custs, setCusts ] = useState<expenseEntity[]>([]);

    async function getData() {
        const realm = await getRealm();
        const result: any = realm.objects('Expense').filtered(`mainCategory = '${mainCategory.id}'`).sorted('createdAt', true).toJSON();
        let newTotal = 0;
        result.forEach((e: any) => newTotal += e.value);
        setCusts(result);
        setTotal(newTotal);
    }

    useEffect(() => {
        addListener('focus', async () => {
            await getData();
        });
    }, []);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.mainContainer}>
                <CustList custs={custs} onPress={(cust) => navigate('AddCust', {editing: cust})} />
                <RectButton style={styles.plusButton} onPress={() => navigate("AddCust", {mainCategory})}>
                    <Icon name="plus" size={30} color="#fff" />
                </RectButton>
            </View>
            <TouchableWithoutFeedback
                onPress={() => navigate("AddCust", {mainCategory})}
            >
                <View style={styles.totalContainer}>
                    <Text style={styles.total}>{toCashBR(total)}</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default MainCustList;
