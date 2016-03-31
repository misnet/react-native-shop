;!function(window, undefined){
	//-------------
	var langsData = {
		'注册':'Sign up',
        '登录':'Sign in',
        '会员登录':'Sign in',
        '请输入手机号':'Input your mobile number',
        '请输入密码':'Input your password',
		'我的资料':'My Profile',
		'呢称':'Nickname',
		'头像':'Avatar',
		'性别':'Sex',
		'修改%name%':'Update %name%',
		'您的网络连接有问题':'Networking is broken'
	};
	//-------------

	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
		define(function() {
	  		return langsData;
		});
	}
}.call(this);
