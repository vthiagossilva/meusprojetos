import React, { useEffect, useRef, useState } from "react";
import {Animated, Dimensions, Text, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  ScrollView,
  State,
  TouchableWithoutFeedback
} from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import { custProps } from "../newcust";
import CustList from "../../components/CustList";
import { COLORS } from "../../theme";

const dim = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};

interface drawerListProps {
    custs: custProps[];
    onTouch(cust: custProps): void;
    requestClose: void;
}

const DrawerList:React.FC<drawerListProps> = ({ custs, onTouch, children }) => {
    const translateY = new Animated.Value(dim.height);
    const [ state,setState ] = useState(0);

    function onHandlerStateChange(event: PanGestureHandlerStateChangeEvent) {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const {translationY} = event.nativeEvent;
            if (translationY < -1) {
              setState(1);
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }).start();

            }
            if (translationY > 1) {
              setState(0);
                Animated.timing(translateY, {
                    toValue: dim.height,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
                translateY.setValue(dim.height);
            }
        }
    }

    function requestClose() {
      Animated.timing(translateY, {
        toValue: dim.height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return (
        <PanGestureHandler
            onHandlerStateChange={onHandlerStateChange}
        >
            <Animated.View style={{
                width: dim.width,
                position: 'absolute',
                left: 0,
                bottom: 0,
            }}>
                {children}
                <Animated.View style={{
                    backgroundColor: COLORS.BACKGROUND,
                    borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                    borderColor: '#444',
                    borderWidth: 1,
                    width: dim.width,
                    height: dim.height * .45,
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    transform: [
                        {
                            translateY: translateY,
                        },
                    ],
                    opacity: translateY.interpolate({
                        inputRange: [50, dim.height],
                        outputRange: [1, 0],
                    }),
                }}>
                  <TouchableWithoutFeedback onPress={requestClose}>
                  <Entypo color={'#ddd'} size={22} name={'chevron-down'} style={{alignSelf: 'center'}} />
                    <CustList custs={custs} onPress={(cust) => onTouch(cust)} />
                  </TouchableWithoutFeedback>
                </Animated.View>
            </Animated.View>
        </PanGestureHandler>
    );
}

export default DrawerList;
