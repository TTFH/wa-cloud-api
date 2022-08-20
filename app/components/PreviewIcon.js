import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export default function PreviewIcon({ render, style, name, color = "#8696A0", size = 18 }) {
	return (
		<>
			{render && <MaterialCommunityIcons style={style} color={color} name={name} size={size} />}
		</>
	);
}
