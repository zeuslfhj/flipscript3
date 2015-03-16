function SoundManager(soundsMap) {
	this.soundsMap = soundsMap;
	this._singleAudio = false;
	this.enabled = true;
}

SoundManager.prototype = {
	/**
	 * play background music
	 * @return {[type]} [description]
	 */
	playBGMusic: function() {
		if (this.soundsMap["bg"]) {
			this.play("bg", true);
		};
	},
	playAsSingleAudio: function(audio) {
		this.singleAudio = audio;
		this._singleAudio = true;
	},
	/**
	 * play the sound only once
	 * @param  {[type]} soundKey [description]
	 * @return {[type]}          [description]
	 */
	playSound: function(soundKey) {
		this.play(soundKey, false);
	},
	enable: function() {
		this.enabled = true;
		this.playBGMusic();
	},
	disable: function() {
		this.enabled = false;

		for (var i in this.soundsMap) {
			this.soundsMap[i].pause();
		}

		if (this.singleAudio) {
			this.singleAudio.pause();
		};
	},
	toggle: function() {
		if (this.enabled) {
			this.disable();
		} else {
			this.enable();
		}
	},
	/**
	 * play a special sound by its name
	 * @param  {[type]}  key    [description]
	 * @param  {Boolean} isLoop [description]
	 * @return {[type]}         [description]
	 */
	play: function(key, isLoop) {
		if (!this.enabled) {
			return;
		};

		var audio = this.soundsMap[key];

		if (!audio) {
			return;
		}

		if (this._singleAudio && key != "bg") {
			this.singleAudio.src = audio.src;
			this.singleAudio.play();
		} else {
			audio.loop = !!isLoop;
			audio.pause();

			try {
				if (!isNaN(audio.duration)) {
					audio.currentTime = 0;
				}
			} catch (e) {}

			try {
				audio.play();
			} catch (e) {}
		};
	}
};

/**
 * Manager the page display or change
 * @param {[type]} templateStrMap [description]
 * @param {[type]} $container     [description]
 */
function PageManager(templateStrMap, $container) {
	this.templateStrMap = templateStrMap;
	this.$container = $container;
	this.eventMaps = []
	this.listeners = {};
}

