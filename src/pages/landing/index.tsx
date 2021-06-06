import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from '../../styles/modal';
import ProjectManager, { useProject } from "../../contexts/project";
import { useNavigation } from "@react-navigation/native";
import mainStyle from "../../mainStyle";
import ButtomComponent from "../../components/ButtomComponent";
import globalStyle from '../../mainStyle';
import { RectButton } from "react-native-gesture-handler";

const LandingPage = () => {
    const { reset, navigate } = useNavigation();
    const { project, mainCategories } = useProject();
    const [ showWelcome, setShowWelcome ] = useState(0);

    useEffect(() => {
        if (project.id === '__NONE__') {
            setShowWelcome(1);
        } else if (project.id !== '' && mainCategories.length > 0) {
            reset({
                index: 0,
                routes: [
                    {name: 'SubContainer'},
                ]
            })
        }
    }, [ project, mainCategories ]);

    return (
        <View style={[globalStyle.mainContainer, styles.centeredView]}>
            {showWelcome > 0 && (
                <>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalHeader}>
                                <Text style={mainStyle.title}>Bem-vinda(o)!</Text>
                            </View>
                            <View style={styles.modalBody}>
                                <View style={styles.paragraphContainer}>
                                    <Text style={globalStyle.paragraph}>Ficamos felizes que esteja aqui. Você ainda não possui projetos. Que tal
                                        iniciar um agora?</Text>
                                </View>
                                <ButtomComponent title={'Novo projeto!'}
                                                 onPress={() => navigate('NewProjectNavigator')}
                                                 textColor={'#cacaca'}
                                                 color={'rgba(255, 255, 255, 0.05)'} />

                            </View>
                        </View>
                    </View>
                    <RectButton style={{
                        alignSelf: 'flex-end',
                        marginBottom: 15,
                        marginRight: 10,
                        opacity: 0,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: '#ccc',
                            opacity: 0,
                        }}>Recuperar dados</Text>
                    </RectButton>
                </>
            )}
            {showWelcome === 0 && (
                <View>
                    <Text style={{
                        color: '#eee',
                        fontWeight: '300',
                        textAlign: 'center',
                        fontSize: 16,
                        marginBottom: 5,
                    }}>meus</Text>
                    <Text style={{
                        color: '#eee',
                        fontWeight: '700',
                        fontSize: 22,
                        marginTop: 5,
                    }}>projetos</Text>
                </View>
            )}
        </View>
    );
}

export default LandingPage;
