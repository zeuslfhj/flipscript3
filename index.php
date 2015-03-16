<?php
require_once "jssdk.php";
$jssdk = new JSSDK("wxcb4a439681fb3fab", "57540a617ff96536d1a366c9b532f577");
$signPackage = $jssdk->GetSignPackage();
?>
<!DOCTYPE html>
<!-- saved from url=(0043)http://shileng2.flipscript.com.cn/index.php -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui">
    <meta name="MobileOptimized" content="320">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="yes" name="apple-touch-fullscreen">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="telephone=no" name="format-detection">
    <meta name="author" content="D-boy">
    <meta http-equiv="Content-Script-Type" content="text/javascript">
    <title>《十万个冷笑话》手游</title>
    <link type="text/css" rel="stylesheet" href="./index.css">
<style type="text/css"></style><style id="style-1-cropbar-clipper">/* Copyright 2014 Evernote Corporation. All rights reserved. */
.en-markup-crop-options {
    top: 18px !important;
    left: 50% !important;
    margin-left: -100px !important;
    width: 200px !important;
    border: 2px rgba(255,255,255,.38) solid !important;
    border-radius: 4px !important;
}

.en-markup-crop-options div div:first-of-type {
    margin-left: 0px !important;
}
</style></head>
<body>
<div id="wx_logo" style="width:0px;height:0px;overflow:hidden;"><img src="./icon.jpg"></div>
<div id="orientation_cover" class="orientation_cover_container" style="display: none;">
    <div class="orientation_cover"><img src="./orientation_cover.png" alt=""></div>
</div>
<div id="tutorial_cover" class="tutorial_cover">
  <div class="phone"><img src="./phone.png" alt=""></div>
  <div class="finger"><img src="./finger.png" alt=""></div>
</div>
<div id="music_icon" class="music_icon play">
</div>
<div id="main-container" class="wrapper">
    <div class="loading_wrapper">
        <div class="loading">
            <div class="loading_icon_container">
              <div class="loading_icon_0"><img src="imgs/loading_icon_0.png" alt=""></div>
              <div class="loading_icon_1"><img src="imgs/loading_icon_1.png" alt=""></div>
            </div>
            <div id="load_line" class="load-line"></div>
        </div>
    </div>
