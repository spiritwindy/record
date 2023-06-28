let audioContext;
let scriptProcessorNode;
let recordedData = [];
let isRecording = false;
let isPlaying = false;

// 获取音频流并开始录音
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            audioContext = new AudioContext();
            scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1);

            let mediaStreamSource = audioContext.createMediaStreamSource(stream);
            mediaStreamSource.connect(scriptProcessorNode);
            scriptProcessorNode.connect(audioContext.destination);

            scriptProcessorNode.onaudioprocess = function (audioProcessingEvent) {
                if (!isRecording) return;
                recordedData.push(
                    new Float32Array(audioProcessingEvent.inputBuffer.getChannelData(0)));
                playRecording();
            };

            isRecording = true;
            
        })
        .catch(function (error) {
            console.error('获取用户媒体设备失败:', error);
        });
}

// 停止录音
function stopRecording() {
    isRecording = false;
    scriptProcessorNode.disconnect();
    audioContext.close();
}

// 播放录音
function playRecording() {
    if (isPlaying) return;
    isPlaying = true;
    console.log("正在播放")
    let audioBuffer = audioContext.createBuffer(1, recordedData.length * 4096, audioContext.sampleRate);
    let channelData = audioBuffer.getChannelData(0);
    let offset = 0;

    recordedData.forEach(function (data) {
        channelData.set(data, offset);
        offset += data.length;
    });
    recordedData = [];
    let audioBufferSourceNode = audioContext.createBufferSource();
    audioBufferSourceNode.buffer = audioBuffer;
    audioBufferSourceNode.connect(audioContext.destination);

    audioBufferSourceNode.onended = function () {
        isPlaying = false;
    };

    audioBufferSourceNode.start();
}

// 监听按钮点击事件
document.getElementById('start-button').addEventListener('click', startRecording);
document.getElementById('stop-button').addEventListener('click', stopRecording);
document.getElementById('play-button').addEventListener('click', playRecording);
