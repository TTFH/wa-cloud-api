import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";

function Screen({ children, style, statusBarColor }) {
	return (
		<SafeAreaView style={[styles.screen, style]}>
			<StatusBar
				backgroundColor={statusBarColor}
				barStyle="light-content"
			/>
			{children}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		backgroundColor: "#FFFFFF",
		flex: 1,
	},
});

export default Screen;
