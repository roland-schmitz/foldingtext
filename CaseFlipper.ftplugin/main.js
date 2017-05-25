// written by Roland Schmitz, <http://roland-schmitz.github.io>
define(function(require, exports, module) {
    var Extensions = require('ft/core/extensions').Extensions;
    var NotificationCenter = require('ft/system/notificationcenter').NotificationCenter;
    Extensions.addInit(function (editor) {
        editor.addKeyMap({
            'Cmd-Ctrl-K' : function (editor) {
				var ranges = editor.selectedRanges()
				var rangesCount = ranges.length;
				// loop for multi cursor selections ==> case change happens before every cursor
				for(var i = 0; i < rangesCount; i++) {
					var selection = ranges[i]
					var node = selection.endNode
					var offset = selection.endOffset
					var line = node.line()
					if(offset == 0) continue
					// find end of a word before cursor
					var original
					var upperCase
					var lowerCase
					while(offset > 0) {
						offset -= 1;
						original = line.charAt(offset)
						upperCase = original.toUpperCase()
						lowerCase = original.toLowerCase()
						// todo: support more than ascii and german letters
						if(upperCase!=lowerCase) {
							break;
						}
					}
					// iterate from last to first letter of the word
					while (offset > 0) {
						original = line.charAt(offset-1)
						upperCase = original.toUpperCase()
						lowerCase = original.toLowerCase()
						if(upperCase!=lowerCase || /[-0-9]/i.test(original)) {
							offset -= 1;
						}
						else {
							break;
						}
					}
					// if changeable first letter found then flip it to upper or lower case
					var original = line.charAt(offset)
					var upperCase = original.toUpperCase()
					var lowerCase = original.toLowerCase()
					if(original != upperCase) {
						node.replaceLineInRange(upperCase,offset,1)
					}
					else if(original != lowerCase) {
						node.replaceLineInRange(lowerCase,offset,1)
					}
					else {
						// no changeable letter found
						// beep()
						// beep() is not defined and produces an error and FoldingText beeps
						// todo: find a better solution to play a sound
					}
				}
			}
        });
    });
});
