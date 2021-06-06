import React, { useRef } from "react";
import {Picker} from '@react-native-picker/picker';
import {
  PickerProps,
  StyleProp,
  Switch, SwitchProps,
  Text,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from "react-native";
import styles from './styles';
import DatePicker, { DatePickerProps } from "react-native-date-picker";



interface inputBlockProps extends TextInputProps {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    autocompleteOptions?: string[];
    onSelect?(e: string): void;
}

export const InputBlock:React.FC<inputBlockProps> = ({ autocompleteOptions, onSelect, label, containerStyle, ...rest }) => {
    const inputRef = useRef<null | TextInput>(null);

    return (
      <TouchableWithoutFeedback onPress={() => {
          inputRef.current?.focus();
      }}>
          <View style={[styles.inputBlock, containerStyle ?? {}]}>
              {!!label && <Text style={styles.label}>{label}</Text>}
              <TextInput ref={inputRef} style={styles.input} {...rest} />
          </View>
      </TouchableWithoutFeedback>
    )
}


interface selectBlockProps extends PickerProps {
    label: string;
    options: { value: string, label: string }[];
    containerStyle?: StyleProp<ViewStyle>;
}

export const SelectBlock:React.FC<selectBlockProps> = ({ label, options, containerStyle, ...rest}) => {
    return (
      <View style={[styles.inputBlock, containerStyle ?? {}]}>
          <Text style={styles.label}>{label}</Text>
          <Picker
            mode={'dropdown'}
            style={[styles.input, {height: 37}]}
            {...rest}
          >
            {options.map(o => <Picker.Item key={o.value} value={o.value} label={o.label} />)}
          </Picker>
      </View>
    )
}

interface switchBlockProps extends SwitchProps {
    label: string;
    onTouch(): void;
    containerStyle?: StyleProp<ViewStyle>;
}

export const SwitchBlock:React.FC<switchBlockProps> = ({ onTouch, containerStyle, label, ...rest }) => {
    return (
      <TouchableWithoutFeedback onPress={onTouch}>
        <View style={[styles.switchBlock, containerStyle ?? {}]}>
          <Text style={styles.label}>{label}</Text>
          <Switch {...rest} />
        </View>
      </TouchableWithoutFeedback>
    )
}


interface dateBlockProps extends DatePickerProps {
    label: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export const DateBlock:React.FC<dateBlockProps> = ({ label, containerStyle, ...rest}) => {
    return (
        <View style={[styles.inputBlock, containerStyle ?? {}]}>
            <Text style={styles.label}>{label}</Text>
            <DatePicker
                style={{
                    alignSelf: 'center',
                }}
                textColor={'#fff'}
                androidVariant={'nativeAndroid'}
                {...rest}
            />
        </View>
    )
}
