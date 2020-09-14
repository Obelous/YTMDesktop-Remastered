const __ = require('./translateProvider')
const systemInfo = require('../utils/systemInfo')
const infoPlayerProvider = require('../providers/infoPlayerProvider')
const path = require('path')
const {
    app,
    BrowserWindow,
    TouchBar,
    nativeImage
} = require('electron');
const {
    TouchBarLabel,
    TouchBarButton,
    TouchBarSpacer
} = TouchBar;

function mediaPlayPauseTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: ';' })
}

function mediaStopTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: ';' })
}

function mediaNextTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: 'j' })
}

function mediaPreviousTrack(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: 'k' })
}

function mediaUpVote(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: '+' })
}

function mediaDownVote(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: '_' })
}

function mediaVolumeUp(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: '=' })
}

function mediaVolumeDown(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: '-' })
}

function mediaForwardTenSeconds(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: 'l' })
}

function mediaRewindTenSeconds(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: 'h' })
}

function mediaRepeat(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: 'r' })
}

function mediaShuffle(mainWindow) {
    mainWindow.webContents.sendInputEvent({ type: 'keydown', keyCode: 's' })
}

function mediaChangeSeekbar(mainWindow, time) {
    infoPlayerProvider.setSeekbar(mainWindow.webContents, time)
}

function mediaChangeVolume(mainWindow, time) {
    infoPlayerProvider.setVolume(mainWindow.webContents, time)
}

function mediaSelectQueueItem(mainWindow, index) {
    infoPlayerProvider.setQueueItem(mainWindow.webContents, index)
}

function mediaAddToLibrary(mainWindow) {
    infoPlayerProvider.addToLibrary(mainWindow.webContents)
}

function mediaAddToPlaylist(mainWindow, index) {
    infoPlayerProvider.addToPlaylist(mainWindow.webContents, index)
}

function createThumbar(mainWindow, mediaInfo) {
    let isPaused = mediaInfo.player.isPaused
    let likeStatus = mediaInfo.player.likeStatus
    let hasId = mediaInfo.track.id

    let thumbsUp = '../assets/img/controls/thumbs-up-button-outline.png'
    let thumbsDown = '../assets/img/controls/thumbs-down-button-outline.png'
    let thumbsReverse = ''

    switch (likeStatus) {
        case 'LIKE':
            thumbsUp = '../assets/img/controls/thumbs-up-button.png'
            thumbsDown = '../assets/img/controls/thumbs-down-button-outline.png'
            thumbsReverse = 'INDIFFERENT'
            break

        case 'DISLIKE':
            thumbsUp = '../assets/img/controls/thumbs-up-button-outline.png'
            thumbsDown = '../assets/img/controls/thumbs-down-button.png'
            thumbsReverse = 'INDIFFERENT'
            break

        case 'INDIFFERENT':
            thumbsUp = '../assets/img/controls/thumbs-up-button-outline.png'
            thumbsDown = '../assets/img/controls/thumbs-down-button-outline.png'
            thumbsReverse = likeStatus == 'LIKE' ? 'DISLIKE' : 'LIKE'
            break
    }

    playOrPause = {
        tooltip: __.trans('MEDIA_CONTROL_PLAY'),
        icon: path.join(__dirname, '../assets/img/controls/play-button.png'),
        click: function () {
            mediaPlayPauseTrack(mainWindow.getBrowserView())
        },
    }

    if (isPaused == false) {
        playOrPause.tooltip = __.trans('MEDIA_CONTROL_PAUSE')
        playOrPause.icon = path.join(
            __dirname,
            '../assets/img/controls/pause-button.png'
        )
    }

    try {
        mainWindow.setThumbarButtons([
            {
                tooltip: __.trans('MEDIA_CONTROL_THUMBS_DOWN'),
                icon: path.join(__dirname, thumbsDown),
                click: function () {
                    mediaDownVote(
                        mainWindow.getBrowserView(),
                        createThumbar(mainWindow, mediaInfo)
                    )
                },
                flags: !hasId ? ['disabled'] : [],
            },
            {
                icon: path.join(__dirname, '../assets/img/null.png'),
                flags: ['disabled', 'nobackground'],
            },
            {
                tooltip: __.trans('MEDIA_CONTROL_PREVIOUS'),
                icon: path.join(
                    __dirname,
                    '../assets/img/controls/play-previous-button.png'
                ),
                click: function () {
                    mediaPreviousTrack(mainWindow.getBrowserView())
                },
                flags: !hasId ? ['disabled'] : [],
            },
            {
                tooltip: playOrPause.tooltip,
                icon: playOrPause.icon,
                click: function () {
                    mediaPlayPauseTrack(mainWindow.getBrowserView())
                },
                flags: !hasId ? ['disabled'] : [],
            },
            {
                tooltip: __.trans('MEDIA_CONTROL_NEXT'),
                icon: path.join(
                    __dirname,
                    '../assets/img/controls/play-next-button.png'
                ),
                click: function () {
                    mediaNextTrack(mainWindow.getBrowserView())
                },
                flags: !hasId ? ['disabled'] : [],
            },
            {
                icon: path.join(__dirname, '../assets/img/null.png'),
                flags: ['disabled', 'nobackground'],
            },
            {
                tooltip: __.trans('MEDIA_CONTROL_THUMBS_UP'),
                icon: path.join(__dirname, thumbsUp),
                click: function () {
                    mediaUpVote(
                        mainWindow.getBrowserView(),
                        createThumbar(mainWindow, mediaInfo)
                    )
                },
                flags: !hasId ? ['disabled'] : [],
            },
        ])
        mainWindow.setSkipTaskbar(false)
    } catch (e) {
        //console.log(e);
    }
}

