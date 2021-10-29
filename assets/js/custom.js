var host = "http://192.168.0.168:8000";
fetch(`${host}/list/`)
  .then(function (response) {
    return response.json();
  })
  .then(function (totalJson) {
    return totalJson.length;
  })
  .then(function (total) {
    document.querySelector("#totalClient").innerHTML = total;
    return total;
  })
  .then(function (total) {
    getCurrentReport(total);
    createChartAndStatus(total);
  });
function getCurrentReport(totalClient) {
  fetch(host + "/currentReport")
    .then(function (detect) {
      return detect.json();
    })
    .then(function (detectJson) {
      alerts = 0;
      warnings = 0;
      if (detectJson.hasOwnProperty("alerts")) {
        alerts = detectJson.alerts.length;
        warnings = detectJson.warnings.length;
      }
      safes = totalClient - warnings - alerts;
      return {
        safes: safes,
        warnings: warnings,
        alerts: alerts,
        total: totalClient,
      };
    })
    .then(function (info) {
      document.querySelector(
        "#antoan div"
      ).innerHTML = `<h1 style=\"text-align: center;\">${info.safes}/${info.total}</h1>`;
      document.querySelector(
        "#canhbao div"
      ).innerHTML = `<h1 style=\"text-align: center;\">${info.warnings}/${info.total}</h1>`;
      document.querySelector(
        "#baodong div"
      ).innerHTML = `<h1 style=\"text-align: center;\">${info.alerts}/${info.total}</h1>`;
    })
    .then(function () {
      setTimeout(function () {
        getCurrentReport(totalClient);
      }, 2000);
    });
}
function createChartAndStatus(totalClient) {
  fetch(host + "/listRecentReport")
    .then(function (response) {
      return response.json();
    })
    .then(function (listJson) {
      return [Object.keys(listJson), Object.values(listJson)]; // tra ve danh sach cac ngay, gia
    })
    .then(function (listDetect) {
      //  get status
      if (listDetect[1][29].hasOwnProperty("alerts")) {
        document.querySelector("#totalAlert").innerHTML =
          listDetect[1][29].alerts.length;
        document.querySelector("#totalWarning").innerHTML =
          listDetect[1][29].warnings.length;
        document.querySelector("#totalSafe").innerHTML =
          totalClient -
          listDetect[1][29].alerts.length -
          listDetect[1][29].warnings.length;
      } else {
        document.querySelector("#totalAlert").innerHTML = 0;
        document.querySelector("#totalWarning").innerHTML = 0;
        document.querySelector("#totalSafe").innerHTML = totalClient;
      }
      // get Char value

      detect = [];
      for (var i = 0; i < listDetect[0].length; ++i) {
        listDetect[0][i] = listDetect[0][i].slice(0, 5);
        alerts = 0;
        warnings = 0;
        if (listDetect[1][i].hasOwnProperty("alerts")) {
          alerts = listDetect[1][i].alerts.length;
          warnings = listDetect[1][i].warnings.length;
        }
        detect.push(((alerts + warnings) / totalClient) * 100);
      }
      detect.push(100);
      return [listDetect[0], detect];
    })
    .then(function (lists) {
      insertChart(lists[0], lists[1]);
    });
}
function insertChart(Labels, datas) {
  var chart = document.getElementById("mychart");
  var chart = document.getElementById("mychart").getContext("2d");
  var massPopChart = new Chart(chart, {
    type: "line",
    data: {
      labels: Labels,
      datasets: [
        {
          label: "Tỉ lệ số máy được phát hiện trong 30 ngày gần nhất",
          borderColor: "red",
          data: datas,
        },
      ],
    },
    option: {},
  });
}
function getClient() {
  fetch(host + "/list/")
    .then(function (response) {
      x = response.json();
      return x;
    })
    .then(function (arrayJson) {
      //console.log(arrayJson);
      x = arrayJson;
      return x;
    })
    .then(function (arrayJson) {
      Client(arrayJson);
    });
}
function getConfig(id) {
  return fetch(host + "/" + id + "/config/")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      return json;
    });
}
function Client(arrayJson) {
  var classManagement = document.querySelector(
    "#DataManagement .container .row"
  );
  var classSettings = document.querySelector("#DataSettings .container .row");
  htmlsManagement = "";
  htmlsSetting = "";
  //console.log(arrayJson)
  for (let i = 0; i < arrayJson.length; ++i) {
    config = getConfig(arrayJson[i]);
    config
      .then(function (json) {
        htmlsManagement += `<div id="Client${json["id"]}" class="col-lg-3 col-md-6 col-xl-3" onclick="showTableDetect(this)">
                                            <img src="assets/img/PCs/clean.jpg" alt=""  class="computer-name">
                                            <button class="computer-name-btn js-btn">${json["name"]}</button>
                                        </div> `;
        htmlsSetting += `<div id="Config${json["id"]}" class="col-lg-3 col-md-6 col-xl-3" onclick="showTableSettings(this)">
                                            <img src="assets/img/PCs/PC.jpg" alt="" class="computer-name">
                                            <button class="computer-name-btn js-btn">${json["name"]}</button>
                                        </div>  `;
        return {
          management: htmlsManagement,
          setting: htmlsSetting,
        };
      })
      .then(function (htmls) {
        classManagement.innerHTML = htmls.management;
        classSettings.innerHTML = htmls.setting;
      });
  }
  setTimeout(function () {
    getImageDetect(arrayJson);
  }, 2000);

  // for (var i = 0; i < arrayJson.length; ++i) {
  //       if detect['alerts'].find( arrayJson[i])
}
function getImageDetect(listClient) {
  fetch(`${host}/currentReport`)
    .then(function (response) {
      return response.json();
    })
    .then(function (detects) {
      for (let i = 0; i < listClient.length; ++i) {
        document.querySelector(
          `#DataManagement .container #Client${listClient[i]} img`
        ).src = "assets/img/PCs/clean.jpg";
      }
      if (detects.hasOwnProperty("alerts")) {
        for (let i = 0; i < detects["alerts"].length; i++) {
          document.querySelector(
            `#DataManagement .container #Client${detects["alerts"][i]} img`
          ).src = "assets/img/PCs/alert.jpg";
        }
        for (let i = 0; i < detects["warnings"].length; i++) {
          document.querySelector(
            `#DataManagement .container #Client${detects["warnings"][i]} img`
          ).src = "assets/img/PCs/warning.jpg";
        }
      }
    })
    .then(function () {
      setTimeout(function () {
        getImageDetect(listClient);
      }, 2000);
    });
}

