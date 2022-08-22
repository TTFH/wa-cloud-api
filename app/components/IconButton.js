import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function IconButton({ style, color = "#8696A0", name, size = 25, onPress }) {
	return (
		<TouchableOpacity style={style} onPress={onPress}>
			<MaterialCommunityIcons color={color} name={name} size={size} />
		</TouchableOpacity>
	);
}
