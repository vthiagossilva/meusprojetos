import React, { useContext, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "./tabs";
import AddCust from "../pages/newcust";
import Menu, { MenuItem } from "react-native-material-menu";
import IconMore from "react-native-vector-icons/Feather";
import LandingPage from "../pages/landing";
import ProjectManager, { ProjectProvider, useProject } from "../contexts/project";
import NewProjectNavigator from "./newproject";
import { useNavigation } from "@react-navigation/native";
import ProjectListPage from "../pages/projectslist";
import EditCategoriesPage from "../pages/editcategories";
import getRealm from "../services/realm";
import { UpdateMode } from "realm";

const SubContainer = createStackNavigator();
const MainContainer = createStackNavigator();

function SubNavigation() {
    const { project } = useContext(ProjectManager);

    return (
        <SubContainer.Navigator mode={"modal"}>
            <SubContainer.Screen name="CustList" component={Tabs} options={{
                title: project.nickname,
                headerRight: () => <CustomHeader />,
                headerTintColor: "#ddd",
                headerStyle: {
                    backgroundColor: "#222d36"
                }
            }} />
            <SubContainer.Screen name={'AddCust'} component={AddCust} options={{
                title: "Nova despesa",
                headerTintColor: "#ddd",
                headerStyle: {
                    backgroundColor: "#222d36"
                }
            }}  />
        </SubContainer.Navigator>
    )
}

function MainNavigation() {
  return (
      <ProjectProvider>
          <MainContainer.Navigator screenOptions={{
              headerShown: false,
          }}>
              <MainContainer.Screen name={'Landing'} component={LandingPage} />
              <MainContainer.Screen name={'NewProjectNavigator'} component={NewProjectNavigator} />
              <MainContainer.Screen name={'SubContainer'} component={SubNavigation} />
              <MainContainer.Screen name={'ProjectListPage'} component={ProjectListPage} options={{
                  title: 'Meus Projetos',
                  headerTintColor: "#ddd",
                  headerShown: true,
                  headerStyle: {
                      backgroundColor: "#222d36"
                  }
              }} />
              <MainContainer.Screen name={'EditCategoriesPage'} component={EditCategoriesPage} options={{
                  title: 'Categorias',
                  headerTintColor: "#ddd",
                  headerShown: true,
                  headerStyle: {
                      backgroundColor: "#222d36"
                  }
              }} />
          </MainContainer.Navigator>
      </ProjectProvider>
  );
}

const CustomHeader = () => {
  const menu = useRef<null | Menu>(null);
  const { project, setProject } = useProject();
  const { navigate, reset } = useNavigation();

  function showMenu() {
    menu.current?.show();
  }
  function hideMenu() {
    menu.current?.hide();
  }

  return (
    <Menu
      button={<IconMore onPress={showMenu} style={{paddingRight: 15, paddingLeft: 10}} name={'more-vertical'} size={25} color={'#fff'} />}
      ref={menu}
    >
      <MenuItem onPress={async () => {
          hideMenu();
          const realm = await getRealm();
          realm.write(() => {
              const now = new Date();
              realm.create('Project', {
                  id: project.id,
                  finish: !project.finish,
                  finishAt: project.finish ? null : now,
                  updatedAt: now,
              }, UpdateMode.Modified);
          });
          setProject({...project, finish: !project.finish});
          navigate("ProjectListPage");
      }}>Marcar como {project.finish ? 'aberto' : 'concluído'}</MenuItem>
        <MenuItem onPress={() => {
            hideMenu();
            reset({
                index: 0,
                routes: [{name: 'NewProjectNavigator'}]
            })
        }}
        >Novo projeto</MenuItem>
        <MenuItem onPress={() => {
            hideMenu();
            navigate('ProjectListPage');
        }}>Meus projetos</MenuItem>
        <MenuItem onPress={() => {
            hideMenu();
            navigate('EditCategoriesPage')
        }}>Editar categorias</MenuItem>
    </Menu>
  )
}

export default MainNavigation;
