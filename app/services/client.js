import { create } from "apisauce";

const http = create({
	baseURL: "http://localhost:3000/",
});

export default http;
