class CompositeGraphRequest {
    graphs = [];
    constructor(graphs) {
        this.graphs = graphs;
    }
}

class CompositeSubRequest {
    method;
    url;
    referenceId;
    body;
    constructor(method, url, referenceId, body) {
        this.method = method;
        this.url = url;
        this.referenceId = referenceId;
        this.body = body;
    }
}

class Graph {
    graphId;
    compositeRequest = [];
    constructor(graphId, compositeRequest) {
        this.graphId = graphId;
        this.compositeRequest = compositeRequest;
    }
}

module.exports = {CompositeGraphRequest, CompositeSubRequest, Graph};