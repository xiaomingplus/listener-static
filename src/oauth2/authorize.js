import {getQuery} from '../utils';
import {time} from 'general-js-utils';
import {request} from '../utils';
import store from 'store';
import 'notie/src/notie.scss';
import notie from 'notie';
(async ()=>{
  var channel_id = getQuery("channel_id");
  if(!channel_id){
    notie.alert(3,'params channel_id is required!',3);
    return;
  }
  var redirect_uri = getQuery("redirect_uri");
  if(!redirect_uri){
    notie.alert(3,'params redirect_uri is required!',3);
    return;
  }
  var response_type = getQuery("response_type");
  if(!response_type){
    notie.alert(3,"params response_type is required!",3);
    return;
  }else if(response_type !== 'code'){
    notie.alert(3,"params response_type must be 'code'!",3);
    return;
  }
  var scope = getQuery("scope");
  if(!scope){
    notie.alert(3,"params scope is required!",3);
    return;
  }
  const expire = store.get("expire");

  if(expire){
    if(parseInt(expire)<=time()){
      store.clear();
      location.href = "/signin.html";
    }else{
      var scopes = scope.split(',');
      if(scopes.length===1 && scopes[0]==='user_id_read'){
        //todo跳转
        const postData =
          {
            channel_id,
            redirect_uri,
            response_type,
            scope
          };
          const state = getQuery('state');
          if(state){
            postData.state = state;
          }
        try{
        var authR = await request({server:'oauth2',path:"oauth2/decision"},'post',postData);
        }catch(e){

          if(e.id==='unauthorized'){
            store.clear();
            location.href = "/signin.html";
            return;
          }
          notie.alert(3,e.message,3);
          return;
        }
        location.href =authR.redirect_uri;
      }else{
        //todo 展示给用户授权页面
      }
    }

  }else{
    location.href = "/signin.html"
  }


})()
