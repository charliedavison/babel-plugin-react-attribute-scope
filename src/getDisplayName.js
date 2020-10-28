const path = require('path');

const getBlockName = file => {
    const name = path.basename(file.opts.filename, path.extname(file.opts.filename));
    return name !== 'index' ? name : path.basename(path.dirname(file.opts.filename));
};

const getName = t => filepath => {
    let namedNode;

    filepath.find(item => {
        // const X = styled
        if (item.isAssignmentExpression()) {
            namedNode = item.node.left;
            // const X = { Y: styled }
        } else if (item.isObjectProperty()) {
            namedNode = item.node.key;
            // class Y { (static) X = styled }
        } else if (item.isClassProperty()) {
            namedNode = item.node.key;
            // let X; X = styled
        } else if (item.isVariableDeclarator()) {
            namedNode = item.node.id;
        } else if (item.isStatement()) {
            // we've hit a statement, we should stop crawling up
            return true;
        }

        // we've got an displayName (if we need it) no need to continue
        if (namedNode) {
            return true;
        }

        return false;
    });

    // foo.bar -> bar
    if (t.isMemberExpression(namedNode)) {
        namedNode = namedNode.property;
    }

    // identifiers are the only thing we can reliably get a name from
    return t.isIdentifier(namedNode) ? namedNode.name : undefined;
};

const getDisplayName = t => (filepath, state) => {
    const { file } = state;
    const componentName = getName(t)(filepath);
    if (file) {
        const blockName = getBlockName(file);
        if (blockName === componentName) {
            return componentName;
        }

        return componentName ? `${blockName}__${componentName}` : blockName;
    }

    return componentName;
};

module.exports = getDisplayName;
