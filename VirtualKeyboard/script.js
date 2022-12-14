
var kb;
var content = false;
var oldid = '';
var label = '';
var content_height = 0;
jQuery(document).ready(function() {
    kb = jQuery('.search').keyboard({
    language: 'en',
    startAs: 'hidden',
    debug: 'false'
  });

});
//Shreeram Hankre
(function ($) {
    var defaults = {

        //LAYOUT
        startAs: 'visible', // 'hidden', 'visible'
        useImage: true, // true, false
        skin: 'default', // 'default', 'blue', 'green', 'red', 'yellow', 'black'
        language: 'en', 
        //DEV
        debug: false, // true, false

    };

    $.fn.keyboard = function (options) {

        if (this.length == 0) return this;
        // create a namespace to be used throughout the plugin
        var _keyboard = {};

        // set a reference to our keyboard element
        var kb = this;

        var ctrlk = false;
        var shiftk = false;
        var capslockk = false;
        var specialchar = false;
        var capital = false;
        var currentskin = 'default';
        var skins = ['blue', 'green', 'red', 'yellow', 'black', 'default'];
        var languages = {
            'en': ['EN', 'English']
        };
        var currentlng = 'en';

        var keys = ['~<>`<>126', '!<>1<>49', '@<>2<>52', '#<>3<>51', '$<>4<>52', '%<>5<>53', '^<>6<>54', '&<>7<>55', '*<>8<>56', '(<>9<>57', ')<>0<>48', '_<>-<>45', '+<>=<>43', 'func<>Backspace<>08', 'br',
            'func<>Tab<>09', 'Q<>q<>81', 'W<>w<>87', 'E<>e<>69', 'R<>r<>82', 'T<>t<>84', 'Y<>y<>89', 'U<>u<>85', 'I<>i<>73', 'O<>o<>79', 'P<>p<>80', '{<>[<>91', '}<>]<>93', '|<>\\<>92', 'br',
            'func<>CapsLock<>00', 'A<>a<>65', 'S<>s<>83', 'D<>d<>68', 'F<>f<>70', 'G<>g<>71', 'H<>h<>72', 'J<>j<>74', 'K<>k<>75', 'L<>l<>76', ':<>;<>59', '"<>\'<>92', 'func<>Enter<>01', 'br',
            'func<>Shift<>14', 'Z<>z<>90', 'X<>x<>88', 'C<>c<>67', 'V<>v<>86', 'B<>b<>66', 'N<>n<>78', 'M<>m<>77', '<<>,<>44', '><>.<>46', '?<>/<>47', 'func<>Shift<>15', 'br',
            'func<>Esc<>0001', 'func<> <>32', 'func<>Search<>0002'
        ];
        var init = function () {
            // merge user-supplied options with the defaults
            kb.setSettings(options);

            setup();

        }


        var setup = function () {

            // create the keyboard container 
            kb.container = $("<div unselectable='on'  class='kb-container' />");
            $('body').append(kb.container);

            // give the functionality to the close button to close the keyboard
            if (_keyboard.settings.startAs == 'hidden') kb.closeKeyboard();

            // create keyboards rows and buttons
            createKeys();

            // create the menu bar
            createMenuBar();
            CreateSearchbar();

            // check if the given language is correct and load it
            $.each(languages, function (index, item) {
                if (_keyboard.settings.language == index) {
                    kb.changeLanguage(index);
                }
            })

            // give the keyboard the ability to be draged and droped
            drag('.kb-container');

            aplyLayout(_keyboard.settings.skin);

            deBug('setup', 'ended');
        }

        /**
         * Creates keyboard keys and their functions
         */
        var createKeys = function () {
            kb.keyboard = $("<div unselectable='on' class='kb-keyboard' />");
            kb.line1 = $("<div unselectable='on' class='kb-line' />");
            kb.line2 = $("<div unselectable='on' class='kb-line' />");
            kb.line3 = $("<div unselectable='on' class='kb-line' />");
            kb.line4 = $("<div unselectable='on' class='kb-line' />");
            kb.line5 = $("<div unselectable='on' class='kb-line' />");
            kb.key = {};

            var linecount = 1;
            $.each(keys, function (index, item) {
                var k = item.split('<>');

                if (k[0] != 'func' && item != 'br') {
                    kb.key[k[2]] = $("<div unselectable='on' class='kb-key kb-letter' id='key" + k[2] + "'><div unselectable='on' class='kb-upper kb-hide'>" + k[0] + "</div><div unselectable='on' class='kb-lower kb-show'>" + k[1] + "</div></div>")
                        .mousedown(function (event) {
                            if (event.preventDefault) event.preventDefault()
                            else event.returnValue = false;
                            var focused = $(':focus');
                            if (focused.val() != undefined) {
                                var pos = getCursorPos(focused);
                                var selection = getSelected();
                                if (selection != '') {
                                    focused.val(focused.val().replace(selection, decodeToLetter($(this).find('.kb-show').html())));
                                    setCursorPos(pos + 1);
                                } else {
                                    focused.val(focused.val().substr(0, pos) + decodeToLetter($(this).find('.kb-show').html()) + focused.val().substr(pos));
                                    setCursorPos(pos + 1);
                                }
                            }

                            deBug('Letter pressed', decodeToLetter($(this).find('.kb-show').html()));
                            if (shiftk) shiftKey();
                        });

                } else if (k[0] == 'func') {
                    kb.key[k[2]] = $("<div unselectable='on' class='kb-key kb-fkey' id='key" + k[2] + "'><div unselectable='on' class='kb-itemkey'>" + k[1] + "</div></div>")
                        .mousedown(function (event) {
                            if (event.preventDefault) event.preventDefault()
                            else event.returnValue = false;
                            var focused = $(':focus');

                            deBug('Key pressed', k[1]);

                            if (k[1] == 'Tab') {
                                if (focused.val() != undefined) {
                                    var pos = getCursorPos(focused);
                                    var selection = getSelected();
                                    if (selection != '') {
                                        focused.val(focused.val().replace(selection, '  '));
                                        setCursorPos(pos + 1);
                                    } else {
                                        focused.val(focused.val().substr(0, pos) + '    ' + focused.val().substr(pos));
                                        setCursorPos(pos + 1);
                                    }
                                }
                            } else if (k[1] == 'CapsLock') {
                                capsLockKey();
                            } else if (k[1] == 'Shift') {
                                shiftKey();
                            } else if (k[1] == 'Backspace') {
                                if (focused.val() != undefined) {
                                    var pos = getCursorPos(focused);
                                    var selection = getSelected();
                                    if (selection != '') {
                                        focused.val(focused.val().replace(selection, ''));
                                        setCursorPos(pos);
                                    } else {
                                        focused.val(focused.val().substr(0, pos - 1) + focused.val().substr(pos));
                                        setCursorPos(pos - 1);
                                    }
                                }

                            } else if (k[1] == 'Enter') {
                                if (focused.val() != undefined) {
                                    EnterPress();
                                    // var pos = getCursorPos(focused);
                                    // var selection = getSelected();
                                    // if (selection != '') {
                                    //     focused.val(focused.val().replace(selection, '\n'));
                                    //     setCursorPos(pos + 1);
                                    // } else {
                                    //     focused.val(focused.val().substr(0, pos) + '\n' + focused.val().substr(pos));
                                    //     setCursorPos(pos + 1);
                                    // }
                                }
                            } else if (k[1] == ' ') {
                                if (focused.val() != undefined) {
                                    var pos = getCursorPos(focused);
                                    var selection = getSelected();
                                    if (selection != '') {
                                        focused.val(focused.val().replace(selection, ' '));
                                        setCursorPos(pos + 1);
                                    } else {
                                        focused.val(focused.val().substr(0, pos) + ' ' + focused.val().substr(pos));
                                        setCursorPos(pos + 1);
                                    }
                                }
                            } else if (k[2] == '0001','0002') {
                                if(k[2] == '0001'){
                                    kb.closeKeyboard();
                                }
                            }
                        });
                }

                if (item == 'br') {
                    linecount++;
                } else {
                    kb['line' + linecount].append(kb.key[k[2]]);
                }

            });

            kb.keyboard.append(kb.line1).append(kb.line2).append(kb.line3).append(kb.line4).append(kb.line5);
            kb.container.append(kb.keyboard).mousedown(function (event) {
                if (event.preventDefault) event.preventDefault()
                else event.returnValue = false;
            });
        }


        var getSelected = function () {
            var t = '';
            if (window.getSelection) {
                t = window.getSelection();
            } else if (document.getSelection) {
                t = document.getSelection();
            } else if (document.selection) {
                t = document.selection.createRange().text;
            }

            return t;
        }


        var aplyLayout = function (skin) {

            var isskin = false;
            $.each(skins, function (index, item) {
                if (skin == item) isskin = true;
            });
            if (!isskin) skin = 'default';

            $('.kb-container').addClass('kb-' + skin + '-container');
            $('.kb-button').addClass('kb-' + skin + '-button');
            $('.kb-key').addClass('kb-' + skin + '-key');
            $('.kb-menubar').addClass('kb-' + skin + '-menubar');
            $('.kb-menubutton').addClass('kb-' + skin + '-menubutton');
            $('.kb-langs').addClass('kb-' + skin + '-langs');
            $('.kb-show').addClass('kb-' + skin + '-show');
            $('.kb-hide').addClass('kb-' + skin + '-hide');

            currentskin = skin;
        }


        var getCursorPos = function (element) {
            if (element.val() == undefined) return 0;

            var el = element.get(0);
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            deBug('Current pos', pos);
            return pos;
        }


        var setCursorPos = function (pos) {
            var focused = $(':focus');
            if (focused[0].setSelectionRange) {
                focused[0].focus();
                focused[0].setSelectionRange(pos, pos);
            } else if (focused[0].createTextRange) {
                var range = focused[0].createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }

        /**
         * Create the menu bar and add it to keyboard container
         */
        var CreateSearchbar = function(){
            debugger;
            kb.searchbar = $("<div class='kb-searchbar'>");
            kb.searchtab = $("<div class='label'><lable class='kb-lable'></lable></div><input id='searchid' class='searchBox search' type='text' value=''/>");
            kb.searchbar.append(kb.searchtab);
            kb.container.append(kb.searchbar);
            deBug('Search Bar', 'created');
        }
        var createMenuBar = function () {
            kb.menubar = $("<div class='kb-menubar' />")
            // kb.closebutton = $("<div class='kb-menubutton' title='Close'></div>")
                .click(function () {
                    $('.kb-menubar').trigger('mouseup');
                    //kb.closeKeyboard();
                });

            // kb.menubar.append(kb.closebutton);
            kb.container.append(kb.menubar);
            deBug('Menu Bar', 'created');
        }
        var decodeToLetter = function (str) {
            return $("<div/>").html(str).text();
        }

        /**
         * Change the state of the letters to upper case
         */
        var capitalize = function () {
            $('.kb-show').addClass('kb-temp');
            $('.kb-hide').addClass('kb-show').addClass('kb-' + currentskin + '-show').removeClass('kb-hide').removeClass('kb-' + currentskin + '-hide');
            $('.kb-temp').addClass('kb-hide').addClass('kb-' + currentskin + '-hide').removeClass('kb-show').removeClass('kb-' + currentskin + '-show');
            $('.kb-temp').removeClass('kb-temp');
            capital = true;
            deBug('Letters status', 'upper case');
        }

        /**
         * Change the state of the letters to lower case
         */
        var deCapitalize = function () {
            $('.kb-hide').addClass('kb-temp');
            $('.kb-show').addClass('kb-hide').addClass('kb-' + currentskin + '-hide').removeClass('kb-show').removeClass('kb-' + currentskin + '-show');
            $('.kb-temp').addClass('kb-show').addClass('kb-' + currentskin + '-show').removeClass('kb-hide').removeClass('kb-' + currentskin + '-hide');
            $('.kb-temp').removeClass('kb-temp');
            capital = false;
            deBug('Letters status', 'lower case');
        }

        /**
         * The functionality of the Caps Lock key
         */
        var capsLockKey = function () {
            if (capslockk) {
                if (capital) deCapitalize();
                else capitalize();

                $('#key00').removeClass('kb-activekey');

                capslockk = false;
            } else {
                if (capital) deCapitalize();
                else capitalize();

                $('#key00').addClass('kb-activekey');
                capslockk = true;
            }
        }

        /**
         * The functionality of the Shift key
         */
        var shiftKey = function () {
            if (shiftk) {
                if (capital) deCapitalize();
                else capitalize();

                $('#key14, #key15').removeClass('kb-activekey');
                shiftk = false;
            } else {
                if (capital) deCapitalize();
                else capitalize();

                $('#key14, #key15').addClass('kb-activekey');
                shiftk = true;
            }
        }

        /**
         * Enable or disable Special chars pressing the Ctrl button
         */
        var specialCharacters = function () {
            if (specialchar) {
                kb.changeLanguage(currentlng);
                $('#key0001').removeClass('kb-activekey');
                specialchar = false;
            } else {
                $('#key0001').addClass('kb-activekey');
                specialchar = true;
            }

        }


        var drag = function (element) {
            $('.kb-menubar').css('cursor', "move")
                .on("mousedown", function (e) {
                    var $drag = $(element).addClass('kb-draggable');

                    var drg_h = $drag.outerHeight(),
                        drg_w = $drag.outerWidth(),
                        pos_y = $drag.offset().top + drg_h - e.pageY,
                        pos_x = $drag.offset().left + drg_w - e.pageX;

                    $drag.parents()
                        .on("mousemove", function (e) {
                            $('.kb-draggable').offset({
                                top: e.pageY + pos_y - drg_h,
                                left: e.pageX + pos_x - drg_w
                            })
                        })
                        .on("mouseup", function () {
                            $(element).removeClass('kb-draggable');
                        });

                    if (e.preventDefault) e.preventDefault()
                    else e.returnValue = false;
                })
                .on("mouseup", function () {
                    $(element).removeClass('draggable');
                });
        }


        var deBug = function (label, msg) {
            if (_keyboard.settings.debug) {
                if (typeof console == "undefined") {
                    alert("Your browser does not support console debugging or you need to activate debugging mode. (F12 if ie)");
                    _keyboard.settings.debug = false;
                } else {
                    console.log(label);
                    console.log(msg);
                    var line = '';
                    for (var i = 0; i < 100; i++) line += "_"
                    console.log(line);
                    console.log('');
                }
            }
        }

        /**
         * ===================================================================================
         *  EXTERNAL FUNCTIONS
         * ===================================================================================
         */
        /**
         * Returns all setting's options
         */
        kb.getSettings = function () {
            return _keyboard.settings;
        }

        /**
         * Marge optional settings with the defaults
         */
        kb.setSettings = function (settings) {
            _keyboard.settings = $.extend({}, defaults, settings);
        }

        kb.changeLanguage = function (lng) {
            var temp = currentlng;
            $.each(languages, function (index, item) {
                if (index == lng) {
                    temp = lng;
                }
            })
            $('.kb-selectlanguage').html(languages[temp][0]);
            currentlng = temp;
        }


        kb.changeSkin = function (color) {
            $('.kb-container').removeClass('kb-' + currentskin + '-container');
            $('.kb-button').removeClass('kb-' + currentskin + '-button');
            $('.kb-key').removeClass('kb-' + currentskin + '-key');
            $('.kb-menubar').removeClass('kb-' + currentskin + '-menubar');
            $('.kb-menubutton').removeClass('kb-' + currentskin + '-menubutton');
            $('.kb-langs').removeClass('kb-' + currentskin + '-langs');
            $('.kb-show').removeClass('kb-' + currentskin + '-show');
            $('.kb-hide').removeClass('kb-' + currentskin + '-hide');

            aplyLayout(color);
            deBug('Change skin to:', color);
        }

        /**
         * Open keyboard
         */
        kb.openKeyboard = function (id) {
            debugger;
            oldid = id.id;
            label = id.name;
            var type = id.type;
            abc = document.querySelector('.label').textContent = label;
            id = document.getElementById('searchid');
            id.type = type;
            kb.container.toggle();
            $(id).focus();
        }

        /**
         * Close keyboard
         */
        kb.closeKeyboard = function () {
            kb.container.hide();
            $('.search').blur();

        }

        var EnterPress = function(){
            txt = document.getElementById('searchid').value;
            document.getElementById(oldid).value = txt;
            kb.closeKeyboard();
        }
        // initialize plugin
        init();

        // returns the current jQuery object
        return this;
    }


})
    (jQuery);
