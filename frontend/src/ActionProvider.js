import {addResponseMessage, setQuickButtons} from 'react-chat-widget';
import {postToGoogle} from './googleApi'

export const ActionProvider = (response, currMessage) => {
    /*
    This is the functino that handle the response from GPT3 and determine what the message should
    be sent to the user.
    */
    var components = response.split(":");
    if (components[0] == "Tips") {
        postToGoogle(currMessage, false);
        // change width of chat window
        var widgetContainer = document.getElementsByClassName("rcw-widget-container")[0];
        widgetContainer.style.width = "50%";
        // Get the google search container
        var gsCloseButton = document.getElementById("gs-close-button");
        gsCloseButton.style.display = "block";
        var google = document.getElementById("gs-container");
        google.style.display = "block";
        addResponseMessage(components[1]);
        setQuickButtons([
            {
            label : 'show images',
            value : 2,
            },
        ]);
    } else {
        // addResponseMessage(components[0] + ' -> ' + components[1] + ' -> ' + components[2]);
        addResponseMessage(response);
    }
}