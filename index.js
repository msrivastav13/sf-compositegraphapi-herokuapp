const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const jsforce = require("jsforce");
const { getToken } = require("sf-jwt-token");
const Request = require("./compositeGraphRequest");

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();
app.use(helmet());
app.use(compression());

const conn = new jsforce.Connection();

app.get("/", async (req, res) => {
  try {
    const jwttokenresponse = await getToken({
      iss: process.env.CLIENT_ID,
      sub: process.env.USERNAME,
      aud: process.env.LOGIN_URL,
      privateKey: process.env.PRIVATE_KEY,
    });
    conn.initialize({
      instanceUrl: jwttokenresponse.instance_url,
      accessToken: jwttokenresponse.access_token,
    });

    const lead = { LastName: "Mohith", Company: "Salesforce" };
    const campaign = { Name: "Test Campaign" };
    const campaignMember = {
      campaignId: "@{Campaign1.Id}",
      leadId: "@{lead1.Id}",
    };

    const leadInput = new Request.CompositeSubRequest(
      "POST",
      "/services/data/v51.0/sobjects/Lead/",
      "Lead1",
      lead
    );
    const campaignInput = new Request.CompositeSubRequest(
      "POST",
      "/services/data/v51.0/sobjects/Campaign/",
      "Campaign1",
      campaign
    );
    const campiagnMemberInput = new Request.CompositeSubRequest(
      "POST",
      "/services/data/v51.0/sobjects/CampaignMember/",
      "CampaignMember1",
      campaignMember
    );

    const graph = new Request.Graph("leadgraph", [
      leadInput,
      campaignInput,
      campiagnMemberInput,
    ]);
    const finalRequest = new Request.CompositeGraphRequest([graph]);

    console.log(JSON.stringify(finalRequest));

    const response = await conn.requestPost(
      "/services/data/v51.0/composite/graph",
      finalRequest
    );

    //const accounts = await conn.query("Select Id, Name From Account LIMIT 20");
    res.json(response);
  } catch (e) {
    console.log(e);
    res.json(JSON.stringify(e));
  }
});
app.listen(PORT, () => {
  console.log("Server Started on " + HOST + "on port " + PORT);
});
