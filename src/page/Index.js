import React from 'react-native';
import PageLoader from '../comp/PageLoader';
import _ from 'lodash';
const {Alert,Platform,AppRegistry, Navigator, BackAndroid,StyleSheet,Text,View} = React;
var _navigator;
import Toast from 'react-native-root-toast';
import RootView from '../comp/RootView';
import Di18n from '../languages/Di18n';


if(Platform.OS === 'android'){
    BackAndroid.addEventListener('hardwareBackPress', (()=> {
        let routes = _navigator.getCurrentRoutes();
        if (routes.length>0) {
            _navigator.pop();
            if(routes.length==2){
                Toast.show(Di18n.tr('再按一次退出程序'),{
                    duration:Toast.durations.SHORT,
                    position:Toast.positions.CENTER,
                    animation:true
                });
            }else if(routes.length==1){
                BackAndroid.exitApp();
            }
            return true;
        }else{
            return false;
        }
    }));
}

export default class QingApp extends React.Component{
    componentDidMount(){

    }
    configureScenceAndroid(){
        return Navigator.SceneConfigs.FadeAndroid;
    };
    renderSceneAndroid(route, navigator){
        _navigator = navigator;
        let lastRoute = null;
        if(navigator.getCurrentRoutes().length>1){
            lastRoute = navigator.getCurrentRoutes()[navigator.getCurrentRoutes().length-2];
        }
        let mustAuth = false;

        switch(route.id){
            case 'profile':
            case 'ucenter':
                mustAuth = true;
                break;
            case 'home':
            default:
                mustAuth = false;
        }

        return <PageLoader page={route.id} navigator={navigator} route={route} auth={mustAuth}/>

    };
    render(){
        return (
                <Navigator
              debugOverlay={false}
              initialRoute={{ title: '首页', id:'home','auth':false}}
              configureScence={this.configureScenceAndroid}
              renderScene={this.renderSceneAndroid}
            />
        )
    }
}
