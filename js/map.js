var data = data || [];
var isDown = false;
var isMove = true;
var sp;

function showAddDialog(e) {
    getClickPos(e)
}

function mapDown(e) {
    isMove = false;
    isDown = true;
    sp = getPoint(e);
}

function mapUp(e) {
    isDown = false;
    if (isMove == false) {
        showAddDialog(e);
    }
}

function mapMove(e) {
    if (isDown) {
        isMove = true;
        var p = getPoint(e);
        document.body.scrollTop -= (p.y - sp.y);
        document.body.scrollLeft -= (p.x - sp.x);
        sp = p;
    }
}

function getPoint(e) {
    var xPage = (navigator.appName == 'Netscape') ? e.pageX : event.x + document.body.scrollLeft;
    var yPage = (navigator.appName == 'Netscape') ? e.pageY : event.y + document.body.scrollTop;
    return {x: xPage, y: yPage};
}

function selectImg() {
    openImg("inputImg", "imageID");
    clearAll();
}

function clearAll() {
    for (var i = 0; i < data.length; i++) {
        var c = data[i];
        var id = "#" + buildCityId(c);
        $(id).remove();
        $("#citySel").empty();
    }
    data = [];
}

function clearVal() {
    $("#inputData").val("");
}

function showData() {
    $("#inputData").val(JSON.stringify(data));
}

function loadData() {
    var d = eval($("#inputData").val());
    if (d) {
        data = d;
        displayOptions();
        displayCityMarks();
        clearVal();
    } else {
        alert("invalid data");
    }
}

function displayOptions() {
    $("#citySel").empty();
    for (var i = 0; i < data.length; i++) {
        var c = data[i];
        var o = new Option(c.name, c.name);
        $("#citySel").append(o);
    }
}

function displayCityMarks() {
    for (var i = 0; i < data.length; i++) {
        var c = data[i];
        appendCity(c);
    }
}

function stopPP(event) {
    event.stopPropagation();
}

function appendCity(c) {
    var x = c.x + 20;
    var id = buildCityId(c);
    var name = c.name;
    var click = "deleteCity('" + name + "')";
    $("#area").append("<div onmousedown='stopPP(event)' onmouseup='stopPP(event)' onmousemove='stopPP(event)'" +
            " onclick='stopPP(event)' id=\"" + id + "\" class=\"cityMark\" " +
            "style=\"left:" + x + "px;top:" + c.y + "px\"><span>" + name + "</span>" +
            "<input type=\"button\" value=\"X\" onclick=\"" + click + "\"/></div>"
    )
    ;
}

function buildCityId(c) {
    return"city_" + c.x + "" + c.y;
}

function optionClick() {
    var val = $("#citySel").val();
    console.log("optionClick " + val);
    showCity(getCityByName(val));
}

function showCity(c) {
    document.body.scrollTop = c.y - window.screen.height / 2 + 100;
    document.body.scrollLeft = c.x - window.screen.width / 2 + 100;
}

function addCity(name, x, y) {
    var c = getCityByName(name);
    if (c) {
        alert(c.name + " 已存在");
    } else {
        c = {name: name, x: x, y: y};
        data.push(c);
        displayOptions();
        appendCity(c);
    }
}

function deleteCity(name) {
    if (name) {
        var c = getCityByName(name);
        if (c) {
            console.log(c);
            var id = "#" + buildCityId(c);
            $(id).remove();
            data.splice(c.index, 1);
            displayOptions();
        }
    }
}

function getCityByName(n) {
    for (var i = 0; i < data.length; i++) {
        var c = data[i];
        if (c.name == n) {
            c.index = i;
            return c;
        }
    }
    return null;
}

function searchCity(e) {
    if (e.keyCode == 13) {
        var n = $("#searchInput").val();
        if (n) {
            var c = getCityByName(n);
            if (c) {
                showCity(c);
            } else {
                alert(n + " 不存在");
            }
        }
    }
}

function saveToLocal() {
    if (confirm("确实要保存？")) {
        mapData.save(JSON.stringify(data));
    }
}

function clearLocal() {
    if (confirm("确实要删除？")) {
        mapData.clear();
    }
}

var mapData = {
    save: function (val) {
        window.localStorage.setItem('map-data', val);
        window.localStorage.setItem('timestamp', (new Date()).getTime());
        return mapData.get();
    },
    get: function () {
        return {
            data: window.localStorage.getItem('map-data'),
            time: window.localStorage.getItem('map-timestamp')
        };
    },
    clear: function () {
        mapData.save("");
    },
    hasData: function () {
        return !!mapData.get().data;
    }
};

window.onload = function () {
    data = mapData.hasData() ? eval(mapData.get().data) : data;
    displayOptions();
    displayCityMarks();
}

