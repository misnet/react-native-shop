import React from 'react-native';
import Storage from '../utils/Storage';
import ToJSON from '../utils/ToJSON';

import Login from '../page/Login';
import Ucenter from '../page/Ucenter';
import Home from '../page/Home';
import Register from '../page/Register';
import Profile from '../page/ucenter/Profile';
import EditProfileItem from '../page/ucenter/EditProfileItem';
import SelectPhoto from '../page/ucenter/SelectPhoto';
//import ProductList from '../page/ProductList';

class PageLoader extends React.Component{
    constructor(props) {
        super(props);
        this.component = null;
    };
    static defaultProps = {
        page:'',
        navigator:null,
        route:null,
        auth:false
    };
    static propTypes = {
        auth:React.PropTypes.bool.isRequired
    };
    async requireAuth(){
        let member = await Storage.get('member');
        if(!member){
            this.props.navigator.replace({id:'login'});
        }
    };

    async componentWillMount(){
        if(this.props.auth){
            await this.requireAuth();
        }
    };
    loadComponent(){
        if(!this.component){
            switch(this.props.page){
                case 'login':
                    return Login;
                case 'ucenter':
                    return Ucenter;
                case 'profile':
                    return Profile;
                case 'editprofileitem':
                    return EditProfileItem;
                case 'register':
                    return Register;
                case 'selectphoto':
                    return SelectPhoto;
                case 'productlist':
                    return ProductList;
                case 'home':
                default:
                    return Home;
            }
        }else{
            return React.createFactory(this.component);
        }
    };
    render(){
        let Comp = this.loadComponent();
        return <Comp navigator={this.props.navigator} route={this.props.route} />
    };
}
module.exports = PageLoader;