function showTableDetect(Self) {
  var id = Self.id.slice(6);
  showTable();
  showDetect(id);
}
function showTableSettings(Self) {
  var id = Self.id.slice(6);
  showTable();
  showSettings(id);
}

function showDetect(id) {
  var apiDetect = `${host}/${id}/?start=0&limit=100`;
  fetch(apiDetect)
    .then(function (response) {
      return response.json();
    })
    .then(function (arrayJson) {
      var htmls = "";
      var infoDetect = document.querySelector(".table-detect .modal-body");
      infoDetect.innerHTML = "";
      for (var i = 0; i < arrayJson.length; ++i) {
        htmls += `<div class="row container-infor id="detect${arrayJson[i]["id"]}" ">
        <ul>
            <li>"id": ${arrayJson[i]["id"]}</li>
            <li>"mes_type": ${arrayJson[i]["mes_type"]}</li>
            <li>"MD5": ${arrayJson[i]["MD5"]}</li>
            <li>"SHA1": ${arrayJson[i]["SHA1"]}</li>
            <li>"type": ${arrayJson[i]["type"]}</li>
            <li>"size": ${arrayJson[i]["size"]}</li>
            <li>"reason": ${arrayJson[i]["reason"]}</li>
            <li>"path": ${arrayJson[i]["path"]}</li>
            <li>"matches": ${arrayJson[i]["matches"]}</li>
            <li>"description": ${arrayJson[i]["description"]}</li>
            <li>"datetime": ${arrayJson[i]["datetime"]} </li>
            <div class="btns">
                <div class="row buttons">
                    <button onclick="deleteDB()">Xóa bỏ</button>
                    <button idDb="${arrayJson[i]["id"]}" idClient ="${id}"  onclick="clearDb(this)">Bỏ qua</button>
                </div>
            </div>
        </ul>
    </div>`;
      }
      infoDetect.innerHTML = htmls;
    });
}
function showSettings(id) {
  var apiDetect = `${host}/${id}/config`;
  fetch(apiDetect)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonConfig) {
      var boolJson = {};
      for (let key in jsonConfig) {
        if (jsonConfig[key] === true) {
          boolJson[key] = `<option value="true">True</option>
                              <option value="false">False</option>`;
        } else {
          boolJson[key] = `<option value="false">False</option>
                              <option value="true">True</option>`;
        }
      }
      var infoSettings = document.querySelector(".table-detect .modal-body");
      var htmls = `
                    <h2>Configue Form</h2>
                    <!-- Configure form -->
                    <div class="container-figure">
                      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
                      <form id="config_form"  method="post">
                            <div class="row">
                                <div class="col-25">
                                    <label >Name</label>
                                </div>
                                <div class="col-75">
                                    <input type="text"  name="name" value=${jsonConfig["name"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label >IP</label>
                                </div>
                                <div class="col-75">
                                    <input type="text"name="ip" value=${jsonConfig["ip"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label >ID</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name="id" value=${jsonConfig["id"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Path</label>
                                </div>
                                <div class="col-75">
                                    <input type="text"  name="path" value=${jsonConfig["path"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label  >Kilobyte</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name ="kilobyte"  value=${jsonConfig["kilobyte"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label >Log file</label>
                                </div>
                                <div class="col-75">
                                    <input type="text"  name = "log_file" value=${jsonConfig["log_file"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Remote host server</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name="remote_host_server" value=${jsonConfig["remote_host_server"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Remote port server</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name ="remote_port_server"value=${jsonConfig["remote_port_server"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Alert level</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name="alert_level" value=${jsonConfig["alert_level"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Warning level</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name ="warning_level" value=${jsonConfig["warning_level"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Notice level</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name ="notice_level" value=${jsonConfig["notice_level"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Allhds</label>
                                </div>
                                <div  class="col-75">
                                    <select name ="allhds" >
                                        ${boolJson["allhds"]}                                      
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Alldrives</label>
                                </div>
                                <div class="col-75">
                                    <select name ="alldrives">
                                        ${boolJson["alldrives"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Printall</label>
                                </div>
                                <div class="col-75">
                                    <select name="printall"> 
                                        ${boolJson["printall"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Allreasons</label>
                                </div>
                                <div class="col-75">
                                    <select name ="allreasons">
                                        ${boolJson["allreasons"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Noprocscan</label>
                                </div>
                                <div class="col-75">
                                    <select name="noprocscan">
                                        ${boolJson["noprocscan"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Nofilescan</label>
                                </div>
                                <div class="col-75">
                                    <select name ="nofilescan">
                                        ${boolJson["nofilescan"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>vulnchecks</label>
                                </div>
                                <div class="col-75">
                                    <select>
                                        ${boolJson["nofilescan"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Nolevcheck</label>
                                </div>
                                <div class="col-75">
                                    <select name ="nolevcheck">
                                        ${boolJson["nolevcheck"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Scriptanalysis</label>
                                </div>
                                <div class="col-75">
                                    <select name = "scriptanalysis">
                                        ${boolJson["scriptanalysis"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Rootkit</label>
                                </div>
                                <div class="col-75">
                                    <select name ="rootkit">
                                        ${boolJson["rootkit"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Noindicator</label>
                                </div>
                                <div class="col-75">
                                    <select name ="noindicator">
                                        ${boolJson["noindicator"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Dontwait</label>
                                </div>
                                <div class="col-75">
                                    <select name ="dontwait">
                                        ${boolJson["dontwait"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Intense</label>
                                </div>
                                <div class="col-75">
                                    <select name="intense">
                                        ${boolJson["intense"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>CSV</label>
                                </div>
                                <div class="col-75">
                                    <select name ="csv">
                                        ${boolJson["csv"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Onlyrelevant</label>
                                </div>
                                <div class="col-75">
                                    <select name ="onlyrelevant">
                                        ${boolJson["onlyrelevant"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Nolog</label>
                                </div>
                                <div class="col-75">
                                    <select name ="nolog">
                                        ${boolJson["nolog"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Update</label>
                                </div>
                                <div class="col-75">
                                    <select name ="update">
                                        ${boolJson["update"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Debug</label>
                                </div>
                                <div class="col-75">
                                    <select name="debug">
                                        ${boolJson["debug"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Maxworkingset</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name ="maxworkingset" value=${jsonConfig["maxworkingset"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Syslogtcp</label>
                                </div>
                                <div class="col-75">
                                    <select name="syslogtcp">
                                        ${boolJson["syslogtcp"]}
                                    </select>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-25">
                                    <label>Logfolder</label>
                                </div>
                                <div class="col-75">
                                    <input type="text"  name="logfolder" value= ${jsonConfig["logfolder"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Nopesieve</label>
                                </div>
                                <div class="col-75">
                                    <select name="nopesieve">
                                        ${boolJson["nopesieve"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Pesieveshellc</label>
                                </div>
                                <div class="col-75">
                                    <select name="pesieveshellc">
                                        ${boolJson["pesieveshellc"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Nolisten</label>
                                </div>
                                <div class="col-75">
                                    <select name ="nolisten">
                                        ${boolJson["nolisten"]}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Excludeprocess</label>
                                </div>
                                <div class="col-75">
                                    <input type="text" name ="excludeprocess" value= ${jsonConfig["excludeprocess"]}>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-25">
                                    <label>Force</label>
                                </div>
                                <div class="col-75">
                                    <select name="force">
                                        ${boolJson["force"]}
                                    </select>
                                </div>
                            </div>
                                
                            <div class="row submit" >
                                <input type="submit"  value="Submit" ">
                            </div>
                      </form>
                    </div>
                `;
      infoSettings.innerHTML = htmls;
    })
    .then(function (id) {
      // submitSettingOnclick();
      setTimeout(function () {
        submitSettingOnclick(id);
      }, 500);
    });
}
// function submitSettings() {
//   // var submit = document.querySelector(".table-detect .modal-body .submit");
//   // console.log(submit);
//   console.log("hello");
// }

