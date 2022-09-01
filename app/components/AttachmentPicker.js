import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, View, } from "react-native";

import IconButton from "./IconButton";
import PickerItem from "./PickerItem";

export default function AttachmentPicker({ items, onPress }) {
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<>
			<IconButton style={styles.rotate} name="attachment" onPress={() => setModalVisible(true)} />
			<Modal visible={modalVisible} animationType="slide" transparent>
				<View style={styles.modal}>
					<IconButton style={styles.close} name="close" onPress={() => setModalVisible(false)} />
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
									onPress(item.label);
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
		top: "23%",
		width: "95%",
	},
	rotate: {
		transform: [{ rotate: "225deg" }]
	},
});
