import React from 'react-native';
import ModalBox from 'react-native-modalbox';
const {Text,View,StyleSheet,TextInput,TouchableOpacity} = React;
import Header from '../comp/Header';
import Footer from '../comp/Footer';
import AppStyles from '../utils/AppStyles';
import Spinner from 'react-native-loading-spinner-overlay';

class RootView extends React.Component{
    static defaultProps = {
        title:'',
        navigator:null,
        hasHeader:true,
        hasFooter:true,
        hasMargin:true,
        loading:false,
        modalChildren:null,
        modalStyle:{},
        modalIsOpen:false,
        modalOnClosed:null,
        headerRightButton:null,
        headerLeftButton:null
    };
    render(){
        //console.warn('closed',this.props.modalOnClosed);
        return (
            <View style={styles.container}>
                <Header
                    hidden={!this.props.hasHeader}
                    leftButton={this.props.headerLeftButton}
                    rightButton={this.props.headerRightButton}
                    title={this.props.title}
                    navigator={this.props.navigator}/>
                <View style={this.props.hasMargin?[styles.body,styles.hasMargin]:styles.body}>
                    {this.props.children}
                </View>
                <Footer hidden={!this.props.hasFooter} navigator={this.props.navigator}/>
                <ModalBox animationDuration={0} onClosed={this.props.modalOnClosed} style={this.props.modalStyle} ref="modal" isOpen={this.props.modalIsOpen} position="center" backdrop={true} >
                    {this.props.modalChildren}
                </ModalBox>
                <Spinner visible={this.props.loading} color="#808080" overlayColor="rgba(255,255,255,0.5)"/>
            </View>
        )
    }
}
var styles = StyleSheet.create({
    container:{
        flex:1,
        position:'relative',
        backgroundColor:'#ffffff'
    },
    body:{

        flex:1
    },
    hasMargin:{
        marginLeft:AppStyles.getScale(1),
        marginRight:AppStyles.getScale(1)
    }
});
module.exports = RootView;
