import React, { useEffect, useState } from "react";
import { View } from "react-native";
import styles from '../../mainStyle';
import { RectButton } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import getRealm from "../../services/realm";
import { projectEntity } from "../../types";
import ProjectList from "../../components/ProjectList";
import { useProject } from "../../contexts/project";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ProjectListPage:React.FC = (props) => {
    const { addListener, navigate, reset } = useNavigation();
    const [ projects, setProjects ] = useState<projectEntity[]>([]);
    const { setProject, project, setNewProject, setMainCategories, mainCategories } = useProject();
    const [ initProject, setInitProject ] = useState(project.id);
    const [ initCategories, setInitCategories ] = useState(mainCategories.map(c => c.id));

    async function getData() {
        const realm = await getRealm();
        const projects: any = realm.objects('Project').sorted('updatedAt', true);
        setProjects(projects);
    }

    async function changeProject(p: projectEntity) {
        if (p.id !== initProject) {
            const realm = await getRealm();
            const categories: any = realm.objects("Category").filtered(`project = '${p.id}' && type = 'main'`).sorted("id");
            setProject(p);
            setMainCategories(categories);
            await AsyncStorage.setItem('currentProject', p.id);
        } else {
            navigate('CustList');
        }
    }

    useEffect(() => {
        addListener('focus', async () => {
            setNewProject(null);
            setInitProject(project.id);
            setInitCategories(mainCategories.map(c => c.id));
            await getData();
        });
    }, []);

    useEffect(() => {
        if (project.id !== initProject && mainCategories.filter((c,i) => {
            return c.id === initCategories[i];
        }).length === 0 ) {
            navigate('CustList');
        }
    }, [ project, mainCategories ]);

    return (
        <View style={styles.mainContainer}>
            <View>
                <ProjectList projects={projects} onPress={changeProject} />
            </View>
            <RectButton style={[styles.plusButton, {bottom: 10}]} onPress={() => {
                reset({
                    index: 0,
                    routes: [{name: 'NewProjectNavigator'}]
                })
            }}>
                <Icon name="plus" size={35} color="#fff" />
            </RectButton>
        </View>
    );
}

export default ProjectListPage;