function clearDb(Self) {
  idClient = Self.getAttribute("idClient");
  idDb = Self.getAttribute("idDb");
  fetch(`${host}/${idClient}/clear/?idDb=${idDb}`)
    .then(function (response) {
      console.log("Skip idDb=" + idDb + " at id = " + idDb);
    })
    .then(function () {
      showDetect(idClient);
    });
}

function deleteDB() {
  alert("Tính năng đang phát triển");
}

getClient();

// code xin cat k dc xoa
// document.querySelector('#DataManagement .container #id button').innerHTML = "May1";
// document.querySelector('#DataManagement .container #id img').src ="assets/img/PCs/alert.jpg"
arrTaskbar = [];
arrHeader = [];
arrDataUpdate = [];
arrBtnUpdate = [];
var classDashboard = document.querySelector("#Dashboard");
var classManagement = document.querySelector("#Management");
var classSettings = document.querySelector("#Settings");
var classUpdate = document.querySelector("#Update");
var classTools = document.querySelector("#Tools");
//Update
var Update_CreateRule = document.querySelector("#Header #btnCreateRule");
var Update_UpdateSignature = document.querySelector(
  "#Header #btnUpdateSignature"
);
var Update_Download = document.querySelector("#Header #btnDownload");
var Update_Document = document.querySelector("#Header #btnDocument");
arrBtnUpdate.push(Update_UpdateSignature);
arrBtnUpdate.push(Update_CreateRule);
arrBtnUpdate.push(Update_Download);
arrBtnUpdate.push(Update_Document);

