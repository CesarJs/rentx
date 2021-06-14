import React, { useState, useRef, useEffect } from 'react';
import { FlatList, ViewToken } from 'react-native';
import { Bullet } from '../Bullet';
import {
	Container,
	ImageIndexes,
	CardImageWrapper,
	CarImage,
} from './styles';

interface Props {
	imagesUrl: {
		id: string;
		photo: string;
	}[];
}

interface ChangeImageProps {
	viewableItems: ViewToken[];
    changed: ViewToken[];
}
export function ImageSlider({ imagesUrl }: Props){
	const [indexImage, setIndexImage] = useState(0);
	const indexChange =useRef((info : ChangeImageProps) => {
		const index = info.viewableItems[0].index!;
		setIndexImage(index);
	});


	return (
		<Container>
			<ImageIndexes >
				{
					imagesUrl.map((item, index) =>
						<Bullet
							key={item.id}
							active={index === indexImage}
						/>
					)
				}
			</ImageIndexes>

				<FlatList
					data={imagesUrl}
					keyExtractor={item => item.id}
					renderItem={({item}) => (
						<CardImageWrapper>
							<CarImage
								source={{ uri: item.photo }}
								resizeMode="contain"
							/>
						</CardImageWrapper>
					)}
					horizontal
					showsHorizontalScrollIndicator={false}
					onViewableItemsChanged={indexChange.current}
				/>


		</Container>

	)

}
