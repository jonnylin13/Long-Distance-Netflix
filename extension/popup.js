import Constants from "../shared/constants";
import LDNClient from "./ldn";

class Popup {
  constructor() {
    this.views = {};

    $().ready(() => {
      this.views[Constants.ViewState.IN_LOBBY] = $("#in-lobby-container");
      this.views[Constants.ViewState.OUT_LOBBY] = $("#out-lobby-container");
      this.views[Constants.ViewState.CONNECT_LOBBY] = $(
        "#connect-lobby-container"
      );

      $("#start-lobby-btn").on("click", event => this.startLobbyClicked(event));
      $("#disconnect-btn").on("click", event =>
        this.disconnectLobbyClicked(event)
      );
      $("#connect-btn").on("click", event => this.connectClicked(event));
      $("#connect-btn-back").on("click", event =>
        this.connectBackClicked(event)
      );
      $("#connect-confirm-btn").on("click", event =>
        this.connectConfirmClicked(event)
      );

      this._updateViewState(Constants.ViewState.OUT_LOBBY);
    });
  }

  // ===============
  // Private Methods
  // ===============
  _getLobbyIdText() {
    return $("#lobby-id-text")[0];
  }

  _updateViewState(newState) {
    console.log("<Popup> Updating view state: " + newState);
    for (const state in this.views) {
      if (state == newState) this.views[state].appendTo("body");
      else this.views[state].detach();
    }

    if (newState == Constants.ViewState.IN_LOBBY) {
      console.log(this._getLobbyIdText());
      if (this._getLobbyIdText()) {
        this._getLobbyIdText().innerHTML = LDNClient.getInstance().user.lobbyId;
      }
    } else {
      if (this._getLobbyIdText()) this._getLobbyIdText().innerHTML = "";
    }
  }

  // =================
  // UI Button Methods
  // =================
  startLobbyClicked(event) {
    LDNClient.getInstance()
      .startLobby({
        type: Constants.Protocol.Messages.START_LOBBY,
        code: Constants.Protocol.SUCCESS
      })
      .then(res => {
        this._updateViewState(Constants.ViewState.IN_LOBBY);
      })
      .catch(err => {
        console.log(err);
      }); // TODO
  }

  disconnectLobbyClicked() {}

  connectClicked() {}

  connectConfirmClicked() {}

  connectBackClicked() {}
}

const popup = new Popup();
