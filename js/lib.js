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