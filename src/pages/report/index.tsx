import React, { useEffect, useState } from "react";
import { Text, View, Dimensions } from "react-native";
import styles from '../../mainStyle';
import getRealm from "../../services/realm";
import { toCashBR } from "../../functools";
import { DateBlock, SelectBlock } from "../../components/FormComponents";
import { useNavigation } from "@react-navigation/native";
import CustList from "../../components/CustList";
import { categoryEntity, expenseEntity } from "../../types";
import { useProject } from "../../contexts/project";
import { ScrollView } from 'react-native-gesture-handler'
import DatePicker from "react-native-date-picker";


const ReportPage:React.FC = () => {
    const {navigate, addListener} = useNavigation();
    const  { project, mainCategories } = useProject();
    const [ payStatus, setPayStatus ] = useState('0');
    const [ total, setTotal ] = useState(0);
    const [ custs, setCusts ] = useState<expenseEntity[]>([]);
    const [ lapse, setLapse ] = useState({
        begin: new Date(),
        end: new Date(),
    });
    const [ categories, setCategories ] = useState<{[key: string]: {value: string, label: string}[]}>({
        mainCategory: [noneOption, ...mainCategories.map(a => {
            return {label: a.nickname, value: a.id};
        })],
        steps: [noneOption],
        secondaryCategory: [noneOption],
    })

    const [ filters, setFilters ] = useState({
        mainCategory: "",
        secondaryCategory: "",
        step: "",
    })

    function changeFilters(field: string, value: string) {
        setFilters({...filters, [field]: value});
    }

    async function getData() {
        const realm = await getRealm();
        let filter = `project = '${project.id}'`;
        if (filters.mainCategory !== '') {
            filter += ` && mainCategory = '${filters.mainCategory}'`;
        }
        if (filters.secondaryCategory !== '') {
            filter += ` && secondaryCategory = '${filters.secondaryCategory}'`;
        }
        if (filters.step !== '') {
            filter += ` && step = '${filters.step}'`;
        }
        if (payStatus !== '0') {
            filter += ` && pay = ${payStatus === '1' ? 1 : 0}`
        }
        const result: any = realm.objects('Expense')
            .filtered(filter)
            .filtered(`createdAt >= $0 && createdAt <= $1`, lapse.begin, lapse.end)
            .sorted('createdAt', true)
            .toJSON();
        let newTotal = 0;
        result.forEach((e: expenseEntity) => newTotal += e.value);
        setCusts(result);
        setTotal(newTotal);
    }

    useEffect(() => {
        getData();
    }, [ filters, categories, payStatus, lapse ])

    useEffect(() => {
        (async () => {
            setCategories({
                mainCategory: [noneOption, ...mainCategories.map(a => {
                    return {label: a.nickname, value: a.id};
                })],
                steps: [noneOption],
                secondaryCategory: [noneOption],
            });
            const realm = await getRealm();
            const firstCust = realm.objects('Expense').filtered(`project = '${project.id}'`).min('createdAt') as Date;
            console.log(firstCust);
            if (firstCust) {
                setLapse({ ...lapse, begin: firstCust });
            }
        })()
    }, [ project, mainCategories ]);

    useEffect(() => {
        addListener('focus', async () => {
            await getData();
            const realm = await getRealm();
            const newSteps: any = realm.objects('Category').filtered(`project = '${project.id}' && type = 'step'`).sorted('id');
            const newSecondaries: any = realm.objects('Category').filtered(`project = '${project.id}' && type = 'secondary'`).sorted('id');
            setCategories({...categories, steps: [noneOption, ...newSteps.map((s: categoryEntity) => {
                return {value: s.id, label: s.nickname};
            })], secondaryCategory: [noneOption, ...newSecondaries.map((s: categoryEntity) => {
                    return {value: s.id, label: s.nickname};
                })]});
        });
    }, []);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.mainContainer}>
                <CustList
                    header={<>
                        <SelectBlock label={'Categoria principal'}
                                     onValueChange={(i: string) => changeFilters('mainCategory', i)}
                                     selectedValue={filters.mainCategory}
                                     options={categories.mainCategory}
                        />
                        {categories.steps.length > 1 && <SelectBlock label={'Fase do projeto'}
																	 onValueChange={(i: string) => changeFilters('step', i)}
																	 selectedValue={filters.step}
																	 options={categories.steps}
						/>}
                        {categories.secondaryCategory.length > 1 && <SelectBlock label={'Categoria extra'}
																				 onValueChange={(i: string) => changeFilters('secondaryCategory', i)}
																				 selectedValue={filters.secondaryCategory}
																				 options={categories.secondaryCategory}
						/>}
                        <DateBlock
                            label={'A partir de'}
                            date={lapse.begin}
                            onDateChange={(e) => setLapse({...lapse, begin: e})}
                            mode={'date'}
                        />
                        <DateBlock
                            label={'Até'}
                            date={lapse.end}
                            onDateChange={(e) => setLapse({...lapse, end: e})}
                            mode={'date'}
                        />
                        <SelectBlock label={'Status de pagamento'}
                                     onValueChange={(i: string) => setPayStatus(i)}
                                     selectedValue={payStatus}
                                     options={availableStatus}
                        />
                    </>}
                    custs={custs}
                    onPress={(cust) => navigate("AddCust", {editing: cust})} />
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.total}>{toCashBR(total)}</Text>
            </View>
        </View>
    );
}

const noneOption = {value: '', label: ''};
const availableStatus = [{
    label: 'Todos',
    value: '0',
}, {
    label: 'Quitados',
    value: '1',
}, {
    label: 'Em aberto',
    value: '2',
}]


export default ReportPage;
