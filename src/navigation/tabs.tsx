import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MainCustList from "../pages/custlist";
import ReportPage from "../pages/report";
import { useProject } from "../contexts/project";
import { useNavigation } from "@react-navigation/native";
import getRealm from "../services/realm";
import { projectEntity } from "../types";
import { UpdateMode } from "realm";

const Tab = createMaterialTopTabNavigator();

function Tabs() {
    const { addListener } = useNavigation();
    const { setNewProject } = useProject();
    const { project, mainCategories } = useProject();

    useEffect(() => {
        setNewProject(null);
        addListener('focus',async () => {
            const realm = await getRealm();
            let total = 0;
            const expenses = realm.objects('Expense').filtered(`project = '${project.id}'`);
            expenses.forEach((e: any) => {
                total += e.value;
            })
            realm.write(() => {
                realm.create('Project', {
                    total,
                    id: project.id
                }, UpdateMode.Modified);
            })
        })
    }, [])

    return (
        <Tab.Navigator tabBarOptions={{
            activeTintColor: "#eee",
            tabStyle: {
                backgroundColor: "#222d36",
                width: 'auto',
                paddingHorizontal: 25,
            },
            scrollEnabled: true,
            style: {
                backgroundColor: "#222d36",
            },
            inactiveTintColor: "#aaa",
        }} backBehavior={"none"}>
            {mainCategories.map(e => <Tab.Screen name={e.id} key={e.id}
                                           component={MainCustList}
                                           options={{
                                               title: e.nickname,
                                           }}
                                           initialParams={{mainCategory: e}} />)}
            <Tab.Screen name={'Report'} component={ReportPage} options={{title: 'Relatório'}} />
        </Tab.Navigator>
    );
}


export default Tabs;
