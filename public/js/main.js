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

var newIpBlock = function (ip) {
    var html = '';
    html += '<div class="appListWrap" id="ip_' + ip.replace(/:/gi, '_') + '">';
    html += '    <h3>' + ip + ' <small onclick="renameIp(\'' + ip + '\', \'\')">[#]</small></h3>';
    html += '</div>';

    $('body').append(html);
};
var newAppBlock = function (app) {
    var html = '';

    html += '<div class="ok" id="app_' + app.id + '">';
    html += '    <strong class="appName">' + app.name + ' <small class="removeApp" onclick="removeApp(\'' + app.name + '\')">[×]</small></strong>';
    html += '    <span class="appDesc">';
    html += '        <span class="appDescTxt">' + app.description + '</span>';
    if (app.testApi) {
        html += '        <a class="testApiLink" href="' + app.testApi + '" target="_blank">[Test API]</a>';
    }
    html += '        <span class="lastSignal">' + moment(app.lastChecked) + '</span>';
    html += '    </span>';
    html += '</div>';

    $('#ip_' + app.ip.replace(/:/gi, '_')).append(html);
};

var updater = function () {
    $.ajax({
        url: '/list?type=json'
    }).done(function (body) {
        var tmp = body.pop();

        while(tmp) {
            var ipBlock = $('#ip_' + tmp.ip.replace(/:/gi, '_'));
            if (ipBlock.length === 0) {
                newIpBlock(tmp.ip);
                ipBlock = $('#ip_' + tmp.ip.replace(/:/gi, '_'));
            }

            var appBlock = $('#app_' + tmp.id);
            if (appBlock.length === 0) {
                newAppBlock(tmp);
                appBlock = $('#app_' + tmp.id);
            }

            appBlock.find('.appDescTxt').text(tmp.description);
            appBlock.find('.lastSignal').text(moment(tmp.lastChecked).format('YYYY-MM-DD HH:mm:ss'));

            if (tmp.isOk) {
                appBlock.addClass('ok');
                appBlock.removeClass('notOk');
            } else {
                appBlock.addClass('notOk');
                appBlock.removeClass('ok');
            }

            var tmp = body.pop();
        }

        $('#lastUpdated').text(moment().format('YYYY-MM-DD HH:mm:ss'));
    }).fail(function (err) {
        console.error(err);
    }).always(function () {
        setTimeout(updater, 5000);
    });
};

$(function () {
    updater();
});