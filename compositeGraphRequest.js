class CompositeGraphBuilder {
    constructor() {
        this.compositeRequest = {};
        this.compositeRequest.graphs = [];
    }
    addGraph(graph) {
        this.compositeRequest.graphs.push(graph);
        return this;
    }
    build() {
        return this.compositeRequest;
    }
}

class CompositeSubRequestBuilder {
    constructor() {
        this.compositeSubRequest = {};
    }
    withMethod(method) {
        this.compositeSubRequest.method = method;
        return this;
    }
    withUrl(url){
        this.compositeSubRequest.url = url;
        return this;
    }
    withBody(body){
        this.compositeSubRequest.body = body;
        return this;
    }
    withReferenceId(referenceId) {
        this.compositeSubRequest.referenceId = referenceId;
        return this;
    }
    build() {
        return this.compositeSubRequest;
    }
}

class GraphBuilder {
    constructor() {
        this.graph = {};
        this.graph.compositeRequest = [];
    }
    withGraphId(graphId){
        this.graph.graphId = graphId;
        return this;
    }
    addCompositeRequest(compositeRequest) {
        this.graph.compositeRequest.push(compositeRequest);
        return this;
    }
    build() {
        return this.graph;
    }
}

module.exports = {CompositeGraphBuilder, CompositeSubRequestBuilder, GraphBuilder};