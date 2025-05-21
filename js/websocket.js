class WebSocketClient {
    constructor() {
        this.socket = null;
        this.connectionId = null;
        this.userId = null;
        this.pingInterval = null;
        this.eventListeners = {};
    }

    // เชื่อมต่อกับ WebSocket server
    connect(url) {
        return new Promise((resolve, reject) => {
            try {
                // ปิดการเชื่อมต่อเก่าก่อน (ถ้ามี)
                if (this.socket) {
                    this.disconnect();
                }

                this.socket = new WebSocket(url);
                
                // Event handlers
                this.socket.onopen = () => {
                    this._startPingInterval();
                    this._emit('connected');
                    resolve();
                };
                
                this.socket.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        this._handleMessage(message);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                        this._emit('error', { message: 'Error parsing message', error });
                    }
                };
                
                this.socket.onclose = (event) => {
                    this._clearPingInterval();
                    this._emit('disconnected', { code: event.code, reason: event.reason });
                };
                
                this.socket.onerror = (error) => {
                    this._emit('error', { message: 'WebSocket error', error });
                    reject(error);
                };
                
            } catch (error) {
                this._emit('error', { message: 'Connection error', error });
                reject(error);
            }
        });
    }
    
    // ลงทะเบียน User ID
    register(userId) {
        if (!this.isConnected()) {
            throw new Error('Not connected to server');
        }

        this.userId = userId;
        
        this.send({
            type: 'register',
            userId: userId
        });
    }
    
    // ส่งข้อความ
    send(message) {
        if (!this.isConnected()) {
            throw new Error('Not connected to server');
        }
        
        const jsonMessage = typeof message === 'string' ? message : JSON.stringify(message);
        this.socket.send(jsonMessage);
        
        if (message.type !== 'ping') {
            this._emit('messageSent', message);
        }
    }
    
    // ส่งข้อความแชท
    sendChat(text, targetUserId = null) {
        const message = {
            type: 'chat',
            text: text
        };
        
        if (targetUserId) {
            message.targetUserId = targetUserId;
        }
        
        this.send(message);
    }
    
    // ส่งการแจ้งเตือน
    sendNotification(targetUserId, action, data) {
        if (!targetUserId) {
            throw new Error('Target user ID is required for notifications');
        }
        
        this.send({
            type: 'notification',
            targetUserId: targetUserId,
            action: action || 'message',
            data: data || {}
        });
    }
    
    // ส่ง ping เพื่อรักษาการเชื่อมต่อ
    sendPing() {
        if (this.isConnected()) {
            this.send({ type: 'ping' });
        }
    }
    
    // ตัดการเชื่อมต่อ
    disconnect() {
        if (this.socket) {
            this._clearPingInterval();
            
            // ตรวจสอบสถานะการเชื่อมต่อ
            if (this.socket.readyState === WebSocket.OPEN || 
                this.socket.readyState === WebSocket.CONNECTING) {
                this.socket.close(1000, 'Client disconnected');
            }
            
            this.socket = null;
            this.connectionId = null;
        }
    }
    
    // ตรวจสอบว่าเชื่อมต่ออยู่หรือไม่
    isConnected() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }
    
    // ลงทะเบียน event listener
    on(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        
        this.eventListeners[eventName].push(callback);
    }
    
    // ลบ event listener
    off(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            return;
        }
        
        this.eventListeners[eventName] = this.eventListeners[eventName]
            .filter(cb => cb !== callback);
    }
    
    // จัดการข้อความที่ได้รับ
    _handleMessage(message) {
        // Emit generic message event
        this._emit('message', message);
        
        // Handle specific message types
        switch (message.type) {
            case 'welcome':
                this.connectionId = message.connectionId;
                this._emit('welcome', message);
                break;
                
            case 'chat':
                this._emit('chat', message);
                break;
                
            case 'notification':
                this._emit('notification', message);
                break;
                
            case 'register':
                this._emit('registered', message);
                break;
                
            case 'pong':
                this._emit('pong', message);
                break;
                
            case 'error':
                this._emit('serverError', message);
                break;
        }
    }
    
    // เริ่ม ping interval เพื่อรักษาการเชื่อมต่อ
    _startPingInterval() {
        this._clearPingInterval();
        
        this.pingInterval = setInterval(() => {
            this.sendPing();
        }, 30000); // 30 seconds
    }
    
    // ล้าง ping interval
    _clearPingInterval() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }
    
    // เรียก event listeners
    _emit(eventName, data) {
        if (!this.eventListeners[eventName]) {
            return;
        }
        
        for (const callback of this.eventListeners[eventName]) {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in ${eventName} event handler:`, error);
            }
        }
    }
}

// Export the class
window.WebSocketClient = WebSocketClient;