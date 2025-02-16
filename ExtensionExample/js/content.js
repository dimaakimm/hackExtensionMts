(function () {
    console.log("MTS-Link Helper запущен!");

    function createElement(tag, attributes = {}, styles = {}) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        Object.assign(element.style, styles);
        return element;
    }

    const container = createElement("div", { id: "mts-link-helper", tabindex: "0" }, {
        position: "fixed",
        bottom: "90px",
        left: "20px",
        width: "400px",
        backgroundColor: "#333", // Темный фон
        color: "white",
        padding: "15px",
        borderRadius: "10px", // Слегка закругленные углы
        fontSize: "16px",
        zIndex: "9999",
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "2px solid #4CAF50", // Зеленая граница для акцента
    });

    const listenerContainer = createElement("div", {}, { display: "none", width: "100%" });

    const textDisplay = createElement("div", { id: "textDisplay", innerText: "Ожидание данных...", tabindex: "0", "aria-label": "Ожидание данных..." }, {
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        marginBottom: "10px",
        fontSize: "16px",
        color: "white",
        border: "1px solid #4CAF50",
        minHeight: "38px"
    });
    listenerContainer.appendChild(textDisplay);

    const summaryDisplay = createElement("div", { id: "summaryDisplay", innerText: "Ожидание данных...", tabindex: "0", "aria-label": "Ожидание данных..." }, {
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        marginBottom: "15px",
        fontSize: "16px",
        color: "white",
        border: "1px solid #4CAF50",
        minHeight: "38px"
    });
    listenerContainer.appendChild(summaryDisplay);

    const subtitleButton = createElement("button", { innerText: "Озвучивание текста", tabindex: "0", "aria-label": "Озвучивание текста", id: "startSound" }, {
        width: "100%",
        padding: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        textTransform: "uppercase",
    });

    let isGray = false;
    subtitleButton.addEventListener("click", () => {
        isGray = !isGray;
        subtitleButton.style.backgroundColor = isGray ? "gray" : "#4CAF50";
    });
    listenerContainer.appendChild(subtitleButton);

    const screenshotButton = createElement("button", { innerText: "Сделать скриншот", tabindex: "0", "aria-label": "Сделать скриншот" }, {
        width: "100%",
        padding: "10px",
        backgroundColor: "#FF5722",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold",
    });
    listenerContainer.appendChild(screenshotButton);

    const languageSelect = createElement("select", { tabindex: "0", "aria-label": "Выберите язык субтитров" }, {
        width: "100%",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        cursor: "pointer",
        color: "black",
        backgroundColor: "#fff",
        marginBottom: "10px",
    });
    const languages = { ru: "Русский", en: "Английский", zh: "Китайский" };
    Object.entries(languages).forEach(([code, name]) => {
        const option = createElement("option", { value: code, innerText: name });
        languageSelect.appendChild(option);
    });
    listenerContainer.appendChild(languageSelect);

    const fontSizeButton = createElement("button", { innerText: "+", tabindex: "0", "aria-label": "Увеличить размер текста" }, {
        width: "100%",
        padding: "10px",
        backgroundColor: "#FFC107",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold",
    });

    fontSizeButton.addEventListener("click", () => {
        let currentSize = parseInt(window.getComputedStyle(textDisplay).fontSize);
        textDisplay.style.fontSize = (currentSize + 2) + "px";
        summaryDisplay.style.fontSize = (currentSize + 2) + "px";
    });

    const decreaseFontSizeButton = createElement("button", { innerText: "-", tabindex: "0", "aria-label": "Уменьшить размер текста" }, {
        width: "100%",
        padding: "10px",
        backgroundColor: "#FFC107",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold",
    });

    decreaseFontSizeButton.addEventListener("click", () => {
        let currentSize = parseInt(window.getComputedStyle(textDisplay).fontSize);
        textDisplay.style.fontSize = (currentSize - 2) + "px";
        summaryDisplay.style.fontSize = (currentSize - 2) + "px";
    });

    const buttonContainer1 = createElement("div", {}, {
        width: "100%",
        display: "flex",
        gap: "10px",
    });
    buttonContainer1.appendChild(decreaseFontSizeButton)
    buttonContainer1.appendChild(fontSizeButton)

    const titleSection1 = createElement("div", { innerText: "Шрифт"}, {
        fontSize: "14px",
        fontWeight: "bold",
    });

    const sectionButtonContainer1 = createElement("div", {}, {
        width: "100%",
        display: "flex",
        gap: "10px",
        flexDirection: "column"
    });
    sectionButtonContainer1.appendChild(titleSection1);
    sectionButtonContainer1.appendChild(buttonContainer1);

    const speedButton = createElement("button", { innerText: "+", tabindex: "0", "aria-label": "Ускорить анимацию" }, {
        width: "100%",
        padding: "10px",
        backgroundColor: "#FFC107",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold",
    });

    let animationSpeed = 300;
    speedButton.addEventListener("click", () => {
        animationSpeed = animationSpeed > 100 ? animationSpeed - 50 : 300;
        console.log("Скорость анимации:", animationSpeed);
    });

    const slowButton = createElement("button", { innerText: "-", tabindex: "0", "aria-label": "Замедлить анимацию" }, {
        width: "100%",
        padding: "10px",
        backgroundColor: "#FFC107",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold",
    });

    slowButton.addEventListener("click", () => {
        animationSpeed += 50;
        console.log("Скорость анимации:", animationSpeed);
    });

    const titleSection2 = createElement("div", { innerText: "Скорость"}, {
        fontSize: "14px",
        fontWeight: "bold",
    });

    const buttonContainer2 = createElement("div", {}, {
        width: "100%",
        display: "flex",
        gap: "10px"
    });
    buttonContainer2.appendChild(slowButton)
    buttonContainer2.appendChild(speedButton)

    const sectionButtonContainer2 = createElement("div", {}, {
        width: "100%",
        display: "flex",
        gap: "10px",
        flexDirection: "column"
    });
    sectionButtonContainer2.appendChild(titleSection2);
    sectionButtonContainer2.appendChild(buttonContainer2);

    const buttonContainer3 = createElement("div", {}, {
        width: "100%",
        display: "flex",
        gap: "10px"
    });
    buttonContainer3.appendChild(sectionButtonContainer1)
    buttonContainer3.appendChild(sectionButtonContainer2)
    listenerContainer.appendChild(buttonContainer3);

    document.body.appendChild(container);
    container.appendChild(listenerContainer);

    const modeSelectContainer = createElement("div", {}, { width: "100%" });
    const modeLabel = createElement("label", { innerText: "Выберите режим:" }, { display: "block", marginBottom: "5px" });
    const modeSelect = createElement("select", { tabindex: "0" }, {
        width: "100%", padding: "10px", border: "none", borderRadius: "5px", fontSize: "14px", cursor: "pointer", color: "black", backgroundColor: "#fff", marginTop: "5px"
    });

    const modes = { "none": "Выберите режим", "speaker": "Speaker", "listener": "Listener" };
    Object.entries(modes).forEach(([value, text]) => {
        const option = createElement("option", { value, innerText: text });
        modeSelect.appendChild(option);
    });

    modeSelectContainer.append(modeLabel, modeSelect);
    container.appendChild(modeSelectContainer);

    function updateUI() {
        listenerContainer.style.display = modeSelect.value === "listener" ? "block" : "none";
        if (modeSelect.value === "listener") {
            listenerContainer.style.display = "block";
            startListening();
        } else {
            listenerContainer.style.display = "none";
            stopListening();
        }
    }

    modeSelect.addEventListener("change", () => {
        updateUI();
        if (modeSelect.value === "speaker") {
            startRecording();
        } else {
            stopRecording();
        }
    });

    document.getElementById("startSound").addEventListener("click", () => {
        console.log("startSound")
        if(wsListener){
            wsListener.close()
        }
        wsListener = new WebSocket("ws://localhost:8000/ws/2/listener");

        wsListener.onopen = () => {
            console.log("WebSocket Listener подключен с аудио");
        };

        wsListener.onmessage = (event) => {
            console.log("message")
            const audioData = event.data;

            const audioBlob = new Blob([audioData], { type: 'audio/wav' });

            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);

            audio.play()
                .then(() => {
                    console.log('Audio is playing');
                })
                .catch((error) => {
                    console.error('Error playing audio:', error);
                });
        };

        wsListener.onerror = (error) => {
            console.error("Ошибка WebSocket Listener:", error);
        };

        wsListener.onclose = () => {
            console.warn("WebSocket Listener отключен");
        };
    })

    let wsSpeaker = null;
    let wsListener = null;
    let recordInterval = null;

    async function getMicrophoneAccess() {
        try {
            return await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
            console.log("Ошибка с getUserMedia:", err);
            return null;
        }
    }

    function recordAudio() {
        if (recordInterval) {
            clearInterval(recordInterval);
        }

        recordInterval = setInterval(async () => {
            const stream = await getMicrophoneAccess();
            if (!stream) return;

            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            const chunks = [];
            mediaRecorder.start();

            mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: "audio/webm" });
                if (wsSpeaker && wsSpeaker.readyState === WebSocket.OPEN) {
                    wsSpeaker.send(audioBlob);
                    console.log("Отправлены аудио данные (WebM файл)");
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

        wsSpeaker.onclose = () => {
            console.warn("WebSocket Speaker закрыт.");
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
            wsSpeaker.close();
            wsSpeaker = null;
        }
    }

    function startListening() {
        if (wsListener && wsListener.readyState === WebSocket.OPEN) {
            wsListener.close();
        }
        wsListener = new WebSocket("ws://localhost:8000/ws/session1/listener");
        wsListener.onopen = () => {
            console.log("WebSocket Listener подключен");
        };
        wsListener.onmessage = (event) => {
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
        if (!textDisplay) return;

        textDisplay.innerHTML = "";
        const words = text.split(" ");
        words.forEach((word, index) => {
            const span = document.createElement("span");
            span.textContent = word + " ";
            span.style.opacity = "0";
            span.style.transition = `opacity ${animationSpeed}ms ease-in-out`;
            textDisplay.appendChild(span);
            setTimeout(() => {
                span.style.opacity = "1";
            }, index * animationSpeed);
        });
    }

    function stopListening() {
        if (wsListener) {
            wsListener.close();
            wsListener = null;
        }
    }

    async function getSummary() {
        try {
            const response = await fetch('http://localhost:8000/summary');
            if (!response.ok) {
                throw new Error(`Ошибка при получении данных: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            const summaryDisplay = document.getElementById("summaryDisplay");
            summaryDisplay.innerHTML = data.text;
            return data;
        } catch (error) {
            console.error('Произошла ошибка при запросе данных:', error);
        }
    }
    setInterval(getSummary, 20000);

    updateUI();
})();
