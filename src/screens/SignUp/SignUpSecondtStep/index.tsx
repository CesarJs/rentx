import React , { useState } from 'react';
import {
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import {
	Container,
	Header,
	Steps,
	Title,
	SubTitle,
	Form,
	FormTitle
} from './styles';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { PasswordInput } from '../../../components/PasswordInput';
import { Button } from '../../../components/Button';
import api from '../../../services/api';


interface Params {
	user: {
		name: string;
		email: string;
		driverLicense: string;
	}
}

export function SignUpSecondtStep(){
	const [	password , setPassword] = useState('');
	const [	confirmPaswd , setConfirmPaswd] = useState('');
	const navigation = useNavigation();
	const route = useRoute();
	const { user } = route.params as Params;
	const theme = useTheme();
	function handleBakc() {
		navigation.goBack();
	}

	async function handleRegister() {
		if(!password || !confirmPaswd){
			return Alert.alert('Informe a senha e a confirmação da senha!');
		}
		if(password !== confirmPaswd){
			return Alert.alert('As senhas não são iguais!');
		}

		await api.post('/users',{
			name: user.name,
			email: user.email,
			driver_license: user.driverLicense,
			password,
		}).then(() => {
			navigation.navigate('Confirmation', {
				title: 'Conta Criada !',
				message: `Agora é só fazer login \ne aproveitar.`,
				nextScreenRoute: 'Signin',
			});
		})
		.catch((response) => {
			Alert.alert('Opa', 'Não foi possivel cadastrar');
		});


	}
	return (
		<KeyboardAvoidingView behavior="position" enabled>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<Header>
						<BackButton onPress={handleBakc} color={theme.colors.text}/>
						<Steps>
							<Bullet />
							<Bullet active/>
						</Steps>
					</Header>
					<Title>
						Crie sua{'\n'}conta
					</Title>
					<SubTitle>
						Faça seu cadastro de {'\n'}
						forma rápida e fácil.
					</SubTitle>
					<Form>
						<FormTitle>2. Senha</FormTitle>
						<PasswordInput
							iconName="lock"
							placeholder="Senha"
							onChangeText={setPassword}
							value={password}
							/>
						<PasswordInput
							iconName="lock"
							placeholder="Repetir Senha"
							onChangeText={setConfirmPaswd}
							value={confirmPaswd}
						/>
					</Form>
					<Button
						title="Cadastrar"
						color={theme.colors.success}
						onPress={handleRegister}
					/>
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)

}
