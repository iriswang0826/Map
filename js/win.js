var menustate = 1;
var audios = document.createElement('audio');
var audioplaystate = 0;
var searchbarstate = 0;
var infoboxstyle = 0;
var Setsearchbarh = 0;
var clientwindisplay = -1;
var StoreSwiper;
var HlepSwiper;
var PlaySwiper;
var lastOpendNav = null;//rui.li
var curType = '';//当前标注类型
$(function(){

    if($(window).width() > $(window).height()){
        Setsearchbar(); 
        $('.signgame').css({'width': '6%','right': '16%'});     
        $('.menu').css({'width': '7.42%'});
        $('.leftsidebar_box').css({'width': '8%','left': '0.75%'});     
        UpdateMenu();    
    }else{
        $('.signgame').css({'width': '10%','right': '24%'});        
        $('.menu').css({'width': '13.2%'});
        $('.leftsidebar_box').css({'width': '14.2%','left': '0.75%'});
        UpdateMenu();

    }

    if(navigator.userAgent.indexOf('iPad') != -1){  
        $('.info_box').css({'height': '11.5%'});
        $('.info_box_nav').css({'height': '11.5%'});
        $('.info_tourist_audio').css({'height': '11.5%'});
        $('.info_tourist_vedio').css({'height': '11.5%'});
        $('.info_tourist_pic').css({'height': '11.5%'});
    } 


    function storeclick(slideIndex){
        clearbars();
        clearmarkers();
        // var data = new Getdata();
        data.shop_type(function(d){
            if(d.code == 0){
                var typeId = d.data[slideIndex].type_id;
                curType = 'shop' + typeId;
                requestBussiness(typeId); 
            }else{
                alert('获取失败'+d.msg);
            }
        })
    }

    function playclick(slideIndex){

        if(slideIndex == 0){
            clearbars();
            clearmarkers();                 
            var name = 'oneday';
            requestSubjectLine(name);   
        }

    }

    function helpclick(slideIndex){
        clearbars();
        clearmarkers();
        // var data = new Getdata();
        data.public_type(function(d){
            if(d.code == 0){
                var typeId = d.data[slideIndex].type_id;
                curType = 'public' + typeId;
                requestPublic(typeId); 
            }else{
                alert(alert('获取失败'+d.msg));
            }
        })

    }   

    HideMenuitem();
    
    
    
    $('#light_search').click(function (event) {
        var obj = event.toElement;
        if (obj === undefined) {
            closeSearchbar();
        }
        if((obj.id == 'light_search')){
            closeSearchbar();  
        }       
    });

    $('#light_location').click(function (event) {
         CloselocationTips();   
    });
    
    $('#light_gaiwancha').click(function (event) {
         CloseAnimationPage();
         setTimeout('ResetAnimationPageFlag()',50000);   
    });

    $('#light_panda').click(function (event) {
         CloseAnimationPage();   
         setTimeout('ResetAnimationPageFlag()',50000); 
    });

    // window.onload = function(){
    //      var req = getURLParameter('req');
    //      var merchantName = getURLParameter('queryStr');
    //       if(req && req == 1){
    //         //request data
    //         clearbars();
    //         clearmarkers();             
    //         requestTourist();
    //       } else if(req && req == 2){
    //           storeclick(0);
    //       } else if(req && req == 3){
    //           storeclick(1);
    //       } else if(req && req == 4){
    //           storeclick(2);
    //       } else if(req && req == 5){
    //           playclick(1);
    //       }
          
    //       if(merchantName && merchantName !== ''){
    //         showcartedialog(merchantName);
    //       }
          
    // }
    $(document).ready(function(){
        // var data=new Getdata();
        data.shop_type(function(d){
            if(d.code == 0){
                for(var i=0;i<d.data.length;i++){
                    $('.mapnavbar_1 ul').append('<li class="shop" data-type="shop"><img src="' + d.data[i].type_img + '"/><div>' + d.data[i].type_name + '</div></li>');
                }
            }else{
                alert('获取失败'+d.msg);
            }
        })
        function setNavbarIconDefault(){
            $('.navbarbase>li').each(function(v,i){
                var navLi = $(this)
                if ($(this).attr('data-focus') && $(this).attr('data-focus') == 'on') {
                    $(this).removeAttr('data-focus');
                     var curIndex = $(this).index();
                    if($(this).attr('data-type') == 'shop') {
                        data.shop_type(function(d){
                            if(d.code == 0){
                                var img_src = d.data[curIndex].type_img;
                                navLi.find('img').attr('src',img_src);
                            }else{
                                alert('获取失败'+d.msg);
                            }
                        })
                    }else if($(this).attr('data-type') == 'public') {
                        data.public_type(function(d){
                            if(d.code == 0){
                                var img_src = d.data[curIndex].type_img;
                                navLi.find('img').attr('src',img_src);
                            }else{
                                alert('获取失败'+d.msg);
                            }
                        })
                    }
                };
            });
        }
        function navBarLiClick(){
            $('.navbarbase>li').on('click',function(){
                setNavbarIconDefault();
                var clickLi = $(this);
                clickLi.attr('data-focus','on');
                var curIndex = clickLi.index();
                if(clickLi.attr('data-type') == 'shop'){
                    data.shop_type(function(d){
                        if(d.code == 0){
                            var img_src = d.data[curIndex].click_img;
                            clickLi.find('img').attr('src',img_src);
                        }else{
                            alert('获取失败'+d.msg);
                        }
                    })
                    storeclick(curIndex);
                } else if(clickLi.attr('data-type') == 'play'){
                    // data.play_type(function(d){
                    //     if(d.code == 0){
                    //         var img_src = d.data[curIndex].click_img;
                    //         clickLi.find('img').attr('src',img_src);
                    //     }else{
                    //         alert('获取失败'+d.msg);
                    //     }
                    // })
                    playclick(curIndex);
                } else if(clickLi.attr('data-type') == 'public'){
                    data.public_type(function(d){
                        if(d.code == 0){
                            var img_src = d.data[curIndex].click_img;
                            clickLi.find('img').attr('src',img_src);
                        }else{
                            alert('获取失败'+d.msg);
                        }
                    })
                    helpclick(curIndex);
                }

            });
        }
        data.public_type(function(d){
            if(d.code == 0){
                for(var i=0;i<d.data.length;i++){
                    $('.mapnavbar_3 ul').append('<li class="public" data-type="public"><img src="' + d.data[i].type_img + '"/><div>' + d.data[i].type_name + '</div></li>');
                }
                navBarLiClick();
            }else{
                alert('获取失败'+d.msg);
            }
        })
        
        
        $('.navbtn').click(function(){
            var wW = $(window).width();
            var navItemW = parseInt(22 * wW / 375);
            
            var data_type = $(this).attr('data-type');
            if ($(this).attr('data-type') !== 'scenic') {
                if (lastOpendNav === $(this).parent().attr('id')) {
                    if ($(this).parent().hasClass('open') == true) {
                        $(this).parent().find('.navclose').css({'width':(0)+'px'});
                        $(this).parent().find('.navbase').css({'width':(0)+'px'});
                        $(this).parent().removeClass('open');
                    } else {
                        $(this).parent().find('.navclose').css({'width':(7)+'px'});
                        $(this).parent().find('.navbase').css({'width':(4*navItemW)+'px'});
                        $(this).parent().addClass('open');
                  }
                } else {
                    $('.navclose').css({'width':(0)+'px'});
                    $('.navbase').css({'width':(0)+'px'});
                    $('.navbox').removeClass('open');
            
                    $(this).parent().find('.navclose').css({'width':(7)+'px'});
                    $(this).parent().find('.navbase').css({'width':(4*navItemW)+'px'});
                    $(this).parent().addClass('open');
                }
                lastOpendNav = $(this).parent().attr('id');
            } else {
                $('.navclose').css({'width':(0)+'px'});
                $('.navbase').css({'width':(0)+'px'});
                $('.navbox').removeClass('open');
                //request data
                clearbars();
                clearmarkers();             
                requestTourist();
                setNavbarIconDefault();
                curType = 'scenic';
            }
        
        });
        
    });
})