var dataUpdateSignature = document.querySelector(
  "#DataUpdate #DataUpdateSignature"
);
var dataCreateRule = document.querySelector("#DataUpdate #DataCreateRule");
var dataDownload = document.querySelector("#DataUpdate #DataDownload");
var dataDocument = document.querySelector("#DataUpdate #DataDocument");
arrDataUpdate.push(dataUpdateSignature);
arrDataUpdate.push(dataCreateRule);
arrDataUpdate.push(dataDownload);
arrDataUpdate.push(dataDocument);

arrTaskbar.push(classDashboard);
arrTaskbar.push(classManagement);
arrTaskbar.push(classSettings);
arrTaskbar.push(classUpdate);
arrTaskbar.push(classTools);
var classMornitor = document.querySelector("#tabs-icons-text-1-tab");
var arrData = [];
dataDashboard = document.querySelector("#DataDashboard");
dataManagement = document.querySelector("#DataManagement");
dataSettings = document.querySelector("#DataSettings");
dataUpdate = document.querySelector("#DataUpdate");

arrData.push(dataDashboard);
arrData.push(dataManagement);
arrData.push(dataSettings);
arrData.push(dataUpdate);
var headerUpdate = document.querySelector("#Header #HeaderUpdate");
var headerDashboard = document.querySelector("#Header #HeaderDashboard");
arrHeader.push(headerDashboard);
arrHeader.push(headerUpdate);
classDashboard.onclick = function (e) {
  for (var i = 0; i < arrTaskbar.length; ++i) {
    arrTaskbar[i].classList.remove("active");
  }
  classDashboard.classList.add("active");
  for (let i = 0; i < arrData.length; i++) {
    arrData[i].hidden = true;
  }
  for (let i = 0; i < arrHeader.length; ++i) {
    arrHeader[i].hidden = true;
  }
  headerDashboard.hidden = false;
  dataDashboard.hidden = false;
};

