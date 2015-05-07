function getClickPos(e) {
    var xPage = (navigator.appName == 'Netscape') ? e.pageX : event.x + document.body.scrollLeft;
    var yPage = (navigator.appName == 'Netscape') ? e.pageY : event.y + document.body.scrollTop;
    identifyImage = document.getElementById("imageID");
    img_x = locationLeft(identifyImage);
    img_y = locationTop(identifyImage);
    var xPos = xPage - img_x;
    var yPos = yPage - img_y;
    var info = '请输入名称，当前坐标是 ' + xPos + ',' + yPos;
    var val = prompt(info);
    if (val) {
        addCity(val, xPos, yPos);
    }
}

//find the screen location of an element
function locationLeft(element) {
    offsetTotal = element.offsetLeft;
    scrollTotal = 0; //element.scrollLeft but we dont want to deal with scrolling - already in page coords

    if (element.tagName != "BODY") {
        if (element.offsetParent != null)
            return offsetTotal + scrollTotal + locationLeft(element.offsetParent);
    }
    return offsetTotal + scrollTotal;
}

//find the screen location of an element
function locationTop(element) {
    offsetTotal = element.offsetTop;
    scrollTotal = 0; //element.scrollTop but we dont want to deal with scrolling - already in page coords

    if (element.tagName != "BODY") {
        if (element.offsetParent != null)
            return offsetTotal + scrollTotal + locationTop(element.offsetParent);
    }
    return offsetTotal + scrollTotal;
}

function openImg(sourceId, targetId) {
    if (typeof FileReader === 'undefined') {
        alert('Your browser does not support FileReader...');
        return;
    }
    var reader = new FileReader();

    reader.onload = function (e) {
        var img = document.getElementById(targetId);
        img.src = this.result;
    }
    reader.readAsDataURL(document.getElementById(sourceId).files[0]);
}

function isIE() {
    var agent = window.navigator.userAgent;
    var isIE7 = agent.indexOf('MSIE 7.0') != -1;
    var isIE8 = agent.indexOf('MSIE 8.0') != -1;
    if (isIE7) console.log("isIE7");
    if (isIE8) console.log("isIE8");
    return (isIE7 || isIE8);
}
function readFileInIE(filePath) {
    try {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var file = fso.GetFile(filePath);
        var fileContent = fso.OpenTextFile(filePath, 1).ReadAll();
        return {
            name: file.Name,
            type: file.Type,
            size: file.Size,
            content: fileContent
        };
    } catch (e) {
        if (e.number == -2146827859) {
            alert('Unable to access local files due to browser security settings. ' +
            'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
            'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
        }
    }
}

function IEReader(sourceId, targetId, onloadend) {
    var o = $(sourceId);
    var img = $(targetId);
    var bean = readFileInIE(o.value);
    $(targetId).src = bean.content;//动态创建img
    if (onloadend) {
        onloadend({
            target: img,
            name: bean.name,
            type: bean.type,
            size: bean.size
        });
    }
}
function html5Reader(sourceId, targetId, onloadend) {
    if (typeof FileReader === 'undefined') {
        return IEReader(sourceId, targetId, onloadend);
        //alert('Your browser does not support FileReader...');
        //return;
    }
    var reader = new FileReader();
    var file = document.getElementById(sourceId).files[0];

    reader.onloadend = function () {
        var img = document.getElementById(targetId);
        img.src = this.result;
        if (onloadend) {
            onloadend({
                target: img,
                name: file.name,
                type: file.type,
                size: file.size
            });
        }
    }
    reader.readAsDataURL(file);
}
function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}
function $(id) {
    return document.getElementById(id);
}
