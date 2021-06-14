import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import * as Yup from 'yup';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';


export function SignUpFirstStep(){

	const [ name, setName ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ driverLicense, setDriverLicense ] = useState('');

	const navigation = useNavigation();
	const theme = useTheme();
	function handleBakc() {
		navigation.goBack();
	}
	async function handleSecondStep() {
		try {
			const schema = Yup.object().shape({
				driverLicense: Yup.string()
					.required('CNH é obrigatória'),
				email: Yup.string()
					.required('É necessário informar um email')
					.email('E-mail inválido'),
				name: Yup.string()
					.required('Você precisa informar o nome!'),


			});
			const data = { name, email, driverLicense };
			await schema.validate(data);
			navigation.navigate("SignUpSecondtStep", {user: data});
		} catch (error) {
			if(error instanceof Yup.ValidationError){
				return Alert.alert("Opa", error.message);
			}
		}
	}
	return (
		<KeyboardAvoidingView behavior="position" enabled>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<Header>
						<BackButton onPress={handleBakc} color={theme.colors.text}/>
						<Steps>
							<Bullet active/>
							<Bullet />
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
						<FormTitle>1. Dados</FormTitle>
						<Input
							iconName="user"
							placeholder="Nome"
							onChangeText={setName}
							value={name}
						/>
						<Input
							iconName="mail"
							placeholder="E-mail"
							keyboardType="email-address"
							onChangeText={setEmail}
							value={email}
						/>
						<Input
							iconName="credit-card"
							placeholder="CNH"
							keyboardType="numeric"
							onChangeText={setDriverLicense}
							value={driverLicense}
						/>
					</Form>
					<Button
						onPress={handleSecondStep}
						title="Próximo"
					/>
				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)

}
