import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

import { useTheme } from 'styled-components';
import { useNetInfo } from '@react-native-community/netinfo';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import { getAcessoryIcons } from '../../utils/getAcessoryIcons';
import { CarDTO } from '../../dtos/CarDTO';
import { getPlatformDate } from '../../utils/getPlataformDate';

import {
	Container,
	Header,
	CarImages,
	Content,
	Details,
	Description,
	Brand,
	Name,
	Rent,
	Period,
	Price,
	Accessories,
	Footer,
	RentalPeriod,
	CalendarIcon,
	DateInfo,
	DateTitle,
	DateValue,
	RentalPrice,
	RentalPriceLabel,
	RentalPriceDetails,
	RentalPriceQuota,
	RentalPriceTotal,
	} from './styles';
import api from '../../services/api';


interface Params {
	car: CarDTO;
	dates : string[];
}
interface RentalPeriod{
	start: string;
	end: string;
}

export function SchedulingDatails(){
	const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
	const [ rentalPeriod, setRentalPeriod ] = useState<RentalPeriod>({} as RentalPeriod);
	const [ sendRequest , setSendRequest ] = useState( false );

	const netInfo = useNetInfo();
	const theme = useTheme();
	const navigation = useNavigation();
	const route = useRoute();

	const { car, dates } = route.params as Params;
	const rentalTotal = {
		diarias : Number(dates.length),
		total: (dates.length * car.price).toFixed(2)
	}
	async function handleRentalComplete(){
		setSendRequest( true );

		await api.post(`rentals`, {
			user_id: 1,
			car_id: car.id,
			start_data: rentalPeriod.start,
			end_date: rentalPeriod.end,
			total: rentalTotal.total
		})
		.then(response => {
			navigation.navigate('Confirmation', {
				title: 'Carro Alugado!',
				message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`,
				nextScreenRoute: 'Home',
			});
		})
		.catch(() => {
			Alert.alert('Não foi possivel confirmar o agendamento.');
			setSendRequest(false);
		});

	}
	function handleBack() {
		navigation.goBack();
	}
	useEffect(() => {
		setRentalPeriod({
			start: 	format(getPlatformDate(new Date(dates[0])), 'dd-MM-yyyy'),
			end: 	format(getPlatformDate(new Date(dates[(dates.length - 1)])), 'dd-MM-yyyy')
		});
	}, []);

	useEffect(() => {
		async function fecthCarUpdate() {
			const { data } = await api.get(`/cars/${car.id}`);
			setCarUpdated(data);
		}
		if(netInfo.isConnected === true){
			fecthCarUpdate();
		}
	}, [netInfo.isConnected]);
	return (
		<Container>
			<Header>
				<BackButton onPress={handleBack} />
			</Header>
			<CarImages>
				<ImageSlider
					imagesUrl={
						!!carUpdated.photos ?
						carUpdated.photos: [{ id: car.thumbnail, photo: car.thumbnail}]
					}
				/>
			</CarImages>
			<Content>
				<Details>
					<Description>
						<Brand>{car.brand}</Brand>
						<Name>{car.name}</Name>
					</Description>
					<Rent>
						<Period>{car.period}</Period>
						<Price>R$ {car.price}</Price>
					</Rent>
				</Details>
				{carUpdated.accessories &&
					<Accessories>
						{carUpdated.accessories.map((acessory) => (
							<Accessory
								key={acessory.name}
								name={acessory.name}
								icon ={getAcessoryIcons(acessory.type)}
							/>
						))}
					</Accessories>
				}
				<RentalPeriod>
					<CalendarIcon>
						<Feather
							name="calendar"
							size={RFValue(24)}
							color={theme.colors.shape}
						/>
					</CalendarIcon>
					<DateInfo>
						<DateTitle>DE</DateTitle>
						<DateValue>{rentalPeriod.start}</DateValue>
					</DateInfo>
					<Feather
						name="chevron-right"
						size={RFValue(10)}
						color={theme.colors.text}
					/>
					<DateInfo>
						<DateTitle>ATÉ</DateTitle>
						<DateValue>{rentalPeriod.end}</DateValue>
					</DateInfo>
				</RentalPeriod>
				<RentalPrice>
					<RentalPriceLabel>TOTAL</RentalPriceLabel>
					<RentalPriceDetails>
						<RentalPriceQuota>{`R$ ${car.price} x${rentalTotal.diarias} diárias`}</RentalPriceQuota>
						<RentalPriceTotal>R$ {rentalTotal.total}</RentalPriceTotal>
					</RentalPriceDetails>
				</RentalPrice>

			</Content>
			<Footer>
				<Button
					title="Alugar Agora"
					onPress={handleRentalComplete}
					color={theme.colors.success}
					enabled={!sendRequest}
					loading={sendRequest}
				/>
			</Footer>
		</Container>

	)

}
