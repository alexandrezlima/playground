
        import * as PixelStreamingWebSdk from "https://unpkg.com/@arcware-cloud/pixelstreaming-websdk@latest/index.esm.js";

        (() => {
        const { ArcwareInit } = PixelStreamingWebSdk;
        const initResult  = ArcwareInit(
            {
            shareId: "share-5db6829b-ec92-4651-b90b-b725c75bd5f1"
            },
            {
                initialSettings: {
                    StartVideoMuted: false,
                    AutoConnect: true,
                    AutoPlayVideo: true,
                    SuppressBrowserKeys: true,
                    AFKTimeout: 360,
                    TimeoutIfIdle: 360
                },
                settings: {
                    infoButton: false,
                    micButton: false,
                    audioButton: false,
                    fullscreenButton: false,
                    settingsButton: false,
                    connectionStrengthIcon: false,
                    SuppressBrowserKeys: false,
                    session: ""
                },
            }
        );

        let Application = initResult.Application;
        let PixelStreaming = initResult.PixelStreaming;

        if (localStorage.getItem('url'))
        {
          const newUrl = localStorage.getItem('url');
          history.replaceState(null, null, newUrl);
          localStorage.removeItem('url');
        }
        
        
        let counter = 0;

        

        //Internal functions.
        window.handleSendCommands = function(command) {
            if (Application)
                Application.emitUIInteraction(command);
        }

        //Removes the loading screen.
        window.removeLoadingScreen = function() {
            const overlay = document.getElementById('overlay');
            const imageContainer = document.getElementById('imageContainer');
            
            if (overlay)
                overlay.remove();

            if (imageContainer)
                imageContainer.remove();
        }

        //Handles the url to open in a new tab.
        window.handleOpenLink = function(url) {
            window.open(url, "_blank");
            console.log(url);
        }

        //Handles the paste function event.
        document.addEventListener("paste", function(event) {
            //Get the clipboard contents as plain text
            var clipboardData = event.clipboardData || window.clipboardData;
            var pastedText = clipboardData.getData("text/plain");

            //Sends the pasted text to the pixel streaming application.
            const command = { paste: pastedText };
            handleSendCommands(command);
        });

        //Used to change the cursor type on interactive elements such as buttons.
        window.toggleCursor = function(cursortype) {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.style.cursor = cursortype;
            }
        }
        
        //Returns if the streaming video is muted.
        window.audiostatus = function()
        {
            //Gets the first video element. The streaming.
            const videoElement = document.querySelector('video');

            if (videoElement) {
                const isMuted = videoElement.muted;
                console.log(isMuted ? "muted" : "not muted");

                const command = { audiostatus: isMuted ? "muted" : "not muted" };
                handleSendCommands(command);
            } else {
                console.log("Nenhum elemento de vídeo encontrado na página.");
            }
        }

        window.unmutesound = function()
        {
            //Gets the first video element. The streaming.
            const videoElement = document.querySelector('video');
            
            if (videoElement) {
                //Checks if the video is muted.
                videoElement.muted = false;
                videoElement.autoplay = true;

                videoElement.play();
                document.cookie = "autoplay=true; path=/; max-age=31536000";
            } else {
                console.log("No video elements found.");
            }
        }

        //Returns if there is any segment.
        window.getSegment = function() {
            let name = 'segment';

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const paramValue = urlParams.get(name);

            let segmentValue = (paramValue !== null) ? paramValue : -1;

            const command = { segment: segmentValue };
            handleSendCommands(command);            
        }

        //Autorecords the screen after loading the level.
        window.autoRecord = function() {
            let name = 'ar';

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const paramValue = urlParams.get(name);

            if (paramValue === 'true')
            {
                const command = { autorecord: paramValue };
                handleSendCommands(command);
            }
            else
            {
								const command = { autorecord: "false" };
                handleSendCommands(command);
            }
        }

        window.viewMode = function() {
            let name = 'vo';

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const paramValue = urlParams.get(name);

            if (paramValue === "true")
            {
                const command = { viewonly: paramValue };
                handleSendCommands(command);
            }
            else
            {
            		const command = { viewonly: "false" };
                handleSendCommands(command);
						}
        }
        
        window.updateProgressBarPercentage = function(percent) {
            const barProgress = document.getElementById('loadingProgressBar');
            if (barProgress) {
            		if (counter === 0) {
                    const loadingBar = document.getElementById('loadingBar');
                    if (loadingBar) {
                        loadingBar.style.display = 'block';
                    }
                    counter++;
                }
            
                barProgress.style.width = percent + '%';
            }
        }


        //Called when the video streaming starts.
        PixelStreaming.videoInitializedHandler.add(
        () => {
          console.log("Video initialized.");

            setTimeout(() => {
                audiostatus();
            }, 4000);
        });
        
        PixelStreaming.websocketOnCloseHandler.add(() => {
            console.log("Disconnected.");
            const url = window.location.href;
						localStorage.setItem('url', url);
            
            window.location.href = 'https://www.mile80.com/eventplayground/reload';
        });
        

        //Responses from UE application.
        Application.getApplicationResponse(
            (response) => {
            console.log("ApplicationResponse", response);

            const url1 = JSON.parse(response);

            /*SET HERE THE LEVEL NAME*/
            const levelname = "L_Upfronts24_0408";

            //Removing loading response.
            if (url1.url == "removeloading")
            {
                removeLoadingScreen();
                const command = { loadingremoved: 'loadingremoved' };
                handleSendCommands(command);
            }

            //Returns the level to load.
            else if (url1.url == "getlevel")
            {
                const command = { loadlevel: levelname };
                handleSendCommands(command);
            }

            //Returns the current level name.
            else if(url1.url == "checklevel")
			{
                const command = { checklevel: levelname };
                handleSendCommands(command);
			}

            //Sets the cursor type to default.
            else if(url1.url == "setcursordefault")
            {
                toggleCursor("default");
            }

            //Sets the cursor type to hand.
            else if(url1.url == "setcursorhand")
            {
                toggleCursor("pointer");
            }

            //Allows volume to true.
            else if (url1.url == "unmutesound")
            {
                unmutesound();
                document.cookie = "audioPermission=true; path=/; max-age=31536000";
            }

            else if (url1.url == "queries")
            {
                viewMode();
                autoRecord();
                getSegment();
                console.log("Queries done.");
            }
            
            else if (url1.progress)
            {
                updateProgressBarPercentage(url1.progress);
                console.log(url1.progress);
            }

            //Open the link in a new tab.
            else
            {
                handleOpenLink(url1.url);
            }
        });

        document.getElementById("video-container").appendChild(Application.rootElement);
    })();
