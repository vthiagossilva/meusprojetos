import React, { useContext, useEffect } from "react";
import { Text, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from '../../styles/modal';
import globalStyle from "../../mainStyle";
import ButtomComponent from "../../components/ButtomComponent";
import ProjectManager from "../../contexts/project";
import getRealm from "../../services/realm";
import { generateUUID } from "../../functools";
import { PRESETS } from "../../static/preset";
import { categoryEntity, mainCategoriesProps } from "../../types";
import main from "../../navigation/main";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const NewProjectPreset = () => {
    const { newProject, project, setProject, mainCategories, setMainCategories } = useContext(ProjectManager);
    const { reset, navigate } = useNavigation();

    async function makeProject(type: 'construcao' | 'casamento' | 'festa' | 'negocio' | null) {
        if (type) {
            const projectID = generateUUID();
            let mainCategories: mainCategoriesProps[] = [];
            const realm = await getRealm();
            realm.write(() => {
                realm.create('Project', {
                    ...newProject,
                    id: projectID,
                })
                const types: ['main', 'step'] = ['main', 'step'];
                types.forEach(typeCategory => {
                    PRESETS[type][typeCategory].forEach((category, index) => {
                        const newCategory: categoryEntity = {
                            id: `${index}${generateUUID()}`,
                            nickname: category,
                            project: projectID,
                            type: typeCategory,
                        }
                        if (typeCategory === 'main') {
                            mainCategories.push({ id: newCategory.id, nickname: newCategory.nickname});
                        }
                        realm.create('Category', newCategory);
                    })
                })
            })
            const now = new Date();
            if (newProject) {
                setProject({ ...newProject, id: projectID, createdAt: now, updatedAt: now });
                await AsyncStorage.setItem('currentProject', projectID);
            }
            setMainCategories(mainCategories.sort((a, b) => {
                return a.id < b.id ? -1 : 1;
            }));
        } else {
            navigate('EditCategoriesPage');
        }
    }

    useEffect(() => {
        if (project.id !== '' && project.id !== '__NONE__' && mainCategories.length > 0) {
            reset({
                index: 0,
                routes: [{ name: "SubContainer" }],
            })
        }
    }, [ project, mainCategories ])

    return (
        <View style={[globalStyle.mainContainer, styles.centeredView]}>
            <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                    <Text style={globalStyle.title}>Escolher modelo</Text>
                </View>
                <View style={styles.modalBody}>
                    <View style={styles.paragraphContainer}>
                        <Text style={[globalStyle.paragraph, {marginBottom: 15}]}>Seu projeto se parece com alguma das opções abaixo?</Text>
                        <ButtomComponent title={'Construção'}
                                         icon={<Ionicons name={'home-outline'} size={20} color={'#eee'} />}
                                         onPress={async () => {
                                            await makeProject('construcao');
                                        }}
                        />
                        <ButtomComponent title={'Casamento'}
                                         icon={<Ionicons name={'heart-outline'} size={20} color={'#eee'} />}
                                         onPress={async () => {
                                            await makeProject('casamento');
                                        }}
                        />
                        <ButtomComponent title={'Festa'}
                                         icon={<MaterialCommunityIcons name={'party-popper'} size={20} color={'#eee'} />}
                                         onPress={async () => {
                                            await makeProject('festa');
                                        }}
                        />
                        <ButtomComponent title={'Negócio'}
                                         icon={<MaterialCommunityIcons name={'storefront-outline'} size={20} color={'#eee'} />}
                                         onPress={async () => {
                                            await makeProject('negocio');
                                        }}
                        />
                    </View>
                    <ButtomComponent title={'Não, quero customizar'}
                                     onPress={async () => {
                                         await makeProject(null);
                                     }}
                                     textColor={'#cacaca'} color={'rgba(255, 255, 255, 0.05)'} />
                </View>
            </View>
        </View>
    );
}

export default NewProjectPreset;
