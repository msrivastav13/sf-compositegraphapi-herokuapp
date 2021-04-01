## SF-COMPOSITEGRAPHAPI-HEROKUAPP

This is a Node.js implementation for [Salesforce Graph API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/using_resources_composite_graph.htm).

The `compositeGraphBuilder.js` shows how to use [fluent interface](https://martinfowler.com/bliki/FluentInterface.html) to build request for Salesforce Composite Graph API.

Connection between Salesforce and Heroku is implemented using `ConnectedApps` and uses OAuth 2.0 JWT Bearer Flow for Server-to-Server Integration

## Example Implementation

``` javascript
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
```

## Learn More

check the code in the `index.js` file to learn how to use `jsforce` to make a call to invoke Salesforce Composite Graph API

To learn more on how about the authentication and implementation, watch the below videos

- [Implementing a JWT Server to Server OAuth between Salesforce and Heroku](https://www.youtube.com/watch?v=c5OZZsVkOKY)
- [Implementing a Node.js service on Heroku to work with Salesforce Composite Graph API](https://www.youtube.com/watch?v=6xf7MtyX8xg)




