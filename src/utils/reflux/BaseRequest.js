import Toast from 'react-native-root-toast';

import _ from 'lodash';
import Api from '../Api';
import Di18n from '../../languages/Di18n';
import Reflux from 'reflux';
/**
 * 对reflux的ActionMethods进行扩展，flux中的action请求全部通过fluxRequest请求
 */

const BaseRequest = {
    async fluxRequest(method,params){
        try{
            if(this.processing) this.processing(true);
            let response = await Api.request(method,params);
            let responseJson = await response.json();
            if(this.processing) this.processing(false);
            this.completed(responseJson,params);
        }catch(error){
            if(this.processing) this.processing(false);
            this.fluxRequestFailure(error);
        }
        // return Api.request(method,params).
        //     then(function(resp){
        //         return resp.json();
        //     }).
        //     then(function(data){
        //         this.completed(data,params);
        //     }.bind(this)).catch(function(error){
        //         this.fluxRequestFailure(error);
        //     }.bind(this));
    },
    fluxRequestFailure(error){
        //TODO:要判断是不是网络问题
        if(error!==undefined && error.message.indexOf("Network request failed")!==-1){
            Toast.show(Di18n.tr('您的网络连接有问题'),{
                duration:Toast.durations.SHORT,
                position:Toast.positions.CENTER,
                animation:true
            });
        }else{
            Toast.show(Di18n.tr('暂有问题'),{
                duration:Toast.durations.SHORT,
                position:Toast.positions.CENTER,
                animation:true
            });
        }
    }
};
_.assign(Reflux.ActionMethods,BaseRequest);

module.exports = BaseRequest;
