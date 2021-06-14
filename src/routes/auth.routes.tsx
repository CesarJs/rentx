import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { Confirmation } from '../screens/Confirmation';
import { Splash } from '../screens/Splash';
import { Signin } from '../screens/Signin';
import { SignUpFirstStep } from '../screens/SignUp/SignUpFirstStep';
import { SignUpSecondtStep } from '../screens/SignUp/SignUpSecondtStep';

const { Navigator, Screen } = createStackNavigator();


export function AuthRoutes() {
	 return (
		<Navigator
			headerMode="none"
			initialRouteName="Splash"
		>
			<Screen
				name="Splash"
				component={Splash}
			/>
			<Screen
				name="Signin"
				component={Signin}
			/>
			<Screen
				name="SignUpFirstStep"
				component={SignUpFirstStep}
			/>
			<Screen
				name="SignUpSecondtStep"
				component={SignUpSecondtStep}
			/>
			<Screen
				name="Confirmation"
				component={Confirmation}
			/>
		</Navigator>

	 );
 }
