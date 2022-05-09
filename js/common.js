$(document).ready(function(){
    let $page = $('#content');
    $page.html('');
    let miclmt = 0;
    let micnew = false;
    let index = 0
    mdata.forEach(obj => {
        if (obj.type == 'h3') {
            micnew = true;
            $page.append('<h3>' + obj.title + '</h3>');
        } else if (obj.type == 'music') {
            if (micnew) {
                micnew = false;
                miclmt++;
                $page.append('<div class="music-list m' + miclmt + '"></div>');
            }
            $('#content .music-list.m' + miclmt).append(`
                <div class="music-box" data-index="` + index + `">
                    <div class="music-icon" style="--img:url(../res/img/music_icon/`
                        + ( obj?.icon ? obj?.icon : 'unknow.png' )
                        + `)"></div>
                    <div class="music-info">
                        <span class="title">` + obj.title + `</span>
                        <span class="author">` + (obj?.author ? obj?.author : '') + `</span>
                        <span class="from">` + (obj?.from ? obj?.from : '') + `</span>
                    </div>
                </div>
            `);
        }
        index++;
    });
});

$('#content').on('click', '.music-box', function() {
    $('#side').removeClass('hide');
    $('.music-box.selected').removeClass('selected');
    $(this).addClass('selected');

    let obj = mdata[$(this).data('index')];
    if (obj?.icon) {
        $('#side .icon').attr('style', '--img:url(../res/img/music_icon/' + obj?.icon + ')');
    } else {
        $('#side .icon').attr('style', '--img:url(../res/img/music_icon/unknow.png)');
    }
    $('#side .title').text(obj.title);
    $('#side .author').text(obj?.author ? obj?.author : '（未知）' );
    $('#side .from').text(obj?.from ? obj?.from : '（未知）' );

    $('#side .use').text('');
    if (obj?.use) {
        obj.use.forEach(obj2 => {
            $('#side .use').append('<a class="tag" href="'
            + biliLink(obj2.bvid, obj2?.pid, obj2?.time)
            + '" target="_blank">' + obj2.bvid
            + (obj2?.pid ? ' P' + obj2?.pid : '')
            + (obj2?.time != undefined ? ' ' + setTime(obj2?.time) : '') + '</a>');
        });
    }

    $('#side .play').text('');
    if (obj?.play) {
        if (obj.play?.m163) {
            $('#side .play').append('<a class="tag" href="https://music.163.com/#/song?id=' + obj.play.m163 + '" target="_blank">网易云音乐</a>');
        }
        if (obj.play?.bili) {
            $('#side .play').append('<a class="tag" href="'
            + biliLink(obj.play.bili.bvid, obj.play.bili?.pid, obj.play.bili?.time)
            + '" target="_blank">Bilibili</a>');
        }
        if (obj.play?.nico) {
            $('#side .play').append('<a class="tag" href="'
            + nicoLink(obj.play.nico.smid)
            + '" target="_blank">Niconico</a>');
        }
    } else {
        $('#side .play').text('（暂无资源）');
    }
});

$('#side').on('click', '.close', function() {
    $('#side').addClass('hide');
    $('.music-box.selected').removeClass('selected');
});

$(document).mousemove(function(e){
    $('.bg .h').css('left', e.pageX);
    $('.bg .w').css('top', e.pageY);
    $('.bg .b').css('top', e.pageY - 16);
    $('.bg .b').css('left', e.pageX - 16);
});

$(document).mousedown(function(){
    $('.bg').addClass('active');
});

$(document).mouseup(function(){
    $('.bg').removeClass('active');
});

function biliLink(video, pid=undefined, time=undefined) {
    let str = "https://www.bilibili.com/video/" + video;

    if(pid || time) {
        str += "?"
        let k = false;
        if(pid) {
            str += ("p=" + pid);
            k = true;
        }
        if(time) {
            str += ((k ? "&" : "") + "t=" + time);
        }
    }

    return str;
}

function nicoLink(smid) {
    return "https://www.nicovideo.jp/watch/sm" + smid;;
}


function setTime(value){
	let s = value;
    let m = 0;
    let h = 0;
    h = Math.floor(s / 3600);
    s -= h * 3600;
    m = Math.floor(s / 60);
    s -= m * 60;
    return (h != 0 ? h + ':' : '')
        + (h != 0 ? zero(m) : m)
        + ':' + zero(s);
}

function zero(value) {
    if (value < 10) {
        return "0" + value;
    }
    return value;
}