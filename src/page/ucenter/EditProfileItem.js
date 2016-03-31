import React,{DeviceEventEmitter,Image,StyleSheet,View,Text,TouchableOpacity,TextInput} from 'react-native';
import RootView from '../../comp/RootView';
import MenuItem from '../../comp/MenuItem';
import Di18n from '../../languages/Di18n';
import CommonUtils from '../../utils/Common';
import AppStyles from '../../utils/AppStyles';
import Storage from '../../utils/Storage';
import Toast from 'react-native-root-toast';
import MemberAction from '../../action/Member';
import MemberStore  from '../../store/Member';
//import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class SaveBtn extends React.Component{
    constructor(props){
        super(props);
    };
    render(){
        return (
            <TouchableOpacity onPress={()=>this.props.save()}>
                <Text>{Di18n.tr('保存')}</Text>
            </TouchableOpacity>
        )
    }
}
class BackBtn extends React.Component{
    constructor(props){
        super(props);
    };
    render(){
        return (
            <TouchableOpacity style={styles.backBtn} onPress={()=>this.props.goback()}>
                <Text  style={styles.leftViewText} >&#xe624;</Text>
            </TouchableOpacity>
        )
    }
}

class EditProfileItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:'',
            spinnerLoading:false,
            value:''
        };
    };
    //判断相关传参是否到位
    componentWillMount(){
        //非法进入时，原路返回
        if(_.isUndefined(this.props.route['name'])
    ||_.isUndefined(this.props.route['key'])){
            Toast.show(Di18n.tr('系统错误'),{
                duration:Toast.durations.SHORT,
                position:Toast.positions.CENTER,
                animation:true,
                onHidden:function(){
                    this.props.navigator.pop();
                }
            });
        }
    };

    onUpdatedProfile(data){
        if(data.memberObject!==undefined){
            DeviceEventEmitter.emit('changeMemberInfo',data.memberObject);
            this.props.navigator.pop();
            // let routes = this.props.navigator.getCurrentRoutes();
            // if(routes.length>2){
            //     //上一个界面刷新？
            //     let lastRoute = routes[routes.length - 2];
            //     //this.props.navigator.replace({'id':'profile'});
            //     if(typeof this.props.route.callback=='function' && this.props.route.previousPage){
            //         this.props.route.callback(this.props.route.previousPage);
            //     }
            //     //this.props.navigator.replacePrevious(lastRoute);
            //     this.props.navigator.pop();
            // }else{
            //     this.props.navigator.pop();
            // }
        }
        if(data.spinnerLoading!==undefined){
            this.setState({'spinnerLoading':data.spinnerLoading});
        }
    };
    componentWillUnmount(){
        this.unsubscribe();
    };
    componentDidMount(){
        this.setState({value:this.props.route['value']})
        this.unsubscribe = MemberStore.listen(this.onUpdatedProfile.bind(this));
    };
    goback(){
        this.props.navigator.pop();
    };
    save(){
        if(!_.isUndefined(this.props.route['key'])){
            let key = this.props.route['key'];
            let item   = {};
            item[key] = this.state.value;
            if(_.isEmpty(item[key])){
                Toast.show(Di18n.tr('%name%为空',{'name':this.props.route['name']}),{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true
                });
            }else{
                MemberAction.saveProfile(item);
            }
        }else{
            this.props.navigator.pop();
        }
    };
    render(){

        return (
            <RootView
                loading={this.state.spinnerLoading}
                hasHeader={true}
                headerLeftButton={React.createElement(BackBtn,{'goback':this.goback.bind(this)})}
                headerRightButton={React.createElement(SaveBtn,{'key':this.props.route.key,'name':this.props.route.name,'save':this.save.bind(this)})}
                hasMargin={true}
                title={Di18n.tr('修改%name%',{'name':this.props.route['name']})}
                navigator={this.props.navigator} >
                <TextInput
                    ref={this.props.route.key}
                    placeholder={Di18n.tr('请输入内容')}
                    placeholderTextColor={AppStyles.placeholderTextColor}
                    underlineColorAndroid={AppStyles.lineColor}
                    style={styles.input}
                    onChangeText={(v)=>this.setState({'value':v})}
                    defaultValue={this.props.route['value']}/>
            </RootView>
        )
    }
};

var styles = StyleSheet.create({
    input:{
        borderWidth:1,
        paddingLeft:AppStyles.getScale(1),
        paddingRight:AppStyles.getScale(1),
    },
    leftViewText:{
        color:AppStyles.lightColor,
        fontFamily:'iconfont',
        fontSize:AppStyles.getScale(2)
    },
    backBtn:{
        alignSelf:'stretch',
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        flexDirection:'row'
    }
});

module.exports = EditProfileItem;
