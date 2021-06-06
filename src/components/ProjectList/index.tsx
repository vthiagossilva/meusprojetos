import React from 'react';
import { Text, View } from "react-native";
import styles from './styles';
import { COLORS } from "../../theme";
import { FlatList, RectButton } from "react-native-gesture-handler";
import { toCashBR } from "../../functools";
import { projectEntity } from "../../types";

interface projectListProps {
  projects: projectEntity[];
  onPress(p: projectEntity): void;
}

const ProjectList:React.FC<projectListProps> = ({ projects, onPress }) => {
    return (
        <>
            {projects.filter(p => !p.finish).length > 0 && <>
                <Text style={styles.subtitle}>Atuais</Text>
                <FlatList
                    data={projects.filter(p => !p.finish)}
                    renderItem={({ item }: { item: projectEntity }) => <Item item={item}
                                                                             onTouch={() => onPress(item)} />}
                    keyExtractor={item => item.id}
                /></>}
            {projects.filter(p => p.finish).length > 0 && <>
                <Text style={styles.subtitle}>Concluídos</Text>
                <FlatList
                data={projects.filter(p => p.finish)}
                renderItem={({item}: {item: projectEntity}) => <Item item={item} onTouch={() => onPress(item)} />}
                keyExtractor={item => item.id}
                /></>}
        </>
    );
}

interface itemProps {
  item: projectEntity;
  onTouch(): void;
}


const Item:React.FC<itemProps> = ({ onTouch, item }) => (
  <View style={{
    borderBottomColor: COLORS.DEFAULT,
    borderBottomWidth: 1,
  }}>
    <RectButton style={styles.itemContainer} onPress={onTouch}>
      <Text style={styles.itemDescription}>{item.nickname}</Text>
      <Text style={styles.itemPrice}>{toCashBR(item.total)}</Text>
    </RectButton>
  </View>
);

export default ProjectList;