</div>
  <div id="templates" class="templates" style="display:none">
   <div id="index">
    <div class="index_template">
     <header class="index_title">
      <div class="index_title_img">
       <img src="imgs/page1_title.png" alt="" />
      </div>
      <div id="index_title_btn" class="index_title_btn">
       <img src="imgs/page1_btn.png" alt="" />
      </div>
     </header>
     <section class="index_imgs">
      <div class="index_img_bl">
       <img src="imgs/page1_img1.png" alt="" />

      </div>
     <div class="index_img_bl2">
           <img src="imgs/page1_img1_1.png" alt="" />
     </div>  
      <div class="index_img_br">
       <img src="imgs/page1_img2.png" alt="" />
      </div>
      <div class="index_logo">
       <img src="imgs/page1_logo.png" alt="" />
      </div>
     </section>
    </div>
   </div>
   <div id="start">
    <div class="game_template">
        <div id="score"><img src="imgs/s0.png"><img src="imgs/s0.png"><img src="imgs/s0.png"></div>
        <div id="knife">
            <img src="imgs/knife.png" alt="" />
        </div>
        <!-- 倒计时-->
        <div id="number">
            <img src="" alt="">
        </div>
        <!-- 倒计时提示-->
        <div id="count-notice">
            <img src="imgs/count-notice.png" alt="">
        </div>
        <!-- 咣-->
        <div id="guang">
            <img src="imgs/guang.png" alt="">
        </div>
        <!-- 手-->
        <div id="hand1" class="hand">
            <img src="imgs/hand1ready.png" alt="">
        </div>
        <!-- 手-->
        <div id="hand2" class="hand">
            <img src="imgs/hand2ready.png" alt="">
        </div>                 
        <!-- 提示-->
        <div id="catchNotice">
            <img src="">
        </div>
        <!-- 接刀失败的血-->
        <div id="blood"><img src="imgs/blood.png"></div>       
        <!-- 扑街-->
        <div id="down"><img src="imgs/down.png"></div>                  
    </div>
   </div>
   <div id="end">
    <div class="end_high_template end_template">
     <header class="end_title">
      <div class="end_title_bg">
       <img src="imgs/end_title.png" alt="" />
      </div>
      <div class="end_title_numbers">
       <div class="end_title_number_wrapper" id="endScore">  
        <img src="imgs/s0.png"><img src="imgs/s0.png"><img src="imgs/s0.png">
       </div>
      </div>
     </header>
     <article class="end_content">
      <div class="content_text_img">
       <img src="imgs/end_content1.png" alt="" />
      </div>
      <div class="content_text">
       
      </div>
     </article>
     <article class="end_content2_wrapper">
      <p class="end_content2_texts"><img src="imgs/endbgtext.png"></p>
      <p class="end_content2_follow"><img src="imgs/end_share_btn.png" alt="" /></p>
     </article>
     <article class="end_buttons">
      <div class="end_buttons_left">
       <img src="imgs/end_btn1.png" alt="" />
      </div>
      <div class="end_buttons_right">
       <img src="imgs/end_btn2.png" alt="" />
      </div>
     </article>
     <footer class="end_footer">
      <div class="end_footer_bg">
       <img src="imgs/end_bottom.png" alt="" />
      </div>
      <div class="end_footer_official_link">
       <img src="imgs/end_official_link.png" alt="" />
      </div>
     </footer>
     <div class="share_cover_container">
      <div class="share_cover">
       <img src="imgs/share_cover.png" alt="" />
      </div>
      <div class="share_finger">
       <img src="imgs/share_finger.png" alt="" />
      </div>
     </div>
    </div>
   </div>
   <div id="download">
    <div class="download_template">
      <div class="download_button download_button_ios"></div>
      <div class="download_button download_button_and"></div>
      <div id="download_cover" class="download_cover"></div>
    </div>
   </div>
  </div>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script async="" src="./analytics.js"></script><script src="./zepto.min.js"></script>
<script src="./index.js"></script>

<script>
  /*
   * 注意：
   * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
   * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
   * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
   *
   * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
   * 邮箱地址：weixin-open@qq.com
   * 邮件主题：【微信JS-SDK反馈】具体问题
   * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
   */
  wx.config({
    debug: false,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
      "onMenuShareTimeline",
      "onMenuShareAppMessage"
    ]
  });

  window.changeShareContent = function( shareContent ){
    wx.onMenuShareTimeline({
        title: shareContent, // 分享标题
        link: 'http://shileng3.flipscript.com.cn/src/index.php', // 分享链接
        imgUrl: 'http://shileng3.flipscript.com.cn/src/imgs/share_icon.jpg', // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            ga('send','event','share','success');
            ga('newTracker.send','event','share','success');

        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareAppMessage({
        title: '守操如玉，不如一撸到底', // 分享标题
        desc: shareContent, // 分享描述
        link: 'http://shileng3.flipscript.com.cn/src/index.php', // 分享链接
        imgUrl: 'http://shileng3.flipscript.com.cn/src/imgs/share_icon.jpg', // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
  };

  window.defaultShareContent = "下限已毁，手已烂…挨虐我不行，你行你上啊！";
  window.lowShareContent = "除了按手机、挖鼻屎，我的手还能用来接白刃！你能么？";
  window.middleShareContent = "你才高贵冷艳！我无下限指数可是超过了全国75％的人呐！";
  window.highShareContent = "呵呵呵，愚蠢的地球人，敢来挑战我的100%无下限么？";

  wx.ready(function(){
    window.changeShareContent( window.defaultShareContent );
  });



</script>

<script>  
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');  

ga('create', 'UA-59727777-3', 'auto');  
ga('create', 'UA-xxxxxxxx-x', 'auto', {'name': 'newTracker'}); 
 
ga('send', 'pageview');  
ga('newTracker.send', 'pageview');
</script>

</body></html>