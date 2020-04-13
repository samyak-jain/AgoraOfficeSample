import * as AgoraRTM from 'agora-rtm-sdk';
import AgoraOffice, { Role } from 'agora-office';

const client = AgoraRTM.createInstance("APP-ID");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const textBox: HTMLInputElement = <HTMLInputElement> document.getElementById("uid");

startButton.addEventListener('click', () => {
    startButton.classList.toggle('disabled');

    const radios: HTMLInputElement = document.querySelector("input[type=radio]:checked");

    client.login({uid: textBox.value}).then(() => {
        console.log('AgoraRTM client login success');
    
        const channel = client.createChannel("demo");
        const iframe: HTMLIFrameElement = document.getElementsByTagName("iframe")[0];
        const officeClient = new AgoraOffice("BACKEND-URL", channel, iframe);

        stopButton.addEventListener("click", () => {
            stopButton.classList.toggle('disabled');
            officeClient.stopSync();
        });

        console.log(radios.value);
    
        if (radios.value == "broadcaster") {
            officeClient.setRole(Role.Broadcaster);
            officeClient.renderFilePickerUi().then((fileUrl: URL) => {
                console.log("Rendered")
                officeClient.loadDocument(fileUrl).then(() => {
                    console.log(fileUrl);
                    console.log("Document loaded");
                    officeClient.syncDocument();
                }).catch(error => {
                    console.log("Error in loading document");
                    console.log(error);
                });
            }).catch(error => {
                console.log("Error in rendering " + error);
            });
        } else {
            officeClient.setRole(Role.Receiver);
            officeClient.syncDocument();
        }
            
    }).catch(err => {
        console.log('AgoraRTM client login failure', err);
    });
});

