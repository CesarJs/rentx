import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

interface ButtonProps {
	color?: string;
}

interface TitleProps {
	light?: boolean;
}
export const Container = styled(RectButton)<ButtonProps>`
	width: 100%;
	padding: 19px;
	align-items: center;
	justify-content: center;
	background-color: ${({ color, theme }) => color ? color : theme.colors.main};
	margin-bottom: 8px;
`;

export const Title = styled.Text<TitleProps>`
	font-family: ${({ theme }) => theme.fonts.primary_500};
	font-size:${RFValue(15)}px ;
	color: ${({ light, theme }) => light ? theme.colors.header : theme.colors.shape};

`;
