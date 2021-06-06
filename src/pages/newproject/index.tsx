import React, { useEffect } from "react";
import { Text, View } from "react-native";

import styles from '../../styles/modal';
import mainStyle from "../../mainStyle";
import globalStyle from "../../mainStyle";
import ButtomComponent from "../../components/ButtomComponent";
import { InputBlock } from "../../components/FormComponents";
import { emptyProject, useProject } from "../../contexts/project";
import { useNavigation } from "@react-navigation/native";

const NewProjectName = () => {
    const { newProject, setNewProject, setMainCategories } = useProject();
    const { navigate, addListener } = useNavigation();

    useEffect(() => {
        addListener('focus', () => setMainCategories([]));
        if (newProject === null) {
            setNewProject(emptyProject);
        }
    }, [])

    if (newProject) {
        return (
            <View style={[globalStyle.mainContainer, styles.centeredView]}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Text style={mainStyle.title}>Novo projeto</Text>
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.paragraphContainer}>
                            <Text style={globalStyle.paragraph}>Escolha um nome para seu projeto</Text>
                            <InputBlock label={""} value={newProject.nickname}
                                        onChangeText={(e) => {
                                            setNewProject({ ...newProject, nickname: e });
                                        }}
                                        placeholder={"Meu projeto"}
                                        placeholderTextColor={"#aaa"}
                                        autoFocus={true}
                                        onEndEditing={() => navigate("NewProjectPreset")}
                            />
                        </View>
                        <ButtomComponent title={"Próximo >"}
                                         onPress={() => navigate("NewProjectPreset")}
                                         textColor={"#cacaca"} color={"rgba(255, 255, 255, 0.05)"} />

                    </View>
                </View>
            </View>
        );
    }
    return (
        <View style={[globalStyle.mainContainer, styles.centeredView]}>

        </View>
    )
}

export default NewProjectName;
