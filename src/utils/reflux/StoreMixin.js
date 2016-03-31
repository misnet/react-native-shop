import Toast from 'react-native-root-toast';
import _ from 'lodash';

/**
 * 对reflux的StoreMethods进行扩展
 * @author Donny
 * @created 12/30,2015
 */
let StoreMixin = {
    /**
     *
     * @resp respone object
     * @cb callback function，传两参：服务器返回的对象内容，是否发生错误
     * @pms 是否弹消息
     */
    baseResponse(resp,cb,pms){
        var isPopMsg = !_.isBoolean(pms)?true:pms;
        if(!_.isUndefined(resp['response_error'])){
            if(isPopMsg){
                Toast.show(resp['response_error']['msg'],{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true,
                    onHidden(){
                        cb(resp['response_error'],true);
                    }
                });
            }else{
                cb(resp['response_error'],true);
            }



        }else if(!_.isUndefined(resp['response_data'])){
            cb(resp['response_data'],false);
            return;
        }else {
            if(isPopMsg){
                Toast.show(resp['response_error']['msg'],{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true,
                    onHidden(){
                        cb(null,true);
                    }
                });
            }else{
                cb(null,true);
            }
        }
    }
};
module.exports = StoreMixin;
