// var

window.removeApp = function (appName) {
    $.ajax({
        url: '/check',
        method: 'DELETE',
        data: {
            name: appName,
        }
    }).done(function () {
        location.reload();
    });
};

window.renameIp = function (ip, currentName) {
    var newName = window.prompt('Set a new name for ' + ip, currentName);
    if (newName === null) {
        return true;
    }

    $.ajax({
        url: '/api/setNameOfIp',
        method: 'POST',
        data: {
            ip: ip,
            name: newName,
        }
    }).done(function () {
        location.reload();
    });
};

var updater = function () {
    $.ajax({
        url: '/list?type=json'
    }).done(function (body) {
        var tmp = body.pop();

        if (!tmp) {
            return true;
        }

        while(tmp.id) {
            $('app_' + tmp.id + ' .appDescTxt').text(tmp.description);
            $('app_' + tmp.id + ' .appDescTxt').text(tmp.description);

            var tmp = body.pop();
        }
    }).fail(function (err) {
        debugger;
    }).always(function () {
        setTimeout(updater, 5000);
    });
};

$(function () {
    updater();
});