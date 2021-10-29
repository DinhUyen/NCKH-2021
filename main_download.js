document.querySelector("#download").onclick = function () {
  var text = "http://192.168.0.168:8000/SignatureBase/Signature";
  var filename = "signature.zip";
  fetch(text)
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename you want
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert("your file has downloaded!"); // or you know, something with better UX...
    })
    .catch(() => alert("oh no!"));
};
