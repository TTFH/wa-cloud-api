import React, { useState } from "react";
import {
	FlatList,
	Image,
	Modal,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

import CategoryPickerItem from "./CategoryPickerItem";

const attachment = require("../assets/attachment.png");
const closeButton = require("../assets/cross.png");

export default function AppPicker({ items }) {
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<>
			<TouchableOpacity onPress={() => setModalVisible(true)}>
				<Image style={styles.button}
					source={attachment}
				/>
			</TouchableOpacity>
			<Modal visible={modalVisible} animationType="slide" transparent={true}>
				<View style={styles.modal}>
					<TouchableOpacity style={styles.close} onPress={() => setModalVisible(false)}>
						<Image style={styles.button}
							source={closeButton}
						/>
					</TouchableOpacity>
					<FlatList
						data={items}
						keyExtractor={(item) => item.value.toString()}
						numColumns={3}
						renderItem={({ item }) => (
							<CategoryPickerItem
								item={item}
								label={item.label}
								onPress={() => {
									setModalVisible(false);
									console.log(item.label);
								}}
							/>
						)}
					/>
				</View>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	close: {
		alignSelf: "flex-end",
		padding: 5,
	},
	modal: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "white",
		borderRadius: 10,
		top: "26%",
		height: "66%",
		justifyContent: "center",
		width: "95%",
		overflow: "hidden",
	},
	button: {
		height: 25,
		width: 25,
	},
});
