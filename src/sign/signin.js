import './signin.scss';
import 'notie/src/notie.scss';
import notie from 'notie';
import store from 'store';
import {countDown,checkTel,checkValid,showError,hideError,request} from '../utils';
document.querySelector(".container").innerHTML = `
<div class="signin-form">
<div class="field">
 <input type="tel" maxlength="11" id="tel" tabindex="1" autofocus required placeholder="请输入手机号码">
 <button class="button valid disabled" tabindex="2" id="validButton">
 <span class="valid-button-text">获取验证码</span>
 <span class="spinner validLoading none">
   <div class="bounce1"></div>
   <div class="bounce2"></div>
   <div class="bounce3"></div>
 </span>
 </button>
</div>
<div class="field">
 <input type="text" id="valid" maxlength="6" tabindex="3" placeholder="请输入6位验证码">
</div>
<button class="button fluid big-button disabled" tabindex="4" id="submitButton">
<span class="submit-button-text">登录</span>
<span class="spinner submitLoading none">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</span>
</button>
</div>`;
const telInput = document.querySelector("#tel");
const validButton = document.querySelector("#validButton");
const submitButton = document.querySelector("#submitButton");
const validInput = document.querySelector("#valid");
const validLoading = document.querySelector(".validLoading");
const submitLoading = document.querySelector(".submitLoading");
const validButtonText = document.querySelector(".valid-button-text");
const submitButtonText = document.querySelector(".submit-button-text");
let validSending=false,signinSending = false;
var sendValid =async function(){
  let telStatus = checkTel(telInput.value);
  if(!telStatus){
    notie.alert(3, '手机号码不符合规范,请重新填写', 3);
    showError(telInput);
    return;
  }else{
    hideError(telInput);
  }
  validSending = true;
  validButton.classList.add("disabled");
  validButtonText.innerHTML = "获取中";
  validLoading.classList.remove("none");
  try{
  var r =   await request(`tel/${telInput.value}/code`,'post');
  }catch(e){
    notie.alert(3, e.id, 3);
    validLoading.classList.add("none");
    validSending = false;
    validButton.classList.remove("disabled");
    validButtonText.innerHTML = "重新发送";
    return;
  }
    validLoading.classList.add("none");
    validInput.focus();
    countDown(30,s=>{
      validButtonText.innerHTML = `${s}s后重新发送`;
    },e=>{
      validSending = false;
      validButton.classList.remove("disabled");
      validButtonText.innerHTML = "重新发送";
    })

};
var login = async function(){
  let telStatus = checkTel(telInput.value);
  if(!telStatus){
    notie.alert(3, '手机号码不符合规范,请重新填写', 3);
    showError(telInput);
    return;
  }else{
    hideError(telInput);
  }
  let validStatus = checkValid(validInput.value);
  if(!validStatus){
    notie.alert(3,'验证码必须是6位数字',3);
    showError(validInput);
    return;
  }else{
    hideError(validInput);
  }
  signinSending = true;
  submitButton.classList.add("disabled");
  submitButtonText.innerHTML = "登录中";
  submitLoading.classList.remove("none");
  try{
  var sessionR = await request(`users/${telInput.value}/sessions`,'post',{
      type:"tel",
      token:validInput.value
    });
  }catch(e){
    if(e.id==='not_found'){
      submitButtonText.innerHTML = "首次登录,注册中";
      try{
        var userR = await request(`users`,'post',{
          type:"tel",
          token:validInput.value,
          account:telInput.value
        });
      }catch(ee){
        notie.alert(3, ee.message, 3);
        signinSending = false;
        submitButton.classList.remove("disabled");
        submitButtonText.innerHTML = "登录";
        submitLoading.classList.add("none");
        return;
      }
      signinSending = true;
      submitButton.classList.add("disabled");
      submitButtonText.innerHTML = "登录中";
      submitLoading.classList.remove("none");
      try{
      var sessionR =  await request(`users/${telInput.value}/sessions`,'post',{
          type:"tel",
          token:userR.token
        });
      }catch(eee){
        notie.alert(3, eee.message, 3);
        signinSending = false;
        submitButton.classList.remove("disabled");
        submitButtonText.innerHTML = "登录";
        submitLoading.classList.add("none");
        return;
      }
    }else{
      notie.alert(3, e.message, 3);
      signinSending = false;
      submitButton.classList.remove("disabled");
      submitButtonText.innerHTML = "登录";
      submitLoading.classList.add("none");
      return;
    }
  }

store.set('token',sessionR.token);
store.set('expire',sessionR.expire);
store.set('userId',sessionR.user.id);
      signinSending = false;
      submitButtonText.innerHTML = "登录成功,跳转中";
      location.href = document.referrer?document.referrer:"/";

};
telInput.addEventListener("input",function(){
   if(telInput.value==="" ){
       submitButton.classList.add('disabled');
     validButton.classList.add("disabled");

    }else{
      if(validInput.value!==""){
        submitButton.classList.remove("disabled");
      }
      if(validSending === false){
        validButton.classList.remove("disabled");
      }
  }
});
validInput.addEventListener("input",function(){
  if(validInput.value==="" ){
    submitButton.classList.add("disabled");
  }else{
    if(telInput.value!==""){
    submitButton.classList.remove("disabled")
  }
  }
});

telInput.addEventListener('keypress', function (e) {
    const key = e.which || e.keyCode;
    if (key === 13) {
      sendValid();
      return;
    }
});


validButton.addEventListener("click",function(){
sendValid();
});

submitButton.addEventListener("click",function(){
login();
});
validInput.addEventListener('keypress', function (e) {
    const key = e.which || e.keyCode;
    if (key === 13) {
      login();
      return;
    }
});
