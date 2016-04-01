/**
 * Di18n
 * A lightweight  plugin for providing internationalization to javascript
 * @auth Donny
 * @version 0.1
 * @url
 */
import EnUSLang from './data/en_US';
import ZhCNLang from './data/zh_CN';
const Di18n = {
	data:{},
	setLanguage:function(lang){
		let langData = ZhCNLang;
		switch(lang){
			case 'en_US':
				langData =  EnUSLang;
				break;
			default:
		}
		this.setData(langData);
	},
	setData:function(langData){
		this.data = langData;
	},
	tr:function(index,placeholders){
		var translated;
		if(typeof this.data[index] !='undefined'){
			translated =  this.data[index];
		}else{
			translated = index;
		}
		return this._replacePlaceholder(translated,placeholders);
	},
	normaliseLanguageCode:function(lang) {
	    lang = lang.toLowerCase();
	    if (lang.length > 3) {
	      lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
	    }
	    lang = lang.replace('-','_');
	    return lang;
	},
	_replacePlaceholder:function(translated,placeholders){
		if(typeof placeholders=='object'){
			for(var k in placeholders){
				if(Array.isArray(translated)){
					translated = this._plural(k,placeholders[k],translated);
				}else if(typeof translated=='string'){
					translated = translated.replace(new RegExp('%'+k+'%', 'g'),placeholders[k]);
				}
			}
		}
		return translated;
	},
	_plural:function(key,kValue,texts){
		var i = (kValue<=1)?0:kValue-1;
		var t = '';
		if(typeof texts[i]!='undefined'){
			t = texts[i];
		}else if(kValue>1){
			t = texts[texts.length-1];
		}else{
			t = texts[0];
		}
		return t.replace(new RegExp('%'+key+'%', 'g'),kValue);
	}
};
module.exports= Di18n;
