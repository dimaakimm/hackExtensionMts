let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let ws = new WebSocket("ws://localhost:8000/ws/session1/speaker");

// Функция для запроса доступа к микрофону
async function getMicrophoneAccess() {
    try {
        // Если разрешение уже есть в localStorage, не запрашиваем его заново
        if (!localStorage.getItem("microphoneAccessGranted")) {
            // Запрашиваем доступ к микрофону
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            localStorage.setItem("microphoneAccessGranted", "true"); // Сохраняем информацию о том, что доступ предоставлен
            return stream;
        } else {
            // Если доступ уже был предоставлен, просто возвращаем доступный поток
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return stream;
        }
    } catch (err) {
        console.log('Ошибка с getUserMedia:', err);
        return null;
    }
}

ws.onopen = () => {
    console.log('WebSocket соединение установлено');
};

document.getElementById("startRecording").addEventListener("click", async () => {
    let recorder;

    async function recordAndSend() {
        try {
            let stream = await getMicrophoneAccess();
            if (!stream) {
                console.log('Нет доступа к микрофону');
                return;
            }

            let mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            let chunks = [];

            // Запускаем запись
            mediaRecorder.start();

            // Когда запись заканчивается, формируем WebM файл
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                let blob = new Blob(chunks, { type: 'audio/webm' });

                // Отправляем WebM файл на сервер
                let audioBlob = new Blob([blob], { type: 'audio/webm' });
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(audioBlob);
                    console.log("Отправлены аудио данные (WebM файл)");
                }
            };

            // Закрываем запись и поток через 1 секунду
            setTimeout(() => {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop()); // Останавливаем все треки потока
            }, 5000); // Запись на 1 секунду

        } catch (err) {
            console.log('Ошибка с getUserMedia:', err);
        }
    }

    // Запускаем запись каждые 1 секунду
    setInterval(() => {
        recordAndSend();
    }, 4500);
});

document.getElementById("stopRecording").addEventListener("click", () => {
    ws.close();  // Закрываем WebSocket соединение при остановке записи
    console.log("Запись остановлена");
});