PageManager.prototype = {
	/**
	 * set the listener to special event
	 * @param {[type]} evtName  [description]
	 * @param {[type]} listener [description]
	 */
	setListener: function(evtName, listener) {
		if (evtName && typeof listener == "function") {
			this.listeners[evtName] = listener;
		};
	},
	removeListener: function(evtName) {
		if (this.listeners[evtName]) {
			delete this.listeners[evtName];
		};
	},
	/**
	 * add event map to manager
	 * @param {[type]} eventMap [description]
	 */
	addEventMap: function(eventMap) {
		if (!eventMap) {
			return;
		};
		this.eventMaps.push(eventMap);
	},
	clearEventMap: function() {
		this.eventMaps.length = 0;
	},
	/**
	 * display the correspond page of the name  这个方法可以缓存nextpage
	 * and prepage the next page after the display
	 * @param  {[type]} indexPageName [description]
	 * @param  {[type]} nextPageName  [description]
	 * @return {[type]}               [description]
	 */
	show: function(indexPageName, nextPageName) {
		if (!indexPageName) {
			console.error("show an empty page isn't allowed");
			return;
		};

		var $fragment = this.createFragment(indexPageName);

		if (!$fragment) {
			console.error("page string is null, please check the name " + indexPageName);
			return;
		};

		this.$container.empty().append($fragment);
		$fragment.addClass("current");
		this.$currentPage = $fragment;
		if (nextPageName) {
			this.prepareNextPage(nextPageName);
		};

		if (this.listeners["pageDisplay"]) {
			this.listeners["pageDisplay"](this.$currentPage.attr("pageName"), this.$currentPage);
		};
	},
	/**
	 * show page with animation
	 * @param  {[type]} pageName corresponding page name
	 * @return {[type]}          [description]
	 */
	showPage: function(pageName) {
		var $fragment = this.createFragment(pageName);

		if (!$fragment) {
			console.error("page string is null, please check the name " + pageName);
			return;
		};

		var _this = this;
		$fragment.addClass("next");
		this.$container.append($fragment);

		$fragment.one("webkitTransitionEnd", function() {
			if (_this.listeners["pageDisplay"]) {
				_this.listeners["pageDisplay"](_this.$currentPage.attr("pageName"), _this.$currentPage);
			};
		});

		setTimeout(function() {
			$fragment.removeClass("next").addClass("current");

			if (_this.$prePage) {
				_this.$prePage.remove();
				_this.$prePage = null;
			};

			if (_this.$currentPage) {
				_this.$currentPage.addClass("previous").removeClass("current");
				_this.$prePage = _this.$currentPage;
			};

			_this.$currentPage = $fragment;
		}, 30);
	},
	/**
	 * prepare the next page in the dom, but will not display it
	 * @param  {[type]} nextPageName [description]
	 * @return {[type]}              [description]
	 */
	prepareNextPage: function(nextPageName) {
		if (!nextPageName) {
			console.error("can't prepare an empty page for nexst");
			return;
		};

		var $fragment = this.createFragment(nextPageName);

		if (!$fragment) {
			console.error("can't create page with name " + nextPageName);
			return;
		};

		$fragment.addClass("next");

		if (this.$nextPage) {
			this.$nextPage.remove();
			this.$nextPage = null;
		};

		this.$container.append($fragment);
		this.$nextPage = $fragment;
	},
	/**
	 * move the prepared page from position of next to the current
	 * @param  {[type]} nextPageName [description]
	 * @return {[type]}              [description]
	 */
	showNextPage: function(nextPageName, afterPageAnimEnded) {
		console.log("next page name:" + nextPageName);
		if (!this.$nextPage) {
			console.log("next page is not existed");
			return;
		};

		var _this = this;

		this.$nextPage.one("webkitTransitionEnd", function() {
			if (_this.listeners["pageDisplay"]) {
				_this.listeners["pageDisplay"](_this.$currentPage.attr("pageName"), _this.$currentPage);
			};

			if (nextPageName) {
				_this.prepareNextPage(nextPageName);
			};

			if (afterPageAnimEnded) {
				afterPageAnimEnded();
			};
		});

		// clear the previous page
		if (this.$prePage) {
			this.$prePage.remove();
			this.$prePage = null;
		};

		this.$nextPage.addClass("current").removeClass("next");
		this.$currentPage.addClass("previous").removeClass("current");
		this.$prePage = this.$currentPage;
		this.$currentPage = this.$nextPage;
		this.$nextPage = null;
	},
	/**
	 * create the fragment with page name
	 * @param  {[type]} pageName [description]
	 * @return {[type]}          [description]
	 */
	createFragment: function(pageName) {
		var pageStr = this.templateStrMap[pageName];

		if (!pageStr) {
			return;
		};

		var $fragment = $("<div>").addClass("page").html(pageStr).attr("pageName", pageName);

		// bind event to the elements
		if (this.eventMaps.length > 0) {
			for (var i = 0; i < this.eventMaps.length; i++) {
				var eventMap = this.eventMaps[i];

				if (eventMap && eventMap[pageName]) {
					var events = eventMap[pageName];

					for (var i = 0; i < events.length; i++) {
						var evt = events[i];
						var queryStr = evt.query;

						$fragment.find(queryStr).on(evt.evt, evt.func);
					};
				};
			};
		};

		return $fragment;
	}
};

var GameManager = function(callbacks, soundManager) {
	this.hits = 0;
	this.callbacks = callbacks;
	this.speed = 1;
	this.soundManager = soundManager;
};

