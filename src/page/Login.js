import React from 'react-native';
const {Text,View,StyleSheet,TextInput,TouchableOpacity} = React;
import RootView from '../comp/RootView';
import AppStyles from '../utils/AppStyles';
import Reflux from 'reflux';
import MemberAction from '../action/Member';
import MemberStore  from '../store/Member';
import mixin from 'es6-react-mixins';
import _ from 'lodash';
import Di18n from '../languages/Di18n';
class RegisterBtn extends React.Component{
    constructor(props){
        super(props);
    };
    render(){
        return (
            <TouchableOpacity onPress={()=>this.props.navigator.push({'id':'register'})}>
                <Text>{Di18n.tr('注册')}</Text>
            </TouchableOpacity>
        )
    }
}
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            spinnerLoading:false,
            memberObject:null
        };
    };
    componentWillUnmount(){
        this.unsubscribe();
    };
    componentDidMount(){
        this.unsubscribe = MemberStore.listen(this.onLogined.bind(this));
    };
    onLogined(u){
        let state = {};
        if(u.memberObject!==undefined){
            state.memberObject = u.memberObject;
        }
        if(u.spinnerLoading!==undefined){
            state.spinnerLoading = u.spinnerLoading;
        }
        this.setState(state);
    };
    login(){
        MemberAction.login(this.state.username,this.state.password);
    };
    componentWillUpdate(nextProps,nextState){
        if(!_.isEqual(this.state.memberObject,nextState.memberObject) && !_.isEmpty(nextState.memberObject)){
            this.props.navigator.replace({'id':'ucenter'});
        }else{
        }
    };
    render(){
        return (
            <RootView headerRightButton={React.createElement(RegisterBtn,this.props)} hasMargin={true} loading={this.state.spinnerLoading} title={Di18n.tr('登录')} navigator={this.props.navigator} hasHeader={true} hasFooter={false}>
                <TextInput
                    placeholder={Di18n.tr('请输入用户名')}
                    placeholderTextColor={AppStyles.placeholderTextColor}
                    underlineColorAndroid={AppStyles.lineColor}
                    style={styles.input}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}/>
                <TextInput
                    placeholder={Di18n.tr('请输入密码')}
                    placeholderTextColor={AppStyles.placeholderTextColor}
                    underlineColorAndroid={AppStyles.lineColor}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}/>
                <TouchableOpacity style={styles.button} onPress={this.login.bind(this)}>
                    <Text style={styles.buttonText}>{Di18n.tr('登录')}</Text>
                </TouchableOpacity>
            </RootView>
        )
    }
}
var styles = StyleSheet.create({
    button:{
        backgroundColor:AppStyles.lightColor,
        paddingTop:AppStyles.getScale(1),
        paddingBottom:AppStyles.getScale(1),
        alignItems:'center'
    },
    buttonText:{
        color:'#ffffff',
    },
    input:{
        borderWidth:1,
        paddingLeft:AppStyles.getScale(1),
        paddingRight:AppStyles.getScale(1),
    }
});
module.exports = Login;
