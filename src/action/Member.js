import md5 from 'md5';
import _ from 'lodash';
import CommonUtils from '../utils/Common';
import Di18n from '../languages/Di18n';
import Reflux from 'reflux';
import Toast from 'react-native-root-toast';
require('../utils/reflux/BaseRequest');
/**
 * 会员相关Action
 */
    const MemberAction =  Reflux.createActions([
        {'login':{children:['completed','failed','processing']}},
        {'logout':{children:['completed','failed']}},
        {'register':{children:['completed','failed','processing']}},
        {'smsVerifyCode':{children:['completed','failed','processing']}},
        {'saveProfile':{children:['completed','failed','processing']}},
        {'getUploadAvatarKey':{children:['completed','failed','processing']}}
    ]);
    /**
     * 用户登录
     */
    MemberAction.login.listen(function(account,password){
        if(_.isEmpty(account)){
            Toast.show(Di18n.tr('请输入手机号'),{
                duration:Toast.durations.SHORT,
                position:Toast.positions.CENTER,
                animation:true
            });
            return;
        }
        if(_.isEmpty(password)){
            Toast.show(Di18n.tr('请输入密码'),{
                duration:Toast.durations.SHORT,
                position:Toast.positions.CENTER,
                animation:true
            });
            return;
        }
        let pwd = md5(password);
        this.fluxRequest('member.login', { "account": account, "passwd": pwd });
    });
    /**
     * 用户注册
     */
    MemberAction.register.listen(function(data){
       var defaultData = {
           'mobile':'',
           'passwd':'',
           'verifyCode':'',
           'smsSeed':''
       };
       data = _.assign({},defaultData,data);
       if(_.isEmpty(data.mobile)||!CommonUtils.testMobile(data.mobile)){
           Toast.show(Di18n.tr('请输入正确手机号码'),{
               duration:Toast.durations.SHORT,
               position:Toast.positions.CENTER,
               animation:true
           });
           return;
       }
       if(_.isEmpty(data.smsSeed)){
           Toast.show(Di18n.tr('请获取验证码'),{
               duration:Toast.durations.SHORT,
               position:Toast.positions.CENTER,
               animation:true
           });
           return;
       }
       if(_.isEmpty(data.verifyCode)){
           Toast.show(Di18n.tr('请输入收到的短信验证码'),{
               duration:Toast.durations.SHORT,
               position:Toast.positions.CENTER,
               animation:true
           });
           return;
       }
       if(_.isEmpty(data.passwd)){
           Toast.show(Di18n.tr('请输入密码'),{
               duration:Toast.durations.SHORT,
               position:Toast.positions.CENTER,
               animation:true
           });
           return;
       }
       this.fluxRequest('member.register',data);
    });
    //登出
    MemberAction.logout.listen(function(){
        this.completed();
    });
    //发短信验证码
    MemberAction.smsVerifyCode.listen(function(mobile){
        if(!CommonUtils.testMobile(mobile)){
            Toast.show(Di18n.tr('请输入正确手机号码'),{
                duration:Toast.durations.SHORT,
                position:Toast.positions.CENTER,
                animation:true
            });
            return;
        }
        this.fluxRequest('member.sendRegisterVerifyCode',{'mobile':mobile});
    });
    /**
     * 用户保存资料
     */
    MemberAction.saveProfile.listen(function(item){
        var $this = this;
        this.fluxRequest('member.save',item).done(function(){
            //重新请求Key
            if(typeof item['photoUrl']!=''){
                MemberAction.getUploadAvatarKey();
            }
        }.bind(this));
    });
    /**
     * 请求上传头像的token key
     */
    MemberAction.getUploadAvatarKey.listen(function(){
        this.fluxRequest('upload.avatar');
    });

    module.exports = MemberAction;