function setProgress(mainWindow, progress, isPaused) {
    if (mainWindow) {
        if (systemInfo.isWindows()) {
            mainWindow.setProgressBar(progress, {
                mode: isPaused ? 'paused' : 'normal',
            })
        } else {
            mainWindow.setProgressBar(progress)
        }
    }
}

var mainWind = null;
function createTouch(mainWindow){
	mainWind = mainWindow
}
while(mainWind){
	console.log(mainWind)
}

function createTouchBar(mainWindow) {
	/* ----------  MC BEGIN ---------- */

	/* -- MC VARS BEGIN -- */
	var playing = false;
	/* --- MC VARS END --- */

	const back = new TouchBarButton({ // done
		backgroundColor: '#444444',
		icon: nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/back.png')).resize({
			width: 16,
			height: 16
		}),
		iconPosition: 'center',
		click: () => {
			mediaNextTrack(mainWindow.getBrowserView())
		}
	});


	const playPause = new TouchBarButton({ /////////////////////////// ALMOST COMPLETE, NEED UPDATE EVENT THINGEY
		backgroundColor: '#444444',
		icon: nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/play.png')).resize({width: 16,height: 16}),
		iconPosition: 'center',
		click: () => {
			mediaPlayPauseTrack(mainWindow.getBrowserView())
		}
	});

	const forward = new TouchBarButton({ // done
		backgroundColor: '#444444',
		icon: nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/forward.png')).resize({
			width: 16,
			height: 16
		}),
		iconPosition: 'center',
		click: () => {
			mediaPreviousTrack(mainWindow.getBrowserView())
		}
	});

	/* -----------  MC END ----------- */

	/* ---------- MISC BEGIN --------- */

	/* -- MC VARS BEGIN -- */
	var like = 0; // dislike = -1, neutral = 0, like = 1
	var muted = false;
	var repeat = infoPlayerProvider.getAllInfo().repeatType; // repeat_off = NONE, repeat = ALL, repeat_one = ONE
	/* --- MC VARS END --- */

	const downVote = new TouchBarButton({
		backgroundColor: '#444444',
		icon: nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsdown.png')).resize({
			width: 16,
			height: 16
		}),
		iconPosition: 'center',
		click: () => {
			if (like == 0) {
				downVote.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsdown_true.png')).resize({
					width: 16,
					height: 16
				});
				like = -1;
				upVote.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsup.png')).resize({
					width: 16,
					height: 16
				});
			} else {
				downVote.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsdown.png')).resize({
					width: 16,
					height: 16
				});
				like = 0;
			}
		}
	});

	const upVote = new TouchBarButton({
		backgroundColor: '#444444',
		icon: nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsup.png')).resize({
			width: 16,
			height: 16
		}),
		iconPosition: 'center',
		click: () => {
			if (like == 0) {
				upVote.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsup_true.png')).resize({
					width: 16,
					height: 16
				});
				like = 1;
				downVote.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsdown.png')).resize({
					width: 16,
					height: 16
				});
			} else {
				upVote.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/thumbsup.png')).resize({
					width: 16,
					height: 16
				});
				like = 0;
			}
		}
	});

	const volumeToggle = new TouchBarButton({
		backgroundColor: '#444444',
		icon: nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/mute.png')).resize({
			width: 16,
			height: 16
		}),
		iconPosition: 'center',
		click: () => {
			if (muted) {
				volumeToggle.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/mute.png')).resize({
					width: 16,
					height: 16
				});
				muted = false
			} else {
				volumeToggle.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/unmute.png')).resize({
					width: 16,
					height: 16
				});
				muted = true;
			}
		}
	});

	const repeatToggle = new TouchBarButton({
		backgroundColor: '#444444',
		icon: nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/repeat-off.png')).resize({
			width: 16,
			height: 16
		}),
		iconPosition: 'center',
		click: () => {
			if (repeat == -1) {
				repeatToggle.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/repeat.png')).resize({
					width: 16,
					height: 16
				});
				repeat = 0;
			} else {
				if(repeat == 0){
					repeatToggle.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/repeat-one.png')).resize({
						width: 16,
						height: 16
					});
					repeat = 1;
				}else{
					repeatToggle.icon = nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/repeat-off.png')).resize({
						width: 16,
						height: 16
					});
					repeat = -1;
				}

			}
		}
	});
	/* ----------  MISC END ---------- */

	var touchBar = new TouchBar({items:[
		back,
		playPause,
		forward,
		new TouchBarSpacer({
			size: 'large'
		}),
		downVote,
		upVote,
		new TouchBarSpacer({
			size: 'large'
		}),
		new TouchBarSpacer({
			size: 'large'
		}),
		volumeToggle,
		repeatToggle
	]});
	
    return touchBar
	/*
	var update = () => {
	  touchBar.playPause.icon = global.sharedObj.paused ? nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/play.png')).resize({width: 16,height: 16}) : nativeImage.createFromPath(path.join(__dirname, '../assets/img/touchbar/pause.png')).resize({width: 16,height: 16});
	};*/
}

