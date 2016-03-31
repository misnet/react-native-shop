import React from 'react-native';
const {DeviceEventEmitter,TouchableHighlight,Alert,ListView,Image,Text,View,StyleSheet,TextInput,TouchableOpacity} = React;
import Reflux from 'reflux';
import mixin from 'es6-react-mixins';
import _ from 'lodash';
import RootView from '../comp/RootView';
import AppStyles from '../utils/AppStyles';
import MemberAction from '../action/Member';
import MemberStore  from '../store/Member';
import Di18n from '../languages/Di18n';
import Storage from '../utils/Storage';
import CommonUtils from '../utils/Common';
import MenuItem from '../comp/MenuItem';

import QING_CONFIG from '../Config';
//import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class Ucenter extends mixin(MemberStore){
    // static state = {
    //     username:'',
    //     password:''
    // };
    constructor(props){
        super(props);
        this.state = {
            nickname: '',
            uid: '',
            avatar:'',
            logout:false
        };
        this.subscription = null;
        this.refreshInfo = this.refreshInfo.bind(this);
    };
    shouldComponentUpdate(nexProps,nextState){
        if(nextState.avatar!=this.state.avatar||this.state.uid!=nextState.uid){
            return true;
        }else{
            return true;
        }
    };
    getMenuList(){
        return [{'title':Di18n.tr('我的订单'),'id':'myorder','icon':''},
        {'title':Di18n.tr('收货地址'),'id':'myaddress','icon':''}]
    };
    selectMenuItem(rowData){
        //console.warn(rowData.id);
    };
    componentWillUnmount(){
        this.unsubscribe();
        this.subscription.remove();
    };
    componentDidMount(){
        this.unsubscribe = MemberStore.listen(this.onLogout.bind(this));
        this.refreshInfo();
        this.subscription = DeviceEventEmitter.addListener('changeMemberInfo',this.refreshInfo.bind(this));
    };
    async refreshInfo(){
        let m = await Storage.get('member');
        if(m ){
            this.setState({
                nickname:m.nickname,
                avatar:m.photoUrl
            });
        }
    };
    onLogout(data){
        if(data.logout!==undefined && data.logout){
            this.props.navigator.push({id:'home'});
        }
    };
    logout(){
        Alert.alert(Di18n.tr('提示'),Di18n.tr('您是否确定要退出登录状态?'),[
            {text:Di18n.tr('取消')},
            {text:Di18n.tr('确定'),onPress:()=>MemberAction.logout()}
        ]);
    };
    editProfile(){
        //this.props.navigator.push({'id':'profile','previousPage':this,callback:this.refreshInfo});
        this.props.navigator.push({'id':'profile'});
    };
    render(){

        return (
            <RootView hasMargin={false} hasFooter={false} title={Di18n.tr('会员中心')} navigator={this.props.navigator}>
                <View style={styles.avatarBackground}>
                    <TouchableOpacity onPress={()=>this.editProfile()}>
                    <Image  source={{uri:CommonUtils.getAvatar(this.state.avatar,10,true)}} style={styles.avatar}/>
                    </TouchableOpacity>
                </View>
                {_.map(this.getMenuList(),function(rowData){
                    return (
                        <MenuItem key={rowData.id} id={rowData.id} icon={rowData.icon} title={rowData.title} onPress={this.selectMenuItem}/>
                    )
                }.bind(this))}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity onPress={this.logout} style={styles.logoutButton}><Text style={styles.logoutButtonText}>{Di18n.tr('退出登录')}</Text></TouchableOpacity>
                </View>
            </RootView>
        )
    }
}
var styles = StyleSheet.create({
    avatarBackground:{
        backgroundColor:AppStyles.lightColor,
        padding:AppStyles.getScale(3),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    avatar:{
        width:AppStyles.getScale(10),
        height:AppStyles.getScale(10),
        borderRadius:AppStyles.getScale(5)
    },
    bottomButtons:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:AppStyles.getScale(3)
    },
    logoutButton:{
        alignItems:'center',
        backgroundColor:AppStyles.lightColor,
        padding:AppStyles.getScale(1),
        width:AppStyles.getScale(20)
    },
    logoutButtonText:{

        color:'#ffffff'
    }
});
module.exports = Ucenter;
