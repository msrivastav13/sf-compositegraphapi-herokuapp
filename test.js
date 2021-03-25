const Request = require("./compositeGraphRequest");

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

const graph = new Request.Graph("leadgraph", [leadInput,campaignInput,campiagnMemberInput]);
const finalRequest = new Request.CompositeGraphRequest([graph]);

console.log(JSON.stringify(finalRequest));
