import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
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
		<Screen statusBarColor="#008069">
			<TouchableOpacity onPress={() => navigation.navigate("WhatsAppInbox")}>
				<MaterialCommunityIcons style={styles.back} color="#008069" name="arrow-left" size={25} />
			</TouchableOpacity>
			<Text style={styles.text}>
				Agregar nuevo contacto de WhatsApp
			</Text>
			<TextInput style={[styles.input, styles.text]} placeholder="Ingresar número" value={number} onChangeText={setNumber} />
			<AppButton text="Agregar número" logo="cellphone" color="#008069" whiteText onPress={() => submitForm(navigation, number.replace(/\D/g, ""))} />
		</Screen>
	);
}

const styles = StyleSheet.create({
	back: {
		margin: 8,
	},
	input: {
		borderColor: "gray",
		borderRadius: 12,
		borderWidth: 1,
		padding: 5,
	},
	text: {
		fontSize: 20,
		margin: 10,
	},
});
