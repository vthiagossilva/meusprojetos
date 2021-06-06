import React, { useContext, useEffect, useState } from "react";
import DatePicker from 'react-native-date-picker'
import { Text, View } from "react-native";
import styles from "../../mainStyle";
import { InputBlock, SelectBlock, SwitchBlock } from "../../components/FormComponents";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import ButtomComponent from "../../components/ButtomComponent";
import { useNavigation, useRoute } from "@react-navigation/native";
import getRealm from "../../services/realm";
import { generateUUID } from "../../functools";
import ProjectManager from "../../contexts/project";
import { categoryEntity, expenseEntity, mainCategoriesProps } from "../../types";
import { UpdateMode } from "realm";
import { COLORS } from "../../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const AddCust:React.FC = () => {
    const {navigate} = useNavigation();
    const { params } = useRoute() as {params: {mainCategory: mainCategoriesProps | null, editing?: expenseEntity | null}};
    const { project, mainCategories } = useContext(ProjectManager);
    const [ steps, setSteps ] = useState<{value: string, label: string}[]>([]);
    const [ secondaries, setSecondaries ] = useState<{value: string, label: string}[]>([]);

    const [ cust, setCust ] = useState<custProps>({id: '',
        description: '',
        value: '',
        pay: true,
        createdAt: new Date(),
        secondaryCategory: "",
        step: '',
        mainCategory: '',
        project: project.id,
    });

    function changeCust(field: string, value: any) {
        setCust({...cust, [field]: value})
    }

    useEffect(() => {
        const type: mainCategoriesProps | null = params ? (params.mainCategory ?? null) : null;
        const editing: expenseEntity | null = params ? (params.editing ?? null) : null;

        if (type) {
            changeCust('mainCategory', type.id);
            params.mainCategory = null;
        }
        if (editing) {
            setCust({
                id: editing.id,
                description: editing.description,
                step: editing.step,
                secondaryCategory: editing.secondaryCategory,
                pay: editing.pay,
                createdAt: editing.createdAt,
                value: editing.value.toString(),
                mainCategory: editing.mainCategory,
                project: editing.project,
                user: editing.user
            })
            params.editing = null;
        }
    }, [ params ]);

    useEffect(() => {
        (async () => {
            const realm = await getRealm();
            const newSteps: any = realm.objects('Category').filtered(`project = '${project.id}'`);
            setSteps([{value: null, label: ''}, ...newSteps.filter((a: categoryEntity) => a.type === 'step').map((a: categoryEntity) => {
                return {value: a.id, label: a.nickname};
            })]);
            setSecondaries([{value: null, label: ''}, ...newSteps.filter((a: categoryEntity) => a.type === 'secondary').map((a: categoryEntity) => {
                return {value: a.id, label: a.nickname};
            })]);
        })()
    }, [ project ]);

    async function deleteExpense() {
        const realm = await getRealm();
        const value = parseFloat(cust.value !== "" ? cust.value : "0");

        realm.write(() => {
            const self = realm.objects('Expense').filtered(`id = '${cust.id}'`);
            realm.delete(self);
            const workProject: any = realm.objects("Project").filtered(`id = '${project.id}'`)[0];
            realm.create("Project", {
                id: project.id,
                updatedAt: new Date()
            }, UpdateMode.Modified);
        })

        navigate(cust.mainCategory);
    }

    async function save() {
        if (parseFloat(cust.value !== "" ? cust.value : "0") > 0) {
            const realm = await getRealm();
            const value = parseFloat(cust.value !== "" ? cust.value : "0");
            realm.write(() => {
                if (cust.id === "") {
                    realm.create("Expense", {
                        ...cust,
                        id: generateUUID(),
                        value
                    });
                } else {
                    realm.create("Expense", {
                        ...cust,
                        value
                    }, UpdateMode.Modified);
                }
                const workProject: any = realm.objects("Project").filtered(`id = '${project.id}'`)[0];
                realm.create("Project", {
                    id: project.id,
                    updatedAt: new Date(),
                }, UpdateMode.Modified);
            });

            navigate(cust.mainCategory);
        }
    }

    return (
        <View style={[styles.mainContainer]}>
        <ScrollView>
                <InputBlock value={cust.description} label={'Descrição'} onChangeText={t => changeCust('description', t)} />
                <InputBlock value={cust.value} label={'Valor'} keyboardType={'numeric'} onChangeText={t => changeCust('value', t)} />
                {steps.length > 1 && <SelectBlock selectedValue={cust.step}
                             onValueChange={(i: string) => changeCust('step', i)}
                             label={'Fase do projeto'} options={steps} />}
                {secondaries.length > 1 && <SelectBlock selectedValue={cust.secondaryCategory}
                             onValueChange={(i: string) => changeCust('secondaryCategory', i)}
                             label={'Categoria extra'} options={secondaries} />}
                <SelectBlock label={'Tipo'}
                             onValueChange={(i: string) => changeCust('mainCategory', i)}
                             selectedValue={cust.mainCategory}
                             options={mainCategories.map(c => {
                                 return {value: c.id, label: c.nickname};
                             })}
                />
                <DatePicker
                    style={{
                        alignSelf: 'center',
                    }}
                    textColor={'#fff'}
                    androidVariant={'nativeAndroid'}
                    date={cust.createdAt}
                    onDateChange={(e) => changeCust('createdAt', e)}
                    mode={'date'}
                />
                <RectButton onPress={() => changeCust('createdAt', new Date())} style={{
                    alignSelf: 'center',
                    marginBottom: 10,
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#ddd',
                    }}>HOJE</Text>
                </RectButton>
                <SwitchBlock label={'Quitado'} onTouch={() => setCust({...cust,  pay: !cust.pay})}
                             value={cust.pay} onValueChange={(e) => setCust({...cust,  pay: e})} />
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                }}
            >
            <ButtomComponent containerStyle={{
                marginHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
            }} title={'Salvar'} onPress={async () => await save()} />
            {cust.id !== "" && (
                <RectButton
                    style={{
                        backgroundColor: COLORS.ERROR,
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        marginLeft: 5,
                        marginTop: 5,
                        borderRadius: 5,
                        alignSelf: 'flex-start'
                    }}
                    onPress={deleteExpense}
                >
                    <FontAwesome
                        name={'trash-o'}
                        color={COLORS.WHITE}
                        size={23}
                    />
                </RectButton>
            )}
            </View>
        </ScrollView>
        </View>
    );
}
/*
 */

interface custProps {
    id: string;
    description: string;
    value: string;
    pay: boolean;
    createdAt: Date;
    secondaryCategory?: string;
    step?: string;
    mainCategory: string;
    project: string;
    user?: string;
}

export default AddCust;
