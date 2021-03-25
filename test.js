const Request = require("./compositeGraphRequest");

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
  campaignId: "@{Campaign1.Id}",
  leadId: "@{Lead1.Id}",
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