function HideMenuitem() {
    $('.line1').hide();
    $('.view_history').hide();
    $('.view_cultureWall').hide();
    $('.line2').hide();
    $('.store-swiper').hide();
    $('.line3').hide();
    $('.shuajia-swiper').hide();
    $('.line4').hide();
    $('.help-swiper').hide();
}

function Setsearchbar() {

    if(Setsearchbarh == 1)
    {
        return;
    }
    var h  = $(window).height()*0.1022;
    if(h >66){
        return;     
    }
    if(h <35){
        h = 35;     
    }
        
    $('.searchbox_input').height(h);
    $('.searchbox_button').height(h);
    Setsearchbarh = 1;
}   

function initcartetable() {
    $('#carte_detal_table').bootstrapTable({data: [{'name':'','seasoning':'','characteristic':'','price':''}]});
}

function scrolldowncartetable() {
    var pos = $('#carte_detal_table').bootstrapTable('scrollTo');
    $('#carte_detal_table').bootstrapTable('scrollTo', 201+pos);
}

function showcartemenu() {
    $('.carte_menu').slideDown('slow');
}

function hidecartemenu() {
    $('.carte_menu').slideUp('slow');
}

function showcartedialog(info) {
    var menu = info.menu;
    $('.main_title').text(info.name);
    initcartetable();
    $('#carte_detal_table').bootstrapTable('load', menu);
    $('.carte_detail_dialog').slideDown('slow');
}