GameManager.prototype = {
	restart: function() {
		this.score = 0;
		this.speed = 1;
		this.waitTime = 1000;
		this.end = false;

		this.whole = 1; //设置最长运动时间

		this.count = 1000 / 50; //20ms		
		this.firstPlay = false;

		var innerHeight = window.innerHeight;

		if (innerHeight < 670 && innerHeight > 570) {

			this.per = 0.74;
		} else if (innerHeight < 570 && innerHeight > 488) {

			this.per = 0.64;

		} else if (innerHeight <= 488) {

			this.per = 0.50;

		} else {

			this.per = 0.77;

		}

		this.run();


	},
	reset: function() {

		this.end = false;


		$('#knife').removeClass('knife-animation' + (this.speed)).removeClass('stop');

		//debugger

		$('#hand1').removeClass('catched').hide().find('img').attr('src', 'imgs/hand1ready.png');

		$('#hand2').removeClass('catched').hide().find('img').attr('src', 'imgs/hand2ready.png');

		$('#hand2').show();
		$('#hand1').show();

		$('#catchNotice').hide();

		$('#blood').hide();

		$('#down').hide();
		$('#guang').hide();
		$('#number').hide();

	},
	//随机生成等待时间
	genWaitTime: function() {
		var randomRoot = Math.random().toFixed(2);

		this.waitTime = 1000 + 2000 * randomRoot;
	},
	//开始接刀
	run: function() {

		console.log('run');
		//this.genWaitTime();

		var _self = this;
		this.reset();

		this.end = true;
		this.showScore();

		//		debugger


		if (!this.firstPlay) {

			$('#count-notice').css('display', 'block');
			this.countDown();
			this.firstPlay = true;

			setTimeout(function() {

				_self.showPending();
				_self.throwKnife();
				_self.end = false;
			}, 3000);

		} else {


			setTimeout(function() {

				_self.showPending();
				_self.throwKnife();
				_self.end = false;
			}, 1000);

		}
	},
	//倒计时
	countDown: function() {

		var imgs = ['imgs/count3.png', 'imgs/count2.png', 'imgs/count1.png'];

		var i = 0;
		var _self = this;
		//debugger
		setTimeout(function() {

			$('#number').css('display', 'block').find('img').attr('src', imgs[i]);

			i += 1;

			_self.soundManager.playSound('countdown');

			setTimeout(function() {

				$('#number').find('img').attr('src', imgs[i]);

				i += 1;

				_self.soundManager.playSound('countdown');

				setTimeout(function() {

					$('#number').find('img').attr('src', imgs[i]);

					_self.soundManager.playSound('countdown');

					//debugger
					setTimeout(function() {

						$('#number').hide();
						$('#count-notice').css('display', 'none');

					}, 800)

				}, 1000);

			}, 1000);

		}, 100)

	},
	getRandom: function(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		return (Min + Math.round(Rand * Range));
	},
	//展示当前分数
	showScore: function() {
		console.log('show score');

		var images = ['imgs/s0.png', 'imgs/s1.png', 'imgs/s2.png', 'imgs/s3.png', 'imgs/s4.png', 'imgs/s5.png', 'imgs/s6.png', 'imgs/s7.png', 'imgs/s8.png', 'imgs/s9.png']

		var bai, shi, ge;
		if (this.score < 100) {

			bai = 0;
			shi = parseInt(this.score / 10);
			ge = this.score % 10;
		} else {
			bai = 1;
			shi = parseInt((this.score - 100) / 10);
			ge = this.score % 10;
		}

		$('#score').find('img').eq(0).attr('src', images[bai]);
		$('#score').find('img').eq(1).attr('src', images[shi]);
		$('#score').find('img').eq(2).attr('src', images[ge]);
	},
	//展示那个等待画面
	showPending: function() {
		console.log('show pending');
		$('#pendingMask').show();

		setTimeout(function() {

			$('#pendingMask').hide();

		}, this.waitTime);

	},
	doCatch: function() {

		if (this.end) {
			return
		}

		console.log('catch!!!');
		//接刀，判断刀的位置

		$('#hand1').css('display', 'none').addClass('catched').find('img').attr('src', 'imgs/hand1catch.png');

		$('#hand2').css('display', 'none').addClass('catched').find('img').attr('src', 'imgs/hand2catch.png');

		$('#hand1').css('display', 'block');
		$('#hand2').css('display', 'block');

		if ((this.position * this.count) < (this.whole * 1000 / this.speed) && (this.position * this.count) >= (this.whole * 1000 / this.speed) * this.per) {

			clearInterval(this.timer);

			this.success();

		} else if ((this.position * this.count) < (this.whole * 1000 / this.speed) * this.per) {

			this.end = true;

		} else {
			this.fail(); //没接到
		}

	},
	showGuang: function() {
		$('#guang').show();
		this.soundManager.playSound('kuang');
		setTimeout(function() {

			$('#guang').hide();

		}, 300)

	},
	throwKnife: function() {

		this.showGuang();
		console.log('throw!!!');


		this.position = 0;

		var _self = this;


		setTimeout(function() {

			$('#knife').addClass('knife-animation' + _self.speed);

			//$('#knife').css('animation-duration',_self.whole/_self.speed+'s')
			//$('#knife').css('-webkit-animation-duration',_self.whole/_self.speed+'s')
			_self.timer = setInterval(function() {
				_self.position += 1;

				//console.log(_self.position)

				if ((_self.position * _self.count) > (_self.whole * 1000 / _self.speed)) {

					_self.fail();

				}
				//位移计时器
			}, _self.count);


		}, 10)



	},
	//接到刀后随机显示四种提示
	stopKnife: function() {

		setTimeout(function() {

			$('#knife').addClass('stop');

		}, 10);


		var positionXMiddle = window.innerWidth / 2;
		var positionYMiddle = window.innerHeight / 2;


		var positionX = this.getRandom(0, positionXMiddle + 50);
		var positionY = this.getRandom(0, positionYMiddle + 50);


		console.log(positionXMiddle, positionX);
		var pics = ['imgs/catch1.png', 'imgs/catch2.png', 'imgs/catch3.png', 'imgs/catch4.png'];
		var picIndex = this.getRandom(0, pics.length - 1);

		this.doGaSendByCatch(picIndex);

		$('#catchNotice').find('img').attr('src', pics[picIndex]);

		$('#catchNotice').css({
			top: positionY,
			left: positionX,
		}).show();

		this.soundManager.playSound('catch');

	},
	doGaSendByCatch: function(index) {
		console.log(index);
		var gaValue = ['wojie', 'shenjie', 'haoyanli', 'kanbudao'][index];
		console.log(gaValue);

		ga('send', 'event', 'win', gaValue);
		ga('newTracker.send', 'event', 'win', gaValue);


	},
	//接刀成功
	success: function() {

		if (this.end) {
			return
		}
		this.stopKnife();

		this.score += 1;

		this.end = true;

		var _self = this;

		setTimeout(function() {
			//debugger
			//_self.speed += 1;
			_self.run();

		}, 1200)


	},
	//接刀失败
	fail: function() {

		//	debugger
		clearInterval(this.timer);
		console.log('fail');

		setTimeout(function() {

			$('#knife').addClass('stop');

		}, 10);

		this.end = true;
		$('#blood').show().addClass('animate');
		//debugger
		var _self = this;

		setTimeout(function(){

			$('#down').css('display', 'block').addClass('boom-animation');

			_self.soundManager.playSound('fail');

		},200)


		ga('send', 'event', 'lose', 'pujie');
		ga('newTracker.send', 'event', 'lose', 'pujie');



		setTimeout(function() {

			_self.callbacks.afterGameEnd(_self);

		}, 2000)

	},


};

