(function () {
    console.log("MTS-Link Helper запущен!");

    // Создание основного контейнера
    const container = document.createElement("div");
    container.id = "mts-link-helper";
    container.style.position = "fixed";
    container.style.bottom = "80px";
    container.style.right = "20px";
    container.style.width = "320px";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    container.style.color = "white";
    container.style.padding = "15px";
    container.style.borderRadius = "8px";
    container.style.fontSize = "16px";
    container.style.zIndex = "9999";
    container.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.3)";
    container.style.textAlign = "center";
    container.setAttribute("tabindex", "0"); // Доступность через Tab

    // Поле выбора режима (speaker/listener)
    const modeSelectContainer = document.createElement("div");
    modeSelectContainer.style.marginBottom = "10px";

    const modeLabel = document.createElement("label");
    modeLabel.innerText = "Выберите режим:";
    modeLabel.style.display = "block";
    modeLabel.style.marginBottom = "5px";
    modeSelectContainer.appendChild(modeLabel);

    const modeSelect = document.createElement("select");
    modeSelect.style.width = "100%";
    modeSelect.style.padding = "8px";
    modeSelect.style.border = "none";
    modeSelect.style.borderRadius = "5px";
    modeSelect.style.fontSize = "14px";
    modeSelect.style.cursor = "pointer";
    modeSelect.style.color = "black";
    modeSelect.setAttribute("tabindex", "0");

    const modes = { "none": "Выберите режим", "speaker": "Speaker", "listener": "Listener" };
    for (const [value, text] of Object.entries(modes)) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        modeSelect.appendChild(option);
    }
    modeSelectContainer.appendChild(modeSelect);
    container.appendChild(modeSelectContainer);

    // **Контейнер для элементов Listener (скрывается при выборе Speaker)**
    const listenerContainer = document.createElement("div");
    listenerContainer.style.display = "none"; // Скрыт по умолчанию

    // Заголовок
    const title = document.createElement("div");
    title.innerText = "MTS-Link Helper";
    title.style.fontSize = "18px";
    title.style.marginBottom = "10px";
    title.style.fontWeight = "bold";
    title.setAttribute("aria-label", "MTS-Link Helper");
    listenerContainer.appendChild(title);

    // Текстовое поле (отображение данных)
    const textDisplay = document.createElement("div");
    textDisplay.id = "textDisplay";
    textDisplay.innerText = "Ожидание данных...";
    textDisplay.style.padding = "10px";
    textDisplay.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    textDisplay.style.borderRadius = "5px";
    textDisplay.style.marginBottom = "10px";
    textDisplay.style.fontSize = "14px";
    textDisplay.setAttribute("tabindex", "0");
    textDisplay.setAttribute("aria-label", textDisplay.innerText);
    listenerContainer.appendChild(textDisplay);

