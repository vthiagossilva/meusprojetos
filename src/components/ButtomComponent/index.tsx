import React from 'react';
import { StyleProp, Text, TextStyle, View, ViewComponent, ViewStyle } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { COLORS } from "../../theme";

interface buttomProps extends RectButtonProps {
    title: string;
    color?: string;
    textColor?: string;
    containerStyle?: StyleProp<ViewStyle>;
    textButtonProps?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    disabled?: boolean;
}

const ButtomComponent:React.FC<buttomProps> = ({ textButtonProps, title, icon, containerStyle, color, textColor, disabled, ...rest }) => {
    const realBackColor = color ?? COLORS.DEFAULT;
    const realTextColor = textColor ?? '#ddd';
    return (
        <View style={[{
            borderRadius: 30,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            marginTop: 20,
            backgroundColor: disabled ? 'rgba(0, 0, 0, 0.05)' : realBackColor,
        }, containerStyle]}>
            <RectButton style={{
                alignItems: 'center',
                flexDirection: icon ? 'row' : 'column',
                justifyContent: icon ? 'space-between' : 'center',
                paddingHorizontal: icon ? 80 : 0,
            }} {...rest}>
                {icon}
                <Text style={[{
                    color: disabled ? 'rgba(0, 0, 0, 0.4)' : realTextColor,
                    marginVertical: 10,
                    fontSize: 16,
                    fontWeight: '700',
                }, textButtonProps]}>{title}</Text>
            </RectButton>
        </View>
    );
}

export default ButtomComponent;
