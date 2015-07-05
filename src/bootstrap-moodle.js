'use strict';

var Moodle = function(){

	// modal html
	var modal = '<div class="modal fade">'
	+ '<div class="modal-dialog">'
	+ '<div class="modal-content">'
	+ '<div class="modal-header">'
	+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
	+ '<h4 class="modal-title"></h4>'
	+ '</div>'
	+ '<div class="modal-body">'
	+ '</div>'
	+ '</div>'
	+ '</div>'
	+ '</div>';

	// possible button types
	var buttonType ={
		default: 'btn-default',
		success: 'btn-success',
		warning: 'btn-warning',
		danger: 'btn-danger',
		info: 'btn-info'
	}

	// moodle object
	var moodle = {
		defaults:{
			selector: null,
			modal: {
				title: 'Modal Title',
				content: '<p>One fine body...</p>',
				loadingText: '<div class="text-center">Loading...</div>',
				bootstrapOptions:{},
				buttons: [{
					type: 'default',
					css: null,
					action: function(e, moodle){
						moodle.hide();
					},
					content: 'Close',
					attr: {
						type: 'button',
						id: 'close-modal'
					}
				}]
			},
			loadOptions: {
				url: null
			}
		},
		init: function(params){
			if(params != null && params.loadOptions != null){
				params.loadOptions = $.extend({}, this.defaults.loadOptions, params.loadOptions)
			}

			if (params != null && params.modal != null) {
				params.modal = $.extend({}, this.defaults.modal, params.modal);
			};

			this.params = $.extend( {}, this.defaults, params);

			appendModal();		
			bindSelector();
		},
		show: function(){

			this.$modal.find('.modal-title').html(this.params.modal.title);

			if(this.params.selector == null || $(this.params.selector).attr('href') == null && this.params.loadOptions.url == null){
				this.$modal.find('.modal-body').html(this.params.modal.content);
				this.$modal.modal(this.params.modal.bootstrapOptions);
			}else{
				load();
			}
		},
		hide: function(){
			this.$modal.modal('hide');
		},
		addButtons: function(buttonOptions){
			if (buttonOptions == null || !(buttonOptions instanceof Array)) {
				console.warn("Cannot append buttons. Please view documentation for 'addButtons'.");
			};

			this.params.modal.buttons =  this.params.modal.buttons.concat(buttonOptions);
			appendButtons(buttonOptions);
		},
		removeButtons: function(buttonOptions){
			var that = this;
			var moodleButtons = that.params.modal.buttons;

			for (var i = 0; i < buttonOptions.length; i++) {
				var buttonOption = buttonOptions[i];
				buttonOption.$button.remove();
				moodleButtons.splice(moodleButtons.indexOf(buttonOption), 1);
			};

			if (moodleButtons.length == 0) that.removeAllButtons();
		},
		removeAllButtons: function(){
			this.params.modal.buttons = [];
			$('.modal-footer').remove();
		}
	};

	function load(){
		var url = moodle.params.loadOptions.url || $(moodle.params.selector).attr('href');

		moodle.$modal.find('.modal-body').html(moodle.params.modal.loadingText);
		moodle.$modal.modal(moodle.params.modal.bootstrapOptions);

		if (url == null) {
			console.warn('Cannot load. Url is not specified.');
			return;
		};

		moodle.params.loadOptions.url = url;
		moodle.params.loadOptions.success = function(response, status, xhr){
			var contentType = xhr.getResponseHeader("content-type");

			moodle.$modal.find('.modal-body').empty();

			if(contentType.indexOf('html') > -1) moodle.$modal.find('.modal-body').html(response);

			moodle.$modal.trigger('modal-loaded', response);
		}

		$.ajax(moodle.params.loadOptions);
	}

	function bindSelector(){
		if (moodle.params.selector == null) return;

		$(moodle.params.selector).click(function(e){
			e.preventDefault();
			moodle.show();
		});
	}

	function appendModal(){
		moodle.$modal = $(modal);

		if (moodle.params.modal.buttons instanceof Array && moodle.params.modal.buttons.length > 0){
			appendButtons(moodle.params.modal.buttons);
		}

		$('body').append(moodle.$modal);

	}

	function appendButtons(buttonOptions){
		var $modalFooter = moodle.$modal.find('.modal-footer').length == 0 ? $('<div class="modal-footer"></div>') : moodle.$modal.find('.modal-footer');

		for (var i = 0; i < buttonOptions.length; i++) {
			var buttonOption = buttonOptions[i];
			var $button = $('<button>', { 'class' : 'btn ' + buttonType[buttonOption.type]}).html(buttonOption.content);

			if (buttonOption.attr != null) {
				for(var property in buttonOption.attr){
					$button.attr(property, buttonOption.attr[property]);	
				} 
			};

			$modalFooter.append($button);

			$button.on('click', function(e){ 
				for( var j = 0; j < moodle.params.modal.buttons.length; j++){
					
					if(!moodle.params.modal.buttons[j].$button.is($(e.target))) continue;

					moodle.params.modal.buttons[j].action(e, moodle);
				}
			});

			buttonOption.$button = $button;

			moodle.$modal.find('.modal-content').append($modalFooter);
		};
	}

	return moodle;
}

Moodle.create = function(params){
	var moodle = Moodle();
	moodle.init(params);
	return moodle;
}