classManagement.onclick = function (e) {
  for (var i = 0; i < arrTaskbar.length; ++i) {
    arrTaskbar[i].classList.remove("active");
  }
  classManagement.classList.add("active");
  for (let i = 0; i < arrData.length; i++) {
    arrData[i].hidden = true;
  }
  for (let i = 0; i < arrHeader.length; ++i) {
    arrHeader[i].hidden = true;
  }
  headerDashboard.hidden = false;
  dataManagement.hidden = false;
};

classSettings.onclick = function (e) {
  for (var i = 0; i < arrTaskbar.length; ++i) {
    arrTaskbar[i].classList.remove("active");
  }
  classSettings.classList.add("active");
  for (let i = 0; i < arrData.length; i++) {
    arrData[i].hidden = true;
  }
  for (let i = 0; i < arrHeader.length; ++i) {
    arrHeader[i].hidden = true;
  }
  headerDashboard.hidden = false;
  dataSettings.hidden = false;
};
classUpdate.onclick = function (e) {
  getVersionSignature();
  for (var i = 0; i < arrTaskbar.length; ++i) {
    arrTaskbar[i].classList.remove("active");
  }
  classUpdate.classList.add("active");
  for (let i = 0; i < arrData.length; i++) {
    arrData[i].hidden = true;
  }
  for (let i = 0; i < arrHeader.length; ++i) {
    arrHeader[i].hidden = true;
  }
  headerUpdate.hidden = false;
  dataUpdate.hidden = false;
};

classTools.onclick = function (e) {
  for (var i = 0; i < arrTaskbar.length; ++i) {
    arrTaskbar[i].classList.remove("active");
  }
  classTools.classList.add("active");
  for (let i = 0; i < arrData.length; i++) {
    arrData[i].hidden = true;
  }
  alert("Chức năng đang được phát triển");
};

classMornitor.onclick = function (e) {
  classManagement.onclick();
};
classDashboard.onclick();
// function submit
const serialize_form = (form) =>
  JSON.stringify(
    Array.from(new FormData(form).entries()).reduce(
      (m, [key, value]) => Object.assign(m, { [key]: value }),
      {}
    )
  );

