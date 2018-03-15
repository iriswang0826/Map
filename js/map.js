var srcZoom = 10;
var mMarks = [];//from servlet post marks,blue
var mClickMarker = null;//for click mark,red
var mClickMarkerInfo;//click mark info,from servlet
var mClickLabel = null;//for click mark text
var mMyPosMarker = null;
var mLabels = [];//from servlet post marks text
var mPolyline = null;//from  servlet subject line
var data = new Getdata();
// 生成地图
var tileLayer = new BMap.TileLayer();
tileLayer.getTilesUrl = function(tileCoord, zoom) {
    var x = tileCoord.x;
    var y = tileCoord.y;
    return '../images/tiles_lgd/' + zoom + '/tile' + x + '_' + y + '.png';
}
var MyMap = new BMap.MapType('MyMap', tileLayer, {minZoom: 8, maxZoom: 10});
var mMap = new BMap.Map('map', {mapType: MyMap});
mMap.centerAndZoom(new BMap.Point(0, 0), 8);

// 放大缩小控件
var zoom_in = document.getElementById('zoom_in');
var zoom_out = document.getElementById('zoom_out');
zoom_in.onclick = function(e) {
    mMap.setZoom(mMap.getZoom() - 1);
    reDisplay();
}
zoom_out.onclick = function(e) {
    mMap.setZoom(mMap.getZoom() + 1);
    reDisplay();
}
// 添加文字label
// 文字标签图层
function requestAllMarks(x){
    data.text(x,function(d){
        if(d.code == 0){
            removeLabels();
            displayLabels(d.data,x);
        }else{
            alert('获取失败'+d.msg);
        }
    })
};
// 文字标签
function displayLabels(points,x){
    for(var i=0;i<points.length;i++){
        var point = lngLatFromPic(points[i].x, points[i].y);
        var name = String(points[i].name);
        var length = name.length;
        var opts = {
             position : point,    
             offset   : new BMap.Size(-5*length, 0)   
        }
        mLabels[i] = new BMap.Label(name,opts);
    if(x == 10){
            //level:'10'
            mLabels[i].setStyle({
             color : "#000",
             backgroundColor :"0.05",
             border :"0",
             fontSize : "22px",
             height : "22px",
             lineHeight : "22px",
             fontFamily:"微软雅黑"
            });
        }else if(x == 9){
          // level:'9'
            mLabels[i].setStyle({
             color : "#000",
             backgroundColor :"0.05",
             border :"0", 
             fontSize : "20px",
             height : "20px",
             lineHeight : "20px",
             fontFamily:"微软雅黑"
            });
        }else if(x == 8){
            // level:'8'
            mLabels[i].setStyle({
             color : "#000",
             backgroundColor :"0.05",
             border :"0", 
             fontSize : "16px",
             height : "20px",
             lineHeight : "20px",
             fontFamily:"微软雅黑"
            });
        }else{
            mLabels[i].setStyle({
             color : "#000",
             backgroundColor :"0.05",
             border :"0", 
             fontSize : "16px",
             height : "20px",
             lineHeight : "20px",
             fontFamily:"微软雅黑"
         }); 
        }
        
    }
    displayRectPoints(mLabels); 
    // 点击之后的标签
    if(mClickLabel != null)
    {
        mMap.removeOverlay(mClickLabel);
        var curZoom = mMap.getZoom();
        if(curZoom == 9){
          // level:'9'
            mClickLabel.setStyle({
             color : "#222222",
             backgroundColor :"0.05",
             border :"0", 
             fontSize : "16px",
             height : "20px",
             lineHeight : "20px",
             fontFamily:"微软雅黑"
            });
        }else if(curZoom == 8){
            // level:'8'
            mClickLabel.setStyle({
             color : "#222222",
             backgroundColor :"0.05",
             border :"0", 
             fontSize : "12px",
             height : "20px",
             lineHeight : "20px",
             fontFamily:"微软雅黑"
            });
        }
        mMap.addOverlay(mClickLabel);
    }
};
function removeLabels(){
    for(var i=0;i<mLabels.length;i++){
        mMap.removeOverlay(mLabels[i]); 
    }
    mLabels = [];
};
requestAllMarks(8);
mMap.addEventListener("zoomend", function(e){   
    requestAllMarks(mMap.getZoom());
    //testRequestRoadPos();
}); 

