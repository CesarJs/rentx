import React , { useState } from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';

import {
	Container,
	IconContainer,
	InputText
} from './styles';

interface Props extends TextInputProps{
	iconName: React.ComponentProps<typeof Feather>['name'];
	value?: string;
}

export function Input({
	iconName,
	value,
	...rest
}: Props){
	const [ isfocused, setIsFocused ] = useState( false );
	const [ isFilled, setIsFilled ] = useState( false );
	const theme = useTheme()

	function handleInputfocus() {
		setIsFocused(true);
	}

	function handleInputBlur(){
		setIsFocused(false);
		setIsFilled(!!value);
	}
	return (
		<Container isFocused={isfocused}>
			<IconContainer>
				<Feather
					name={iconName}
					size={24}
					color={isfocused || isFilled ? theme.colors.main : theme.colors.text_detail}
					/>
			</IconContainer>
			<InputText
				onFocus={handleInputfocus}
				onBlur={handleInputBlur}
				{...rest}
			/>
		</Container>

	)

}
