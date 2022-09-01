import React from "react";
import { StyleSheet, Text, View } from "react-native";

function parseMarkdown(text_string) {
	//const regex = /(?<=^|\s)_(?=\S).*(?<=\S)_(?=\s|$)/g;
	const regex = /_([^_`]+)_|\*([^*`]+)\*|~([^~`]+)~|```([^`]+)```|(https?:\/\/\S+)|(.)/g;
	//const regex = /_((?=\S)[^_`]+(?<=\S))_|\*((?=\S)[^*`]+(?<=\S))\*|~((?=\S)[^~`]+(?<=\S))~|```([^`]+)```|(https?:\/\/\S+)|(.)/g;

	let res = [];
	let append_text = "";
	let match = regex.exec(text_string);
	while (match) {
		if (match.index === regex.lastIndex) regex.lastIndex++;
		const [, italic, bold, strikethrough, monospace, link, text] = match;
		const to_parse = italic || bold || strikethrough;
		if (text) append_text += text;
		else {
			if (append_text) res.push({ text: append_text });
			append_text = "";
		}
		if (monospace) res.push({ monospace });
		else if (link) res.push({ link });
		else if (to_parse) {
			const child = parseMarkdown(to_parse);
			child.forEach(c => {
				let node = { ...c };
				if (italic) node.italic = true;
				if (bold) node.bold = true;
				if (strikethrough) node.strikethrough = true;
				res.push(node);
			});
		}
		match = regex.exec(text_string);
	}
	if (append_text) res.push({ text: append_text });
	return res;
}

export default function Markdown({ children }) {
	return (
		<View style={styles.container}>
			{parseMarkdown(children.replace(/(\r?\n)/g, "\t")).map((node, index) => {
				if (node.monospace) return <Text key={index} style={styles.monospace}>{node.monospace}</Text>;
				if (node.link) return <Text key={index} style={styles.link}>{node.link}</Text>;

				const style = [];
				if (node.italic) style.push(styles.italic);
				if (node.bold) style.push(styles.bold);
				if (node.strikethrough) style.push(styles.strikethrough);
				return <Text key={index} style={style}>{node.text}</Text>;
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	bold: {
		fontWeight: "bold",
	},
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
	},
	italic: {
		fontStyle: "italic",
	},
	link: {
		color: "blue",
	},
	monospace: {
		fontFamily: "monospace",
	},
	strikethrough: {
		textDecorationLine: "line-through",
	},
});
