import React, {
	useState,
	createContext,
	useEffect,
	useContext,
	ReactNode
} from 'react';

import api from '../services/api';
import { database } from '../database';
import { User as ModelUser} from '../database/models/user';
import { Car as ModelCar } from '../database/models/car';

interface User {
	id: string;
	user_id: string;
	email:  string;
	name: string;
	driver_license: string;
	avatar: string;
	token: string;
}


interface SignInCredentials {
	email: string;
	password: string;
}
interface AuthContexData {
	user: User;
	signIn: (credentials: SignInCredentials) => Promise<void>;
	signOut: () => Promise<void>;
	updatedUser: (user:User) => Promise<void>;

}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext<AuthContexData>({} as AuthContexData);

function AuthProvider({ children }: AuthProviderProps){
	const [data, setData] = useState<User>({} as User);

	async function signIn({ email, password }: SignInCredentials){

		try {
			const response = await api.post('/sessions', {
				email,
				password
			});
			const { token, user } = response.data;
			api.defaults.headers.authorization = `Bearer ${token}`;


			const userCollection = database.get<ModelUser>('users');
			await database.action(async () => {
				await userCollection.create((newUser)=> {
					newUser.user_id = user.id,
					newUser.name = user.name,
					newUser.email = user.email,
					newUser.driver_license = user.driver_license,
					newUser.avatar = user.avatar,
					newUser.token = token

				})
			});
			setData({...user, token});

		} catch (error) {
			throw new Error(error);
		}

	}

	async function signOut(){
		try {
			const userCollection = database.get<ModelUser>('users');
			// const carCollection = database.get<ModelCar>('cars');
			await database.action(async() => {
				const userSelected = await userCollection.find(data.id);
				// const carsSelected = await carCollection.query().fetch();
				await userSelected.destroyPermanently();
				// await carsSelected.map((car) => car.destroyPermanently());

				setData({} as User);
			});
		} catch (error) {
			throw new Error(error);

		}
	}
	async function updatedUser(user: User){
		try {
			const userCollection = database.get<ModelUser>('users');
			await database.action(async () => {
				const userSelected = await userCollection.find(data.id);
				await userSelected.update(( userData ) => {
					userData.name = user.name,
					userData.driver_license = user.driver_license,
					userData.avatar = user.avatar
				});
			});
			setData(user);
		} catch (error) {
			throw new Error(error);

		}
	}
	useEffect(() => {
		async function loadUserData() {
			const userCollection = database.get<ModelUser>('users');

			const response = await userCollection.query().fetch();
			if(response.length > 0 ){
				const userData = response[0]._raw as unknown as User;
				api.defaults.headers.authorization = `Bearer ${userData.token}`;
				setData(userData);
			}
		}

		loadUserData();
	});
	return (
		<AuthContext.Provider
			value={{
				user: data,
				signIn,
				signOut,
				updatedUser
			}}
		>
			{ children }
		</AuthContext.Provider>
	)

}

function useAuth(): AuthContexData {
	const context = useContext(AuthContext);
	return context;
}

export { AuthProvider, useAuth }
