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

class GraphBuilder {
    constructor() {
        this.graph = {};
        this.graph.compositeRequest = [];
    }

    withGraphId(graphId) {
        this.graph.graphId = graphId;
        return this;
    }

    addCompositeSubRequest(compositeSubRequest) {
        this.graph.compositeRequest.push(compositeSubRequest);
        return this;
    }

    build() {
        return this.graph;
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

    withUrl(Url) {
        this.compositeSubRequest.url = Url;
        return this;
    }

    withReferenceId(referenceId) {
        this.compositeSubRequest.referenceId = referenceId;
        return this;
    }

    withBody(body) {
        this.compositeSubRequest.body = body;
        return this;
    }

    build() {
        return this.compositeSubRequest;
    }
}

module.exports = {CompositeSubRequestBuilder, GraphBuilder, CompositeGraphBuilder};