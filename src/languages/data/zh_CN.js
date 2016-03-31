;!function(window, undefined){
	//-------------
	var langsData = {
		'Please type your name':'请输入您的姓名',
		'Passowrd length must be more than %len%':'密码至少需要%len%位',
		'I have %num% apple':'我有%num% 个苹果',
		'You are awesome':'你太棒了'
	};
	//-------------
	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
		define(function() {
	  		return langsData;
		});
	}
}.call(this);
