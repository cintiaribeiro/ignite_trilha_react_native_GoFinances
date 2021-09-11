import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex:1;
`;

export const Header = styled.View`
    width: 100%;
    height: 70%;
    background-color: ${({ theme })=> theme.color.primary};

    justify-content: flex-end;
    align-items: center;
`;

export const TitleWrapper = styled.View`
    align-items: center;
`;

export const Title = styled.Text`
    font-family: ${({ theme })=> theme.fonts.medium};
    color: ${({ theme })=> theme.color.shape};
    font-size: ${RFValue(30)}px;
    text-align: center;
    margin-top: 45px;
`;

export const SignInTitle = styled.Text`
    font-family: ${({ theme })=> theme.fonts.regular};
    color: ${({ theme })=> theme.color.shape};
    font-size: ${RFValue(15)}px;
    text-align: center;
    margin: 80px 67px;
`;

export const Footer = styled.View`
    width: 100%;
    height: 30%;
    background-color: ${({ theme })=> theme.color.secondary};
`;

export const FooterWrapper = styled.View`
    margin-top: ${RFPercentage(-4)}px;
    padding: 0 32px;
    justify-content: space-between;
`;
