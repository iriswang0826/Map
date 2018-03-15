
var retArray = [];
var searchResultCurPage = 1;
var searchResultPageNum = 5;
var searchResult = [];
var allPageNum = 0;
var keyword;
var pagebtn = false;

function getRetItem(retObj) {
	var retItem = '';
	var type = retObj.type;
	var shop_img = '';
	var addName = retObj.name;
	if(type == 'shop'){
		shop_img = 'shop';
	}else if(type == 'public'){
		shop_img = 'service';
	}else if(type == 'scenic'){
		shop_img = 'scenic';
	}
	retItem = '<li onclick="a(this)">\
			<table class=line_table>\
			<tr>\
				<td>\
					<form class=list1_dise>\
						<button id="list1_dise_tx" disabled="disabled"\
							style="font-weight: bold; font-size: 20px">'+addName+'</button>\
					</form>\
				</td>\
				<td class=list1_shop_type style="text-align:right; margin-right:20px"><img class="shop_img" \
					src="../images/searchResultMenu/'+shop_img+'.png" /></td>\
			</tr>\
		</table>\
	</li>';
	return retItem;
}

function showSearchResult(){
	$('.search_result_dialog').fadeIn();
	$('.search_result_show').fadeOut();
}

function closeSearchResultMenu(){
	$('.search_result_dialog').hide();
	//$('.search_result_show').hide();
}

function hideSearchResultMenu(){
	$('.search_result_dialog').fadeOut();
	$('.search_result_show').fadeIn();
}

function a(v){
	var clickIndex =  $(v).index();
	var clickName = retArray[clickIndex].name;
	// var clickNameArr = new Array();
	// clickNameArr.push(clickName);
	var clickPoint = [];
	clickPoint = retArray[clickIndex].ten;
	hideSearchResultMenu();
	getPosOfSearchRet(clickPoint);	
}
var pageLists = [];
function getSearchResultAllPage(count) {
	// var searchResultTotal = retArray.length;
	allPageNum = Math.ceil(count/searchResultPageNum);
	if(allPageNum == 1){
		$('.search_result_next').hide();
	}else{
		$('.search_result_next').show();
			for(var i=0;i<allPageNum;i++){
				pageLists.push('<li class="page_num">'+(i+1)+'</li>');
			}
		pageListsAppend('');
	}
}

function pageListsAppend(v) {
	$('#table_page').html('');
	var start = searchResultCurPage == 1?(searchResultCurPage-1):searchResultCurPage;
	var end = start + 2;
	for(var i = start; i<=end; i++){
		$('#table_page').append(pageLists[i]);
	}
	if(v == ''){
		$('.page_num').eq(0).addClass('presson');
	}else if(v == 'next'){
		$('.page_num').eq(1).addClass('presson');
	}else if(v == 'prev'){
		$('.page_num').eq(1).addClass('presson');
	}
}

function searchResultDialogAppend() {
	$('#search_result_list').html('');
	var start = 0;
	var end = retArray.length;

	var result = new Array();
	for(var i = start; i<end; i++){
		$('#search_result_list').append(searchResult[i]);
		if(retArray[i] !=undefined){
			result.push(retArray[i]);
		}
	}
	// console.log(result);
	getPosOfSearchRetOnly(result);
}
$(function(){	
	$('#btn_prev').click(function(){
		
		if(searchResultCurPage == 1){
			return;
		}
		searchResultCurPage--;
		
		if(searchResultCurPage == 1){
		$('.presson').removeClass('presson');
			$('.page_num').eq(0).addClass('presson');
		}else if(searchResultCurPage == allPageNum-1){
		$('.presson').removeClass('presson');
			$('.page_num').eq(1).addClass('presson');
		}else{
				pageListsAppend('prev');
		}
		console.log(searchResultCurPage);
		pageSearch();
		searchResultDialogAppend();
	});

	$('#btn_next').click(function(){
		if(searchResultCurPage == allPageNum){
			return;
		}
		searchResultCurPage++;
		if(searchResultCurPage == 2){
		$('.presson').removeClass('presson');
			$('.page_num').eq(1).addClass('presson');
		}else if(searchResultCurPage == allPageNum){
			$('.presson').removeClass('presson');
			$('.page_num').eq(2).addClass('presson');
		}else{
			pageListsAppend('next');
		}
		console.log(searchResultCurPage);
		pageSearch();
		searchResultDialogAppend();
	});
	
	$('.search_result_show').click(function(){
		$('.search_result_dialog').fadeIn();
		$(this).fadeOut();
	});
	
	$('.search_result_hide').click(function(){
		hideSearchResultMenu();
	});
	
	$('.search_result_close').click(function(){
		$('.search_result_dialog').hide();
		$('.search_result_show').hide();
		removeMarks();
	});
});

function SearchInSolr(searchKey,searchResultCurPage) {
	data.sousuo(searchKey,searchResultCurPage,function(d){
		if(d.code == 0){
			retArray = d.data.list;
			if(!pagebtn){
				var searchResultNum = d.data.count;
				getSearchResultAllPage(searchResultNum);
			}
			searchResult = [];
			for(var i=0;i<retArray.length;i++){
				searchResult.push(getRetItem(retArray[i]));
			}
			searchResultDialogAppend();
			$('#search_result_sub_title').text(searchKey);
			showSearchResult();
		}else {
			alert('获取失败'+d.msg);
		}
	})
};
function searchsitebytext(text) {
    closeSearchbar();
    clearmarkers();
    clearbars();  
    if(text.length>0){
    	pagebtn = false;
        SearchInSolr(text,searchResultCurPage);
    }
}
function searchsite() {
    var val = document.getElementById('searchtext_input').value;
    keyword = val;
    searchsitebytext(keyword);
    curType = '';
}
function pageSearch(){
	clearmarkers();
	clearbars();
	pagebtn = true;
	SearchInSolr(keyword,searchResultCurPage);
}
