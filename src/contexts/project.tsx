import React, { createContext, useContext, useEffect, useState } from "react";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { COLORS } from "../theme";
import getRealm from "../services/realm";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categoryEntity, mainCategoriesProps, projectEntity } from "../types";


interface projectProps {
    project: projectEntity;
    newProject: projectEntity | null;
    mainCategories: mainCategoriesProps[];
    setProject(v: projectEntity): void;
    setNewProject(v: projectEntity | null): void;
    setMainCategories(v: mainCategoriesProps[]): void;
}

const ProjectManager = createContext<projectProps>({} as projectProps);
export const useProject = () => useContext(ProjectManager);

export const ProjectProvider:React.FC = ({ children }) => {
    const [ project, setProject ] = useState(emptyProject);
    const [ newProject, setNewProject ] = useState<projectEntity | null>(null);
    const [ mainCategories, setMainCategories ] = useState<mainCategoriesProps[]>([]);

    async function getData() {
        const realm = await getRealm();
        const currentProject: string | null = await AsyncStorage.getItem('currentProject');
        if (currentProject) {
            let projects: any = realm.objects('Project').filtered(`id = '${currentProject}'`);
            if (projects.length > 0) {
                const categories: mainCategoriesProps[] = realm.objects('Category')
                    .filtered(`project = '${projects[0].id}' && type = 'main'`)
                    .sorted('id')
                    .map((a: any) => {
                        return {id: a.id, nickname: a.nickname};
                    })
                setProject(projects[0]);
                setMainCategories(categories);
                return;
            } else {
                projects = realm.objects('Project').sorted('updatedAt');
                if (projects.length > 0) {
                    const categories: mainCategoriesProps[] = realm.objects('Category')
                        .filtered(`project = '${projects[0].id}' && type = 'main'`)
                        .sorted('id')
                        .map((a: any) => {
                            return {id: a.id, nickname: a.nickname};
                        })
                    setProject(projects[0]);
                    setMainCategories(categories);
                    return;
                }
            }
        }
        setProject({...emptyProject, id: '__NONE__'});
    }

    useEffect(() => {
        (async () => {
            await changeNavigationBarColor(COLORS.BACKGROUND, false, false);
            await getData();
        })()
    }, []);

    return (
        <ProjectManager.Provider value={{
            project,
            mainCategories,
            setMainCategories,
            setProject,
            newProject,
            setNewProject,
        }}>
            {children}
        </ProjectManager.Provider>
    )
}

export const emptyProject: projectEntity = {
    id: '',
    nickname: '',
    finish: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    total: 0,
}

export default ProjectManager;