// 添加图标
//convert pic x,y to baidu xiangshu pos将图片xy转换为地图像素坐标
function pixelCoordFromPic(x,y){
    var worldCoordinate =  worldCoordFromPic(x,y);//转换为墨卡托坐标
    var posx = Math.floor(worldCoordinate.x * Math.pow(2, mMap.getZoom() -18));
    var posy = Math.floor(worldCoordinate.y * Math.pow(2, mMap.getZoom() -18));
    var pixel= new BMap.Pixel (posx, posy);
    return pixel;
}

//将图片坐标转换为百度墨卡托坐标
function worldCoordFromPic(x,y){
    var point= new BMap.Point(-10, 0);
    point.x=x*Math.pow(2, 18-srcZoom);
    point.y=y*Math.pow(2, 18-srcZoom);
    return point;
};
//将地图墨卡托坐标转换为图片坐标
function worldCoordToPic(x,y){
    var pixel= new BMap.Pixel (-10, 0);
    pixel.x=Math.floor(x*Math.pow(2, srcZoom-18));
    pixel.y=Math.floor(y*Math.pow(2, srcZoom-18));
    return pixel;
};
// 转换为经纬度
function lngLatFromPic(x,y){   
    var projection =mMap.getMapType().getProjection();//获取地图类型所使用的投影实例
    var pingmian = worldCoordFromPic(x,y);
    return projection.pointToLngLat(pingmian);  //根据平面坐标获得球面座标 经纬度
};
//将经纬度转换为图片坐标
function lngLatToPic(x,y){
    var point= new BMap.Point(x, y);
    var projection =mMap.getMapType().getProjection();
    var pixel = projection.lngLatToPoint(point);
    pic = worldCoordToPic(pixel.x,pixel.y);
    return pic;
};
// 添加图标
function displayMarks(points,type){
    for(var i=0;i<points.length;i++){
        var point; //将图片坐标转换为经纬度
        var myIcon;
        var pointType;
        if(type == 'search') {
            pointType = points[i].type;
            point = lngLatFromPic(points[i].ten.x, points[i].ten.y);
        }else if(type == 'line'){
            pointType = points[i].type;
            point = lngLatFromPic(points[i].x, points[i].y); 
        }else{
            pointType = type;
            point = lngLatFromPic(points[i].x, points[i].y); 
        }
        if(pointType == 'shop'){
            myIcon = new BMap.Icon("../images/meishi_zuobiao.png", new BMap.Size(64, 65),{anchor:new BMap.Size(32,65)});//设置标注的图标
        }else if(pointType == 'scenic'){
            myIcon = new BMap.Icon("../images/jingdian_zuobiao.png", new BMap.Size(64, 65),{anchor:new BMap.Size(32,65)});
        }else{
            myIcon = new BMap.Icon("../images/tingche_zuobiao.png", new BMap.Size(64, 65),{anchor:new BMap.Size(32,65)});
        }
        mMarks[i] = new BMap.Marker(point,{icon: myIcon}); 
        //mMarks[i] = new BMap.Marker(point); 创建标注
        mMarks[i].addEventListener("click", function(e){
            //mClickMarker = this;
        });
    }
    displayRectPoints(mMarks);  //将mMarks添加到地图中
};
//将覆盖物添加到地图中
 function displayRectPoints(points){
    for(i=0;i<points.length;i++){
        mMap.addOverlay(points[i]);//将覆盖物添加到地图中
    }
};

function requestBussiness(typeid){
    var type = 'shop';
    var curZoom = mMap.getZoom();
    data.shop(typeid,curZoom,function(d){
        if(d.code == 0){
            removePathPlanning();//移除路线
            removeMarks();//移除图标
            displayMarks(d.data,type);

        }else{
            alert(alert('获取失败'+d.msg));
        }
    })
};

function requestTourist(){
    var type = 'scenic';
    var curZoom = mMap.getZoom();
    data.scenic(curZoom,function(d){
        if(d.code == 0){
            removePathPlanning();
            removeMarks();
            displayMarks(d.data,type);
        }else{
            alert('获取失败'+d.msg);
        }
    })
};