function closecartedialog() {
    $('.carte_detail_dialog').slideUp('slow');
}

function pauseaudio() {
    audioplaystate = 0;
    showplayaudio();
    audios.pause(); 
}

function showplayaudio() {
    $('.bofang').attr('src', '../images/vedio.png');
}

function showpauseaudio() {
    $('.bofang').attr('src', '../images/vediopuase.png');
}
function infoboxUI() {
    var divNum = $('.info_box .info_wrap').children().length;
    var divMargin = parseInt($('.info_navigation').css('marginLeft')) + parseInt($('.info_navigation').css('marginRight'));
    var divWidth = ($('.info_navigation').width() + divMargin)*divNum;
    $('.info_box').css('padding-left',($('.info_box').width()-divWidth)/2);
}
function hideinfobox() {
    $('.info_box').slideUp('slow');       
}

function openSearchbar() {
    closeSearchResultMenu();
    closecartedialog();
    document.getElementById('light_search').style.display = 'block';
    document.getElementById('fade_search').style.display = 'block';
    searchbarstate = 1; 
    $('.searchbox_input').focus();
}

function closeSearchbar() {
    document.getElementById('light_search').style.display = 'none';
    document.getElementById('fade_search').style.display = 'none';
    document.getElementById('searchtext_input').value = '';
    setTimeout('Clearsearchbarstater()',1000);  
}



function Clearsearchbarstater() {
    searchbarstate = 0; 
}
function OpenIosCrossScreenTips() { 
    document.getElementById('light_ios_crossscreen').style.display = 'block';
    document.getElementById('fade_ios').style.display = 'block';        
}

function CloseIosCrossScreenTips() {    
    document.getElementById('light_ios_crossscreen').style.display = 'none';
    document.getElementById('fade_ios').style.display = 'none';
}

function OpenAndriodCrossScreenTips() { 
    document.getElementById('light_andriod_crossscreen').style.display = 'block';
    document.getElementById('fade_andriod').style.display = 'block';        
}

function CloseAndriodCrossScreenTips() {    
    document.getElementById('light_andriod_crossscreen').style.display = 'none';
    document.getElementById('fade_andriod').style.display = 'none';
}

var  Animationxiangmaowushow = 1;
var  Animationkailushow = 1;

function OpenAnimationPage(place) { 
    if(place == 'xiangmaowu'){
        if(Animationxiangmaowushow){
            document.getElementById('light_panda').style.display = 'block';
            document.getElementById('fade_panda').style.display = 'block';
            Animationxiangmaowushow = 0;
        }   
    }else if(place == 'kailu'){
        if(Animationkailushow){
            document.getElementById('light_gaiwancha').style.display = 'block';
            document.getElementById('fade_gaiwancha').style.display = 'block';      
            Animationkailushow =  0;
        }
    }   
}

function ResetAnimationPageFlag() { 
    Animationxiangmaowushow = 1;
    Animationkailushow = 1;
}

function CloseAnimationPage() { 
    document.getElementById('light_panda').style.display = 'none';
    document.getElementById('fade_panda').style.display = 'none';   
    document.getElementById('light_gaiwancha').style.display = 'none';
    document.getElementById('fade_gaiwancha').style.display = 'none';       
}

 function popHelpPage(){ 
    window.location.href = 'help2.html';
} 

function closeHelpPage(){ 
    $('iframe').remove(); 
} 

function clearmarkers() {   
    removeClickMarker();
    removePathPlanning();
    removeMarks();
}

function clearbars() {  
    hideinfobox();
    pauseaudio();
}

function SetMapCenter() {   
    requestCenterZero();
}

