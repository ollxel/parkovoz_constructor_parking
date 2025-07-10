const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Генерация случайных данных для демонстрации
function generateParkingData(size) {
    const data = [];
    for (let i = 0; i < size; i++) {
        data.push(Math.random() > 0.7 ? 1 : 0);
    }
    return data;
}

wss.on('connection', (ws) => {
    console.log('Новое подключение');
    
    // Отправляем данные каждые 2 секунды
    const interval = setInterval(() => {
        try {
            if (ws.readyState === WebSocket.OPEN) {
                const parkingData = generateParkingData(20); // 20 spots
                ws.send(JSON.stringify({
                    type: "parking_data",
                    data: parkingData,
                    timestamp: new Date().toISOString()
                }));
            }
        } catch (e) {
            console.error('Ошибка отправки данных:', e);
        }
    }, 2000);
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === "request_data") {
                const parkingData = generateParkingData(data.size || 20);
                ws.send(JSON.stringify({
                    type: "parking_data",
                    data: parkingData,
                    timestamp: new Date().toISOString()
                }));
            }
        } catch (e) {
            console.error('Ошибка обработки сообщения:', e);
        }
    });
    
    ws.on('close', () => {
        console.log('Подключение закрыто');
        clearInterval(interval);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket ошибка:', error);
    });
});

console.log('WebSocket сервер запущен на порту 8080');