import _ from 'lodash';
//import _object from 'lodash/fp/object';
import {Dimensions,PixelRatio} from 'react-native';
import AppStyles from './AppStyles';
import QING_CONFIG from '../Config';
const CommonUtils = {
        /**
         * 对json对象按key进行排序，需要lodash程序支持
         */
        sortKeysBy(obj, comparator) {
            var keys = _.sortBy(_.keys(obj), function (key) {
                return comparator ? comparator(obj[key], key) : key;
            });
            return _.zipObject(keys, _.map(keys, function (key) {
                return obj[key];
            }));
        },
        baseResponse:function(resp){
            if(!_.isUndefined(resp['response_error'])){
                return resp['response_error']
            }else if(!_.isUndefined(resp['response_data'])){
                resp['response_data'];
                return;
            }else {
                //;
            }
        },
        //判断手机号
        testMobile:function(tel){
            return !_.isEmpty(tel) && /^(13|15|17|18)\d{9}$/.test(tel);
        },
        //取得屏幕dpr值
        getDPR:function(){
    		var dpr;
    	    if(PixelRatio !== undefined) {
                dpr = PixelRatio.get();
            } else {
                dpr = 1;
            }
    		return dpr;
    	},
        //取得可用的宽与高
        getViewPort:function(){
            let {width,height} = Dimensions.get('window');
            let rw = width * this.getDPR();
            let rh = height * this.getDPR();
            let dpr = this.getDPR();
            return {
                width:width,
                height:height,
                realWidth:rw,
                realHeight:rh,
                dpr:dpr
            };
        },

        /**
         * 取缩略图
         */
        thumb(imgurl,width,height,isRem=false){
            if(isRem){
                width = AppStyles.getScale(width);
            }
            width = this.getViewPort().dpr * width;
            if(isRem){
                height = AppStyles.getScale(height);
            }
            height = this.getViewPort().dpr * height;
            width  = parseInt(width);
            height = parseInt(height);
            var tail = '_'+width+'x'+height;
    		var imgurlArray = imgurl.split('.');
    		var ext = imgurlArray[imgurlArray.length - 1];
    		tail+='.'+ext;
            if(imgurl.substring(0,1)==='/'){
                imgurl = QING_CONFIG['img_host'] + imgurl;
            }
    		return imgurl+tail;
        },
        /**
         * 取得头像
         */
        getAvatar(avatarUrl,avatarWidth=40,isRem=false){
           var w = avatarWidth;
        //    if(isRem){
        //        w = AppStyles.getScale(avatarWidth);
        //    }
        //    w = this.getViewPort().dpr * w;
        //    w = parseInt(w);
           if(avatarUrl){
               avatarUrl = this.thumb(avatarUrl,w,w,isRem);
           }else{
               avatarUrl = QING_CONFIG['img_host']+ '/m/i/davatar.gif';
           }
           return avatarUrl;
       }
};
module.exports = CommonUtils;
