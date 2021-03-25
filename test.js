const request = require('./compositeGraphBuilder');

const lead = {LastName : "Trailhead", Company: "Salesforce"};
const leadCompositeRequest = new request.CompositeSubRequestBuilder()
    .withBody(lead)
    .withMethod("POST")
    .withReferenceId("Lead1")
    .withUrl("/services/data/v50.0/sobjects/Lead")
    .build();

const campaign = {Name : "Campaign1"};
const campaignCompositeRequest = new request.CompositeSubRequestBuilder()
    .withBody(campaign)
    .withMethod("POST")
    .withReferenceId("Campaign1")
    .withUrl("/services/data/v50.0/sobjects/Campaign")
    .build();

const campaignMember = {leadId: '@{Lead1.id}', campaignId: '@{Campaign1.id}'};
const campaignMemberCompositeRequest = new request.CompositeSubRequestBuilder()
    .withBody(campaignMember)
    .withMethod("POST")
    .withReferenceId("campaignMember1")
    .withUrl("/services/data/v50.0/sobjects/CampaignMember")
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

console.log(JSON.stringify(graphApiInput));
