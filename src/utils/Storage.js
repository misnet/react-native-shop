import {AsyncStorage} from 'react-native';
import ToJSON from './ToJSON';
const Storage = {
    /**
     * 保存数据
     */
     async set(name,dataObject){
         try{
             await AsyncStorage.setItem(name,ToJSON.toJSON(dataObject));
         }catch(e){
             
         }
    },
    /**
     *
     */
     async get(name){
        try{
            const d = await AsyncStorage.getItem(name);
            if(d){
                return ToJSON.evalJSON(d);
                //return d;
            }else{
                return null;
            }
        }catch(e){
            return null;
        }
    },
    async  clear(){
        try{
            await AysncStorage.clear();
        }catch(e){

        }
    },
    async  del(name){
        try{
            await AsyncStorage.removeItem(name);
        }catch(e){
        }

    }
};
module.exports = Storage;
