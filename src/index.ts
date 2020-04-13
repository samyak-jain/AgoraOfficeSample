import * as AgoraRTM from 'agora-rtm-sdk';
import AgoraOffice, { Role } from 'agora-office';

const client = AgoraRTM.createInstance("029250729b864e369e870703ac3fd265");
client.login({uid: prompt("name")}).then(() => {
    console.log('AgoraRTM client login success');

    const channel = client.createChannel("demo");
    const iframe: HTMLIFrameElement = document.getElementsByTagName("iframe")[0];
    const radios = document.querySelectorAll("input[type=radio]");

    radios.forEach(value => {
        value.addEventListener('change', event => {
            const element: HTMLInputElement = <HTMLInputElement> event.target;
            if (element.value == "broadcaster") {
                const officeClient = new AgoraOffice("https://dry-journey-00420.herokuapp.com", channel, iframe, Role.Broadcaster);
                officeClient.renderFilePickerUi().then((fileUrl: URL) => {
                    console.log("Rendered")
                    officeClient.loadDocument(fileUrl).then(() => {
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
                const officeClient = new AgoraOffice("https://dry-journey-00420.herokuapp.com", channel, iframe, Role.Receiver);
                officeClient.syncDocument();
            }
        });
    });
}).catch(err => {
    console.log('AgoraRTM client login failure', err);
});

