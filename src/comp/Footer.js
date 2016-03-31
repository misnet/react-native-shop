var React = require('react-native');
var {TouchableOpacity,View, Text, StyleSheet,ToastAndroid} = React;
import AppStyles from '../utils/AppStyles';
import Di18n   from '../languages/Di18n';
import Storage from '../utils/Storage';
class Footer extends React.Component {

    static defaultProps = {
        hidden:false,
        navigator:null
    };
    clear(){
        Storage.del('member');
    };
    render(){
        return (
            this.props.hidden?null:(
            <View style={styles.footer}>
                <TouchableOpacity
                     activeOpacity={0.2} style={styles.menu}
                     onPress={()=>this.props.navigator.push({id:'home'})}>
                    <Text style={styles.menuText}>
                        <Text style={[styles.icon]}>&#xe600; </Text>
                        {Di18n.tr('首页')}
                    </Text>

                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.2}
                    style={styles.menu}
                    >
                    <Text style={styles.menuText}>
                        <Text style={[styles.icon]}>&#xe608; </Text>
                        {Di18n.tr('购物车')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.2}
                    style={styles.menu}
                    onPress={() => this.props.navigator.push({auth:true,title:Di18n.tr('会员中心'),id:'ucenter'})}
                    >
                    <Text style={styles.menuText}>
                        <Text style={[styles.icon]}>&#xe606; </Text>
                        {Di18n.tr('我的')}
                    </Text>
                </TouchableOpacity>
            </View>)
        )
    }
}
var styles = StyleSheet.create({
    footer:{
        "borderTopWidth":1,
        "borderColor":AppStyles.lineColor,
        "borderStyle":"solid",
        backgroundColor:'#f7f8f9',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    menu:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        paddingTop:AppStyles.getScale(1),
        paddingBottom:AppStyles.getScale(1),
        borderColor:AppStyles.lineColor,
        borderRightWidth:1,
        borderStyle:'solid',
        backgroundColor:'#efefef'
    },
    menuText:{

    },
    icon:{
        fontSize:AppStyles.getScale(2),
        fontFamily:'iconfont',
        paddingRight:20,
        width:40,
        borderColor:AppStyles.lineColor,
        borderRightWidth:1,
        borderStyle:'solid'
    }

});
module.exports = Footer;
