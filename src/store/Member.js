import StoreMixin from '../utils/reflux/StoreMixin';
import _ from 'lodash';
import Reflux  from 'reflux';
import MemberAction from '../action/Member';
import Storage from '../utils/Storage';
import Di18n   from '../languages/Di18n';
import Toast from 'react-native-root-toast';

let MemberStore =  Reflux.createStore({
    listenables:[MemberAction],
    mixins:[StoreMixin],
    onLoginProcessing(loading){
        this.trigger({'spinnerLoading':loading});
    },
    onRegisterProcessing(loading){
        this.trigger({'spinnerLoading':loading});
    },
    onSaveProfileProcessing(loading){
        this.trigger({'spinnerLoading':loading});
    },
    /**
     * 完成登陆
     */
    onLoginCompleted:function(resp){
        var $this = this;
        this.baseResponse(resp,(responseData,isError)=>{
            let name = 'member';
            if(!isError && !_.isUndefined(responseData[name])){

                let userObject = {uid:'',access_token:'',access_token_expired:0};
                let u = _.assign({},userObject,responseData[name]);
                //做暂时存放
                //console.warn('logincompleted',JSON.stringify(u));
                Storage.set(name,u);
                //console.warn('responseData',JSON.stringify(u));
                $this.trigger({'memberObject':u});
            }else{
                //登陆失败
                //$this.trigger({'spinnerLoading':false});
            }
        });
    },
    onLogoutCompleted(){
        Storage.del('member');
        this.trigger({'logout':true});
    },
    /**
     * 发短信验证码
     */
    onSmsVerifyCodeCompleted(resp){
        var $this = this;
        this.baseResponse(resp,(responseData,isError)=>{
            var name = 'result';
            if(!isError && !_.isUndefined(responseData[name])){
                $this.trigger({'smsSeed':responseData['seed'],'verifyCodeSentTime':new Date()});
            }else{

            }
        });
    },
    /**
     * 注册
     */
    onRegisterCompleted(resp){
        var $this = this;
        this.baseResponse(resp,(responseData,isError)=>{
            var name = 'member';
            if(!isError && !_.isUndefined(responseData[name])){
                let userObject = {uid:'',access_token:'',access_token_expired:0};
                let u = _.assign({},userObject,responseData[name]);
                //做暂时存放
                Storage.set(name,u);
                $this.trigger({'memberObject':u});
            }else{
                //登陆失败
            }
        });
    },
    /**
     * 保存用户资料
     * @param resp 服务端响应
     * @params action的相关参数
     */
     onSaveProfileCompleted(resp,params){
        var $this = this;
        this.baseResponse(resp,(responseData,isError)=>{
            if(!isError && responseData['result']){
                Storage.get('member').then((memberInfo)=>{
                    let newMemberInfo = _.assign({},memberInfo,params);
                    Storage.set('member',newMemberInfo);
                    $this.trigger({'memberObject':newMemberInfo});
                    Toast.show(Di18n.tr('完成资料保存'),{
                        duration:Toast.durations.SHORT,
                        position:Toast.positions.CENTER,
                        animation:true
                    });
                })
                //let memberInfo    = await Storage.get('member');

            }else{
                ;
            }
        },false);
    },
    /**
     * 请求上传头像的token key
     */
    onGetUploadAvatarKeyCompleted:function(resp){
        var uploadKey = resp['response_data']['key'];
        this.trigger({'uploadKey':uploadKey});
    }
});
module.exports = MemberStore;
