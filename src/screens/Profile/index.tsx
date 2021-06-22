import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	Alert
} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../hooks/auth';
import { useNetInfo } from '@react-native-community/netinfo';

import {
	Container,
	Header,
	HeaderTop,
	Headertitle,
	LogoutButton,
	PhotoContainer,
	Photo,
	PhotoButton,
	Content,
	ContentHeader,
	Option,
	OptionTitle,
	Section
} from './styles';

import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { PasswordInput } from '../../components/PasswordInput';




export function Profile(){
	const { user, signOut, updatedUser } = useAuth();

	const [option, setOption ] = useState<'dataEdit' | 'passwordEdit' >('dataEdit');
	const [ avatar , setAvatar ] = useState(user.avatar);
	const [ name, setName ] = useState(user.name);
	const [ email, setEmail ] = useState(user.email);
	const [ driverLicense, setDriverLicense ] = useState(user.driver_license);

	const netInfo = useNetInfo();
	const theme = useTheme();
	const navigation = useNavigation();

	function handleBack() {
		navigation.goBack();
	}

	function handleOptionChange(opationselected : 'dataEdit' | 'passwordEdit'){
		if(netInfo.isConnected === false && opationselected === 'passwordEdit'){
			return Alert.alert('Você está offline', 'Acesse a internet para alterar a senha!');
		}
		setOption(opationselected);
	}
	async function handleAvatarSelect() {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 4],
			quality: 1,
		});

		if(result.cancelled){
			return ;
		}
		if(result.uri) {
			setAvatar(result.uri);
		}
	}
	async function handleProfileUpdate(){
		try {
			const schema = Yup.object().shape({
				driverLicense: Yup.string()
				.required('CNH é obrigatória'),
				name: Yup.string()
				.required('O nome é obrigatório')
			});

			const data = {name, driverLicense};
			await schema.validate(data);
			await updatedUser({
				id: user.id,
				user_id: user.user_id,
				email: user.email,
				name,
				driver_license: driverLicense,
				avatar,
				token: user.token
			});
			Alert.alert('Perfil atualizado!');
		} catch (error) {
			if(error instanceof Yup.ValidationError){
				Alert.alert('Opa', error.message);
			}else{
				Alert.alert('Não foi possivel atualizar os dados.');
			}
		}
	}
	async function handleSignOut(){
		Alert.alert(
			"Tem certeza ?",
			"Se você sair, irá precisar de internet para conectar-se novamente.",
			[
				{
					text: 'Cancelar',
					onPress: () => {},
					style: "cancel"
				},
				{
					text:'Sair',
					onPress: () => signOut(),
					style: 'destructive'
				}
			]
		);

	}
	return (
		<KeyboardAvoidingView behavior="position" enabled >
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<Container>
					<Header>
						<HeaderTop>
							<BackButton
								color={theme.colors.shape}
								onPress={handleBack}
							/>
							<Headertitle>Editar Perfil</Headertitle>
							<LogoutButton onPress={handleSignOut}>
								<Feather
									name="power"
									size={24}
									color={theme.colors.shape}
								/>
							</LogoutButton>
						</HeaderTop>
						<PhotoContainer>
							{!!avatar && <Photo source={{ uri: avatar }}/>}
							<PhotoButton onPress={handleAvatarSelect} >
								<Feather
									name="camera"
									size={24}
									color={theme.colors.shape}
								/>
							</PhotoButton>
						</PhotoContainer>
					</Header>
					<Content style={{marginBottom: useBottomTabBarHeight()}}>
						<ContentHeader>
							<Option
								onPress={() => handleOptionChange('dataEdit')}
								active={option === 'dataEdit'}
								>
								<OptionTitle active={option === 'dataEdit'}>
									Dados
								</OptionTitle>
							</Option>
							<Option
								active={option === 'passwordEdit'}
								onPress={() => handleOptionChange('passwordEdit')}
							>
								<OptionTitle active={option === 'passwordEdit'}>
									Trocar senha
								</OptionTitle>
							</Option>
						</ContentHeader>
						{option === 'dataEdit' ?
							<Section>
								<Input
									iconName="user"
									placeholder="Nome"
									autoCorrect={false}
									defaultValue={user.name}
									onChangeText={setName}
								/>
								<Input
									iconName="mail"
									editable={false}
									defaultValue={user.email}
								/>
								<Input
									iconName="credit-card"
									placeholder="CNH"
									keyboardType="numeric"
									defaultValue={user.driver_license}
									onChangeText={setDriverLicense}

								/>
							</Section>
						:
							<Section>
								<PasswordInput
									iconName="lock"
									placeholder="Senha atual"
								/>
								<PasswordInput
									iconName="lock"
									placeholder="Nova senha"
								/>
								<PasswordInput
									iconName="lock"
									placeholder="Repetir senha"

								/>
							</Section>
						}
						<Button
							title="Salvar alterações"
							onPress={handleProfileUpdate}
						/>
					</Content>

				</Container>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)

}
