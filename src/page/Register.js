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
            <TouchableOpacity onPress={()=>this.props.navigator.push({'id':'login'})}>
                <Text>{Di18n.tr('登录')}</Text>
            </TouchableOpacity>
        )
    }
}
class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mobile: '',
            passwd: '',
            verifyCode:'',
            spinnerLoading:false,
            'smsSeed':'',
            'memberObject':null,
            'verifyCodeSentTime':null,
            verifyCodeText:Di18n.tr('获取验证码')
        };
        this.timer = null;
        this.timeHit = 0;
    };
    componentWillUnmount(){
        this.unsubscribe();
        if(this.timer){
            clearInterval(this.timer);
        }
    };
    componentDidMount(){
        this.unsubscribe = MemberStore.listen(this.onUpdateState.bind(this));
    };

    componentDidUpdate(prevProps,prevState){

    };
    onUpdateState(data){
        let state = {};
        _.assign(state,data);
        // if(u.spinnerLoading!==undefined){
        //     state.spinnerLoading = u.spinnerLoading;
        // }
        this.setState(state);
    };
    sendVerifyCode(){
        if(this.timeHit==0){
            MemberAction.smsVerifyCode(this.state.mobile);
        }
        if(!this.timer){
            this.timer = setInterval(function(){
                const maxSeconds = 60;
                let txt = '';
                this.timeHit++;
                //console.warn('this.timeHit',this.timeHit);
                if(this.timeHit > maxSeconds){
                    txt = Di18n.tr('获取验证码');
                    this.timeHit = 0;
                    clearInterval(this.timer);
                    this.timer = null;
                }else{
                    //console.warn(maxSeconds,this.timeHit);
                    txt = (parseInt(maxSeconds) - parseInt(this.timeHit))+'秒';
                }
                this.setState({'verifyCodeText':txt});
            }.bind(this),1000);
        }
    };
    register(){
        const data = {
            mobile:this.state.mobile,
            passwd:this.state.passwd,
            verifyCode:this.state.verifyCode,
            smsSeed:this.state.smsSeed
        };
        //console.warn(JSON.stringify(data));
        MemberAction.register(data);
    };
    componentWillUpdate(nextProps,nextState){
        if(!_.isEqual(this.state.memberObject,nextState.memberObject) && !_.isEmpty(nextState.memberObject)){
            this.props.navigator.replace({'id':'ucenter'});
        }else{
        }
    };
    render(){
        return (
            <RootView headerRightButton={React.createElement(RegisterBtn,this.props)} hasMargin={true} loading={this.state.spinnerLoading} title={Di18n.tr('会员注册')} navigator={this.props.navigator} hasHeader={true} hasFooter={false}>
                <TextInput
                    maxLength={11}
                    keyboardType="numeric"
                    placeholder={Di18n.tr('请输入手机号')}
                    placeholderTextColor={AppStyles.placeholderTextColor}
                    underlineColorAndroid={AppStyles.lineColor}
                    style={styles.input}
                    onChangeText={(mobile) => this.setState({mobile})}
                    value={this.state.mobile}/>
                <View style={styles.verifyCodeView}>
                    <TextInput
                        maxLength={6}
                        keyboardType="numeric"
                        placeholder={Di18n.tr('短信验证码')}
                        placeholderTextColor={AppStyles.placeholderTextColor}
                        underlineColorAndroid={AppStyles.lineColor}
                        style={[styles.input,styles.verifyCodeInputer]}
                        onChangeText={(verifyCode) => this.setState({verifyCode})}
                        value={this.state.verifyCode}/>
                    <TouchableOpacity style={[styles.button,styles.smsButton]} onPress={this.sendVerifyCode.bind(this)}>
                        <Text ref="btnSendVCode" style={styles.buttonText}>{this.state.verifyCodeText}</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    placeholder={Di18n.tr('请输入密码')}
                    placeholderTextColor={AppStyles.placeholderTextColor}
                    underlineColorAndroid={AppStyles.lineColor}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(passwd) => this.setState({passwd})}
                    value={this.state.passwd}/>
                <TouchableOpacity style={styles.button} onPress={this.register.bind(this)}>
                    <Text style={styles.buttonText}>{Di18n.tr('注册')}</Text>
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
        paddingRight:AppStyles.getScale(1)

    },
    verifyCodeInputer:{
        flex:1,
        paddingBottom:AppStyles.getScale(0.25),
    },
    smsButton:{
        flex:1,
        margin:0,
        padding:0
    },
    verifyCodeView:{
        flexDirection:'row',
        paddingTop:AppStyles.getScale(0.5),
    }
});
module.exports = Register;
