import React , { useState } from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';

import {
	Container,
	IconContainer,
	InputText,
} from './styles';
import { BorderlessButton } from 'react-native-gesture-handler';

interface Props extends TextInputProps{
	iconName: React.ComponentProps<typeof Feather>['name'];
	value?: string;
}

export function PasswordInput({
	iconName,
	value,
	...rest
}: Props){
	const [ visiblePaswd, setVisiblePaswd ] = useState (true);

	const [ isfocused, setIsFocused ] = useState( false );
	const [ isFilled, setIsFilled ] = useState( false );
	const theme = useTheme();

	function handleChangeVisiblePaswd() {
		setVisiblePaswd(oldState => !oldState);
	}

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
				secureTextEntry={visiblePaswd}
				autoCorrect={false}
			/>
			<BorderlessButton onPress={handleChangeVisiblePaswd}>
				<IconContainer>
					<Feather
						name={visiblePaswd ? 'eye' : 'eye-off'}
						size={24}
						color={theme.colors.text_detail}
					/>
				</IconContainer>
			</BorderlessButton>
		</Container>

	)

}
