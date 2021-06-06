import React, { useEffect, useState } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import styles from "./styles";
import globalStyles from "../../mainStyle";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { InputBlock } from "../../components/FormComponents";
import { useProject } from "../../contexts/project";
import { generateUUID } from "../../functools";
import { useNavigation } from "@react-navigation/native";
import getRealm from "../../services/realm";
import Icon from "react-native-vector-icons/AntDesign";
import main from "../../navigation/main";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../theme";
import ButtomComponent from "../../components/ButtomComponent";
import ModalComponent from "../../components/ModalComponent";
import { categoryEntity, expenseEntity } from "../../types";
import { UpdateMode } from "realm";
import AsyncStorage from "@react-native-async-storage/async-storage";


const EditCategoriesPage:React.FC = () => {
    const { addListener, navigate, reset } = useNavigation();
    const projectContext = useProject();
    const project = projectContext.newProject ?? projectContext.project;
    const [ deletedCategories, setDeletedCategories ] = useState<categoryEntity[]>([]);

    const [ mainCategories, setMainCategories ] = useState([
        {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "main" },
        {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "main" }
    ]);
    const [ steps, setSteps ] = useState([
        {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "step" },
    ]);
    const [ secondaries, setSecondaries ] = useState([
        {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "secondary" },
    ]);
    const [ deleteC, setDeleteC ] = useState<null | [categoryEntity, number]>(null);


    function changeCategory(
        type: 'mainCategories' | 'step' | 'secondary',
        index: number,
        value: string,
        field: string
    ) {
        if (type === "mainCategories") {
            setMainCategories(mainCategories.map((c, i) => {
                if (i === index) {
                    return {...c, [field]: value}
                }
                return c;
            }))
        } else if (type === 'secondary') {
            setSecondaries(secondaries.map((c, i) => {
                if (i === index) {
                    return {...c, [field]: value}
                }
                return c;
            }))
        } else {
            setSteps(steps.map((c, i) => {
                if (i === index) {
                    return {...c, [field]: value}
                }
                return c;
            }))
        }
    }

    function addBlock(type: 'main' | 'step' | 'secondary') {
        if (type === 'main') {
            const len = mainCategories.length;
            if (len < 4 && (len === 0 || mainCategories.filter(a => a.nickname === '').length === 0)) {
                setMainCategories([
                    ...mainCategories,
                    {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "main" },
                ])
            }
        } else if (type === 'step') {
            const len = steps.length;
            if (len === 0 || steps.filter(a => a.nickname === '').length === 0) {
                setSteps([
                    ...steps,
                    {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "step" },
                ])
            }
        } else if (type === 'secondary') {
            const len = secondaries.length;
            if (len === 0 || secondaries.filter(a => a.nickname === '').length === 0) {
                setSecondaries([
                    ...secondaries,
                    {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "secondary" },
                ])
            }
        }
    }

    function removeBlock(type: 'main' | 'step' | 'secondary', index: number, force: boolean = false) {
        if (type === 'main' && mainCategories.length > 2) {
            if (mainCategories[index].id.length === 10 || force) {
                const newCat = [...mainCategories];
                if (force) {
                    setDeletedCategories([...deletedCategories, mainCategories[index] as categoryEntity]);
                }
                newCat.splice(index, 1)
                setMainCategories(newCat);

            } else {
                setDeleteC([mainCategories[index] as categoryEntity, index]);
            }
        } else if (type === 'step' && steps.length > 1) {
            console.log([type, index, force])
            if (steps[index].id.length === 10 || force) {
                const newSteps = [...steps];
                if (force) {
                    setDeletedCategories([...deletedCategories, steps[index] as categoryEntity]);
                }
                newSteps.splice(index, 1);
                setSteps(newSteps);
            } else {
                setDeleteC([steps[index] as categoryEntity, index]);
            }
        } else if (secondaries.length > 1) {
            if (secondaries[index].id.length === 10 || force) {
                const newSecondaries = [...secondaries];
                if (force) {
                    setDeletedCategories([...deletedCategories, secondaries[index] as categoryEntity]);
                }
                newSecondaries.splice(index, 1);
                setSecondaries(newSecondaries);
            } else {
                setDeleteC([secondaries[index] as categoryEntity, index]);
            }
        }
    }

    async function deleteCategory(categories: categoryEntity[]) {
        const realm = await getRealm();
        realm.write(() => {
            categories.forEach(category => {
                if (category.type === 'main') {
                    const expenses = realm.objects("Expense").filtered(`mainCategory =  '${category.id}'`);
                    realm.delete(expenses);
                } else {
                    const expenses: any = realm.objects("Expense").filtered(`${category.type} =  '${category.id}'`);
                    expenses.forEach((expense: expenseEntity) => {
                        realm.create('Expense', {
                            id: expense.id,
                            [category.type]: null,
                        }, UpdateMode.Modified);
                    })
                }

                const _category = realm.objects('Category').filtered(`id = '${category.id}'`);
                realm.delete(_category);
            })
        })
    }

    async function editCategory(categories: categoryEntity[], projectID: string) {
        const realm = await getRealm();
        realm.write(() => {
            categories.forEach((category, i) => {
                realm.create('Category', {
                    ...category,
                    id: category.id.length === 10 ? `${i}${generateUUID()}` : category.id,
                    project: projectID,
                }, UpdateMode.Modified);
            })
        })
    }

    async function save() {
        if (mainCategories.filter(a => a.nickname !== '').length > 1) {
            const projectID = projectContext.newProject ? generateUUID() : project.id;

            await deleteCategory(deletedCategories);
            await editCategory([...mainCategories, ...steps, ...secondaries].filter(a => a.nickname !== "") as categoryEntity[], projectID);
            const realm = await getRealm();
            if (projectContext.newProject) {
                realm.write(() => {
                    realm.create("Project", {
                        ...projectContext.newProject,
                        id: projectID
                    });
                });
            }
            const now = new Date();
            if (projectContext.newProject) {
                projectContext.setProject({
                    ...projectContext.newProject,
                    id: projectID,
                    createdAt: now,
                    updatedAt: now
                });
                await AsyncStorage.setItem("currentProject", projectID);
            }
            const categories: any = realm.objects("Category").filtered(`project = '${projectID}' && type = 'main'`).sorted("id");

            projectContext.setMainCategories(categories.filter((a: any) => a.nickname !== "").map((c: any) => {
                return {
                    id: c.id,
                    nickname: c.nickname
                };
            }));

            if (projectContext.newProject) {
                reset({
                    index: 0,
                    routes: [{ name: "SubContainer" }]
                });
            } else {
                navigate("SubContainer");
            }
        }
    }


    useEffect(() => {
        addListener('focus', async () => {
            if (projectContext.newProject === null) {
                const realm = await getRealm();
                const categories: any = realm.objects("Category").filtered(`project = '${project.id}'`);
                setMainCategories([
                        ...categories.filter((c: any) => c.type === 'main').map((c: any) => {
                            return {nickname: c.nickname, id: c.id, project: c.project, type: "main"}
                        })
                ])
                setSteps([
                        ...categories.filter((c: any) => c.type === 'step').map((c: any) => {
                            return {nickname: c.nickname, id: c.id, project: c.project, type: "step"}
                        }),
                        {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "step" },
                ]);
                setSecondaries([
                        ...categories.filter((c: any) => c.type === 'secondary').map((c: any) => {
                            return {nickname: c.nickname, id: c.id, project: c.project, type: "secondary"}
                        }),
                        {nickname: '', id: generateUUID().substr(0, 10), project: project.id, type: "secondary" },
                ])
            }
        })
    }, [])

    return (
        <ScrollView style={globalStyles.mainContainer}>
            <Text style={styles.title}>Categorias principais</Text>
            <Text style={styles.muted}>Escolha entre duas e quatro categorias principais</Text>
            <View style={styles.inputsContainer}>
                {mainCategories.map((c, i) => {
                    return (
                        <View key={c.id} style={styles.block}>
                            <InputBlock
                                containerStyle={{
                                    flex: 1,
                                }}
                                value={c.nickname}
                                onChangeText={e => changeCategory('mainCategories', i, e, 'nickname')}
                                placeholder={`Categoria ${i + 1}`}
                                placeholderTextColor={'#888'}
                            />
                            <RectButton
                                onPress={() => removeBlock('main', i)}
                                style={{
                                    width: 30,
                                    height: 35,
                                    backgroundColor: COLORS.BACKGROUND,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FontAwesome
                                    name={'trash-o'}
                                    color={COLORS.MUTED}
                                    size={23}
                                />
                            </RectButton>
                    </View>)
                })}
                {mainCategories.length < 4 && <RectButton style={styles.moreContainer} onPress={() => addBlock('main')}>
                    <View style={styles.moreLine}>
                    </View>
                    <View style={styles.moreButtom}>
                        <Icon name="plus" size={12} color="#fff" />
                    </View>
                </RectButton>}
            </View>

            <Text style={styles.title}>Fases ou categorias secundárias do projeto</Text>
            <Text style={styles.muted}>Opcional. Crie quantas quiser</Text>
            <View style={styles.inputsContainer}>
                {steps.map((c, i) => {
                    return (
                        <View key={c.id} style={styles.block}>
                            <InputBlock
                                containerStyle={{
                                    flex: 1,
                                }}
                                value={c.nickname}
                                onChangeText={e => changeCategory('step', i, e, 'nickname')}
                                placeholder={`Fase ${i + 1}`}
                                placeholderTextColor={'#888'}
                            />
                            <RectButton
                                onPress={() => removeBlock('step', i)}
                                style={{
                                    width: 30,
                                    height: 35,
                                    backgroundColor: COLORS.BACKGROUND,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FontAwesome
                                    name={'trash-o'}
                                    color={COLORS.MUTED}
                                    size={23}
                                />
                            </RectButton>
                        </View>)
                })}
                {(steps.filter(a => a.nickname === '').length === 0) && <RectButton style={styles.moreContainer} onPress={() => addBlock("step")}>
                    <View style={styles.moreLine}>
                    </View>
                    <View style={styles.moreButtom}>
                        <Icon name="plus" size={12} color="#fff" />
                    </View>
                </RectButton>}
            </View>

            <Text style={styles.title}>Categorias extras</Text>
            <Text style={styles.muted}>Opcional. Crie quantas quiser</Text>
            <View style={styles.inputsContainer}>
                {secondaries.map((c, i) => {
                    return (
                        <View key={c.id} style={styles.block}>
                            <InputBlock
                                    containerStyle={{
                                        flex: 1,
                                    }}
                                value={c.nickname}
                                onChangeText={e => changeCategory('secondary', i, e, 'nickname')}
                                placeholder={`Categoria ${i + 1}`}
                                placeholderTextColor={'#888'}
                            />
                            <RectButton
                                onPress={() => removeBlock('secondary', i)}
                                style={{
                                    width: 30,
                                    height: 35,
                                    backgroundColor: COLORS.BACKGROUND,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FontAwesome
                                    name={'trash-o'}
                                    color={COLORS.MUTED}
                                    size={23}
                                />
                            </RectButton>
                    </View>)
                })}
                {(secondaries.filter(a => a.nickname === '').length === 0) && <RectButton style={styles.moreContainer} onPress={() => addBlock("secondary")}>
                    <View style={styles.moreLine}>
                    </View>
                    <View style={styles.moreButtom}>
                        <Icon name="plus" size={12} color="#fff" />
                    </View>
                </RectButton>}
            </View>
            <ButtomComponent title={'Salvar'} containerStyle={{
                marginVertical: 10,
            }}
                             onPress={save}
            />
            {projectContext.newProject === null && <RectButton
                style={{
                    alignSelf: "center",
                    marginTop: 10,
                    marginBottom: 15
                }}
                onPress={() => navigate("SubContainer")}
            >
                <Text
                    style={{
                        color: COLORS.MUTED
                    }}
                >CANCELAR</Text>
            </RectButton>}
            <ModalComponent
                visible={!!deleteC}
                onRequestClose={() => setDeleteC(null)}
            >
                {!!deleteC &&
                <>
                    <Text
                        style={{
                            fontSize: 16,
                            marginBottom: 15,
                            color: '#eee'
                        }}
                    >
                        Deletar categoria "<Text style={{fontWeight: '700'}}>{deleteC[0].nickname}</Text>"?</Text>
                    {deleteC[0].type === 'main' && <Text style={{color: '#eee'}}>Todas os gastos associados serão permanentemente deletados também.</Text>}

					<TouchableWithoutFeedback
						onPress={() => {
                            removeBlock(deleteC[0].type, deleteC[1], true);
                            setDeleteC(null);
                        }}
					>
                        <ButtomComponent title={'DELETAR'} containerStyle={{
                            justifyContent: 'space-between',
                        }}
                                         textButtonProps={{
                                             marginVertical: 8,
                                             fontSize: 15,
                                         }}
                                         color={COLORS.ERROR} icon={
                            <FontAwesome
                                name={'trash-o'}
                                color={COLORS.WHITE}
                                size={23}
                            />
                        }
                        />
					</TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
						onPress={() => setDeleteC(null)}
					>
                        <RectButton
                            style={{
                                alignSelf: 'center',
                                marginTop: 20,
                                marginBottom: 5,
                            }}
                            onPress={() => setDeleteC(null)}
                        >
                            <Text
                                style={{
                                    color: COLORS.MUTED
                                }}
                            >Cancelar</Text>
                        </RectButton>
					</TouchableWithoutFeedback>
                </>}
            </ModalComponent>
        </ScrollView>
    );
}

export default EditCategoriesPage;
