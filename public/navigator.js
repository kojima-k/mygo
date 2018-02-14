var socket = io();

var initMapResolve
var initMapPromise = new Promise(function(resolve, reject) {
    initMapResolve = resolve
})

var getCurrentPositionResolve
var getCurrentPositionPromise = new Promise(function(resolve, reject) {
    getCurrentPositionResolve = resolve
})

var firstMygoPositionResolve
var firstMygoPositionPromise = new Promise(function(resolve, reject) {
    firstMygoPositionResolve = resolve
})

function initMap() {
    console.log('ライブラリロード完了')
    initMapResolve()
}

function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
        function(position) {    
            console.log('位置情報取得完了', position)            
            getCurrentPositionResolve({
                lat: 34.665684,
                lng: 135.519257
            })            
            // getCurrentPositionResolve({
            //     lat: position.coords.latitude,
            //     lng: position.coords.longitude
            // })            
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

function displayRoute() {

}


function main() {
    var directionsService
    var directionsDisplay    
    var map = null    
    var mygoMarker = null
    var selfPosition = {
        lat: 0,
        lng: 0
    }

    initMapPromise.then(function() {
        directionsService = new google.maps.DirectionsService()
    })

    function calcRoute(origin, destination, directionsDisplay) {
        var request = {
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        };
        
        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(result);
            }
        })
    }

    getCurrentPosition()        

    Promise.all([initMapPromise, getCurrentPositionPromise]).then(function(data) {        
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: data[1]
        });
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map)
        selfPosition = data[1]
        
    })

    socket.on('s2c-mygo-position', function(data) {
        console.log(data)
        if(mygoMarker == null) {
            mygoMarker = new google.maps.Marker({
                position: data,
                map: map
            })
            firstMygoPositionResolve(data)
        } else {
            mygoMarker.setPosition(new google.maps.LatLng( data.lat, data.lng ))
        }        
    })

    Promise.all([firstMygoPositionPromise, getCurrentPositionPromise, initMapPromise])
        .then(function(results) {
            calcRoute(results[0], results[1], directionsDisplay)
        })

}

$('.instructions button').on('click',function(){    
    socket.emit('c2s-instruction', $(this).data('word'))
})

main()