function requestPublic(typeid){
    var type = 'public';
    var curZoom = mMap.getZoom();
    data.public(typeid,curZoom,function(d){
        if(d.code == 0){
            removePathPlanning();//移除路线
            removeMarks();//移除图标
            displayMarks(d.data,type);
        }else{
            alert(alert('获取失败'+d.msg));
        }
    })
};
function reDisplay() {
    if(curType == 'scenic'){
        requestTourist();
    }else if(curType.indexOf('shop') > -1){
        var typeid = parseInt(curType.replace(/[^0-9]/ig,""));
        requestBussiness(typeid);
    }else if(curType.indexOf('public') > -1){
        var typeid = parseInt(curType.replace(/[^0-9]/ig,""));
        requestPublic(typeid);
    }else{
        return;
    }
}
// 移除图标
function removeMarks(){
    for(var i=0;i<mMarks.length;i++){
        mMap.removeOverlay(mMarks[i]); 
    }
    mMarks = [];
};
function removeClickMarker(){
    if(mClickMarker != null){
        hideinfobox();
        hidecartemenu();
        mMap.removeOverlay(mClickMarker);
        mClickMarker = null;
        mClickMarkerInfo = null;
        mMap.removeOverlay(mClickLabel);
        mClickLabel = null;
    }
};

var mPolyline = null;//from  servlet subject line
var mPathPlanning = false;

// 移除路线
function removePathPlanning(){
    if(mPolyline != null)
    {
        for(var i=0;i<mPolyline.length;i++)
        {
            mMap.removeOverlay(mPolyline[i]);//移除覆盖物
        }
        mPathPlanning = false;
        mPolyline = [];
        mPolyline = null;
    }
};

function requestSubjectLine(x){
    $.get(apiUrl + 'api/path/' + x, function (d) {
        var result = d;
        var type = 'line';
        removePathPlanning();
        removeMarks();
        displayMarks(result.points,type);
        console.log(result.points);
        displaySubjectLine(result.path);
    }); 
};
//points ins pic points
function displaySubjectLine(points){
    mPolyline = [];
    // for(var i=0;i<points.length;i++)
    // {
    //     displayLine(points[i].path,points[i].lineType);
    // }
    displayLine(points);
};

function displayLine(points){
    var length = mPolyline.length;
    var point = [];
    for(var i=0;i<points.length;i++){
        point[i] = lngLatFromPic(points[i].x, points[i].y);
    }
       
    // if(flag == 1){
        mPolyline[length] = new BMap.Polyline(point,
                {strokeColor:"#974dde", strokeStyle:"dashed",strokeWeight:4, strokeOpacity:1});
    // }else{
    //     mPolyline[length] = new BMap.Polyline(point,
    //             {strokeColor:"#974dde",strokeStyle:"dashed",strokeWeight:4, strokeOpacity:0.4});
    // }
    mMap.addOverlay(mPolyline[length]);
};


function isClickMarks(point){
    var pic = lngLatFromPic(point.x, point.y);
    for(var i=0;i<mMarks.length;i++)
    {
        if((mMarks[i].point.lng== pic.lng)&&(mMarks[i].point.lat == pic.lat))
        {
            return true;
        }   
    }
    return false;
}
function getPosOfSearchRet(point){
    // var value = encodeURIComponent(x);
    var curZoom = mMap.getZoom();
    data.click(point.x,point.y,curZoom,function(d){
        if(d.code == 0){
            var result = d.data;
            requestresetcenterAndZoom();
            removePathPlanning();
            removeMarks();
            displayClickMarker(result);

        }else {
            alert('获取失败'+d.msg);
        }
    })
};

