import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, TouchableOpacity, View, } from "react-native";

import PickerItem from "./PickerItem";

export default function AttachmentPicker({ items }) {
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<>
			<TouchableOpacity onPress={() => setModalVisible(true)}>
				<MaterialCommunityIcons style={styles.rotate} color="#8696A0" name="attachment" size={25} />
			</TouchableOpacity>
			<Modal visible={modalVisible} animationType="slide" transparent={true}>
				<View style={styles.modal}>
					<TouchableOpacity style={styles.close} onPress={() => setModalVisible(false)}>
						<MaterialCommunityIcons color="#8696A0" name="close" size={25} />
					</TouchableOpacity>
					<FlatList
						data={items}
						keyExtractor={(item) => item.value.toString()}
						numColumns={3}
						renderItem={({ item }) => (
							<PickerItem
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
		paddingRight: 5,
		paddingTop: 5,
	},
	modal: {
		alignSelf: "center",
		backgroundColor: "white",
		borderRadius: 10,
		top: "24%",
		width: "95%",
	},
	rotate: {
		transform: [{ rotate: "225deg" }]
	},
});
