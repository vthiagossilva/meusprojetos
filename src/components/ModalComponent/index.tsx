import React from "react";
import { Modal, ModalBaseProps, View } from "react-native";
import styles from './styles';


const ModalComponent:React.FC<ModalBaseProps> = ({ children, ...rest }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            {...rest}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {children}
                </View>
            </View>
        </Modal>
    );
}

export default ModalComponent;
