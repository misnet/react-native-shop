import React from 'react-native';
const {ListView,StyleSheet,Text,View,Image,TouchableOpacity} = React;
import Header from '../comp/Header';
import RootView from '../comp/RootView';
import ProductAction from '../action/Product';
import ProductStore from  '../store/Product';
import QING_CONFIG from '../Config';
import CommonUtils from '../utils/Common';
import AppStyles from '../utils/AppStyles';
import Di18n from '../languages/Di18n';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadingMore:false,
            noMore:false,
            spinnerLoading:false,
            product:[],
            pagination:{
                page:1,
                limit:10,
                total:0
            },
            dataSource:new ListView.DataSource({rowHasChanged: this._rowHasChanged})
        }
        //分2列
        this.groupNum  = 2;
        this.totalPage = 0;
        this.renderRow = this.renderRow.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
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
    componentDidMount(){
        this.fetch(this.state.pagination.page);
        this.unsubscribe = ProductStore.listen(this.onChanged.bind(this));
    };
    componentWillUnmount(){
        this.unsubscribe();
    };
    onChanged(data){
        //console.warn(JSON.stringify(data));
        if(data.pagination!==undefined){
            this.setState({pagination:data.pagination});
        }
        if(data.product!==undefined){
            //加入数组中
            let newState: Object = {loadingMore:false};
            this.totalPage = Math.ceil(data.pagination.total / data.pagination.limit);
            if(data.pagination.page>=this.totalPage){
                newState.noMore = true;
            }
            if(data.product.length > 0){
                newState.product     = this.state.product.concat(data.product);
                newState.dataSource = this.state.dataSource.cloneWithRows(_.chunk(newState.product,this.groupNum));
            }
            //console.warn(JSON.stringify(newState.product));
            this.setState(newState);
        }
    };
    onEndReached(){
        if (!this.state.noMore && !this.state.loadingMore) {
            let page = Math.min(this.state.pagination.page+1,this.totalPage);
            this.fetch(page);
        }
    };
    fetch(page){
        this.state.loadingMore = true;
        ProductAction.getList(page,this.state.pagination.limit);
    };
    //生成产品块
    renderProduct(product){
        return (
            <View style={styles.productView} key={'p'+product.id}>
                <TouchableOpacity>
                <Image style={styles.productImg} source={{uri:CommonUtils.thumb(product['imgurl'],15,20,true)}}/>
                <Text style={styles.productTitle}>{product.productName}</Text>
                <Text style={styles.price}><Text style={styles.rmb}>&#xe61d;</Text>{product.price}</Text>
                </TouchableOpacity>
            </View>
        )
    };
    renderRow(rowData, sectionID, rowID){
        let images    = rowData.map((product,i)=>{
            if(product === null ) return null;
            return this.renderProduct(product);
        });
        return (
            <View style={styles.imageGrid}>
                {images}
            </View>
        );
    };
    renderFooter(){
        if(this.state.noMore){
            return (
                <View style={styles.loadedView}><Text>{Di18n.tr('共探索到%name%个宝贝',{name:this.state.pagination.total})}</Text></View>
            )
        }else{
            return (
                <View style={styles.loading}><Text>{Di18n.tr('努力加载中...')}</Text></View>
            )
        }
    };
    render(){
        return (

            <RootView
                navigator={this.props.navigator}
                title={Di18n.tr('首页')}
                hasHeader={true}
                hasMargin={false}
                hasFooter={true}
                >
                <ListView
                    renderFooter={this.renderFooter}
                    onEndReached={this.onEndReached}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    pageSize={this.state.pagination.limit}
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
    productView:{
        marginBottom:AppStyles.getScale(1),
        justifyContent:'center',
        alignItems:'center',
        padding:AppStyles.getScale(0.5)
    },
    productImg: {
        width: AppStyles.getScale(15),
        height: AppStyles.getScale(20),
        marginBottom:AppStyles.getScale(0.5)
    },
    productTitle:{
        alignSelf:'flex-start',
        lineHeight:AppStyles.getScale(2)
    },
    price:{
        alignSelf:'flex-start',
        lineHeight:AppStyles.getScale(2),
        color:AppStyles.lightColor
    },
    rmb:{
        fontFamily:'iconfont'
    },
    loadedView:{
        alignSelf:'center',
        padding:AppStyles.getScale(2)
    },
    loading:{
        alignSelf:'center',
        padding:AppStyles.getScale(2)
    }
});
module.exports=Home;