//Update
Update_UpdateSignature.onclick = function (event) {
  event.preventDefault();
  for (var i = 0; i < arrBtnUpdate.length; ++i) {
    arrBtnUpdate[i].classList.remove("active");
  }
  Update_UpdateSignature.classList.add("active");
  for (let i = 0; i < arrDataUpdate.length; i++) {
    arrDataUpdate[i].hidden = true;
  }
  // console.log(dataCreateRule);
  dataUpdateSignature.hidden = false;
};
Update_CreateRule.onclick = function (event) {
  event.preventDefault();
  for (var i = 0; i < arrBtnUpdate.length; ++i) {
    arrBtnUpdate[i].classList.remove("active");
  }
  Update_CreateRule.classList.add("active");
  for (let i = 0; i < arrDataUpdate.length; i++) {
    arrDataUpdate[i].hidden = true;
  }
  uploadExecute = document.querySelector(
    ".createrule .uploadExecute"
  ).hidden = false;
  dataCreateRule.hidden = false;
  rule = document.querySelector(".createrule .rule");
  addRuleCreated = document.querySelector(".createrule  #addRuleCreated");
  uploadExecute.hidden = false;
  addRuleCreated.hidden = true;
  rule.hidden = true;
};

Update_Document.onclick = function (event) {
  event.preventDefault();
  for (var i = 0; i < arrBtnUpdate.length; ++i) {
    arrBtnUpdate[i].classList.remove("active");
  }
  Update_Document.classList.add("active");
  for (let i = 0; i < arrDataUpdate.length; i++) {
    arrDataUpdate[i].hidden = true;
  }
  console.log(dataCreateRule);
  dataDocument.hidden = false;
};

function submitSettingOnclick() {
  document.querySelector("#config_form .submit").onclick = function (event) {
    event.preventDefault();
    Self = document.querySelector("#config_form");
    const json = JSON.parse(serialize_form(Self));
    json.excludeprocess = json.excludeprocess.split(",");

    fetch(`${host}/${json.id}/changeConfig`, {
      body: JSON.stringify(json),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        document.querySelector(
          `#DataSettings #Config${json.id} button`
        ).innerHTML = json.name;
        document.querySelector(
          `#DataManagement #Client${json.id} button`
        ).innerHTML = json.name;
        alert("Thay đổi thành công");
      })
      .catch((error) => {
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
        console.error("Error:", error);
      });
  };
}

