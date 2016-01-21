(function($) {

	'use strict';

	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	$(document).ready(function() {

		/*===========================
		=            WOW            =
		===========================*/
		new WOW().init();

		/*=================================
		=            Particles            =
		=================================*/

		var canvasID = 'particles',
			canvas = document.getElementById(canvasID);

		function initHeader() {
			width = $headerSizer.width();
			height = $headerSizer.height();

			canvas = document.getElementById('particles');
			canvas.width = width;
			canvas.height = height;
			ctx = canvas.getContext('2d');

			circles = [];
			for(var x = 0; x < width * 0.3; x++) {
				var c = new Circle();
				circles.push(c);
			}
			animate();
		}

		function addListeners() {
			window.addEventListener('scroll', scrollCheck);
			window.addEventListener('resize', resize);
		}

		function scrollCheck() {
			if (document.body.scrollTop > height) {
				animateHeader = false;
			} else {
				animateHeader = true;
			}
		}

		function resize() {
			width = $headerSizer.width();
			height = $headerSizer.height();
			canvas.width = width;
			canvas.height = height;
		}

		function animate() {
			if(animateHeader) {
				ctx.clearRect(0, 0, width, height);
				for(var i in circles) {
					circles[i].draw();
				}
			}
			requestAnimationFrame(animate);
		}

		function Circle() {
			var self = this;

			(function() {
				self.pos = {};
				init();
			})();

			function init() {
				self.pos.x = Math.random() * width;
				self.pos.y = height + Math.random() * 100;
				self.alpha = 0.1 + Math.random() * 0.3;
				self.scale = 0.1 + Math.random() * 0.3;
				self.velocity = Math.random();
			}

			this.draw = function() {
				if(self.alpha <= 0) {
					init();
				}
				self.pos.x += self.velocity;
				self.pos.y -= self.velocity;
				self.alpha -= 0.0005;
				ctx.beginPath();
				ctx.arc(self.pos.x, self.pos.y, self.scale * 10, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'rgba(255,255,255,' + self.alpha + ')';
				ctx.fill();
			};
		}

		if (canvas) {

			var $headerSizer, width, height, ctx, circles, animateHeader = true;

			if ($('#intro .bg').length > 0) {
				$headerSizer = $('#intro .bg');
			} else {
				$headerSizer = $('#intro');
			}

			initHeader();
			addListeners();

		}

		/*========================================
		=            Animated Letters            =
		========================================*/
		var animationDelay = 3000,
			lettersDelay = 100;

		function singleLetters($words) {
			$words.each(function(){
				var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
				for (var i in letters) {
					letters[i] = '<em>' + letters[i] + '</em>';
					letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
				}
				var newLetters = letters.join('');
				word.html(newLetters).css('opacity', 1);
			});
		}

		function takeNext($word) {
			return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
		}

		function switchWord($oldWord, $newWord) {
			$oldWord.removeClass('is-visible').addClass('is-hidden');
			$newWord.removeClass('is-hidden').addClass('is-visible');
		}

		function hideLetter($letter, $word, $bool, $duration) {
			$letter.removeClass('in').addClass('out');
			if(!$letter.is(':last-child')) {
				setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
			} else if($bool) {
				setTimeout(function(){ hideWord(takeNext($word)); }, animationDelay);
			}
			if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
				var nextWord = takeNext($word);
				switchWord($word, nextWord);
			}
		}

		function showLetter($letter, $word, $bool, $duration) {
			$letter.addClass('in').removeClass('out');
			if(!$letter.is(':last-child')) {
				setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
			} else {
				if(!$bool) { setTimeout(function(){ hideWord($word); }, animationDelay); }
			}
		}

		function hideWord($word) {
			var nextWord = takeNext($word);
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
		}

		function animateHeadline($headlines) {
			var duration = animationDelay;
			$headlines.each(function(){
				var headline = $(this);
				setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ); }, duration);
			});
		}

		function initHeadline() {
			singleLetters($('.animated-letters').find('b'));
			animateHeadline($('.animated-letters'));
		}

		initHeadline();

		/*===========================
		=            Nav            =
		===========================*/
		$('.btn-nav').click(function() {
			$('.main-nav').toggleClass('main-nav--visible');
		});

		$('.main-nav nav').onePageNav({
			easing: 'swing',
			scrollSpeed: 500,
			filter: ':not(.external)'
		});

		/*=====================================
		=            Button scroll            =
		=====================================*/
		$(document).on('click', '.btn-go', function(e) {
			e.preventDefault();
			var target = $(this).attr('href');
			var targetOffset = $(target).offset();
			$('html,body').animate({scrollTop: (targetOffset.top)}, 500);
		});

		/*=====================================
		=            Progress bars            =
		=====================================*/
		$('.skills .skills-item, .bars .bars-item').each(function() {
			var progress = $(this).data('progress');
			$(this).css('width', progress + '%');
		});

		/*================================
		=            Lightbox            =
		================================*/
		$('.btn-lightbox').magnificPopup({
			type: 'image',
			mainClass: 'unica',
			removalDelay: 300
		});

		$('.gallery').each(function() {
			$(this).magnificPopup({
				delegate: 'a',
				type: 'image',
				mainClass: 'unica',
				gallery: {
					enabled: true
				},
				removalDelay: 300
			});
		});

		/*=================================
		=            Portfolio            =
		=================================*/
		$('.works').shuffle({
			itemSelector: '.works-item',
			gutterWidth: 30
		});

		$('.filter li').on('click', function() {
			var $this = $(this),
			isActive = $this.hasClass( 'active' ),
			group = isActive ? 'all' : $this.data('group');
			if ( !isActive ) {
				$('.filter .active').removeClass('active');
			}
			$this.toggleClass('active');
			$('.works').shuffle( 'shuffle', group );
		});

		$('.filtered .works-item-link').magnificPopup({
			type: 'inline',
			gallery: {
				enabled: true
			},
			mainClass: 'unica',
			removalDelay: 300
		});

		/*=================================
		=            Slideshow            =
		=================================*/
		$('.slideshow').owlCarousel({
			singleItem: true,
			autoPlay: true,
			theme: 'owl-unica',
			transitionStyle: 'UnicaAnim',
			navigationText: ['', '']
		});

		$('.tools').owlCarousel({
			items: 11,
			autoPlay: true,
			theme: 'owl-unica',
			pagination: false
		});

		/*=======================================
		=            Form validation            =
		=======================================*/
		$('.contact-form').validate({
			errorClass: 'input--error',
			validClass: 'input--success',
			errorPlacement: function() {
				return true;
			},
			highlight: function(element, errorClass) {
				$(element).parents('.input').addClass(errorClass);
			},
			unhighlight: function(element, errorClass) {
				$(element).parents('.input').removeClass(errorClass);
			},
			rules: {
				email: {
					email: true
				}
			}
		});

		/*===================================
		=            Form submit            =
		===================================*/
		$('.contact-form').submit(function(e){
			e.preventDefault();
			var $form = $(this),
				$submit = $form.find('input[type="submit"]');
			if( $form.valid() ){
				var dataString = $form.serialize();
				$submit.before('<div class="loader"></div>');
				$.ajax({
					type: $form.attr('method'),
					url: $form.attr('action'),
					data: dataString,
					success: function() {
						$submit.before('<div class="message message-success">Your message was sent successfully!</div>');
					},
					error: function() {
						$submit.before('<div class="message message-error">Your message wasn\'t sent, please try again.</div>');
					},
					complete: function() {
						$form.find('.loader').remove();
						$form.find('.message').fadeIn();
						setTimeout(function() {
							$form.find('.message').fadeOut(function() {
								$(this).remove();
							});
						}, 5000);
					}
				});
			}
		});

		/*==============================
		=            Inputs            =
		==============================*/
		$('.input-field-item').each( function() {
			var $parentEl = $(this).parents('.input');
			if( $(this).val() !== '' ) {
				$.trim($(this).val());
				$parentEl.addClass('input--filled');
			}
			$(this).on('focus', function() {
				$parentEl.addClass('input--focused input--filled');
			});
			$(this).on('blur', function() {
				$parentEl.removeClass('input--focused');
				if( $.trim($(this).val()) === '' ) {
					$parentEl.removeClass('input--filled');
				}
			});
		});

		/*==============================
		=            Tweets            =
		==============================*/
		var tweetsID = 'tweets',
		tweetsEl = document.getElementById(tweetsID);
		if (tweetsEl) {
			var tweetsConfig = {
				'id': tweetsEl.getAttribute('data-id'),
				'domId': tweetsID,
				'maxTweets': 1,
				'showInteraction': false
			};
			twitterFetcher.fetch(tweetsConfig);
		}

		/*=================================
		=            Instagram            =
		=================================*/
		var instaEl = document.getElementById('instafeed');
		if (instaEl) {
			var feed = {};
			if (instaEl.getAttribute('data-user-id')) {
				feed = new Instafeed({
					get: 'user',
					userId: parseInt(instaEl.getAttribute('data-user-id')),
					accessToken: instaEl.getAttribute('data-access-token'),
					limit: 9
				});
			} else {
				feed = new Instafeed({
					get: 'tagged',
					tagName: instaEl.getAttribute('data-hashtag'),
					clientId: instaEl.getAttribute('data-client-id'),
					limit: 9
				});
			}
			feed.run();
		}

		/*============================
		=            Tabs            =
		============================*/
		$('.tabs-nav li').on('click', function(e) {
			e.preventDefault();
			var tabIndex = $(this).index();
			$(this).addClass('active').siblings().removeClass('active').end()
			.parents('.tabs').find('.tabs-item').eq(tabIndex).addClass('tabs-item-active').siblings().removeClass('tabs-item-active');
		});

		/*=================================
		=            Accordion            =
		=================================*/
		$('.accordion-item').each(function() {
			if ($(this).hasClass('accordion-item-active')) {
				$(this).find('.accordion-item-inner').show();
			}
		});
		$('.accordion-item-heading').on('click', function() {
			$(this).parent().toggleClass('accordion-item-active').find('.accordion-item-inner').slideToggle();
			$(this).parent().siblings('.accordion-item-active').removeClass('accordion-item-active').find('.accordion-item-inner').slideToggle();
		});

		/*===============================
		=            Toggles            =
		===============================*/
		$('.toggle-item-heading').on('click', function() {
			$(this).parent().toggleClass('toggle-item-active').find('.toggle-item-inner').slideToggle();
		});

		/*============================================================
		=            Section layout fix for IE9 and lower            =
		============================================================*/
		function setSectionsBorderWidth() {
			var pageWidth = $('body').innerWidth();
			$('section[class*="section-bg"]').each(function() {
				if ($(this).hasClass('section-top-rise') || $(this).hasClass('section-top-fall')) {
					$(this).append('<div class="before" style="border-left-width:' + pageWidth + 'px" />');
				}
				if ($(this).hasClass('section-bottom-rise') || $(this).hasClass('section-bottom-fall')) {
					$(this).append('<div class="after" style="border-right-width:' + pageWidth + 'px" />');
				}
			});
		}
		function updateSectionsBorderWidth() {
			var newPageWidth = $('body').innerWidth();
			$('section[class*="section-bg"]').each(function() {
				if ($(this).hasClass('section-top-rise') || $(this).hasClass('section-top-fall')) {
					$('.before', this).css('border-left-width', newPageWidth);
				}
				if ($(this).hasClass('section-bottom-rise') || $(this).hasClass('section-bottom-fall')) {
					$('.after', this).css('border-right-width', newPageWidth);
				}
			});
		}
		if ($('html').hasClass('lte-ie9')) {
			setSectionsBorderWidth();
			$(window).on('resize', function() {
				updateSectionsBorderWidth();
			});
		}

	});

	(function() {
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame =
			window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
					timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

			if (!window.cancelAnimationFrame) {
				window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
			}
		}

	}());

}(jQuery));
