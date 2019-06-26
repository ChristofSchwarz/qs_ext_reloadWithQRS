/*globals define*/

var mainsection1 = {
	label: 'Export Settings',
	type: 'items',
	component: 'expandable-items',
	items: {
		i1: {
			label: 'Objects',
			type: 'items',
			items: [
                {
					 label: 'Button Label',
					 type: 'string',
					 expression: 'optional',
					 ref: 'btnlabel',
					 defaultValue: 'Reload'
				},			
				{
					 label: 'VirtualProxy',
					 type: 'string',
					 expression: 'optional',
					 ref: 'vproxy',
					 defaultValue: 'header'
				},{
					 label: 'Header-key',
					 type: 'string',
					 expression: 'optional',
					 ref: 'hdrkey',
					 defaultValue: 'user'
				},{
					 label: 'Header-value',
					 type: 'string',
					 expression: 'optional',
					 ref: 'hdrval',
					 defaultValue: 'QMI-QS-SN\\vagrant'
				} 
			]
		} 
	}
};

define( ["qlik", "jquery", "text!./style.css"], function ( qlik, $, cssContent ) {
	'use strict';
	$( "<style>" ).html( cssContent ).appendTo( "head" );

	return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				settings: {
					uses: "settings"
				},
				mysection: mainsection1
			}
		},

		paint: function ( $element, layout ) {
			var html = "<div>";
			var self = this;
			var ownId = this.options.id;
			var app = qlik.currApp(this);
			var enigma = app.model.enigmaModel;
			var localeInfo = app.model.layout.qLocaleInfo;
			//console.log('locale', localeInfo);
			//console.log('layout', layout);
			html += "</div>";
			//add 'more...' button
			html += '<button id="btn1_' +ownId + '" class="lui-button">' + layout.btnlabel + '</button>';
			$element.html( html );
			$element.find("#btn1_"+ownId).on( "click", function () {
				
				var qrssettings = {
				  "async": true,
				  "crossDomain": false,
				  "url": '/' + layout.vproxy + '/qrs/app/' + app.id + '/reload?xrfkey=1234567890abcdef',
				  "method": "POST",
				  "headers": {
					"X-Qlik-Xrfkey": "1234567890abcdef"
				  }
				}
				qrssettings.headers[layout.hdrkey] = layout.hdrval;
				
				$.ajax(qrssettings).done(function (response) {
				    alert('Reload submitted, is being executed on server');
				    console.log(response);
				}).catch(function(err){
				    alert('Didnt work. ' + err.status + ' ' + err.statusText);
				    console.log(err);
				});
		
			});
			
			return qlik.Promise.resolve();
		}
	};
} );
