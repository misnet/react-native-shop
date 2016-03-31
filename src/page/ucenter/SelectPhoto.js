import React,{DeviceEventEmitter,Platform,RefreshControl,CameraRoll,Image,StyleSheet,View,Text,TouchableOpacity,ListView} from 'react-native';
import _ from 'lodash';
import RootView from '../../comp/RootView';
import MenuItem from '../../comp/MenuItem';
import Di18n from '../../languages/Di18n';
import CommonUtils from '../../utils/Common';
import AppStyles from '../../utils/AppStyles';
import Storage from '../../utils/Storage';
import Toast from 'react-native-root-toast';
import MemberAction from '../../action/Member';
import MemberStore  from '../../store/Member';
import ToJSON from '../../utils/ToJSON';
import QING_CONFIG from '../../Config';
//import  RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class SelectPhoto extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            images:[],
            isRefreshing:false,
            loadingMore:false,
            noMore:false,
            lastCursor:(null : ?string),
            loaded:0,
            bigImages:false,
            spinnerLoading:false,
            assetType:'Photos',
            uploadKey:'',
            memberObject:null,
            dataSource:new ListView.DataSource({rowHasChanged: this._rowHasChanged})
        }
        this.renderRow = this.renderRow.bind(this);
    };
    _rowHasChanged(r1,r2) {
       if (r1.length !== r2.length) {
          return true;
       }
       for (var i = 0; i < r1.length; i++) {
         if (r1[i] !== r2[i]) {
           return true;
         }
       }
       return false;
    };
    renderImage(node) {
        let imageSize = 75;
        let imageStyle = [styles.image, {width: imageSize, height: imageSize}];
        return (
            <TouchableOpacity key={'p'+node.uri} onPress={this.selectPicture.bind(this,node)}>
                <View><Image source={node} style={imageStyle} /></View>
            </TouchableOpacity>
        );
    };
    selectPicture(node){
        const url = QING_CONFIG['api_uri']+'/upload';
        let filename = '';
        if(node.type.indexOf('jpeg')!=-1||node.type.indexOf('jpg')!=-1){
            filename = 'image.jpg';
        }else if(node.type.indexOf('png')!=-1){
            filename = 'image.png';
        }else if(node.type.indexOf('gif')!=-1){
            filename = 'image.gif';
        }else{
            Toast.show(Di18n.tr('只支持PNG、JPG或GIF图片上传'),{
                duration:Toast.durations.SHORT,
                position:Toast.positions.CENTER,
                animation:true
            });
            this.setState({'spinnerLoading':false});
            return;
        }

        let  data = new FormData();
        data.append("type","avatar");
        data.append("key",this.state.uploadKey);
        data.append("file",{...node, name: filename});
        let xhr = new XMLHttpRequest();
        xhr.open('POST',url);
        xhr.onload = ()=>{
            if(xhr.status!== 200){
                //上传失败;
                Toast.show(Di18n.tr('服务响应失败'),{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true
                });
                this.setState({'spinnerLoading':false});
                return;
            }
            if(!xhr.responseText){
                //无响应
                //console.warn('no response');
                Toast.show(Di18n.tr('服务端无响应'),{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true
                });
                this.setState({'spinnerLoading':false});
                return;
            }
            let result = ToJSON.evalJSON(xhr.responseText);

            if(!_.isUndefined(result['response_error'])){
                Toast.show(result['response_error']['msg'],{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true
                });
                this.setState({'spinnerLoading':false});
            }else if(!_.isUndefined(result['response_data'])){
                let avatarUrl = result['response_data']['url'];
                MemberAction.saveProfile({'photoUrl':avatarUrl,'key':this.state.uploadKey});
            }else {
                this.setState({'spinnerLoading':false});
                Toast.show(Di18n.tr('服务端返回格式不正确'),{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true
                });
            }
            //console.warn('rt',xhr.responseText);
        };
        //TODO:react-native的接口尚未实现
        // if(xhr.upload){
        //     xhr.upload.onprogress = (event)=>{
        //         console.warn('onprogress',event);
        //         if(event.lengthComputable){
        //
        //             console.warn(event.loaded,event.total);
        //             this.setState({uploadProgress: event.loaded / event.total});
        //         }
        //     }
        // }
        xhr.send(data);
        this.setState({'spinnerLoading':true});
        //
        // fetch(url,{
        //     method:'post',
        //     body:data,
        //     mode: "FormData",
        //     headers:{"Content-Type": "multipart/FormData"}
        // }).then((resp)=>{
        //     return resp.json();
        // }).then((s)=>{
        //     console.warn(JSON.stringify(s));
        // }).catch((e)=>{
        //     console.warn('error',e);
        // })
    };
    renderRow(rowData, sectionID, rowID){
        let images    = rowData.map((node,i)=>{
            if(node === null ) return null;
            return this.renderImage(node);
        });
        return (
            <View style={styles.imageGrid}>
                {images}
            </View>
        );
    };
    onEndReached() {
        if (!this.state.noMore) {
            this.fetch();
        }
    };
    // _renderFooterSpinner() {
    //     if (!this.state.noMore) {
    //       return <ActivityIndicatorIOS style={styles.spinner} />;
    //     }
    //     return null;
    // };
    storeImages(data){
        const assets = data.edges;
        let newState: Object = {loadingMore:false};
        if(!data.page_info.has_next_page){
            newState.noMore = true;
        }
        if(assets.length > 0){
            newState.lastCursor = data.page_info.end_cursor;
            let images          = assets.map(function(asset){
                return {...asset.node.image,type:asset.node.type}
            });
            newState.images     = this.state.images.concat(images);
            newState.dataSource = this.state.dataSource.cloneWithRows(_.chunk(newState.images,4));
        }
        this.setState(newState);
    };
    logImageError(err){
        console.warn(err);
    };
    fetch(clear){
        if(!this.state.loadingMore){
            this.setState({loadingMore:true},()=>{this._fetch(clear);})
        }
    };
    _fetch(clear){
        if(clear){
            this.setState({
                images:[],
                isRefreshing:false,
                loadingMore:false,
                noMore:false,
                lastCursor:(null : ?string),
                loaded:0,
                bigImages:false,
                spinnerLoading:false
            },this.fetch);
        }
        let fetchParams = {
            first:25,
            groupTypes:'SavedPhotos',
            assetType:this.state.assetType
        };
        if (Platform.OS === "android") {
            delete fetchParams.groupTypes;
        };
        if(this.state.lastCursor){
            fetchParams.after = this.state.lastCursor;
        }
        CameraRoll.getPhotos(fetchParams).then((data)=>{
            this.storeImages(data);
        }).catch((e)=>{
            this.logImageError(e);
        });
    };
    componentDidMount(){
        this.fetch();
        MemberAction.getUploadAvatarKey();
        this.unsubscribe = MemberStore.listen(this.onChangeState.bind(this));
    };
    componentWillUnmount(){
        this.unsubscribe();
    };
    onChangeState(data){
        if(data.uploadKey!==undefined){
            this.setState({uploadKey:data.uploadKey});
        }
        if(data.memberObject!==undefined){
            let routes = this.props.navigator.getCurrentRoutes();
            DeviceEventEmitter.emit('changeMemberInfo',data.memberObject);
            this.props.navigator.pop();
        }
    };

    goback(){
        this.props.navigator.pop();
    };
    render(){
        return (
            <RootView
                loading={this.state.spinnerLoading}
                hasHeader={true}
                hasMargin={false}
                title={Di18n.tr('选择照片')}
                navigator={this.props.navigator} >
                <ListView
                    onEndReached={()=>this.onEndReached()}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    pageSize={24}
                    />
            </RootView>
        )
    }
};
const styles = StyleSheet.create({
    imageGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    image: {
        margin: 4,
    }
});
module.exports = SelectPhoto;
