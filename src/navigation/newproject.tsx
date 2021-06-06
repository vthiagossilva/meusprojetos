import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewProjectName from "../pages/newproject";
import NewProjectPreset from "../pages/newproject/preset";

const Nav = createStackNavigator();

const NewProjectNavigator = () => {
    return (
        <Nav.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Nav.Screen name={'NewProjectName'} component={NewProjectName} />
            <Nav.Screen name={'NewProjectPreset'} component={NewProjectPreset} />
        </Nav.Navigator>
    )
}

export default NewProjectNavigator;