function getPosOfSearchRetOnly(x) {
        requestresetcenterAndZoom();
        removePathPlanning();
        removeMarks();
        var type = 'search';
        var points = [];
        for(var i=0;i<x.length;i++){
            points.push(x[i]);
        }
        displayMarks(points,type);
};
function displayClickMarker(pos){
    if((mClickMarkerInfo != null)&&(mClickMarkerInfo.x == pos.x)&&(mClickMarkerInfo.y == pos.y)) {
        
    }else {
        removeClickMarker();
        if(isClickMarks(pos) == false)
        {
            removePathPlanning();
            removeMarks();
        }
        mClickMarkerInfo = pos;
        var point = lngLatFromPic(mClickMarkerInfo.x, mClickMarkerInfo.y);
        var myIcon;
        var pointType = pos.type;
        if(pointType == 'shop'){
            myIcon = new BMap.Icon("../images/meishi_zuobiao_dj.png", new BMap.Size(64, 65),{anchor:new BMap.Size(32,65)});
        }else if(pointType == 'scenic'){
            myIcon = new BMap.Icon("../images/jingdian_zuobiao_dj.png", new BMap.Size(64, 65),{anchor:new BMap.Size(32,65)});
        }else{
            myIcon = new BMap.Icon("../images/tingche_zuobiao_dj.png", new BMap.Size(64, 65),{anchor:new BMap.Size(32,65)});
        }
        mClickMarker = new BMap.Marker(point,{icon: myIcon});
        mClickMarker.addEventListener("click", function(e){   

        });
        mMap.addOverlay(mClickMarker);
        
        var curZoom = mMap.getZoom();
        if(curZoom == 8 || curZoom == 9){
            var name = String(mClickMarkerInfo.name);
            var length = name.length;
            var opts = {
                 position : point,    
                 offset   : new BMap.Size(-5*length, 0)   
            }
            mClickLabel = new BMap.Label(name,opts);
            if(curZoom == 9){
                mClickLabel.setStyle({
                    color : "#222222",
                    backgroundColor :"0.05",
                    border :"0", 
                    fontSize : "16px",
                    height : "20px",
                    lineHeight : "20px",
                    fontFamily:"微软雅黑"
                });
            }else if(curZoom == 8){
                mClickLabel.setStyle({
                    color : "#222222",
                    backgroundColor :"0.05",
                    border :"0", 
                    fontSize : "12px",
                    height : "20px",
                    lineHeight : "20px",
                    fontFamily:"微软雅黑"
                });
            }
            mMap.addOverlay(mClickLabel);
        }
        
        pauseaudio();
        infoClick();
    }
};
function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
}  
function infoClick(){
    hideinfobox();
    $('.info_box .info_wrap').html('');
    $('.info_box').slideDown('slow');
    if(isEmptyObject(mClickMarkerInfo.voice) == false) {
        $('.info_box .info_wrap').append('<div class="info_audio"><a><img class="bofang" src="../images/vedio.png"></a></div>');    
    }
    if(!isEmptyObject(mClickMarkerInfo.video)) {
        $('.info_box .info_wrap').append('<div class="tourist_vedio"><a><img class="lanshipin" src="../images/shipin.png"></a></div>');
    }
    if(!isEmptyObject(mClickMarkerInfo.introduce)) {
        $('.info_box .info_wrap').append('<div class="info_text"><a><img class="xiangqing" src="../images/more_pic.png"></a></div>');
    }
    $('.info_box .info_wrap').append('<div class="info_navigation"><a><img class="daohang" src="../images/nav.png"></a></div>');
    if(mClickMarkerInfo.menu.length > 0) {
        showcartedialog(mClickMarkerInfo);
        // initcartetable();
    } else {
        closecartedialog();
    }
    infoboxUI();
    $('.info_audio').click(function(){ 
        if(audioplaystate == 0){ 
            audioplaystate = 1; 

            audios.src = requestMarkAudio(); 
            var asrc = audios.src; 
            
             showpauseaudio();                
             audios.play(); 
                      
        }else{ 
            pauseaudio();           
        }           
    }); 
     
    $('.info_text').click(function(){
        requestMarkInfo();
    }); 
    
    $('.info_navigation').click(function(){
        curNavigation();
        hideinfobox();        
    }); 

    $('.tourist_vedio').click(function(){
        requestVedioBook();
    }); 

    $('.tourist_pic').click(function(){
        requestMarkBook();
    }); 
}

$(".carte_menu").click(function(){
    console.log(mClickMarkerInfo.menu);

    hidecartemenu();
    // showcartedialog(mClickMarkerInfo.menu);
    $('.carte_detail_dialog').slideDown('slow');

});

$(".carte_detail_close").click(function(){
    closecartedialog();
    showcartemenu();
});