const guarder = (mainWindow, f) => {
    if (mainWindow && mainWindow.webContents) f(mainWindow)
}

exports.playPauseTrack = (v) => guarder(v, mediaPlayPauseTrack)
exports.stopTrack = (v) => guarder(v, mediaStopTrack)
exports.nextTrack = (v) => guarder(v, mediaNextTrack)
exports.previousTrack = (v) => guarder(v, mediaPreviousTrack)
exports.upVote = (v) => guarder(v, mediaUpVote)
exports.downVote = (v) => guarder(v, mediaDownVote)
exports.volumeUp = (v) => guarder(v, mediaVolumeUp)
exports.volumeDown = (v) => guarder(v, mediaVolumeDown)
exports.mediaForwardTenSeconds = (v) => guarder(v, mediaForwardTenSeconds)
exports.mediaRewindTenSeconds = (v) => guarder(v, mediaRewindTenSeconds)
exports.changeSeekbar = mediaChangeSeekbar
exports.changeVolume = mediaChangeVolume
exports.selectQueueItem = mediaSelectQueueItem
exports.repeat = mediaRepeat
exports.shuffle = mediaShuffle
exports.addToLibrary = mediaAddToLibrary
exports.addToPlaylist = mediaAddToPlaylist

// For Windows
exports.createThumbar = createThumbar
exports.setProgress = setProgress
// For Mac
exports.createTouchBar = createTouchBar;
exports.createTouch = createTouch;