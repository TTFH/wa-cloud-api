import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export default function PreviewIcon({ render, name, color = "#8696A0" }) {
	return (
		<>
			{render && <MaterialCommunityIcons color={color} name={name} size={18} />}
		</>
	);
}
