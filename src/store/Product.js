import StoreMixin from '../utils/reflux/StoreMixin';
import _ from 'lodash';
import Reflux  from 'reflux';
import ProductAction from '../action/Product';
import Storage from '../utils/Storage';
import Di18n   from '../languages/Di18n';
import Toast from 'react-native-root-toast';

let ProductStore =  Reflux.createStore({
    listenables:[ProductAction],
    mixins:[StoreMixin],
    /**
     * 商品详情
     */
    // onGetDetailCompleted(resp){
    //     var $this = this;
    //     this.baseResponse(resp,(responseData,isError)=>{
    //         var name = 'product';
    //         if(!isError && !_.isUndefined(responseData[name])){
    //             $this.trigger({
    //                 'product':responseData[name],
    //                 'images':responseData['images'],
    //                 'content':responseData['content'],
    //                 'sku':responseData['sku']
    //             });
    //         }
    //     });
    // },
    //_cacheListData: {},
    /**
     * 列出商品列表
     */
    onGetListCompleted:function(resp){
        var $this = this;
        this.baseResponse(resp,(responseData,isError)=>{
            var name = 'product';
            //console.warn('responseData',JSON.stringify(responseData));
            if(!isError && !_.isUndefined(responseData[name])){
                $this.trigger({
                    'product':responseData[name],
                    'pagination':{
                        'total':responseData['total'],
                        'page':responseData['page'],
                        'limit':responseData['limit']
                    }
                });
            }
        });
    }
});
module.exports = ProductStore;
