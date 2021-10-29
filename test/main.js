version=5.2
clean=false
host="http://192.168.160.1:8000"
document.querySelector("form button").onclick = function (event) {
    event.preventDefault()
    var input = document.querySelector('input[type="file"]')
    var body = new FormData()
    body.append('file', input.files[0])
    fetch(`${host}/SignatureServer/update/?version=${version}&clean=${clean}`, {
        method: 'POST',
        body: body
    }).then(function (response) {
        if (response.ok) {
            
            return response.json()
        }
        throw new Error('Network response was not ok.')
    }).then(function (json) {
        console.log(json)
    }).catch(function (error) {
        console.log(error)
    })
}



