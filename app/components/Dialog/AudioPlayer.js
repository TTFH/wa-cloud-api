import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import IconButton from "../IconButton";

function formatTime(ms) {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (60 * 1000)) % 60);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function AudioPlayer({ source }) {
	const [sound, setSound] = useState();
	const [isPlaying, setIsPlaying] = useState(false);
	const [position, setPosition] = useState(0);
	const [duration, setDuration] = useState(0);

	async function loadSound() {
		const { sound } = await Audio.Sound.createAsync(source);
		const { durationMillis } = await sound.getStatusAsync();
		setDuration(isNaN(durationMillis) ? 0 : durationMillis);
		sound.setOnPlaybackStatusUpdate(status => {
			setIsPlaying(status.isPlaying);
			setPosition(status.positionMillis);
			if (status.didJustFinish)
				sound.stopAsync();
		});
		setSound(sound);
	}

	async function playSound() {
		await sound.playAsync();
	}

	async function pauseSound() {
		await sound.pauseAsync();
	}

	async function handleSlide(value) {
		if (!sound) loadSound();
		await sound.setPositionAsync(value);
	}

	useEffect(() => {
		return sound ? () => sound.unloadAsync() : undefined;
	}, [sound]);

	return (
		<>
			<View style={styles.container}>
				{!sound && <IconButton name="download-circle-outline" size={35} onPress={loadSound} />}
				{sound && !isPlaying && <IconButton name="play" size={35} onPress={playSound} />}
				{sound && isPlaying && <IconButton name="pause" size={35} onPress={pauseSound} />}
				<View style={styles.slider}>
					<Slider
						minimumValue={0}
						//maximumValue={duration}
						value={position}
						tapToSeek
						thumbTintColor="#009DE2"
						minimumTrackTintColor="#009DE2"
						onSlidingComplete={value => handleSlide(value)}
					/>
				</View>
			</View>
			<Text style={styles.time}>
				{formatTime(position)} / {formatTime(duration)}
			</Text>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
	slider: {
		justifyContent: "center",
		width: 175,
	},
	time: {
		color: "#667781",
		fontSize: 13,
		paddingLeft: 5,
	},
});
