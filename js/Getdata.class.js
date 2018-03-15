/**
 * Created by 流歌 on 2017/7/10.
 * 地图数据获取类v1.3 使用前请引入jquery
 */

function Getdata() {

    this.url='http://st.zhanglina.net/index.php/user/map/';//主链接

    this.ajax=function (url,formData,$return) {
        formData.return='jsonp';
        var type_return='jsonp';

        $.ajax({
            async: false,
            cache: false,
            url : url,
            type : "POST",
            data : formData,
            dataType:type_return,
            jsonp:"callback",
            success : function(data) {
                $return(data);
            },
            error : function(data) {
                //alert('aaa');
                //alert(data.status + " : " + data.statusText + " : " + data.responseText);
            }
        });

    }


    /**
     * 店铺类型获取
     *
     * */
    this.shop_type=function ($return) {
        var url=this.url+'shop_type';
        this.ajax(url,{},$return);
    }

    /**
     * 公共设施类型获取
     * @param $return 回调方法
     * */
    this.public_type=function ($return) {
        var url=this.url+'public_type';

        this.ajax(url,{},$return);
    }

    /**
     * 景点获取
     *@param level 级别
     * @param $return 回调方法
     * */
    this.scenic=function (level,$return) {
        var url=this.url+'scenic';

        this.ajax(url,{level:level},$return);
    }

    /**
     * 商铺获取
     *@param type_id 类型id
     * @param level 级别
     * @param $return 回调方法
     * */
    this.shop=function (type_id,level,$return) {
        var url=this.url+'shop';

        this.ajax(url,{type_id:type_id,level:level},$return);
    }

    /**
     * 公共设施获取
     *@param type_id 类型id
     * @param level 级别
     * @param $return 回调方法
     * */
    this.public=function (type_id,level,$return) {
        var url=this.url+'publics';

        this.ajax(url,{type_id:type_id,level:level},$return);
    }

    /**
     * 文字获取
     * */
    this.text=function (level,$return) {
        var url=this.url+'text';
        this.ajax(url,{level:level},$return);
    }

    /**
     * 搜索
     * */
    this.sousuo=function (text,num,$return) {
        var url=this.url+'sousuo';

        this.ajax(url,{text:text,num:num},$return);
    }

    /**
    * 点击
    * */
    this.click=function(x,y,level,$return){
        var url=this.url+'click';

        this.ajax(url,{x:x,y:y,level:level},$return);
    }
}
