import React,{DeviceEventEmitter,Image,StyleSheet,View,Text} from 'react-native';
import ModalBox from 'react-native-modalbox';
import RootView from '../../comp/RootView';
import MenuItem from '../../comp/MenuItem';
import Di18n from '../../languages/Di18n';
import CommonUtils from '../../utils/Common';
import AppStyles from '../../utils/AppStyles';
import Storage from '../../utils/Storage';
import MemberAction from '../../action/Member';
import MemberStore  from '../../store/Member';
//import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nickname: '',
            uid: '',
            avatar:'',
            gender:0,
            spinnerLoading:false,
            openSelectGenderModal:false
        };
        this.refreshInfo = this.refreshInfo.bind(this);
        this.subscription = null;
    };
    componentWillUnmount(){
        this.unsubscribe();
        this.subscription.remove();
        //console.warn('will unmount');
    };
    componentWillMount(){
        //console.warn('will mount');
    };
    onUpdatedProfile(data){
        if(data.spinnerLoading!==undefined){
            this.setState({'spinnerLoading':data.spinnerLoading});
        }
        if(data.memberObject!==undefined){
            //this.refreshInfo(this);
            DeviceEventEmitter.emit('changeMemberInfo',data.memberObject);
        }
    };
    // shouldComponentUpdate(nextProps,nextState){
    //
    // },
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('changeMemberInfo',this.refreshInfo);
        this.refreshInfo();
        this.unsubscribe = MemberStore.listen(this.onUpdatedProfile.bind(this));
    };
    refreshInfo(m){
        Storage.get('member').then((m)=>{
            if(m ){
                this.setState({
                    nickname:m.nickname,
                    avatar:m.photoUrl,
                    gender:m.gender
                });
                //console.warn(JSON.stringify(m));
            }
        });
    };
    selectGenderModal(){
        return (
            <View>
                <View style={styles.modalTitle}><Text style={styles.modalTitleText}>{Di18n.tr('选择性别')}</Text></View>
                <MenuItem
                    title={Di18n.tr('男')}
                    titleStyle={this.state.gender?styles.selectedGender:null}
                    onPress={()=>this.setGender(1)}
                    hasRightArrow={false}
                    />
                <MenuItem
                    titleStyle={!this.state.gender?styles.selectedGender:null}
                    style={styles.lastItem}
                    onPress={()=>this.setGender(0)}
                    hasRightArrow={false}
                    title={Di18n.tr('女')}/>
            </View>
        )
    };
    closeSelectGenderModal(){
        this.setState({'openSelectGenderModal':false});
    };
    setGender(v){
        this.refs['root'].refs['modal'].close();
        this.state.gender = v;
        this.setState({'openSelectGenderModal':false},(()=>{
            //if(this.selectedGender){
                MemberAction.saveProfile({gender:this.state.gender});
            //}
        }));
    };
    selectGender(){
        this.setState({'openSelectGenderModal':true});
        //console.warn(this.refs['root'].refs['modal']);
        //this.refs['root'].refs['modal'].open();
    };
    editProfile(data){
        switch(data.key){
            case 'gender':
                break;
            case 'avatar':
                this.props.navigator.push({'id':'selectphoto'});
                break;
            default:
                this.props.navigator.push({id:'editprofileitem',name:data.name,key:data.key,value:data.value})
        }

    };
    render(){
        let avatarImage =(
            <Image source={{uri:CommonUtils.getAvatar(this.state.avatar,4,true)}} style={styles.avatar}/>

        );
        let nickname = (<Text>
            {this.state.nickname}
            <Text style={[styles.rightArrow]}>&#xe60f;</Text>
        </Text>);
        let gender = (
            <Text>
                {this.state.gender==1?Di18n.tr('男'):Di18n.tr('女')}
                <Text style={[styles.rightArrow]}>&#xe60f;</Text>
            </Text>
        );
        return (
            <RootView
                ref="root"
                loading={this.state.spinnerLoading}
                modalIsOpen={this.state.openSelectGenderModal}
                modalStyle={styles.selectGenderModal}
                modalOnClosed={()=>this.closeSelectGenderModal()}
                modalChildren={this.selectGenderModal()}
                hasHeader={true}
                hasFooter={false}
                hasMargin={true}
                title={Di18n.tr('我的资料')}
                navigator={this.props.navigator} >
                <MenuItem
                    title={Di18n.tr('头像')}
                    rightComponent={avatarImage}
                    onPress={this.editProfile.bind(this,{'key':'avatar'})}
                    />
                <MenuItem

                    title={Di18n.tr('呢称')}
                    rightComponent={nickname}
                    onPress={this.editProfile.bind(this,{"name":Di18n.tr('呢称'),"key":'nickname',"value":this.state.nickname})}
                    />
                <MenuItem
                    title={Di18n.tr('性别')}
                    rightComponent={gender}
                    onPress={()=>this.selectGender()}
                    />

            </RootView>
        )
    }
};

var styles = StyleSheet.create({
    modalTitle:{
        padding:AppStyles.getScale(1),
        justifyContent:'center',
        borderColor:AppStyles.lineColor,
        borderBottomWidth:2,

    },
    modalTitleText:{
        justifyContent:'center',
        alignSelf:'stretch'
    },
    avatar:{
        width:AppStyles.getScale(4),
        height:AppStyles.getScale(4),
        borderRadius:AppStyles.getScale(0.2),
        borderWidth:0.5,
        borderColor:AppStyles.lineColor
    },
    rightArrow:{
        fontSize:AppStyles.getScale(1.5),
        fontFamily:'iconfont',
        justifyContent:'center',
        color:AppStyles.lineColor
    },
    selectGenderModal:{
        width:AppStyles.getPXFromPercent({width:90}).width,
        height:AppStyles.getScale(13)
    },
    lastItem:{
        borderBottomWidth:0
    },
    selectedGender:{
        color:AppStyles.lightColor,
        fontWeight:'bold'
    }
});

module.exports = Profile;
