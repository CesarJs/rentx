import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
	Container,
	Header,
	HeaderContent,
	TotalCars,
	CarList,
	MyCarsButton
} from './styles';

import api from '../../services/api';
import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';
import { CarDTO } from '../../dtos/CarDTO';

export function Home(){
	const navigation = useNavigation();
	const [ cars, setCars ] = useState<CarDTO[]>([]);
	const [ loading, setLoading ] = useState(true);
	const theme = useTheme();
	const carData = [
		{
			brand: 'Audi',
			name: 'RS 5 Coupé',
			rent: {
				period: 'Ao dia',
				price: 120
			},
			thumbnail: 'https://freepngimg.com/thumb/audi/35227-5-audi-rs5-red.png'
		}
	]

	function handleCarDatails(car: CarDTO){
		navigation.navigate('CarDatails', { car });
	}
	function handleOpenMyCars(){
		navigation.navigate('MyCars');
	}
	useEffect(() => {
		async function fetCars() {
			try {
				const response = await api.get('/cars');
				setCars(response.data);
			} catch (error) {
				console.log(error);
			}finally{
				setLoading(false);
			}

		}
		fetCars();
	}, []);
	return (
		<Container>
			<StatusBar
				barStyle="light-content"
				backgroundColor="transparent"
				translucent
			/>
			<Header>
				<HeaderContent>
					<Logo
						width={RFValue(108)}
						height={RFValue(12)}
						/>
					<TotalCars>
						Total de {cars.length} carros
					</TotalCars>
				</HeaderContent>
			</Header>
			{loading ? <Load /> :
			<CarList
				data={cars}
				keyExtractor={item => item.id}
				renderItem={({ item }) =>
					<Car data={item} onPress={() => handleCarDatails(item)}/>
				}
				/>
			}
		<MyCarsButton onPress={handleOpenMyCars}>
			<Ionicons
				name="ios-car-sport"
				size={RFValue(32)}
				color={theme.colors.shape}
				/>
		</MyCarsButton>
		</Container>

	)

}
