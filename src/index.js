const getDisplayName = require('./getDisplayName.js');

module.exports = function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            Program: function Program(path, state) {
                const property = state.opts.property;

                let displayName = getDisplayName(t)(path, state);

                path.traverse({
                    JSXElement: function JSXElement(path2) {
                        const attributes = path2.node.openingElement.attributes;
                        const attributesArray = Array.from(attributes);
                        let isJSX = true;

                        const existingDataHookIndex = attributesArray.findIndex(attribute => {
                            if (attribute.name && attribute.name.name) {
                                if(attribute.name.name === property) return true;

                                if (attribute.name.name === 'data-hook' && typeof attribute.value.value === 'string') {
                                    isJSX = false;
                                    return true;
                                }
                            }
                            return false;
                        });

                        if (existingDataHookIndex === -1) return;

                        const hookValue = attributesArray[existingDataHookIndex].value.value;
                        displayName += `-${hookValue}`;

                        path2.node.openingElement.attributes.splice(existingDataHookIndex, 1);

                        path2.node.openingElement.attributes.push(
                            t.jSXAttribute(t.jSXIdentifier(isJSX ? property : 'data-hook'), t.stringLiteral(`${displayName}`)),
                        );
                    },
                });
            },
        },
    };
}
