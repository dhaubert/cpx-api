const axios = require("axios");

class SlackProvider {
  constructor() {}

  getUserHash({ username }) {
    switch (username) {
      case "guilherme":
        return "<@UEA292M9P>";
      case "tsenger":
        return "<@U056448MM>";
      case "douglas":
        return "<@U052DQF3Y>";
      default:
        return false;
    }
  }

  async postOnChannel({ usernameFrom, usernameTo, amount, message }) {
    message = message || "";

    const userHashTo = this.getUserHash({ username: usernameTo });
    const userHashFrom = this.getUserHash({ username: usernameFrom });

    if (!userHashFrom || !userHashTo) {
      return "false";
    }

    const date = Math.floor(new Date() / 1000);

    const body = {
      text: `${userHashTo} you got ${amount} CPX from ${userHashFrom} <!date^${date}^at {date_num} {time_secs}| AM>. ${message}`
    };
    const payload = JSON.stringify(body);

    const response = await axios
      .post(
        "https://hooks.slack.com/services/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",
        payload
    );
    console.log("Posted on Slack channel #CPX", response.statusText);
    return response.statusText;
  }
}

module.exports = new SlackProvider();
