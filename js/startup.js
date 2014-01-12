function loadRemote(path, callback) {
				var fetch = new XMLHttpRequest();
				fetch.open('GET', path);
				fetch.overrideMimeType("text/plain; charset=x-user-defined");
				fetch.onreadystatechange = function() {
					if(this.readyState == 4 && this.status == 200) {
						/* munge response into a binary string */
						var t = this.responseText || "" ;
						var ff = [];
						var mx = t.length;
						var scc= String.fromCharCode;
						for (var z = 0; z < mx; z++) {
							ff[z] = scc(t.charCodeAt(z) & 255);
						}
						callback(ff.join(""));
					}
				}
				fetch.send();
			}
			
function play(el) {
	if (audioControl)
	{		
		audioControl.stop();		
	}
	else 
	{		
		var file = el.getAttribute('href');
		loadRemote(file, function(data) {
			midiFile = MidiFile(data);
			synth = Synth(44100);
			replayer = Replayer(midiFile, synth);
			//audio = AudioPlayer(replayer);
			audioControl = AudioPlayer(replayer, null, audioContext, function(ctx) {
				audioControl = null;
				audioContext = ctx;
				el.nextSibling.firstChild.setAttribute( "src", chrome.extension.getURL("img/btn.png") );
			} );
		});
		el.nextSibling.firstChild.setAttribute( "src", chrome.extension.getURL("img/btnStop.png") );
	}
}

var audioControl = null;
var audioContext = null;
//function play(el){	alert('play:'+ el.getAttribute('href')); }

function injectHtml(element) {
  
  var btn = document.createElement('span');
  btn.className = 'playMidi';
  
  if (element.nextSibling) 
	element.parentNode.insertBefore(btn, element.nextSibling);
  else 
	element.parentNode.appendChild(btn);
   
   btn.innerHTML = "<img src=\""+chrome.extension.getURL("img/btn.png")+"\" onclick = \"return false\" title = \"Play MIDI\">";
   
   btn.addEventListener('click', function(onClickProp){
		play(element); 
	  });
 }

 function endsWith(str, suffix) {
	if (str==null) return false;
	
    return ((str.indexOf('upload.wikimedia.org') !== -1) 
			&& (str.indexOf(suffix, str.length - suffix.length) !== -1));
}
 
function parseHtml()
{
	var els = document.getElementsByTagName('a');
	for(var i=0;i<els.length;i++)
	{
		if ( endsWith( els[i].getAttribute('href'), '.mid'))
			injectHtml(els[i]);
	}
}

parseHtml();