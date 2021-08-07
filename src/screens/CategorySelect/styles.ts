import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import themes from '../../global/styles/themes';

interface CategoryProps {
    isActive: boolean
}

export const Container = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({ theme })=> theme.color.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(113)}px;
    background-color: ${({ theme })=> theme.color.primary};
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;

export const Title = styled.Text`
    font-family: ${({ theme })=> theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme })=> theme.color.shape};
`;

export const Category = styled.TouchableOpacity<CategoryProps>`
    width: 100%;
    padding: ${RFValue(15)}px;
    flex-direction: row;
    align-items: center;

    background-color: ${({ isActive, theme })=> 
        isActive ? theme.color.secondary_light : theme.color.background
    };
`;

export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    margin-right: 16px;
`;

export const Name = styled.Text`
    font-family: ${({ theme })=> theme.fonts.regular};
    font-size: ${RFValue(14)}px;
`;

export const Separator = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${({ theme })=> theme.color.text};
`;

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;




