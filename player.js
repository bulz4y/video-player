(function(){
    class Player {
        constructor(media) {
            this.media = media;
           

      

            this.initialize();
            
        }
    
        initialize() {
            // Video Player Container
            this.videoPlayerContainer = document.querySelector('.video-player');    

            // Track
            this.track = document.querySelector('#subtitles');

            // Controls Container
            this.controls = document.querySelector('.video-player .controls');

            // Controls
            this.reset = document.querySelector('.reset');
            this.bwd = document.querySelector('.rewind');
            this.play = document.querySelector('.play');
            this.fwd = document.querySelector('.forward');
            this.timerProgress = document.querySelector('#timer-progress');
            this.time = document.querySelector('.time');
            this.volume = document.querySelector('#volume');
            this.mute = document.querySelector('.mute');
            this.newFile = document.querySelector('.new-video');
            this.fullscreen = document.querySelector('.fullscreen');
            this.playBtn = document.querySelector('.play-btn');
    
            this.file = document.getElementById('file');
            this.source = document.getElementById('source');


            // Tooltips
            this.playTooltip = document.querySelector('.play .tooltip-text');
            this.muteTooltip = document.querySelector('.mute .tooltip-text');
            this.fullscreenTooltip = document.querySelector('.fullscreen .tooltip-text');
    
            // Icons
            this.resetIcon = document.querySelector('.reset i');
            this.playIcon = document.querySelector('.play i');
            this.playBtnIcon = document.querySelector('.play-btn i');
            this.volumeIcon = document.querySelector('.volume i');
            this.fullscreenIcon = document.querySelector('.fullscreen i');



            // Settings Menu
            this.settings = document.querySelector('.settings');
            this.mainMenu = document.querySelector('.main-menu');
            this.captionsMenu = document.querySelector('.captions-menu');
            this.speedMenu = document.querySelector('.speed-menu');


            this.captions = document.querySelector('.main-menu .captions');
            this.captionsBack = document.querySelector('.captions-menu .back-captions');
            this.chooseCaptions = document.querySelector('.captions-menu .ctrl.captions');
            this.captionsFile = document.querySelector("#caption-file");
            this.currentCaption = document.querySelector('.main-menu .current-caption');

            this.speed = document.querySelector('.main-menu .speed');
            this.speedBack = document.querySelector('.speed-menu .back-speed');
            this.speeds = document.querySelectorAll('.speed-menu .speed .ctrl');
            this.currentSpeed = document.querySelector('.main-menu .current-speed');

            // Sub off
            this.captionsOff = document.querySelector('.captions-menu .off');

            // Subtitle
            this.sub = document.querySelector('.captions-menu .sub');

            // Active Menu
            this.active = null; 


            // Active Controls
            this.activeControls = true;
            this.sleep = 3000;
            this.timeout = null;
         
            // Error
            this.error = document.querySelector('.error');
    
            // Current State
            this.currentVol = this.volume.value;
            this.muted = false;
    
            this.paused = this.media.paused;
            this.playable = false;
            this.currentSrc = this.media.currentSrc;
            this.currentTrackSrc = '';
    
            this.media.volume = this.currentVol;
    
            this.setupListeners();
            this.userShortcuts();
        }
    
    
        userShortcuts() {
            document.addEventListener('keyup', (e) => {
                const key = e.keyCode || e.which;
               

                switch(key) {
                    case 37:
                        if(e.target !== this.volume) {
                            this.backwardMedia();
                            this.toggleControls();
                            this.volume.style.outline = 'none';
                        } else {
                            this.changeVolume(null, -0.05);
                            this.toggleControls();
                            this.volume.style.outline = '1px solid #fff';
                        }
                       
                        break;
                    case 39:
                        if(e.target !== this.volume) {
                            this.forwardMedia();
                            this.toggleControls();
                            this.volume.style.outline = 'none';
                        } else {
                            this.changeVolume(null, 0.05);
                            this.toggleControls();
                            this.volume.style.outline = '1px solid #fff';
                        }
                        
                       
                        break;
                    case 32:
                        this.playMedia();
                        break;
                    case 77:
                        this.muteMedia();
                        this.toggleControls();
                        break;
                    case 70:
                        this.mediaFullscreen();
                        break;
                    case 78:
                       
                        this.addNewFile();
                        this.toggleControls();
                    
                        break;
                    case 38:
                        if(e.target !== this.timerProgress) {
                            this.changeVolume(null, 0.05);
                            this.toggleControls();
                            this.timerProgress.style.outline = 'none';
                        }else {
                            this.forwardMedia();
                            this.toggleControls();
                            this.timerProgress.style.outline = '1px solid #fff';
                        }
                        break;
                        
                    case 40:
                        
                        if(e.target !== this.timerProgress) {
                            this.changeVolume(null, -0.05);
                            this.toggleControls();
                            this.timerProgress.style.outline = 'none';
                        } else {
                            this.backwardMedia();
                            this.toggleControls();
                            this.timerProgress.style.outline = '1px solid #fff';
                        }
                     
                        break;
                    case 82:
                        this.resetMedia();
                        this.toggleControls();
                        break;
                    default:
                        break;
                }
                
            })
        }
    
    
        setupListeners() {
            // Active controls
            window.addEventListener('mousemove', this.toggleControls.bind(this));

            // Ended Video Event
            this.media.addEventListener('ended', this.videoEnded.bind(this));
    
            // Play Pause event
            this.play.addEventListener('click', this.playMedia.bind(this));
            this.media.addEventListener('click', this.playMedia.bind(this));
            this.media.addEventListener('dblclick', this.mediaFullscreen.bind(this))
            this.playBtn.addEventListener('click', this.playMedia.bind(this));
    
            // Reset Event
            this.reset.addEventListener('click', this.resetMedia.bind(this));
    
            // Backward Event
            this.bwd.addEventListener('click', this.backwardMedia.bind(this));
    
            //Forward Event
            this.fwd.addEventListener('click', this.forwardMedia.bind(this));
    
                 
            // Initialize volume color
            this.volume.style.background = `linear-gradient(to right, #3071a9 ${this.volume.value * 100}%, rgba(255,255,255,0.25) ${this.volume.value * 100}%)`;
            
            // Volume Event
            this.volume.addEventListener('input', this.changeVolume.bind(this));
    
            // Mute Event
            this.mute.addEventListener('click', this.muteMedia.bind(this));
    
            // Add Video
            this.newFile.addEventListener('click', this.addNewFile.bind(this));    
            this.file.addEventListener('input', this.loadFile.bind(this));
    
    
    
            // Fullscreen Event
            this.fullscreen.addEventListener('click', this.mediaFullscreen.bind(this));
            this.videoPlayerContainer.addEventListener('fullscreenchange', this.mediaFullscreenChange.bind(this));
    
            // Media Time Update event
            this.media.addEventListener('loadedmetadata', () => {
                    this.updateMediaProgress();
                    this.media.addEventListener('timeupdate', this.updateMediaProgress.bind(this));

                    

            });
    
    
            // Progress Time Event
            this.timerProgress.addEventListener('input', this.changeMediaDuration.bind(this));
            
    
            this.timerProgress.addEventListener('mousedown', () => {
                if(!this.playable) return;
    
                this.media.pause();
                this.setIcon(this.playIcon, 'fas fa-play');
                
            });
    
            this.timerProgress.addEventListener('mouseup', () => {
                if(!this.playable) return;
    
                if(!this.paused){
                    this.media.play();
                    this.setIcon(this.playIcon, 'fas fa-pause');
                }
                
            });


            // Settings Menu Events

            // Close Settings Menu on outside click
            window.addEventListener('click', (e) => {
                this.timerProgress.style.outline = 'none';
                this.volume.style.outline = 'none';
                if(this.active) {
                    this.closeMenu();
                    this.settings.classList.remove('active');
                    this.active = null;    
                }
                
            });

            // Open Main Menu
            this.settings.addEventListener('click', this.openMainMenu.bind(this));

            // Captions Menu
            this.captions.addEventListener('click', this.openCaptionsMenu.bind(this));

            // Captions Menu -> Main Menu
            this.captionsBack.addEventListener('click', this.captionsBackToMain.bind(this));
            
            this.chooseCaptions.addEventListener('click', this.triggerAddCaption.bind(this));
            this.captionsFile.addEventListener('input', this.addCaptions.bind(this));
          

            // Captions On and Off
            this.captionsOff.addEventListener('click', this.turnOffCaptions.bind(this))
            this.sub.addEventListener('click', this.turnOnCaptions.bind(this));

            // Open Speed Menu
            this.speed.addEventListener('click', this.openSpeedMenu.bind(this));

        
            // Speed Menu - Main Menu
            this.speedBack.addEventListener('click', this.speedBackToMain.bind(this));


            // Change Playback Rate Event
            for(let i = 0; i < this.speeds.length; i++) {
                this.speeds[i].addEventListener('click', this.changePlaybackRate.bind(this));             
            }
    
        }


        turnOffCaptions() {
              this.captionsOff.classList.add('active');
              this.sub.classList.remove('active');
              this.currentCaption.textContent = 'Off';
              this.track.track.mode = 'hidden';
        }


        turnOnCaptions() {
            this.captionsOff.classList.remove('active');
            this.sub.classList.add('active');
            this.currentCaption.textContent = 'On';
            this.track.track.mode = 'showing';
        }

        triggerAddCaption() {
            this.captionsFile.click();
        }

    

        addCaptions(e) {

            if(this.currentTrackSrc !== '') {
                URL.revokeObjectURL(this.currentTrackSrc);
            }

            this.currentTrackSrc = URL.createObjectURL(e.target.files[0]);

            this.track.src = this.currentTrackSrc;

            this.track.track.mode = 'showing';
           
            
            this.track.addEventListener('load', (e) => {
                let cues = this.track.track.cues;
                for(let i = 0; i < cues.length; i++) {
                    cues[i].line = 12;
                }
            });

            let name = e.target.files[0].name;

            this.sub.textContent = name;
            let previousActive = document.querySelector('.captions-menu .ctrl.active');
            previousActive.classList.remove('active');
            this.sub.classList.add('ctrl');
            this.sub.classList.add('active');
            this.currentCaption.textContent = 'On';

            e.target.value = '';
            
        }

        closeMenu() {
            
            if(this.active) {
                this.active.style.opacity = 0;
                this.active.style.visibility = 'hidden';
                this.active.style.zIndex = 10;
            }
            

           
        }

        openMenu() {
            if(this.active) {
                this.active.style.opacity = 1;
                this.active.style.visibility = 'visible';
                this.active.style.zIndex = 20;
            }
            
        }
    
        openMainMenu(e) {
            e.stopImmediatePropagation();
            if(this.active) {
                this.closeMenu();
                this.active = null;
                this.settings.classList.remove('active');
                return;
            }

            this.active = this.mainMenu;
            this.settings.classList.add('active');
            this.openMenu();
        }

        openCaptionsMenu(e){
            e.stopImmediatePropagation();
            this.closeMenu();

            this.active = this.captionsMenu;
            this.openMenu();
        }

        captionsBackToMain(e){
            e.stopImmediatePropagation();
            this.closeMenu();

            this.active = this.mainMenu;
            this.openMenu();
        }

        openSpeedMenu(e){
            e.stopImmediatePropagation();
            this.closeMenu();

            this.active = this.speedMenu;

            this.openMenu();
        }

        speedBackToMain(e) {
            e.stopImmediatePropagation();
            this.closeMenu();

            this.active = this.mainMenu;
            
            this.openMenu();
        }



        toggleControls() {
            this.videoPlayerContainer.style.cursor = 'default';
            if(this.timeout) {
                clearTimeout(this.timeout);
               
                    this.timeout = setTimeout(() => {
                        if(!this.media.paused) {
                            this.controls.style.opacity = 0;
                            this.controls.style.pointerEvents = 'none';
                            this.videoPlayerContainer.style.cursor = 'none';
                        }
                       
                    }, this.sleep);
                }
                this.controls.style.opacity = 1;
                this.controls.style.pointerEvents = 'all';
        }

        



        setIcon(el, className) {
            el.className = className;
        }
    
    
        videoEnded() {
            this.paused = this.media.paused;
            this.setIcon(this.playIcon, 'fas fa-play');
        }
    
    
        
        playMedia() {
            if(!this.playable) return;
        
            if(this.media.paused) {
                if(this.media.currentTime >= this.media.duration) {
                    this.media.currentTime = 0;
                }
                this.media.play();
                this.paused = this.media.paused;
                this.setIcon(this.playIcon, 'fas fa-pause');
                this.playBtn.style.visibility = 'hidden';
                this.playBtn.style.opacity = 0;
                this.playTooltip.textContent = 'Pause';

                this.timeout = setTimeout(() => {
                    if(!this.media.paused) {
                        this.controls.style.opacity = 0;
                        this.controls.style.pointerEvents = 'none';
                        this.videoPlayerContainer.style.cursor = 'none';
                    }
                    
                }, this.sleep);

            } else {
                this.media.pause();
                clearTimeout(this.timeout);
                this.controls.style.opacity = 1;
                this.controls.style.pointerEvents = 'all';
                this.paused = this.media.paused;
                this.setIcon(this.playIcon, 'fas fa-play');
                this.setIcon(this.playBtnIcon, 'fas fa-play');
                this.playBtn.style.visibility = 'visible';
                this.playBtn.style.opacity = 1;
                this.playTooltip.textContent = 'Play';
                
            }
            
        }
    
    
        resetMedia() {
            if(!this.playable) return;
            this.media.currentTime = 0;
        }
    
    
        backwardMedia() {
            
            if(!this.playable) return;
            this.media.currentTime -= 5;
            if(this.media.currentTime < 0) {
                this.media.pause();
                this.media.currentTime = 0;
                this.setIcon(this.playIcon, "fas fa-play");
            }
            
        }
    
        forwardMedia() {  
           
            if(!this.playable) return;
            this.media.currentTime += 5;
            
            if(this.media.currentTime >= this.media.duration) {
                this.media.pause();
                this.media.currentTime = this.media.duration;
                this.setIcon(this.playIcon, "fas fa-play");
            }
            
        }
    
    
    
        changeVolume(e, val) {
          
            let volume;
            if(e) {
                e.preventDefault();
                volume = parseFloat(e.target.value);
            } else {
                volume = parseFloat(this.volume.value) + val;
                
                if(volume > 1 || volume < 0) return;
                
                this.volume.value = volume;
            }
            
            this.volume.style.background = `linear-gradient(to right, #3071a9 ${this.volume.value * 100}%, rgba(255,255,255,0.25) ${this.volume.value * 100}%)`;
            
    
            this.media.volume = volume;
    
    
            if(volume <= 0) {
                this.muted = true;
                this.currentVol = 0.1;
                this.setIcon(this.volumeIcon, 'fas fa-volume-mute');
                this.muteTooltip.textContent = 'Unmute';
            } else {
                this.muted = false;
                this.setIcon(this.volumeIcon, 'fas fa-volume-up');
                this.muteTooltip.textContent = 'Mute';
            }
    
        }
    
        muteMedia() {
           
            if(this.muted) {
                this.media.volume = this.currentVol;
                this.volume.value = this.currentVol;
                this.volume.style.background = `linear-gradient(to right, #3071a9 ${this.volume.value * 100}%, rgba(255,255,255,0.25) ${this.volume.value * 100}%)`;
                this.setIcon(this.volumeIcon, 'fas fa-volume-up');
                this.muteTooltip.textContent = 'Mute';
            } else {
                this.currentVol = this.volume.value;
                this.media.volume = 0;
                this.volume.value = 0;
                this.volume.style.background = `linear-gradient(to right, #3071a9 ${this.volume.value * 100}%, rgba(255,255,255,0.25) ${this.volume.value * 100}%)`;
                this.setIcon(this.volumeIcon, 'fas fa-volume-mute');
                this.muteTooltip.textContent = 'Unmute';
            }
    
            this.muted = !this.muted;
    
        }
    
        addNewFile() {
                
            this.media.pause();
            this.playBtn.style.opacity = 1;
            this.playBtn.style.visibility = 'visible';
            this.setIcon(this.playIcon, 'fas fa-play');
            this.file.click();
            
        }
        loadFile(e) {
            
            const file = e.target.files;
            if(!file.length) {
                return;
            }

           if(file[0].type.indexOf('video/mp4') === -1 && file[0].type.indexOf('video/webm') === -1) {
                this.error.style.opacity = 1;
                this.error.style.visibility = 'visible';

                setTimeout(() => {
                    this.error.style.opacity = 0;
                    this.error.style.visibility = 'hidden';
                }, 3000);

                e.target.value = null;

                return;
            }

            this.error.style.opacity = 0;
            this.error.style.visibility = 'hidden';

        
    
            this.playable = true;
    
            
            if(this.currentSrc !== '') {
                URL.revokeObjectURL(this.currentSrc);
            }
            
          

            this.currentSrc = URL.createObjectURL(file[0]);
            this.source.setAttribute('src', this.currentSrc);
            this.source.setAttribute('type', file[0].type);
            this.media.load();
            
            
            this.setIcon(this.playIcon, 'fas fa-play');
            this.media.volume = this.currentVol;
            this.timerProgress.value = 0;

            
            e.target.value = null;
        }
    
        mediaFullscreen() {
            if(!document.fullscreenElement) {
                if(this.videoPlayerContainer.requestFullscreen) {
                    this.videoPlayerContainer.requestFullscreen();
                    this.setIcon(this.fullscreenIcon, 'fas fa-compress-alt');
                    this.fullscreenTooltip.textContent = 'Exit Fullscreen';
                }
            } else {
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                    this.setIcon(this.fullscreenIcon, 'fas fa-expand-alt');
                    this.fullscreenTooltip.textContent = 'Enter Fullscreen';
                }
            }
        }
    
        mediaFullscreenChange() {
            if(!document.fullscreenElement) {
                this.setIcon(this.fullscreenIcon, 'fas fa-expand-alt');
            }
        }
    
        updateMediaProgress() {
          
            
            if(!this.playable) return;
    
            let percent = (this.media.currentTime / (this.media.duration || 1)) * 100;
            
            this.timerProgress.value = percent;
    
            
            this.timerProgress.style.background = `linear-gradient(to right, #3071a9 ${percent}%, rgba(255,255,255,0.25) ${percent}%)`;
            
            let timeLeft = (this.media.duration || 0) - this.media.currentTime;
            let hours = Math.floor(timeLeft / 3600);
            let minutes = Math.floor((timeLeft - hours * 3600) / 60);
            let seconds = Math.floor(timeLeft -(hours * 3600 + minutes * 60));
    
            let timer = "";
    
    
            if(hours < 10 && hours > 0) {
                timer += '0' + hours + ":";
            } else if(hours >= 10){
                timer += hours + ":";
            }
    
    
            
            if(minutes < 10) {
                timer += '0' + minutes + ":";
            } else  {
                timer += minutes + ":";
            }
    
            if(seconds < 10) {
                timer += '0' + seconds;
            } else  {
                timer += seconds;
            }
    
        
            this.time.textContent = "-" + timer;
        }
    
    
    
        changeMediaDuration(e) {
            if(!this.playable) return;
    
            let percent = e.target.value;
            this.media.currentTime = this.media.duration * (percent / 100);  
        }

        changePlaybackRate(e) {
                e.stopImmediatePropagation();
                this.media.playbackRate = parseFloat(e.target.dataset.value);
                this.currentSpeed.textContent = (this.media.playbackRate === 1) ? 'Nomal' : this.media.playbackRate;
                
                let previousActive = document.querySelector('.speed-menu .speed .ctrl.active');
                previousActive.classList.remove('active');

                e.target.classList.add('active');

                this.closeMenu();
                this.active = this.mainMenu;
                this.openMenu();
            
        }
    
    }
    
    
    const media = document.querySelector('.player');
    const player = new Player(media);
})()
