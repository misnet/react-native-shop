var React = require('react-native');
var {TouchableOpacity,View, Text, StyleSheet,ToastAndroid} = React;
import AppStyles from '../utils/AppStyles';

class Header extends React.Component {

    static defaultProps = {
        title:'',
        hidden:false,
        navigator:null,
        rightButton:null,
        leftButton:null
    };
    goback(){
        if(this.props.navigator.getCurrentRoutes().length>1){
            this.props.navigator.pop();
        }
    };
    render(){
        return (
            this.props.hidden?null:(
            <View style={styles.header}>
                <View style={styles.leftView}>
                {this.props.leftButton?this.props.leftButton:(
                    <TouchableOpacity style={styles.leftViewButton} onPress={this.goback.bind(this)}>
                        {(this.props.navigator.getCurrentRoutes().length>1)?<Text  style={styles.leftViewText} >&#xe624;</Text>:null}
                    </TouchableOpacity>
                )}
                </View>

                <View style={styles.headerTextView}>
                    <Text style={styles.headerText}>{this.props.title}</Text>
                </View>
                <View style={styles.rightView}>
                    {this.props.rightButton?(this.props.rightButton):null}
                </View>
            </View>)
        )
    }
}
var styles = StyleSheet.create({
    header:{
        "borderBottomWidth":1,
        "borderColor":AppStyles.lineColor,
        "borderStyle":"solid",
        backgroundColor:'#f7f8f9',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    leftView:{
        width:AppStyles.getScale(4),
        height:AppStyles.getScale(4),
        alignItems:'center',
        justifyContent:'center',
    },
    rightView:{
        width:AppStyles.getScale(4)
    },
    headerTextView:{

    },
    leftViewText:{
        color:AppStyles.lightColor,
        fontFamily:'iconfont',
        fontSize:AppStyles.getScale(2)
    },
    headerText:{
        textAlign:'center',
        color:AppStyles.textColor
    }
});
module.exports = Header;
