/*
document.getElementById('captureButton').addEventListener('click', () => {
    chrome.tabCapture.capture({ audio: true, video: false }, function(stream) {
        if (chrome.runtime.lastError || !stream) {
            console.error('Ошибка захвата аудио:', chrome.runtime.lastError);
            return;
        }

        // Создаем элемент для воспроизведения аудио (по желанию)
        const audioElement = document.createElement('audio');
        audioElement.srcObject = stream;
        audioElement.controls = true;
        document.body.appendChild(audioElement);
        audioElement.play();

        // Используем MediaRecorder для записи аудио из MediaStream
        let mediaRecorder;
        try {
            mediaRecorder = new MediaRecorder(stream);
        } catch (e) {
            console.error('MediaRecorder не поддерживается:', e);
            return;
        }

        const recordedChunks = [];

        // Событие срабатывает при наличии данных записи
        mediaRecorder.ondataavailable = function(event) {
            if (event.data && event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // Когда запись остановлена, собираем все данные в один Blob
        mediaRecorder.onstop = function() {
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);

            // Создаем ссылку для скачивания записанного аудио
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'recorded_audio.webm';
            downloadLink.textContent = 'Скачать записанное аудио';
            downloadLink.style.display = 'block';
            document.body.appendChild(downloadLink);

            console.log('Запись завершена, аудио доступно для скачивания.');
        };

        // Запускаем запись
        mediaRecorder.start();
        console.log('Началась запись аудио.');

        // Пример: останавливаем запись через 10 секунд
        setTimeout(() => {
            mediaRecorder.stop();
            console.log('Остановка записи.');
        }, 10000);
    });
});
*/
