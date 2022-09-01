import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddContactScreenWA from "./app/screens/AddContactScreenWA";
import ChatScreenWA from "./app/screens/ChatScreenWA";
import InboxScreenWA from "./app/screens/InboxScreenWA";
import http from "./app/services/client";
import SendTemplateScreen from "./app/screens/SendTemplateScreen";

// npm start
// eslint --ext .js app/ --fix
// eas build -p android --profile development

function getUserToken() {
	const fragment = window?.location?.hash; // ?#access_token=USER_TOKEN
	if (fragment?.includes("access_token")) {
		const user_token = fragment.split("=")[1];
		console.log("User Token: " + user_token);
		http.put("add_ig_account", { user_token }).then(() => {
			window.location.hash = "";
		});
	}
}

const Stack = createNativeStackNavigator();

export default function App() {
	useEffect(() => {
		getUserToken();
	}, []);

	return (
		<NavigationContainer >
			<Stack.Navigator initialRouteName="WhatsAppInbox" screenOptions={{ headerShown: false }} >
				<Stack.Screen name="WhatsAppInbox" component={InboxScreenWA} options={{ orientation: "all" }} />
				<Stack.Screen name="ChatWhatsApp" component={ChatScreenWA} options={{ orientation: "all" }} />
				<Stack.Screen name="AddContactWA" component={AddContactScreenWA} options={{ orientation: "all" }} />
				<Stack.Screen name="SendTemplate" component={SendTemplateScreen} options={{ orientation: "all" }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
