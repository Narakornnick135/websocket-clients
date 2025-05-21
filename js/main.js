document.addEventListener('DOMContentLoaded', () => {
    // Create instances
    const client = new WebSocketClient();
    const ui = new WebSocketUI();
    
    // Connect event
    document.getElementById('connect-btn').addEventListener('click', async () => {
        const serverUrl = ui.serverUrlInput.value.trim();
        
        if (!serverUrl) {
            ui.addMessage('Please enter server URL', 'system');
            return;
        }
        
        try {
            ui.updateConnectionStatus('connecting');
            ui.addMessage(`Connecting to ${serverUrl}...`, 'system');
            
            await client.connect(serverUrl);
            
            ui.updateConnectionStatus('connected');
        } catch (error) {
            ui.updateConnectionStatus('disconnected');
            ui.addMessage(`Connection failed: ${error.message}`, 'system');
            console.error('Connection error:', error);
        }
    });
    
    // Disconnect event
    document.getElementById('disconnect-btn').addEventListener('click', () => {
        client.disconnect();
        ui.updateConnectionStatus('disconnected');
        ui.addMessage('Disconnected from server', 'system');
        ui.connectionDetails.textContent = 'Not connected';
    });
    
    // Register event
    document.getElementById('register-btn').addEventListener('click', () => {
        const userId = ui.userIdInput.value.trim();
        
        if (!userId) {
            ui.addMessage('Please enter a user ID', 'system');
            return;
        }
        
        try {
            client.register(userId);
            ui.addMessage(`Registering as ${userId}...`, 'system');
        } catch (error) {
            ui.addMessage(`Registration error: ${error.message}`, 'system');
        }
    });
    
    // Send message event
    document.getElementById('send-btn').addEventListener('click', () => {
        const type = ui.messageTypeSelect.value;
        const targetUserId = ui.targetUserInput.value.trim();
        const text = ui.messageTextArea.value.trim();
        
        if (!text) {
            ui.addMessage('Please enter a message', 'system');
            return;
        }
        
        try {
            switch (type) {
                case 'chat':
                    client.sendChat(text, targetUserId || null);
                    // Add outgoing message to UI
                    ui.addMessage({ 
                        type: 'chat', 
                        text, 
                        targetUserId 
                    }, 'outgoing');
                    break;
                
                case 'notification':
                    if (!targetUserId) {
                        ui.addMessage('Target user ID is required for notifications', 'system');
                        return;
                    }
                    
                    client.sendNotification(targetUserId, 'custom', { message: text });
                    ui.addMessage(`Notification sent to ${targetUserId}: ${text}`, 'system');
                    break;
                    
                case 'ping':
                    client.sendPing();
                    ui.addMessage('Ping sent to server', 'system');
                    break;
            }
            
            // Clear message textarea
            ui.messageTextArea.value = '';
            
        } catch (error) {
            ui.addMessage(`Error sending message: ${error.message}`, 'system');
        }
    });
    
    // Set up WebSocket event handlers
    client.on('connected', () => {
        ui.addMessage('Connected to server', 'system');
    });
    
    client.on('disconnected', (data) => {
        ui.updateConnectionStatus('disconnected');
        ui.addMessage(`Disconnected: ${data.reason || 'No reason provided'} (Code: ${data.code})`, 'system');
    });
    
    client.on('welcome', (message) => {
        ui.showWelcomeMessage(message);
    });
    
    client.on('registered', (message) => {
        ui.showRegistrationResult(message);
    });
    
    client.on('chat', (message) => {
        ui.addMessage(message, 'incoming');
    });
    
    client.on('notification', (notification) => {
        ui.addMessage(notification, 'notification');
    });
    
    client.on('serverError', (error) => {
        ui.addMessage(`Server error: ${error.message}`, 'system');
    });
    
    client.on('error', (error) => {
        ui.addMessage(`Error: ${error.message}`, 'system');
        console.error('Client error:', error);
    });
    
    // Add handler for pong messages
    client.on('pong', (message) => {
        ui.addMessage(`Pong received from server (timestamp: ${new Date(message.timestamp).toLocaleTimeString()})`, 'system');
    });
    
    // Initial message
    ui.addMessage('WebSocket Client initialized. Please connect to a server.', 'system');
});