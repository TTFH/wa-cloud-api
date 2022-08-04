# WhatsApp Cloud Api implementation in React Native and Node.js  
### A working application to send and receive WhatsApp messages using Meta's Cloud Api*  
  
**Warning:** This application contains JS code, use at your own risk.  
\* only text messages are currently implemented  

## Instalation
Install Node.js from https://nodejs.org/en/download/current/  
If you are using Windows 7 use this version https://nodejs.org/dist/v14.16.1/node-v14.16.1-x64.msi  
and create an Environment variable called: NODE_SKIP_PLATFORM_CHECK and set it to 1  

Open a command prompt at the folder `wa-cloud-api`  
Install expo with `npm install -g expo-cli`  
Install the dependencies with the command `npm install` (it will take a while)  
Move to the folder Server with `cd Server`  
Install express with `npm install express`  

## Run the front
Execute `npm start`  
Then type 'w'  

## Run the server
Open a command prompt at the folder `Server`  
`node app.js`  
Open another command prompt at the folder `Server`  
`ngrok http --region eu 3000`  
Open http://localhost:4040/ in your browser and copy your server URL  

## Configure Meta's WhatsApp Cloud API
First, you need a Facebook account :(  
Go to https://developers.facebook.com/ and create an App of type Business  
Click on Add Product and select WhatsApp  
Go to Getting started and copy your Temporary access token and your Phone number ID to Server/sendMessage.js (the token expire in 24 hours, you can get a permanet token somehow)  
Go to Configuration and edit your Callback URL, add your server URL (https://???.eu.ngrok.io/webhook) and set your Verify token from Server/app.js  

![Inbox](https://github.com/TTFH/wa-cloud-api/blob/734f51ff73f4882166cd0e426dff0296e5cc5add/preview/inbox.png)

![Chat](https://github.com/TTFH/wa-cloud-api/blob/734f51ff73f4882166cd0e426dff0296e5cc5add/preview/chat.png)
