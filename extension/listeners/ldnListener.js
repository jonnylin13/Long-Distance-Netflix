import Constants from "../../shared/constants";
import LDNClient from "../ldn";

export default class LDNMessageListener {
  constructor() {
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      this.onMessage(req, sender, sendResponse);
    });
  }

  onMessage(req, sender, sendResponse) {
    const data = JSON.parse(req);

    if (!data.type) {
      console.log(
        "<Error> LDN background received a broken message from a content script."
      );
      console.log(req);
      return;
    }
    console.log("<Info> LDN background received message type: ", data.type);
    let response = {};

    if (data.type === Constants.Protocol.Messages.POPUP_LOADED) {
      response.type = Constants.Protocol.Messages.POPUP_LOADED_ACK;
      response.code = Constants.Protocol.SUCCESS;
    } else if (data.type === Constants.Protocol.Messages.GET_LOBBY_ID) {
      if (LDNClient.getInstance().user.lobbyId) {
        response.type = Constants.Protocol.Messages.GET_LOBBY_ID_ACK;
        response.code = Constants.Protocol.SUCCESS;
        response.lobbyId = LDNClient.getInstance().user.lobbyId;
      } else {
        response.type = Constants.Protocol.Messages.GET_LOBBY_ID_ACK;
        response.code = Constants.Protocol.FAIL;
      }
    } else if (data.type === Constants.Protocol.Messages.START_LOBBY) {
      // TODO #35
      LDNClient.getInstance()
        .startLobby(req)
        .then(res => {
          // Parse the response
        })
        .catch(err => {
          response.type = Constants.Protocol.Messages.START_LOBBY_ACK;
          response.code = Constants.Protocol.FAIL;
        });
    }
    console.log("<Info> Sending the following response: ");
    console.log(response);
    sendResponse(JSON.stringify(response));
  }
}