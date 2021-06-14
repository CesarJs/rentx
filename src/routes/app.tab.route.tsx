import React from 'react';
import { useTheme } from 'styled-components';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeSvg from '../assets/home.svg';
import CarSvg from '../assets/car.svg';
import PeopleSvg from '../assets/people.svg';

import { AppStackRoutes } from './app.stack.routes';
import { Home } from '../screens/Home';
import { MyCars } from '../screens/MyCars';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { Navigator, Screen } = createBottomTabNavigator();


export function AppTabRoutes() {
	const theme = useTheme();
	 return (
		<Navigator
			tabBarOptions={{
				activeTintColor:theme.colors.main,
				inactiveTintColor: theme.colors.text_detail,
				showLabel: false,
				style:{
					paddingVertical: Platform.OS === 'ios' ? 20 : 0,
					height: 78,
					backgroundColor: theme.colors.background_primary
				}
			}}
		>
			<Screen
				name="Home"
				component={AppStackRoutes}
				options={{
					tabBarIcon: (({ color }) => (
						<HomeSvg width={RFValue(24)} height={RFValue(24)} fill={color}/>
					))
				}}
			/>
			<Screen
				name="Profile"
				component={Home}
				options={{
					tabBarIcon: (({ color }) => (
						<PeopleSvg width={RFValue(24)} height={RFValue(24)} fill={color}/>
					))
				}}
			/>
			<Screen
				name="MyCars"
				component={MyCars}
				options={{
					tabBarIcon: (({ color }) => (
						<CarSvg width={RFValue(24)} height={RFValue(24)} fill={color}/>
					))
				}}
			/>
		</Navigator>

	 );
 }