// Кнопка "Добавить субтитры"
    const subtitleButton = document.createElement("button");
    subtitleButton.innerText = "Добавить субтитры";
    subtitleButton.style.width = "100%";
    subtitleButton.style.padding = "8px";
    subtitleButton.style.backgroundColor = "#4CAF50";
    subtitleButton.style.color = "white";
    subtitleButton.style.border = "none";
    subtitleButton.style.borderRadius = "5px";
    subtitleButton.style.cursor = "pointer";
    subtitleButton.style.marginBottom = "10px";
    subtitleButton.style.fontSize = "14px";
    subtitleButton.setAttribute("tabindex", "0");
    subtitleButton.setAttribute("aria-label", "Добавить субтитры");

    let isGray = false; // Флаг состояния кнопки

    subtitleButton.addEventListener("click", () => {
        isGray = !isGray; // Переключение состояния
        subtitleButton.style.backgroundColor = isGray ? "gray" : "#4CAF50";
    });

    listenerContainer.appendChild(subtitleButton);

    // Выпадающий список языков
    const languageSelect = document.createElement("select");
    languageSelect.style.width = "100%";
    languageSelect.style.padding = "8px";
    languageSelect.style.border = "none";
    languageSelect.style.borderRadius = "5px";
    languageSelect.style.fontSize = "14px";
    languageSelect.style.cursor = "pointer";
    languageSelect.style.color = "black";
    languageSelect.setAttribute("tabindex", "0");
    languageSelect.setAttribute("aria-label", "Выберите язык субтитров");

    const languages = { ru: "Русский", en: "Английский", zh: "Китайский" };
    for (const [code, name] of Object.entries(languages)) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        languageSelect.appendChild(option);
    }

    listenerContainer.appendChild(languageSelect);
    container.appendChild(listenerContainer);

    // Добавление контейнера в body
    document.body.appendChild(container);

    // **Функция переключения видимости**
    function updateUI() {
        if (modeSelect.value === "listener") {
            listenerContainer.style.display = "block"; // Показываем элементы listener
        } else {
            listenerContainer.style.display = "none"; // Скрываем все, кроме селектора
        }
    }

    modeSelect.addEventListener("change", () => {
        updateUI();
        if (modeSelect.value === "speaker") {
            startRecording();
        } else if (ws) {
            ws.close();
            console.log("WebSocket соединение закрыто");
        }
    });

    let wsSpeaker = null; // WebSocket для speaker
    let wsListener = null; // WebSocket для listener
    let recordInterval = null; // Интервал записи

    async function getMicrophoneAccess() {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return stream;
        } catch (err) {
            console.log("Ошибка с getUserMedia:", err);
            return null;
        }
    }

    function recordAudio() {
        if (recordInterval) {
            clearInterval(recordInterval); // Очищаем предыдущий интервал записи
        }

        recordInterval = setInterval(async () => {
            let stream = await getMicrophoneAccess();
            if (!stream) {
                console.log("Нет доступа к микрофону");
                return;
            }

            let mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            let chunks = [];

            mediaRecorder.start();
            mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
            mediaRecorder.onstop = () => {
                let audioBlob = new Blob(chunks, { type: "audio/webm" });
                if (wsSpeaker && wsSpeaker.readyState === WebSocket.OPEN) {
                    wsSpeaker.send(audioBlob);
                    console.log("Отправлены аудио данные (WebM файл)");
                } else {
                    console.log("WebSocket не открыт. Данные не отправлены.");
                }
            };

            setTimeout(() => {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
            }, 5000);
        }, 5000);
    }

    function startRecording() {
        if (wsSpeaker) {
            console.log("Закрытие предыдущего WebSocket Speaker...");
            wsSpeaker.close();
        }

        wsSpeaker = new WebSocket("ws://localhost:8000/ws/session1/speaker");

        wsSpeaker.onopen = () => {
            console.log("WebSocket Speaker подключен");
            recordAudio();
        };

        wsSpeaker.onerror = (error) => {
            console.error("Ошибка WebSocket Speaker:", error);
        };

        wsSpeaker.onclose = (event) => {
            console.warn("WebSocket Speaker закрыт. Код:", event.code, "Причина:", event.reason);
            setTimeout(() => {
                if (wsSpeaker && wsSpeaker.readyState === WebSocket.CLOSED) {
                    stopRecording();
                }
            }, 500);
        };
    }

    function stopRecording() {
        if (recordInterval) {
            clearInterval(recordInterval);
            recordInterval = null;
            console.log("Запись остановлена.");
        }
        if (wsSpeaker && wsSpeaker.readyState === WebSocket.OPEN) {
            console.log("Закрываем WebSocket Speaker...");
            wsSpeaker.close();
            wsSpeaker = null;
        }
    }

// **Функция переключения режима**
    function updateUI() {
        if (modeSelect.value === "listener") {
            listenerContainer.style.display = "block";
            startListening();
        } else {
            listenerContainer.style.display = "none";
            stopListening();
        }
    }

    function startListening() {
        if (wsListener && wsListener.readyState === WebSocket.OPEN) {
            console.log("Закрытие предыдущего WebSocket Listener...");
            wsListener.close();
        }


        wsListener = new WebSocket("ws://localhost:8000/ws/session1/listener");

        wsListener.onopen = () => {
            console.log("WebSocket Listener подключен");
        };

        wsListener.onmessage = async (event) => {
            console.log("Получены данные от сервера:", event.data);
            animateTextDisplay(event.data);
        };

        wsListener.onerror = (error) => {
            console.error("Ошибка WebSocket Listener:", error);
        };

        wsListener.onclose = () => {
            console.warn("WebSocket Listener отключен");
        };
    }

    function animateTextDisplay(text) {
        const textDisplay = document.getElementById("textDisplay");
        console.log(textDisplay);
        if (!textDisplay) {
            console.error("❌ Ошибка: элемент #textDisplay не найден!");
            return;
        }
        textDisplay.innerHTML = ""; // Очищаем текст перед анимацией

        const words = text.split(" ");
        words.forEach((word, index) => {
            let span = document.createElement("span");
            span.textContent = word + " "; // Добавляем пробел после каждого слова
            span.style.opacity = "0"; // Скрываем слово
            span.style.transition = "opacity 0.5s ease-in-out";
            textDisplay.appendChild(span);

            // Показываем слово с задержкой
            setTimeout(() => {
                span.style.opacity = "1";
            }, index * 300); // Задержка между словами 300 мс
        });
    }

// **Функция для остановки WebSocket Listener**
    function stopListening() {
        if (wsListener) {
            console.log("Закрываем WebSocket Listener...");
            wsListener.close();
            wsListener = null;
        }
    }

// **Обновляем UI при смене режима**
    modeSelect.addEventListener("change", () => {
        updateUI();
        if (modeSelect.value === "speaker") {
            startRecording();
        } else {
            stopRecording();
        }
    });

// **Установить начальное состояние UI**
    updateUI();

})();
