// 定义全局变量
let mediaRecorder;
let audioContext;
let audioPlayer = document.getElementById('audio-player');
let startButton = document.getElementById('start-button');
let stopButton = document.getElementById('stop-button');

// 检查浏览器是否支持getUserMedia和MediaRecorder
if (navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
    startButton.disabled = false;
} else {
    console.log('浏览器不支持录音功能');
}

// 开始录音
startButton.addEventListener('click', function () {
    startButton.disabled = true;
    stopButton.disabled = false;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            audioContext = new AudioContext();
            mediaRecorder = new MediaRecorder(stream);

            let audioChunks = [];
            mediaRecorder.start();
            mediaRecorder.addEventListener('dataavailable', function (e) {
                audioChunks.push(e.data);
            });

            mediaRecorder.addEventListener('stop', function () {
                let audioBlob = new Blob(audioChunks);
                let audioUrl = URL.createObjectURL(audioBlob);

                audioPlayer.src = audioUrl;
                audioPlayer.play();

                audioChunks = [];
            });

          
        })
        .catch(function (error) {
            console.error('获取用户媒体设备失败:', error);
        });
});

// 停止录音
stopButton.addEventListener('click', function () {
    startButton.disabled = false;
    stopButton.disabled = true;

    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }

    audioContext.close();
});