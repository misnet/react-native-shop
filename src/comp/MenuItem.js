import React from 'react-native';
const {TouchableHighlight,ListView,Image,Text,View,StyleSheet} = React;
import AppStyles from '../utils/AppStyles';
class MenuItem extends React.Component{
    constructor(props){
        super(props);
    };
    static defaultProps = {
        title:'',
        icon:'',
        id:'',
        style:null,
        rightComponent:null,
        onPress:false,
        titleStyle:null,
        hasRightArrow:true
    }
    render(){
        return (
            <TouchableHighlight underlayColor={AppStyles.lineColor} activeOpacity={0.5} style={[styles.menuItem,this.props.style]} onPress={typeof this.props.onPress=='function'?this.props.onPress.bind(null,this.props):null}>
                <View style={styles.menuView}>
                    <Text style={this.props.titleStyle}>
                        {this.props.icon?<Text style={[styles.menuIcon]}>{this.props.icon}</Text>:null}
                         {this.props.title}
                    </Text>
                    {this.props.rightComponent?this.props.rightComponent:(typeof this.props.onPress=='function' && this.props.hasRightArrow?<Text style={[styles.rightArrow]}>&#xe60f;</Text>:null)}
                </View>
            </TouchableHighlight>
        );
    }
}

var styles = StyleSheet.create({
    rightArrow:{
        fontSize:AppStyles.getScale(1.5),
        fontFamily:'iconfont',
        justifyContent:'center',
        color:AppStyles.textColor
    },
    menuIcon:{
        fontSize:AppStyles.getScale(2),
        fontFamily:'iconfont'
    },
    menuItem:{
        paddingVertical:AppStyles.getScale(1),
        paddingLeft:AppStyles.getScale(1),
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:AppStyles.lineColor
    },
    menuView:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    menuList:{
        marginLeft:AppStyles.getScale(1),
        marginRight:AppStyles.getScale(1)
    }
});
module.exports = MenuItem;
