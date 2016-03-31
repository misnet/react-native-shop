import _ from 'lodash';
import md5 from 'md5';
import CommonUtils from './Common';
import Storage from './Storage';
import QING_CONFIG from '../Config';
const Api = {
    /**
     * 对api请求的参数重新设置，生成sign签名，参照taobao的API做法：
     * 1.先排序
     * 2.将key与value进行拼接，然后头与尾加上app_secret
     * 3.将字串进行md5，再转为大写
     */
    async _resetReqParams(method,params={}){
        let p = _.cloneDeep(params);
        let memberInfo = await Storage.get('member');
        let at = '';
        if(memberInfo && !_.isUndefined(memberInfo['access_token'])){
            at = memberInfo['access_token'];
        }
        let oid = await Storage.get('openid');

        _.assign(p,{'oauthid':oid,'method':method,'appkey':QING_CONFIG['api_key'],'access_token':at,'appid':QING_CONFIG['appid']});
        p = CommonUtils.sortKeysBy(p);
        let sign = QING_CONFIG['api_secret'];
        _.mapKeys(p, function(value, key) {
           let t = value==null?'':value;
           sign+=key+t;
        });
        sign+= QING_CONFIG['api_secret'];
        return _.assign(p,{sign:md5(sign).toUpperCase()});
    },
    /**
     * 发起API请求
     */
    async request(method,params){
        //console.warn('params:',JSON.stringify(params));
        var p = await this._resetReqParams(method,params);
        //console.warn('param json:',JSON.stringify(p));
        return  fetch(QING_CONFIG['api_uri'],{
            method:'POST',
            body:JSON.stringify(p),
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
    }
};
module.exports=Api;
