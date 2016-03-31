import {Dimensions,PixelRatio} from 'react-native';
import _ from 'lodash';

const AppStyles = {
    //相当于HTML的font-size:62.5%或10px
    rootScale:10.0,
    textColor:'#808080',
    lightColor:'#c5523f',
    lineColor:'#dfdfdf',
    placeholderTextColor:'#ccc',
    getScale(size){
        return this.rootScale * parseFloat(size);
    },
    getViewPort(){
        let {height,width}=Dimensions.get('window');
        return {width,height};
    },
    getPXFromPercent(vp){
        let config = _.assign({},{width:100,height:100},vp);
        let maxViewPort = this.getViewPort();
        let data = {
            width:parseFloat(vp.width) / 100 * maxViewPort.width,
            height:parseFloat(vp.height) / 100 * maxViewPort.height,
        };
        return {width:parseInt(data.width),height:parseInt(data.height)};
    }
}

module.exports= AppStyles;