$(".carte_detail_more").click(function(){
    scrolldowncartetable();
});
function requestMarkAudio(){
    var url = mClickMarkerInfo.voice.voice_url;
    return url;
};

function closeAudioPage(){ 
    $("iframe").remove(); 
} 

function requestMarkInfo(){
    var wH = $(window).height();
    var posX = mClickMarkerInfo.x;
    var posY = mClickMarkerInfo.y;
    var curZoom = mMap.getZoom();
    $('<iframe align=middle marginwidth=0 marginheight=0 src=\"guide.html?posX='+posX+'&posY='+posY+'&curZoom='+curZoom+'\" frameborder=no scrolling=no width=100% height='+wH+'px style=\"position:absolute;top:0;left:0;z-index:100000\"></iframe>').appendTo($("body"));
};
function curNavigation(){
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            // map.addOverlay(mk);
            // map.panTo(r.point);
            var latCurrent = r.point.lat;
            var lngCurrent = r.point.lng;
            var destination_lng = mClickMarkerInfo.lon;
            var destination_lat = mClickMarkerInfo.lat;
            // 经纬度：纬度，经度
            location.href="http://api.map.baidu.com/direction?origin="+latCurrent+","+lngCurrent+"&destination=" + destination_lat + "," + destination_lng + "&mode=walking&region=苏州&output=html";
        }else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true})
};
function requestMarkBook(){
    var wH = $(window).height();
    var type = mClickMarkerInfo.type;
    var name = mClickMarkerInfo.name; 
    $('<iframe align=middle marginwidth=0 marginheight=0 src=\"pic.html?type=&name='+name+'\" frameborder=no scrolling=no width=100% height='+wH+'px style=\"position:absolute;top:0;left:0;z-index:100000\"></iframe>').appendTo($("body"));

};

function requestVedioBook(){
    var wH = $(window).height();
    var videourl = mClickMarkerInfo.video.video_url;
    $('<iframe align=middle marginwidth=0 marginheight=0 src=\"video.html?type=&videourl='+videourl+'\" frameborder=no scrolling=no width=100% height='+wH+'px style=\"position:absolute;top:0;left:0;z-index:100000\"></iframe>').appendTo($("body"));
};
function requestCenterZero(){
    mMap.setCenter(new BMap.Point(0.4, -0.2));
};
function requestresetcenterAndZoom(){
    mMap.centerAndZoom(new BMap.Point(0.4, -0.2), 8);
};
function closeDetailInfo(){
    $("iframe").remove();
}

function closeAdInfo(){
    $("iframe").remove();
}
function requestNeareastMark(point){
    var curZoom = mMap.getZoom();
    mClickPos = pixelCoordFromPic(point.x,point.y);//将点击的坐标转换为像素坐标
    data.click(mClickPos.x,mClickPos.y,curZoom,function(d){
        if(d.code == 0){
            var result = d.data;
            console.log(result);
            var rpoint = pixelCoordFromPic(result.x,result.y);
            var xdist = Math.abs(rpoint.x-mClickPos.x);
            var ydist = Math.abs(rpoint.y-mClickPos.y);
            // if((xdist > 80)||(ydist >80)) {
            //     removePathPlanning();
            //     removeClickMarker();
            //     removeMarks();
            //     hidecartemenu();
            //     closecartedialog();
            // }else {
                displayClickMarker(result);
            // }
            mClickPos  = null;
        }else {
            alert('获取失败'+d.msg);
        }
    })
};

mMap.addEventListener("zoomend", function(e){   
    requestAllMarks(mMap.getZoom());
    reDisplay();
}); 

mMap.addEventListener("touchstart", function(e){   
    mTouchStart = e.pixel;  
}); 

mMap.addEventListener("touchend", function(e){   
    touchEnd = e.pixel;
    if(mPathPlanning == false)
    {
        if(Math.abs(mTouchStart.x-touchEnd.x)<=10&&Math.abs(mTouchStart.y-touchEnd.
                y)<=10)
        {
            var point = lngLatToPic(e.point.lng,e.point.lat);//经纬度转换为图片xy
            // if(isClickGameMarks(point) == false){//&& (isClicksellerMarks(point) == false) modify by rui.li 2017-2-7
                requestNeareastMark(point);
                // curType = '';
            // }
        }
    }   
}); 