import styled, { css } from 'styled-components/native';
import { TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface ContainerProps {
	isFocused: boolean;
}


export const Container = styled.View<ContainerProps>`
	flex-direction: row;

	${({isFocused, theme}) => isFocused && css`
		border-bottom-width: 2px;
		border-bottom-color: ${({theme}) => theme.colors.main};
	`}

	margin-bottom: 8px;
`;

export const IconContainer = styled.View`
	width: ${RFValue(56)}px;
	height: ${RFValue(56)}px;
	justify-content: center;
	align-items: center;

	margin-right: 2px;

	background-color: ${({ theme }) => theme.colors.background_secondary};

`;
export const InputText = styled(TextInput)`
	flex:1;
	background-color: ${({ theme }) => theme.colors.background_secondary};
	color: ${({ theme }) => theme.colors.text};
	font-family: ${({ theme }) => theme.fonts.primary_400};
	font-size: ${RFValue(15)}px;
	padding :0 23px;
`;

