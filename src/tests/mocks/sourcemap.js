export class SourceMapGenerator {
    addMapping() {}
    toString() { return ''; }
}

export class SourceMapConsumer {
    static with() { return Promise.resolve(); }
}

export class SourceNode {
    toString() { return ''; }
    toStringWithSourceMap() { return { code: '', map: new SourceMapGenerator() }; }
} 