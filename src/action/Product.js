import md5 from 'md5';
import _ from 'lodash';
import CommonUtils from '../utils/Common';
import Di18n from '../languages/Di18n';
import Reflux from 'reflux';
import Toast from 'react-native-root-toast';
require('../utils/reflux/BaseRequest');
/**
 * 产品相关Action
 */
const ProductAction =  Reflux.createActions([
    {'getList':{children:['completed','failed']}},
    {'getDetail':{children:['completed','failed']}}
]);
/**
 * 取得商品详情
 */
ProductAction.getDetail.listen(function(id){
    this.fluxRequest('product.getDetail',{'id':id});
});
/**
 * 取得商品列表
 */
ProductAction.getList.listen(function(page,limit){
    this.fluxRequest('product.getList',{'page':page,'limit':limit});
});
module.exports = ProductAction;
