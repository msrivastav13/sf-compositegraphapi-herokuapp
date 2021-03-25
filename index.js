const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const jsforce = require('jsforce');
const { getToken } = require('sf-jwt-token');
const request = require('./compositeGraphBuilder');


const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();
app.use(helmet());
app.use(compression());

const conn = new jsforce.Connection();

app.get('/', async (req, res) => {
    try {
        const jwttokenresponse = await getToken({
            iss: process.env.CLIENT_ID,
            sub: process.env.USERNAME,
            aud: process.env.LOGIN_URL,
            privateKey: process.env.PRIVATE_KEY
        });
        conn.initialize({
            instanceUrl: jwttokenresponse.instance_url,
            accessToken: jwttokenresponse.access_token
        });


        const lead = { LastName: "Trailhead", Company: "Salesforce" };
        const leadCompositeRequest = new request.CompositeSubRequestBuilder()
            .withBody(lead)
            .withMethod("POST")
            .withReferenceId("Lead1")
            .withUrl("/services/data/v51.0/sobjects/Lead")
            .build();

        const campaign = { Name: "Campaign1" };
        const campaignCompositeRequest = new request.CompositeSubRequestBuilder()
            .withBody(campaign)
            .withMethod("POST")
            .withReferenceId("Campaign1")
            .withUrl("/services/data/v51.0/sobjects/Campaign")
            .build();

        const campaignMember = { leadId: '@{Lead1.id}', campaignId: '@{Campaign1.id}' };
        const campaignMemberCompositeRequest = new request.CompositeSubRequestBuilder()
            .withBody(campaignMember)
            .withMethod("POST")
            .withReferenceId("campaignMember1")
            .withUrl("/services/data/v51.0/sobjects/CampaignMember")
            .build();

        const graph1 = new request.GraphBuilder()
            .withGraphId("graph1")
            .addCompositeSubRequest(leadCompositeRequest)
            .addCompositeSubRequest(campaignCompositeRequest)
            .addCompositeSubRequest(campaignMemberCompositeRequest)
            .build();

        const graphApiInput = new request.CompositeGraphBuilder()
            .addGraph(graph1)
            .build();

        const resp = await conn.requestPost(
            '/services/data/v51.0/composite/graph',
            graphApiInput
        );

        res.json(resp);
    } catch (e) {
        console.log(e);
        res.json(JSON.stringify(e));
    }
});
app.listen(PORT, () => {
    console.log('Server Started on ' + HOST + 'on port ' + PORT);
});