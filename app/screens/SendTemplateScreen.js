import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";

import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import DialogWA from "../components/Dialog/DialogWA";
import IconButton from "../components/IconButton";
import Screen from "../components/Screen";
import http from "../services/client";

// TODO: remove var_count and buttons_count
const template_list = [
	{
		name: "button_template",
		caption: "Hello {{1}}, this is a test message with a button. For some reason Spanish was not available.",
		interactive: { var_count: 1, buttons_count: 1, buttons: ["Clickeame!"] },
	},
	{
		name: "hello_world",
		title: "Hello World",
		caption: "Welcome and congratulations!! This message demonstrates your ability to send a message notification from WhatsApp Business Platform's Cloud API. Thank you for taking the time to test with us.",
		footer: "WhatsApp Business API Team",
		interactive: { var_count: 0, buttons_count: 0, list: "Configurar" },
	},
	{
		name: "sdi_template1",
		title: "No te pierdas nuestras nuevas ofertas!!!",
		caption: "Hola {{1}}, *llamanos* o *visita nuestra web* para ver las ultimas novedades en productos {{2}}. Saludos {{3}}.",
		footer: "ADI - Algo de Informatica",
		interactive: { var_count: 1, buttons_count: 0, call: "Llamar", web: "Visitar web" },
	},
	{
		name: "pedido_inconcluso_1",
		caption: "Estimado {{1}},\nHemos detectado el pasado {{2}} que realizó una solicitud de {{3}}.\nPor favor, responda este mensaje para obtener su {{4}} y completar su {{5}}\nGracias.",
		interactive: { var_count: 5, buttons_count: 2, buttons: ["Hablar c/operador", "Más información"] },
	},
];

const empty_template = {
	message_id: "1",
	timestamp: Math.floor(Date.now() / 1000),
	incoming: true,
	interactive: { var_count: 0, buttons_count: 0 },
};

export default function SendTemplateScreen({ route, navigation }) {
	const { user_id, username } = route.params;
	const [vars, setVars] = useState([]);
	const [payloads, setPayloads] = useState([]);
	const [template, setTemplate] = useState(empty_template);
	const [selectedTemplate, setSelectedTemplate] = useState("");

	function goBack() {
		navigation.navigate("ChatWhatsApp", { user_id: user_id, username: username });
	}

	function sendTemplate() {
		console.log("Send Template", user_id, selectedTemplate, vars);
		http.post("template", { phone_number: user_id, template_name: selectedTemplate, vars }).then(response => {
			if (response.ok) goBack();
		});
	}

	useEffect(() => {
		setSelectedTemplate(template_list[0].name);
		setTemplate({ ...empty_template, ...template_list[0] });
	}, []);

	return (
		<Screen statusBarColor="#008069">
			<View style={styles.container}>
				<IconButton style={styles.backButton} color="#FFFFFF" name="arrow-left" onPress={goBack} />
				<Text style={styles.title} numberOfLines={1}>
					Enviar Template a {username}
				</Text>
				<IconButton style={styles.menuButton} color="#FFFFFF" name="dots-vertical" />
			</View>

			<View style={styles.pickerContainer}>
				<Picker style={styles.picker} mode="dropdown" selectedValue={selectedTemplate} onValueChange={
					(itemValue, itemIndex) => {
						setSelectedTemplate(itemValue);
						setTemplate({ ...empty_template, ...template_list[itemIndex] });
					}
				}>
					{template_list.map((item, index) => {
						return <Picker.Item key={index} label={item.name} value={item.name} />;
					})}
				</Picker>
			</View>

			<View style={styles.background}>
				<ImageBackground style={styles.backgroundImage}
					source={require("../assets/background.png")}
				/>
				<ScrollView>
					<View style={styles.chatContainer}>
						<DialogWA message={template} hasTail />
					</View>
				</ScrollView>
			</View>
			<View style={styles.buttonContainer}>
				{
					[...Array(template.interactive.var_count)].map((_, i) => (
						<AppInput key={i} placeholder={`Variable {{${i + 1}}}`} logo="variable" color="#008069" onChangeText={text => {
							const newVars = [...vars];
							newVars[i] = text;
							setVars(newVars);
						}
						} />
					))
				}
			</View>
			<View style={styles.buttonContainer}>
				{
					[...Array(template.interactive.buttons_count)].map((_, i) => (
						<AppInput key={i} placeholder={`Payload \"${template.interactive.buttons[i]}\"`} logo="nuke" color="#008069" onChangeText={text => {
							const newPayloads = [...payloads];
							newPayloads[i] = text;
							setPayloads(newPayloads);
						}
						} />
					))
				}
			</View>
			<View style={styles.buttonContainer}>
				<AppButton text="Preview" logo="message-draw" color="#008069" whiteText onPress={() => {
					const defaultCaption = template_list.find(item => item.name === selectedTemplate).caption;
					let newCaption = defaultCaption;
					for (let i = 0; i < template.interactive.var_count; i++)
						newCaption = newCaption.replace(`{{${i + 1}}}`, vars[i] ? vars[i] : "");

					const defaultButtons = template_list.find(item => item.name === selectedTemplate).interactive.buttons;
					let newButtons = defaultButtons;
					for (let i = 0; i < template.interactive.buttons_count; i++)
						if (payloads[i]) newButtons[i] = payloads[i];
					setTemplate({ ...template, caption: newCaption, interactive: { ...template.interactive, buttons: newButtons } });
				}} />
				<AppButton text="Enviar Template" logo="send" color="#008069" whiteText onPress={sendTemplate} />
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	backButton: {
		marginVertical: 15,
		paddingHorizontal: 10,
	},
	background: {
		alignSelf: "center",
		backgroundColor: "#EFEAE2",
		borderRadius: 15,
		//height: "35%",
		flex: 1,
		marginVertical: 10,
		paddingTop: 10,
		width: "95%",
	},
	backgroundImage: {
		height: "100%",
		opacity: 0.5,
		position: "absolute",
		width: "100%",
		zIndex: -1,
	},
	buttonContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	chatContainer: {
		flex: 1,
		justifyContent: "flex-end",
		paddingHorizontal: 5,
	},
	container: {
		alignItems: "center",
		backgroundColor: "#008069",
		flexDirection: "row",
	},
	menuButton: {
		marginLeft: "auto",
		marginRight: 10,
	},
	picker: {
		width: 170,
	},
	pickerContainer: {
		alignItems: "center",
		alignSelf: "center",
		borderColor: "#008069",
		borderRadius: 15,
		borderWidth: 1,
		flexDirection: "row",
		marginTop: 10,
		paddingLeft: 10,
	},
	title: {
		alignSelf: "center",
		color: "#FFFFFF",
		fontFamily: "sans-serif",
		fontSize: 18,
	},
});
