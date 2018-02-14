var socket = io();

function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
        function(position) {    
            socket.emit('c2s-mygo-position', {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
            console.log(position)
        },
        // 取得失敗した場合
        function(error) {
            switch(error.code) {
                case 1: //PERMISSION_DENIED
                alert("位置情報の利用が許可されていません");
                break;
                case 2: //POSITION_UNAVAILABLE
                alert("現在位置が取得できませんでした");
                break;
                case 3: //TIMEOUT
                alert("タイムアウトになりました");
                break;
                default:
                alert("その他のエラー(エラーコード:"+error.code+")");
                break;
            }
        }
    );
}

function speak(text) {
    var synth = window.speechSynthesis
    var utterThis = new SpeechSynthesisUtterance(text)
    utterThis.voice = synth.getVoices().find(function(voice) { return voice.lang == 'ja-JP' })
    utterThis.pitch = 1
    utterThis.rate = 1
    synth.speak(utterThis)
}

socket.on('s2c-instruction', function(text){        
    var $div = $('<div>' + text + '</div>')
    $('.instruction-display').append($div.addClass('animate'))
    setTimeout(function() {
        $div.remove()
    }, 3000)
    speak(text);
})

setInterval(function() {
    getCurrentPosition()
}, 1000)

getCurrentPosition()