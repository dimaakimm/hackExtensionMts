const ws = new WebSocket("ws://localhost:8000/ws/session1/listener");

ws.onmessage = async (event) => {
    // Получаем аудио данные от сервера
    const audioData = event.data;
    console.log("Received audio data:", audioData);
};
