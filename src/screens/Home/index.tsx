import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { StatusBar, Button } from 'react-native';
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from '../../database';
import api from '../../services/api';

import Animated , {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	withSpring
} from 'react-native-reanimated';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

import {
	Container,
	Header,
	HeaderContent,
	TotalCars,
	CarList
} from './styles';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../database/models/car';
import { LoadAnimate } from '../../components/LoadAnimate';
import { CarDTO } from '../../dtos/CarDTO';


export function Home(){

	const [ cars, setCars ] = useState<ModelCar[]>([]);
	const [ loading, setLoading ] = useState(true);

	const netinfo = useNetInfo();
	const navigation = useNavigation();
	const positionY = useSharedValue(0);
	const positionX = useSharedValue(0);

	const myCarsButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: positionX.value },
				{ translateY: positionY.value}
			]
		}
	});
	const onGestureEvent = useAnimatedGestureHandler({
		onStart(_, ctx: any){
			ctx.positionX = positionX.value;
			ctx.positionY = positionY.value;
		},
		onActive(event, ctx: any){
			 positionX.value = ctx.positionX + event.translationX;
			 positionY.value = ctx.positionY + event.translationY;
		},
		onEnd(){
			if(positionY.value >= -47) {
				positionY.value = withSpring(0);
			}
			if(positionX.value >= -75){
				positionX.value = withSpring(0);
			}
		}
	});
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
	async function resetDatabase() {
		await database.unsafeResetDatabase();
	}
	async function offilneSyncronize() {

		await synchronize({
			database,
			pullChanges: async({ lastPulledAt }) => {

				const response = await api
				.get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
				const { changes, latestVersion } = response.data;
				return { changes, timestamp: latestVersion}
			},
			pushChanges: async({ changes }) => {
				const user = changes.users ;
				if(user){
					await api.post('/users/sync', user);
				}
			}
		});

	}
	function handleCarDatails(car: ModelCar){
		navigation.navigate('CarDatails', { car });
	}
	function handleOpenMyCars(){
		navigation.navigate('MyCars');
	}
	useEffect(() => {
		let isMounted = true;
		async function fetCars() {
			try {
				const carColletion = database.get<ModelCar>('cars');
				const cars = await carColletion.query().fetch();
				console.log('cars',cars);
				if(isMounted){
					setCars(cars);
				}
			} catch (error) {
				console.log(error);
			}finally{
				if(isMounted){
					setLoading(false);
				}
			}

		}
		fetCars();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {

		if(netinfo.isConnected === true){
			offilneSyncronize();
		}
	}, [netinfo.isConnected]);
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
						{!loading &&
							<TotalCars>
								Total de {cars.length} carros
							</TotalCars>
						}
				</HeaderContent>
			</Header>
		{loading ? <LoadAnimate /> :
			<CarList
				data={cars}
				keyExtractor={item => item.id}
				renderItem={({ item }) =>
					<Car data={item} onPress={() => handleCarDatails(item)}/>
				}
				/>
		}
		{/* <PanGestureHandler onGestureEvent={onGestureEvent}>
			<Animated.View
				style={[
					myCarsButtonStyle,
					{
						position: 'absolute',
						bottom: 13,
						right: 2
					}
				]}
			>
				<ButtonAnimated
					onPress={handleOpenMyCars}
					style={[styles.button, {backgroundColor: theme.colors.main}]}
				>
					<Ionicons
						name="ios-car-sport"
						size={RFValue(32)}
						color={theme.colors.shape}
						/>
				</ButtonAnimated>
			</Animated.View>
		</PanGestureHandler> */}
		</Container>

	)

}


