const axios = require("axios");

class SlackProvider {
  constructor() {
    this.slackToken = process.env.SLACK_TOKEN;
    this.slackUrl = process.env.SLACK_URL;
    this.webhookURL = process.env.SLACK_WEBHOOK_URL;
  }

  async getUserHash({ email }) {
    const user = await this.getSlackUserFromEmail({ email });
    return user.id;
  }

  async getUsersFromTeam() {
    const users = await axios.get(
      `${this.slackUrl}/users.list?token=${this.slackToken}`
    );
    return users.data.members || false;
  }

  async getSlackUserFromEmail({ email }) {
    if (!email) {
      return false;
    }
    const users = await this.getUsersFromTeam();
    const found = users.find(
      user => (user.deleted == false && user.profile.email == email)
    );
    return found? this.formatUser(found): false;
  }

  async postOnChannel({ from, to, amount, message }) {
    message = message || "";

    from = this.citationFormat({ id: from });
    to = this.citationFormat({ id: to });

    if (!from || !to) {
      return "false";
    }

    const date = Math.floor(new Date() / 1000);

    const body = {
      text: `${to} you got ${amount} CPX from ${from} <!date^${date}^at {date_num} {time_secs}| AM>. ${message}`
    };
    const payload = JSON.stringify(body);

    const response = await axios.post(
      this.webhookURL,
      payload
    );
    console.log("Posted on Slack channel #CPX", response.statusText);
    return response.statusText;
  }

  formatUser({
    id,
    color,
    real_name,
    tz,
    profile: {
      title,
      email,
      image_original,
      display_name,
      status_text,
      status_emoji
    },
    is_admin
  }) {
    return {
      id,
      color,
      displayName: display_name,
      realName: real_name,
      timezone: tz,
      title,
      email,
      photoUrl: image_original,
      status: { text: status_text, emoji: status_emoji },
      isAdmin: is_admin
    };
  }

  citationFormat({ id }) {
    return `<@${id}>`;
  }
}

module.exports = new SlackProvider();