//UPDATE SIGNATURE
document.querySelector(".uploadSignature form button").onclick = function (
  event
) {
  event.preventDefault();
  var version = 1.0;
  var clean = false;
  version = document.querySelector('.uploadSignature input[type="text"]').value;
  var sel = document.querySelector(".uploadSignature #Choose");
  clean = sel.options[sel.selectedIndex].text;
  console.log(version);
  console.log(clean);
  var input = document.querySelector('.uploadSignature input[type="file"]');
  var result = document.querySelector(".uploadSignature .result");
  var body = new FormData();
  body.append("file", input.files[0]);
  result.innerHTML = "Loading ...";
  fetch(`${host}/SignatureServer/update/?version=${version}&clean=${clean}`, {
    method: "POST",
    body: body,
  })
    .then(function (response) {
      if (response.ok) {
        result.innerHTML = "Upload Signature successfully";
        getVersionSignature();
        return response.json();
      } else {
        result.innerHTML = "Have some errors";
        throw new Error("Network response was not ok.");
      }
    })
    .then(function (json) {
      console.log(json);
    })
    .catch(function (error) {
      console.log(error);
    });
};
//CREATE RULE
//tai rule len
document.querySelector(".createrule form .uploadFileExcute").onclick =
  function (event) {
    uploadExecute = document.querySelector(".createrule .uploadExecute");
    rule = document.querySelector(".createrule .rule");
    ruleCreated = document.querySelector(".createrule .rule #ruleCreated");
    addRuleCreated = document.querySelector(".createrule  #addRuleCreated");
    event.preventDefault();
    var nameRule = document.querySelector(".createrule #nameRule").value;
    var description = document.querySelector(".createrule #description").value;
    var author = document.querySelector(".createrule #author").value;
    var score = document.querySelector(".createrule #score").value;
    var typeFile = document.querySelector(".createrule #typeFile").value;

    var input = document.querySelector(
      '.createrule #taiRule input[type="file"]'
    );
    var result = document.querySelector(".createrule #taiRule .result");
    var body = new FormData();
    body.append("file", input.files[0]);
    result.innerHTML = "Loading ...";
    //create Signature
    fetch(
      `${host}/SignatureBase/createRuleYara/?nameRule=${encodeURI(
        nameRule
      )}&description=${encodeURI(description)}&author=${encodeURI(
        author
      )}&score=${encodeURI(score)}&typeFile=${encodeURI(typeFile)}`,
      {
        method: "POST",
        body: body,
      }
    )
      .then(function (response) {
        if (response.ok) {
          result.innerHTML = "Upload Signature successfully";
          return response.json();
        }
        result.innerHTML = "Network response was not ok.";
        throw new Error("Network response was not ok.");
      })
      .then(function (json) {
        console.log(json);
        json = json.replaceAll("\n", "<br>");
        uploadExecute.hidden = true;
        rule.hidden = false;
        addRuleCreated.hidden = true;
        ruleCreated.innerHTML = json;
        console.log(json);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

document.querySelector(".createrule .rule .AddSignature").onclick = function (
  event
) {
  document.querySelector(".createrule  #addRuleCreated").hidden = false;
};
//Them rule
var addRule = document.querySelector(".createrule #addRuleCreated .add");
addRule.onclick = function (event) {
  event.preventDefault();
  var version = 1.0;
  var clean = false;
  var name = "";
  version = document.querySelector(
    ".createrule  #addRuleCreated #version"
  ).value;
  name = document.querySelector(".createrule #addRuleCreated #namerule").value;
  var sel = document.querySelector(".createrule #Choose");
  clean = sel.options[sel.selectedIndex].text;
  var result = document.querySelector(".createrule  .result");
  result.innerHTML = "Loading ...";
  fetch(
    `${host}/SignatureBase/addYaraRule/?ruleName=${name}&clean=${clean}&version=${version}`,
    {
      method: "POST",
    }
  )
    .then(function (response) {
      if (response.ok) {
        result.innerHTML = "Upload Signature successfully";
        getVersionSignature();
        return response.json();
      } else {
        result.innerHTML = "Have some errors";
        throw new Error("Network response was not ok.");
      }
    })
    .then(function (json) {
      console.log(json);
    })
    .catch(function (error) {
      console.log(error);
    });
};
function getVersionSignature() {
  fetch(`${host}/SignatureBase/getVersion/`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      document.querySelector(
        "#DataUpdate .versionCurrent"
      ).innerHTML = `Phiên bản hiện tại : ${parseFloat(data).toFixed(2)}`;
      return data;
    });
}
//Tai ve rule vua tao
document.querySelector(".createrule .rule .downloadRule").onclick = function (
  event
) {
  event.preventDefault;
  console.log("hehe");
  var text = `${host}/SignatureBase/YaraRuleCreated`;
  var filename = "YaraRuleCreated.yar";
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
//UPDATE SIGNATURE
//khoi phuc signature
document.querySelector(
  "#DataUpdate .uploadSignature .restoreSignature "
).onclick = function restoreSignature(event) {
  event.preventDefault();
  var result = document.querySelector(".createrule  .result");
  fetch(`${host}/SignatureBase/restoreBackup`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then(function (response) {
    if (response.ok) {
      getVersionSignature();
      alert("Khôi phục Signature thành công");
    } else {
      alert("Have some errors");
      throw new Error("Network response was not ok.");
    }
  });
};

//DOWNLOAD
var downloadExample = document.querySelector(
  "#Header #downloadSignature #downloadSignatureExample"
);
console.log(downloadExample);
downloadExample.onclick = function (event) {
  event.preventDefault();
  var text = `${host}/SignatureBase/SignatureBaseExample`;
  var filename = "signatureExample.zip";
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

var downloadSignatureCurrent = document.querySelector(
  "#Header #downloadSignature #downloadSignatureCurrent"
);
downloadSignatureCurrent.onclick = function (event) {
  event.preventDefault();
  var text = `${host}/SignatureBase/Signature`;
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
var downloadSignatureBackup = document.querySelector(
  "#Header #downloadSignature #downloadSignatureBackup"
);
downloadSignatureBackup.onclick = function (event) {
  event.preventDefault();
  var text = `${host}/SignatureBase/SignatureBackup`;
  var filename = "signatureBackup.zip";
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
