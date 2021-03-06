import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View`
   flex: 1;
   background-color: ${({ theme})=> theme.color.background};
`;

export const Header = styled.View`
    background-color: ${({ theme })=> theme.color.primary};
    width: 100%;
    height: ${RFValue(133)}px;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;
export const Title = styled.Text`
    font-family: ${({ theme })=> theme.fonts.regular};
    font-size: ${RFValue(18)}px;
    color: ${({ theme })=> theme.color.shape};
`;
export const Form = styled.View`
    flex: 1;
    width: 100%;
    padding: 24px;
    justify-content: space-between;
`;
export const Fields = styled.View``;

export const TransactionTypes = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 8px;
    margin-bottom: 16px;

`;