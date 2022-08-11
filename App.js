import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AddContactScreenWA from "./app/screens/AddContactScreenWA";
import HomeScreen from "./app/screens/HomeScreen";
import ChatScreenFB from "./app/screens/ChatScreenFB";
import ChatScreenIG from "./app/screens/ChatScreenIG";
import ChatScreenWA from "./app/screens/ChatScreenWA";
import InboxScreenFB from "./app/screens/InboxScreenFB";
import InboxScreenIG from "./app/screens/InboxScreenIG";
import InboxScreenWA from "./app/screens/InboxScreenWA";

import { addIgAccount } from "./app/services/httpservice";

// npm start
/*
TODO:
show forwarding tag on messages
send reply-to msg
send forwarding msg
send template message
show image from link
send image from link
*/
const Stack = createStackNavigator();

function getUserToken() {
	const fragment = window.location.hash; // ?#access_token=USER_TOKEN
	if (fragment.includes("access_token")) {
		const user_token = fragment.split("=")[1];
		console.log("User Token: " + user_token);
		addIgAccount(user_token).then(() => {
			window.location.hash = "";
		});
	}
}

export default function App() {
	useEffect(() => {
		getUserToken();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="HOME" screenOptions={{ headerShown: false }} >
				<Stack.Screen name="HOME" component={HomeScreen} />
				<Stack.Screen name="WhatsAppInbox" component={InboxScreenWA} />
				<Stack.Screen name="MessengerInbox" component={InboxScreenFB} />
				<Stack.Screen name="InstagramInbox" component={InboxScreenIG} />
				<Stack.Screen name="ChatWhatsApp" component={ChatScreenWA} />
				<Stack.Screen name="ChatMessenger" component={ChatScreenFB} />
				<Stack.Screen name="ChatInstagram" component={ChatScreenIG} />
				<Stack.Screen name="AddContactWA" component={AddContactScreenWA} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
