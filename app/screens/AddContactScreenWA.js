import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import colors from "../config/colors";
import http from "../services/client";

function submitForm(navigation, number) {
	if (number.length > 0) {
		http.put("add_contact", { number }).then(result => {
			if (result.ok)
				navigation.navigate("ChatWhatsApp", { user_id: number, username: result.data });
		});
	}
}

export default function AddContactScreenWA({ navigation }) {
	const [number, setNumber] = useState("");
	return (
		<Screen style={styles.container}>
			<TouchableOpacity onPress={() => navigation.navigate("WhatsAppInbox")}>
				<MaterialCommunityIcons style={styles.back} color={colors.whatsapp} name="arrow-left" size={25} />
			</TouchableOpacity>
			<Text style={styles.text}>
				Ingrese un nuevo número de teléfono:
			</Text>
			<TextInput style={styles.input} placeholder="Ingresar número" value={number} onChangeText={setNumber} />
			<AppButton text="Agregar número" logo="cellphone" color={colors.whatsapp} onPress={() => submitForm(navigation, number.replace(/\D/g, ""))} />
		</Screen>
	);
}

const styles = StyleSheet.create({
	back: {
		marginLeft: 8,
		marginTop: 8,
	},
	container: {
		flex: 1,
	},
	input: {
		borderColor: "gray",
		borderRadius: 10,
		borderWidth: 1,
		fontSize: 20,
		margin: 10,
		padding: 5,
	},
	text: {
		fontSize: 20,
		margin: 10,
	},
});
