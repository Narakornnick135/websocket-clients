class WebSocketUI {
    constructor() {
        // DOM Elements
        this.connectionStatus = document.getElementById('connection-status');
        this.messagesContainer = document.getElementById('messages-container');
        this.serverUrlInput = document.getElementById('server-url');
        this.userIdInput = document.getElementById('user-id');
        this.messageTypeSelect = document.getElementById('message-type');
        this.targetUserInput = document.getElementById('target-user');
        this.messageTextArea = document.getElementById('message-text');
        this.connectBtn = document.getElementById('connect-btn');
        this.disconnectBtn = document.getElementById('disconnect-btn');
        this.registerBtn = document.getElementById('register-btn');
        this.sendBtn = document.getElementById('send-btn');
        this.connectionDetails = document.getElementById('connection-details');
    }
    
    // อัปเดตสถานะการเชื่อมต่อ
    updateConnectionStatus(status) {
        this.connectionStatus.className = 'status ' + status;
        this.connectionStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        
        // อัปเดตสถานะปุ่ม
        if (status === 'connected') {
            this.connectBtn.disabled = true;
            this.disconnectBtn.disabled = false;
            this.registerBtn.disabled = false;
        } else if (status === 'disconnected') {
            this.connectBtn.disabled = false;
            this.disconnectBtn.disabled = true;
            this.registerBtn.disabled = true;
            this.sendBtn.disabled = true;
        } else if (status === 'connecting') {
            this.connectBtn.disabled = true;
            this.disconnectBtn.disabled = true;
            this.registerBtn.disabled = true;
            this.sendBtn.disabled = true;
        }
    }
    
    // แสดงข้อความ
    addMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        let content = '';
        
        switch (type) {
            case 'incoming':
                content = `<strong>[${timestamp}] From ${message.sender || 'Unknown'}:</strong> ${message.text}`;
                break;
                
            case 'outgoing':
                const target = message.targetUserId ? ` to ${message.targetUserId}` : '';
                content = `<strong>[${timestamp}] You${target}:</strong> ${message.text}`;
                break;
                
            case 'notification':
                content = `<strong>[${timestamp}] Notification (${message.action}):</strong> ${JSON.stringify(message.data)}`;
                break;
                
            case 'system':
                content = `<strong>[${timestamp}] System:</strong> ${message}`;
                break;
        }
        
        messageElement.innerHTML = content;
        this.messagesContainer.appendChild(messageElement);
        
        // เลื่อนไปล่างสุด
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    // แสดงข้อความต้อนรับ
    showWelcomeMessage(message) {
        this.connectionDetails.textContent = JSON.stringify(message, null, 2);
        this.addMessage(`Connected to server with ID: ${message.connectionId}`, 'system');
    }
    
    // แสดงข้อความการลงทะเบียน
    showRegistrationResult(message) {
        if (message.status === 'success') {
            this.addMessage(`Registered successfully as ${message.userId}`, 'system');
            this.sendBtn.disabled = false;
        } else {
            this.addMessage(`Registration failed: ${message.message || 'Unknown error'}`, 'system');
        }
    }
    
    // ล้างข้อความ
    clearMessages() {
        this.messagesContainer.innerHTML = '';
    }
}

// Export the class
window.WebSocketUI = WebSocketUI;