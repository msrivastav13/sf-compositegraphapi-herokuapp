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
        const leadInput = new Request.CompositeSubRequestBuilder()
            .withMethod("POST")
            .withUrl("/services/data/v51.0/sobjects/Lead/")
            .withReferenceId("Lead1")
            .withBody(lead)
            .build();

        const campaign = { Name: "Test Campaign" };
        const campaignInput = new Request.CompositeSubRequestBuilder()
            .withMethod("POST")
            .withUrl("/services/data/v51.0/sobjects/Campaign/")
            .withReferenceId("Campaign1")
            .withBody(campaign)
            .build();

        const campaignMember = {
            campaignId: "@{Campaign1.id}",
            leadId: "@{Lead1.id}",
        };
        const campiagnMemberInput = new Request.CompositeSubRequestBuilder()
            .withMethod("POST")
            .withUrl("/services/data/v51.0/sobjects/CampaignMember/")
            .withReferenceId("CampaignMember1")
            .withBody(campaignMember)
            .build();

        const graph1 = new Request.GraphBuilder()
            .withGraphId("leadgraph")
            .addCompositeRequest(leadInput)
            .addCompositeRequest(campaignInput)
            .addCompositeRequest(campiagnMemberInput)
            .build();

        const requestBody = new Request.CompositeGraphBuilder()
            .addGraph(graph1)
            .build();

        console.log(JSON.stringify(requestBody));

        const response = await conn.requestPost(
            "/services/data/v51.0/composite/graph",
            requestBody
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
