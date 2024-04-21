let Application;
import * as PixelStreamingWebSdk from "https://unpkg.com/@arcware-cloud/pixelstreaming-websdk@latest/index.esm.js";
(() => {
  const { ArcwareInit } = PixelStreamingWebSdk;
  const initResult = new ArcwareInit(
    {
      shareId: "share-5db6829b-ec92-4651-b90b-b725c75bd5f1"
    },
    {
      initialSettings: {
        StartVideoMuted: true,
        AutoConnect: true,
        AutoPlayVideo: true,
        SuppressBrowserKeys: false
      },
      settings: {
        fullscreenButton: false,
        infoButton: false,
        micButton: false,
        audioButton: true,
        settingsButton: false,
        connectionStrengthIcon: false,
        session: ""
      },
    }
  );

  Application = initResult.Application;

  let PixelStreaming = initResult.PixelStreaming;




  PixelStreaming.videoInitializedHandler.add(
    () => {
      console.log("Video initialized.");

      setTimeout(() => {
        removeLoadingScreen();

        // Função para criar o popup personalizado com bordas arredondadas
        function createPermissionPopup() {
            // Cria o elemento do popup
            var popup = document.createElement('div');
            
            // Define estilos do popup
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.padding = '20px';
            popup.style.backgroundColor = '#f9f9f9';
            popup.style.borderRadius = '15px';
            popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            popup.style.zIndex = '9999';
            
            // Mensagem do popup
            var message = document.createElement('p');
            message.innerText = 'Deseja permitir a ativação do som?';
            popup.appendChild(message);
            
            // Botão para negar
            var denyButton = document.createElement('button');
            denyButton.innerText = "Don't Allow";
            denyButton.style.marginRight = '10px';
            denyButton.onclick = function () {
                // Adicione lógica aqui para negar a ativação do som, se necessário
                console.log('Permissão negada para ativar o som');
                document.body.removeChild(popup);
            };
            popup.appendChild(denyButton);
            
            // Botão para permitir
            var allowButton = document.createElement('button');
            allowButton.innerText = 'OK';
            allowButton.onclick = function () {
                // Adicione lógica aqui para permitir a ativação do som, por exemplo, ativar elementos de áudio ou vídeo
                var videoElement = document.getElementById('videoRef');
                var audioElement = document.getElementById('audioRef');
                if (videoElement) {
                    videoElement.muted = false;
                    videoElement.play();
                }
                if (audioElement) {
                    audioElement.muted = false;
                    audioElement.play();
                }
                console.log('Permissão concedida para ativar o som');
                document.body.removeChild(popup);
            };
            popup.appendChild(allowButton);
            
            // Adiciona o popup ao corpo do documento
            document.body.appendChild(popup);
        }

        // Função para verificar se o elemento de áudio ou vídeo está silenciado
        function checkMuteStatus() {
            var videoElement = document.getElementById('videoRef');
            var audioElement = document.getElementById('audioRef');

            if (videoElement && audioElement) {
                // Verifica se o vídeo ou áudio está silenciado
                if (videoElement.muted || audioElement.muted) {
                    // Se estiverem silenciados, exibe o popup
                    createPermissionPopup();
                }
            }
        }

    checkMuteStatus();



      }, 1500);
    });


  Application.getApplicationResponse(
    (response) => {

      /*********** CUSTOM CODE BEGINS *****************************************************/
      const url1 = JSON.parse(response); //Gets the response and parses JSON.

      const levelname = "L_CiscoLive24";

      //Removing loading response.
      if (url1.url == "removeloading")
      {
        removeLoadingScreen();
        const command = { loadingremoved: 'loadingremoved' };
        handleSendCommand(command);
      }

      //Get level response.
      else if (url1.url == "getlevel")
      {
        /*
        //Gets the tab URL, looking for a level name.
        const currentPageUrl = window.location.href;
        let level = "";
        const lastSlashIndex = currentPageUrl.lastIndexOf('/');
        const questionMarkIndex = currentPageUrl.lastIndexOf('?');
        if (questionMarkIndex !== -1)
          level = currentPageUrl.substring(lastSlashIndex + 1, questionMarkIndex);
        else
          level = currentPageUrl.substring(lastSlashIndex + 1);
      
        //const command = { loadlevel: level }; //Use this line instead of below to open the link level
        */
        const command = { loadlevel: levelname };
        handleSendCommand(command);
      }

      //Get filename response. Responsible to get the dropbox filename in the query. Marked to edit.
      else if (url1.url == "getfilename")
      {
        //Finds the value of ?<value>.
        const currentPageUrl = window.location.href;
        const questionMarkIndex = currentPageUrl.lastIndexOf('?');
        const equalSignIndex = currentPageUrl.lastIndexOf('=');
        let filename = '';

        if (questionMarkIndex !== -1 && equalSignIndex !== -1)
          filename = currentPageUrl.substring(questionMarkIndex + 1, equalSignIndex);
        else
          filename = '';

        const command = { loadfilename: filename };
        handleSendCommand(command);
      }

      //Get filename response. Responsible to get the dropbox key in the query. Marked to edit.
      else if (url1.url == "getfilekey")
      {
        const currentPageUrl = window.location.href;
        let filekey = '';
        const equalSignIndex = currentPageUrl.lastIndexOf('=');

        if (equalSignIndex !== -1)
          filekey = currentPageUrl.substring(equalSignIndex + 1);
        else
          filekey = '';
        
        const command = { loadfilekey: filekey };
        handleSendCommand(command);
      }

      //Check level response.
      else if(url1.url == "checklevel")
      {
        const command = { checklevel: levelname };
        handleSendCommand(command);
      }

      //Sets the cursor type to "default".
      else if(url1.url == "setcursordefault")
      {
        toggleCursor("default");
      }

      //Sets the cursor type to "hand".
      else if(url1.url == "setcursorhand")
      {
        toggleCursor("pointer");
      }

      //Most important event: opens urls. 
      else
      {
        handleOpenLink(url1.url);
      }
    /*********** CUSTOM CODE ENDS ******************************************************/

  });

  setTimeout(() =>
    document
      .getElementById("videoContainer")
      .appendChild(Application.rootElement)
  );

})();

window.handleSendCommand = function(command) {
  if (Application) {
    Application.emitUIInteraction(command);
  }
}


/*********** CUSTOM CODE ***********************************************************/
//Toggles the cursor style.
function toggleCursor(cursortype) {
  const videoContainer = document.getElementById("videoContainer");
  console.log("videoContainer:", videoContainer);
  console.log("cursortype:", cursortype);

  if (cursortype === "pointer") {
      videoContainer.style.cursor = "pointer";
  } else if (cursortype === "default") {
      videoContainer.style.cursor = "default";
  }

  console.log("Cursor style set to:", videoContainer.style.cursor);
}


//Handles the paste function event
document.addEventListener("paste", function(event) {
  //Get the clipboard contents as plain text
  var clipboardData = event.clipboardData || window.clipboardData;
  var pastedText = clipboardData.getData("text/plain");

  //Sends the pasted text to the pixel streaming application.
  const command = { paste: pastedText };
  handleSendCommand(command);
});


//Opens the URL link on the browser (new tab)
function handleOpenLink(url)
{
  window.open(url, "_blank");
  console.log(url);
}

//If called, removes the loading screen overlay and the loading image
function removeLoadingScreen() {
  const image = document.querySelector('.centered-image');
  if (image) {
      image.remove();
      overlay.remove();
  }
}


/*********** CUSTOM CODE ENDS ******************************************************/