function UpdateMenu() { 
    menustate = 0;
    var bodyWidth = $(window).width();
    var bodyHeigth = $(window).height();
    if(bodyWidth > bodyHeigth){
        $('.leftsidebar_box').animate({left:'0.75%'});                      
        $('.menu').animate({left:'8.7%'});
    }else{
        $('.leftsidebar_box').animate({left:'0.75%'});                      
        $('.menu').animate({left:'14.2%'});
    }

    $('.jiantou2').attr('src', 'images/jiantou3.png');
    
    $('.line2').show();
    $('.store-swiper').show();
    $('.line3').hide();
    $('.shuajia-swiper').show();
    $('.line4').hide();
    $('.help-swiper').show();
        
    var h = 70/106*$('.store-swiper').width();
    $('.swiper-slide').width($('.store-swiper').width());
    $('.store-swiper').height(h*3);
    $('.shuajia-swiper').height(h*3);   
    $('.help-swiper').height(h*3);  
    //$('.action_arrow_bar').click();       
}

function ismobile(test){
    var u = navigator.userAgent, app = navigator.appVersion;
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
     if(window.location.href.indexOf('?mobile')<0){
      try{
       if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
        return '0';
       }else{
        return '1';
       }
      }catch(e){}
     }
    }else if( u.indexOf('iPad') > -1){
        return '0';
    }else{
        return '1';
    }
};

function setUI(){
    var wH = $(window).height();
    $('.content').css({'height':wH});
    var bodyWidth = $(window).width();
    var bodyHeigth = $(window).height();
    
    if(((bodyWidth > bodyHeigth)&&(clientwindisplay == 0))
    ||((bodyWidth <= bodyHeigth)&&(clientwindisplay == 1))){
        return;
    }
    
    if(bodyWidth > bodyHeigth){ 
        //add css for heng pin
        $('.signgame').css({'width': '6%','right': '16%'});
        $('.menu').css({'width': '7.42%'});
        $('.leftsidebar_box').css({'width': '8%','left': '0.75%'});
        UpdateMenu();
        // InitSignGamePage();  
        CloseIosCrossScreenTips();
        CloseAndriodCrossScreenTips(); 
 
        if(clientwindisplay != -1){
            if(searchbarstate == 0)
            {
                // if(!checkBluetoothState()){
                //     OpenBTTips();
                // }
            }  
        }
        Setsearchbar(); 
        clientwindisplay = 0;                     
        
        /*new nav bar rui.li*/
         var wW = $(window).width();
         var navItemW = parseInt(22 * wW / 375);
         $('.navbox .navbtn').css({'width':navItemW+'px'});
         $('.navbox .navbtn img').css({'width':navItemW/1.7+'px','height':navItemW/1.7+'px'});
         var oLi1 = $('#navbar_1 .navbarbase>li').length;
         var oLi3 = $('#navbar_3 .navbarbase>li').length;
         var oLi4 = $('#navbar_4 .navbarbase>li').length;
         $('.navbarbase>li').css({'width':navItemW+'px'});
         var margin = parseInt($('.navbarbase li').css('marginLeft'));
         $('#navbar_1 .navbarbase').css({'width':(navItemW+margin*2)*(oLi1+1)+'px'});
         $('#navbar_2 .navbarbase').css({'width':navItemW*0+'px'});
         $('#navbar_3 .navbarbase').css({'width':(navItemW+margin*2)*(oLi3+1)+'px'});
         $('#navbar_4 .navbarbase').css({'width':(navItemW+margin*2)*(oLi4+1)+'px'});
         $('.navbarbase>li img').css({'width':navItemW/1.7+'px','height':navItemW/1.7+'px'});

         $('.mapnavbar').show();
    }else{

        clientwindisplay = 1; 
        //add css for shu pin 
        $('.menu').css({'width': '13.2%'}); 
        $('.leftsidebar_box').css({'width': '14.2%','left': '0.75%'}); 
        UpdateMenu(); 
        var pla=ismobile(1); 
        if(pla == 0){ 
            OpenIosCrossScreenTips(); 
        }else{ 
            OpenAndriodCrossScreenTips();           
        } 
        $('.mapnavbar').hide();//rui.li
    }
    
    setTimeout('HideMenuitem()',5);
    setTimeout('SetMapCenter()',500);
}
$(window).bind('load', setUI);
$(window).bind('resize', setUI);
$(window).bind('orientationchange', setUI);

// getWeixinShareTicketOnly('', '', 'http://oss.1trip.com/dev/kzxz/images/camera/s.jpg', '', function(data){
// });


