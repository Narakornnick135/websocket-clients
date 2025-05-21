# WebSocket Client Application

A user-friendly WebSocket client application with a web interface for testing WebSocket server connections, sending messages, and monitoring WebSocket communication.

## 📷 Show Image
*(แทรกรูปภาพหน้าจอ UI ที่นี่ ถ้ามี)*

---

## ✨ Features

- Connect to any WebSocket server endpoint  
- Register a user ID with the server  
- Send different message types:
  - Chat  
  - Notification  
  - Ping  
- Target specific users with private messages  
- Real-time message display  
- Connection status monitoring  
- Automatic ping mechanism to keep connections alive  

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v18 or higher recommended)  
- npm (usually comes with Node.js)  

### 🔧 Installation

Clone the repository or download the source code:

```
git clone https://github.com/yourusername/websocket-client.git
cd websocket-client
```

Install the dependencies:

```
npm install
```

### ▶️ Running the Application

Start the client server:

```
npm start
```

The application will be accessible at:  
**http://localhost:8080**

---

## 📡 Usage

### 🔗 Connecting to a WebSocket Server

1. Enter the WebSocket server URL in the **"Server URL"** field (e.g., `ws://localhost:3000`)  
2. Click **"Connect"**  
3. The connection status will update to **"Connected"** if successful  

### 👤 Registering a User ID

1. After connecting, enter a user ID in the **"User ID"** field  
2. Click **"Register"**  
3. A confirmation message will appear if registration is successful  

### ✉️ Sending Messages

- Select a message type from the dropdown:
  - **Chat**: Regular chat messages  
  - **Notification**: System notifications  
  - **Ping**: Connection test  
- For targeted messages, enter a user ID in the **"Target User ID"** field  
  - *(Leave empty to broadcast to all users, if supported by the server)*  
- Type your message in the message text area  
- Click **"Send Message"**

### 🖥️ Message Display

- **Incoming Messages**: Displayed in gray  
- **Outgoing Messages**: Displayed in blue  
- **System Messages**: Displayed in light gray, italic text  
- **Notifications**: Displayed in yellow  

---

## 🧩 Application Structure

| File/Folder       | Description                               |
|-------------------|-------------------------------------------|
| `index.html`      | Main application HTML                     |
| `css/style.css`   | Application styling                       |
| `js/websocket.js` | Core WebSocket client implementation      |
| `js/ui.js`        | UI interaction handling                   |
| `js/main.js`      | Main application logic                    |
| `server.js`       | Static file server for the client app     |

---

## 📨 WebSocket Message Types

The client supports several message types:

### 1. Registration

```json
{
  "type": "register",
  "userId": "user123"
}
```

### 2. Chat

```json
{
  "type": "chat",
  "text": "Hello, how are you?",
  "targetUserId": "user456"
}
```

### 3. Notification

```json
{
  "type": "notification",
  "targetUserId": "user456",
  "action": "new_message",
  "data": {
    "content": "Hello, user456!"
  }
}
```

### 4. Ping

```json
{
  "type": "ping"
}
```

---

## 🧪 Developing and Testing WebSocket Servers

This client application is ideal for testing WebSocket servers during development.

1. Start your WebSocket server  
2. Connect this client to your server's WebSocket endpoint  
3. Test various message types and functionalities  
4. Monitor the server's responses in the client interface  

---

## 🛠️ Troubleshooting

- **Connection Issues**: Verify the WebSocket server is running and the URL is correct  
- **Registration Failures**: Ensure your server supports the registration message format  
- **Message Delivery Problems**: Check that user IDs are correctly registered on the server  
- **Disconnections**: Some firewalls or proxies may terminate idle WebSocket connections  

---

## 🪪 License

MIT

---

## 🙏 Acknowledgements

- **Express** – Used for serving the client application  
- **WebSocket API** – Browser WebSocket implementation  

> Designed to work with the WebSocket Server implementation available in the companion repository.
