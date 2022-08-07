import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InboxScreen from "./app/screens/InboxScreen";
import InboxMessengerScreen from "./app/screens/InboxMessengerScreen";
import ChatScreen from "./app/screens/ChatScreen";
import ChatMessengerScreen from "./app/screens/ChatMessengerScreen";
import AddPhoneScreen from "./app/screens/AddPhoneScreen";

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

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="MessengerInbox" screenOptions={{ headerShown: false }} >
				<Stack.Screen name="Home" component={InboxScreen} />
				<Stack.Screen name="MessengerInbox" component={InboxMessengerScreen} />
				<Stack.Screen name="Chat" component={ChatScreen} />
				<Stack.Screen name="ChatMessenger" component={ChatMessengerScreen} />
				<Stack.Screen name="AddPhone" component={AddPhoneScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