(function() {
	/**
	 * preload all images and call the cb function
	 * @param  {Function} cb [description]
	 * @return {[type]}      [description]
	 */
	var loading = function(cb) {
		var imgSrcs = [
			"bg.jpg",
			"bubble.png",
			"common_bg1.jpg",
			"common_bg2.jpg",
			"end_bg.png",
			"end_bottom.png",
			"end_btn1.png",
			"end_btn2.png",
			"end_content1.png",
			"end_content2.png",
			"end_content3.png",
			"end_numbers.png",
			"end_numbers2.png",
			"end_official_link.png",
			"end_share_bg.png",
			"end_share_btn.png",
			"end_title.png",
			"finger.png",
			"game_title1.png",
			"game_title2.png",
			"loading_numbers.png",
			"loading_percent.png",
			"orientation_cover.png",
			"page1_btn.png",
			"page1_img1.png",
			"page1_img2.png",
			"page1_logo.png",
			"page1_title.png",
			"phone.png",
			"endbgtext.png",
			"blood.png",
			"count1.png",
			"count2.png",
			"count3.png",
			"guang.png",
			"catch1.png",
			"catch2.png",
			"catch3.png",
			"catch4.png",
			"hand1catch.png",
			"hand1ready.png",
			"hand2catch.png",
			"hand2ready.png",
			"down.png",
			"s0.png",
			"s1.png",
			"s2.png",
			"s3.png",
			"s4.png",
			"s5.png",
			"s6.png",
			"s7.png",
			"s8.png",
			"s9.png",
			"count-notice.png",
			"download.jpg"
		];

		var audioSrcs = [
			"bg.mp3",
			"fail.mp3",
			"catch.mp3",
			"kuang.mp3",
			"countdown.mp3"
		];

		var count = 0;
		var allCount = audioSrcs.length + imgSrcs.length;
		var loadedPercent = $("#loadedPercent");
		var $wrapper = $("#load_line").empty();
		/**
		 * callback function for load event and error event
		 * @return {[type]} [description]
		 */
		var loaded = function() {
			count++;

			var percent = Math.round(count / allCount * 100);
			var numbers = (percent + "").split("");
			//debugger
			$wrapper.empty();
			for (var i = 0; i < numbers.length; i++) {
				$wrapper.append($("<div>").addClass("loading_numbers").addClass("loading_" + numbers[i]));
			}
			$wrapper.append($("<div>").addClass("loading_percent"));

			if (count >= allCount) {
				if (typeof cb == "function") {
					// try{
					cb(audioMap);
					// }catch( e ){
					// 	console.error( e );
					// }
				};
			};
		};

		for (var i = imgSrcs.length - 1; i >= 0; i--) {
			var src = imgSrcs[i];

			var img = new Image();
			$(img).load(loaded).error(loaded);

			img.src = "imgs/" + src;
		};

		var audioSrcIdx = 0;
		var audioMap = {};
		var audioLoad = function() {
			var src = audioSrcs[audioSrcIdx];
			audioSrcIdx++;
			var audio = new Audio();
			var timeoutID;

			$(audio).one("canplaythrough", function() {
				if (timeoutID) {
					clearTimeout(timeoutID);
				};

				audioMap[src] = audio;

				loaded();
				if (audioSrcIdx < audioSrcs.length) {
					audioLoad();
				};
			}).one("error", function(e) {
				if (timeoutID) {
					clearTimeout(timeoutID);
				};

				loaded();
				if (audioSrcIdx < audioSrcs.length) {
					audioLoad();
				};
			});
			audio.src = "sounds/" + src;
			audio.play();
			setTimeout(function() {
				audio.pause();
			}, 1);

			timeoutID = setTimeout(function() {
				timeoutID = null;
				audioMap[src] = audio;
				$(audio).off("canplaythrough").off("error");

				loaded();
				if (audioSrcIdx < audioSrcs.length) {
					audioLoad();
				};
			}, 100);

			if (audio.readyState > 3) {
				loaded();

				if (audioSrcIdx < audioSrcs.length) {
					audioLoad();
				};
			};
		};

		audioLoad();
	};

	/**
	 * load the template to cache from dom tree and then remove it from the tree  在这里把所有dom加载一下，默认id为缓存id
	 * @return {[type]} [description]
	 */
	var generateTemplates = function() {
		//var $templatesContainer = $('<div id="templates" class="templates"><div id="index"><div class="index_template"><header class="index_title"><div class="index_title_img"><img src="imgs/page1_title.png" alt=""></div><div id="index_title_btn" class="index_title_btn"><img src="imgs/page1_btn.png" alt=""></div></header><section class="index_imgs"><div class="index_img_bl"><img src="imgs/page1_img1.png" alt=""></div><div class="index_img_br"><img src="imgs/page1_img2.png" alt=""></div><div class="index_logo"><img src="imgs/page1_logo.png" alt=""></div></section></div></div><div id="start">hahaha</div><div id="end_low"><div class="end_low_template end_template"><header class="end_title"><div class="end_title_bg"><img src="imgs/end_title.png" alt=""></div><div class="end_title_numbers"><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_1"></span></div><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_2"></span></div><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_0"></span></div></div></header><article class="end_content"><div class="content_text_img"><img src="imgs/end_content3.png" alt=""></div></article><article class="end_content2_wrapper"><p class="end_content2_texts">还不快点击关注《十万个冷笑话》手游官方微信账号，好好修炼你的节操！记得找女王大人讨福利啊喂！</p><p class="end_content2_follow"><img src="imgs/end_share_btn.png" alt=""></p><p class="end_content2_tip"><span class="end_content2_tip_label">暗号: &nbsp;&nbsp;</span><span class="end_content2_tip_value">女王大人</span></p></article><article class="end_buttons"><div class="end_buttons_left"><img src="imgs/end_btn1.png" alt=""></div><div class="end_buttons_right"><img src="imgs/end_btn2.png" alt=""></div></article><footer class="end_footer"><div class="end_footer_bg"><img src="imgs/end_bottom.png" alt=""></div><div class="end_footer_official_link"><img src="imgs/end_official_link.png" alt=""></div></footer><div class="share_cover_container"><div class="share_cover"><img src="imgs/share_cover.png" alt=""></div><div class="share_finger"><img src="imgs/share_finger.png" alt=""></div></div></div></div><div id="end_middle"><div class="end_middle_template end_template"><header class="end_title"><div class="end_title_bg"><img src="imgs/end_title.png" alt=""></div><div class="end_title_numbers"><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_1"></span></div><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_2"></span></div><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_0"></span></div></div></header><article class="end_content"><div class="content_text_img"><img src="imgs/end_content2.png" alt=""></div><div class="content_text">4</div></article><article class="end_content2_wrapper"><p class="end_content2_texts">还不快点击关注《十万个冷笑话》手游官方微信账号，好好修炼你的节操！记得找女王大人讨福利啊喂！</p><p class="end_content2_follow"><img src="imgs/end_share_btn.png" alt=""></p><p class="end_content2_tip"><span class="end_content2_tip_label">暗号: &nbsp;&nbsp;</span><span class="end_content2_tip_value">女王大人</span></p></article><article class="end_buttons"><div class="end_buttons_left"><img src="imgs/end_btn1.png" alt=""></div><div class="end_buttons_right"><img src="imgs/end_btn2.png" alt=""></div></article><footer class="end_footer"><div class="end_footer_bg"><img src="imgs/end_bottom.png" alt=""></div><div class="end_footer_official_link"><img src="imgs/end_official_link.png" alt=""></div></footer><div class="share_cover_container"><div class="share_cover"><img src="imgs/share_cover.png" alt=""></div><div class="share_finger"><img src="imgs/share_finger.png" alt=""></div></div></div></div><div id="end_high"><div class="end_high_template end_template"><header class="end_title"><div class="end_title_bg"><img src="imgs/end_title.png" alt=""></div><div class="end_title_numbers"><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_1"></span></div><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_2"></span></div><div class="end_title_number_wrapper"><span class="end_number_effect"></span> <span class="end_number end_number_0"></span></div></div></header><article class="end_content"><div class="content_text_img"><img src="imgs/end_content1.png" alt=""></div><div class="content_text">4</div></article><article class="end_content2_wrapper"><p class="end_content2_texts">立刻点击关注《十万个冷笑话》手游官方微信账号，找女王大人领奖吧！</p><p class="end_content2_follow"><img src="imgs/end_share_btn.png" alt=""></p><p class="end_content2_tip"><span class="end_content2_tip_label">暗号: &nbsp;&nbsp;</span><span class="end_content2_tip_value">女王大人</span></p></article><article class="end_buttons"><div class="end_buttons_left"><img src="imgs/end_btn1.png" alt=""></div><div class="end_buttons_right"><img src="imgs/end_btn2.png" alt=""></div></article><footer class="end_footer"><div class="end_footer_bg"><img src="imgs/end_bottom.png" alt=""></div><div class="end_footer_official_link"><img src="imgs/end_official_link.png" alt=""></div></footer><div class="share_cover_container"><div class="share_cover"><img src="imgs/share_cover.png" alt=""></div><div class="share_finger"><img src="imgs/share_finger.png" alt=""></div></div></div></div></div>');
		var $templatesContainer = $('#templates');
		var $templates = $templatesContainer.children();
		var templateMap = {};

		$templates.each(function() {
			var $this = $(this);
			templateMap[$this.attr('id')] = $this.html();
		});

		$templatesContainer.remove();
		$templatesContainer = null;

		return templateMap;
	};

	/**
	 * generate events map of all page
	 * @param  {[type]} pageManager [description]
	 * @param  {[type]} gameManager [description]
	 * @param  {[type]} soundManager [description]
	 * @return {[type]}              [description]
	 */
	var generateEvtMap = function(pageManager, gameManager, soundManager) {
		var evtMap = {};

		evtMap.index = [{
			evt: "tap",
			query: "#index_title_btn",
			func: function() {
				//recheckSoundFunc( gameNamesWithOrder, soundManager );
				var gameStart = 'start';
				pageManager.showNextPage(gameStart);
				gameManager.restart();

				ga('send', 'event', 'begin', 'home');
				ga('newTracker.send', 'event', 'begin', 'home');

			}
		}];

		evtMap.start = [{
			evt: "tap",
			query: ".game_template",
			func: function() {
				gameManager.doCatch();
			}
		}]

		//处理游戏运行时逻辑
		/*
		var gameEvtMaps = gameManager.getEvtMaps( pageManager, soundManager );
		for (var evtName in gameEvtMaps) {
			evtMap[ evtName ] = gameEvtMaps[ evtName ];
		}
*/
		var endEvts = [{
			evt: "tap",
			query: ".end_buttons_left",
			func: function() {

				var newEvtMap = generateEvtMap(pageManager, gameManager, soundManager);
				pageManager.clearEventMap();
				pageManager.addEventMap(newEvtMap);
				pageManager.show('start');
				gameManager.restart();

				ga('send', 'event', 'end', 'restart');
				ga('newTracker.send', 'event', 'end', 'restart');

			}
		}, {
			evt: "tap",
			query: ".share_cover_container",
			func: function() {
				$(".share_cover_container").hide();
			}
		}, {
			evt: "tap",
			query: ".end_buttons_right",
			func: function() {
				$(".share_cover_container").show();

				ga('send', 'event', 'end', 'share');
				ga('newTracker.send', 'event', 'end', 'share');

			}
		}, { //下载
			evt: "tap",
			query: ".end_content2_follow",
			func: function() {
				/*
				if (gameManager.score >= -140) {
					gaDesc = "BFB1";
					gaValue = "end100";
				} else if (gameManager.score < -140 && gameManager.score >= -180) {
					gaDesc = "BFB2";
					gaValue = "end160";
				} else {
					gaDesc = "BFB3";
					gaValue = "end200";
				}*/
				pageManager.show('download');

				ga('send', 'event', 'end', 'download');
				ga('newTracker.send', 'event', 'end', 'download');


				//window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA5MjA0MjQ2OQ==&mid=203959519&idx=1&sn=9589d0cf9758eab66db6e4e1da65d499#rd";
			}
		}, {
			evt: "tap",
			query: ".end_footer_official_link",
			func: function() {
				if (gameManager.score >= -140) {
					gaDesc = "10cold1";
					gaValue = "end100";
				} else if (gameManager.score < -140 && gameManager.score >= -180) {
					gaDesc = "10cold2";
					gaValue = "end160";
				} else {
					gaDesc = "10cold3";
					gaValue = "end200";
				}
				ga('send', 'event', 'official', gaDesc, gaValue);
				ga('newTracker.send', 'event', 'official', gaDesc, gaValue);

				window.location.href = "http://sw.8864.com/";
			}
		}];

		evtMap.end = endEvts;

		evtMap.download = [{
			evt: "tap",
			query: ".download_button",
			func: function(){
				var downloadCover = $("#download_cover");
				downloadCover.show();
			}
		}, {
			evt: "tap",
			query: "#download_cover",
			func: function(){
				$("#download_cover").hide();
			}
		}];

		return evtMap;
	};

	var generateGameCallbacks = function(pageManager) {
		return {
			afterGameEnd: function(gameManager) {
				var pageName;
				var scoreValue = Math.abs(gameManager.score);
				pageName = 'end';
				var index = 0
					
				if (scoreValue >= 15) {

					window.shareContent = window.highShareContent;
					index=3;

				} else if (scoreValue< 15 && scoreValue> 10) {

					window.shareContent = window.middleShareContent;
					index=2;

				} else if (scoreValue <=10 && scoreValue>5) {

					window.shareContent = window.lowShareContent;
					index=1;

				}

				var resultText= [];

				console.log('score:'+scoreValue)
				var bai, shi, ge;

				if (scoreValue < 100) {

					bai = 0;
					shi = parseInt(scoreValue / 10);
					ge = scoreValue % 10;
				} else {
					bai = 1;
					shi = parseInt((scoreValue - 100) / 10);
					ge = scoreValue % 10;
				}

				console.log(bai,shi,ge);
				pageManager.showPage(pageName);

				var images = ['imgs/s0.png', 'imgs/s1.png', 'imgs/s2.png', 'imgs/s3.png', 'imgs/s4.png', 'imgs/s5.png', 'imgs/s6.png', 'imgs/s7.png', 'imgs/s8.png', 'imgs/s9.png']

				$('#endScore').find('img').eq(0).attr('src', images[bai]);
				$('#endScore').find('img').eq(1).attr('src', images[shi]);
				$('#endScore').find('img').eq(2).attr('src', images[ge]);

				if (window.shareContent) {
					if (window.changeShareContent) {
						window.changeShareContent(window.shareContent);
					} else {
						console.log("share content:" + window.shareContent);
					}
				};
			}
		};
	};

	var generateSoundsMap = function(loadedAudios) {
		var keySrcMap = {
			bg: "bg.mp3",
			fail: "fail.mp3",
			catch: "catch.mp3",
			kuang: "kuang.mp3",
			countdown: "countdown.mp3"
		};

		var soundsMap = {};

		for (var key in keySrcMap) {
			var src = keySrcMap[key];
			var audio = loadedAudios[src];
			if (audio) {
				soundsMap[key] = audio;
			};
		}

		return soundsMap;
	}

	var recheckSoundFunc = function(gameNamesWithOrder, soundManager) {
		if (soundManager.soundsMap["bg"].readyState <= 0) {
			soundManager.playBGMusic();

			var audio = new Audio();
			soundManager.playAsSingleAudio(audio);
			$("#music_icon").addClass("play");
		};
	};

	var init = function(loadedAudios) {
		var soundsMap = generateSoundsMap(loadedAudios);
		var templateStrMap = generateTemplates();

		var $mainContainer = $("#main-container");

		var soundManager = new SoundManager(soundsMap);
		var pageManager = new PageManager(templateStrMap, $mainContainer);
		var gameManagerCallbacks = generateGameCallbacks(pageManager);
		var gameManager = new GameManager(gameManagerCallbacks, soundManager);
		var eventMap = generateEvtMap(pageManager, gameManager, soundManager);
		//起始页
		var start = 'start';

		soundManager.playBGMusic();
		pageManager.addEventMap(eventMap);
		//开始
		pageManager.show('index', start);

		pageManager.setListener('pageDisplay', function(pageName, $fragment) {
			if (pageName && pageName == start) {

				/*
				引导逻辑
				var $tutorial = $("#tutorial_cover");

				$fragment.append( $tutorial );
				setTimeout(function(){
					$("#tutorial_cover").remove();
				}, 4000);

				$tutorial.show();*/

			};

			$(".common_title_value").text(Math.abs(gameManager.score));
		});

		window.onorientationchange = function() {
			var isLandscape = false;

			if (isNaN(window.orientation)) {
				isLandscape = window.innerWidth < window.innerHeight;
			} else {
				isLandscape = window.orientation != 0;
			}
			if (isLandscape) {
				$("#orientation_cover").show();
			} else {
				$("#orientation_cover").hide();
			}
		};

		if (window.innerWidth < window.innerHeight) {
			$("#orientation_cover").hide();
		} else {
			$("#orientation_cover").show();
		}

		if (soundManager.soundsMap["bg"].readyState > 0) {
			$("#music_icon").addClass("play");
		}

		$("#music_icon").on("tap", function() {
			soundManager.toggle();

			if (soundManager.enabled) {
				$(this).addClass("play");
			} else {
				$(this).removeClass("play");
			}
		});
	};

	var loadingImgs = ["imgs/loading_percent.png", "imgs/loading_numbers.png", "imgs/loading_icon_0.png", "imgs/loading_icon_1.png"];
	var loadingImgsCount = 0;
	var onloaded = function() {
		loadingImgsCount++;

		if (loadingImgsCount >= loadingImgs.length) {
			loading(init);
		};
	};

	for (var i = 0; i < loadingImgs.length; i++) {
		var imgSrc = loadingImgs[i];
		var img = new Image();

		$(img).load(onloaded).error(onloaded);
		img.src = imgSrc;
	};

	document.addEventListener("touchstart", function(e) {
		e.preventDefault();
	});

	document.addEventListener("touchmove", function(e) {
		e.preventDefault();
	});
})();