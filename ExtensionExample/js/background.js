chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[background.js] Получено сообщение:", message);
    if (message.command === "startRecording") {
        console.log("[background.js] Начинаем запись...");
        chrome.storage.local.set({ recording: true });
    }
    if (message.command === "stopRecording") {
        console.log("[background.js] Останавливаем запись...");
        chrome.storage.local.set({ recording: false });
    }
    if (message.audioUrl) {
        console.log("[background.js] Скачиваем аудиофайл:", message.audioUrl);
        chrome.downloads.download({
            url: message.audioUrl,
            filename: "mts_link_audio.webm",
            saveAs: true
        });
    }
});