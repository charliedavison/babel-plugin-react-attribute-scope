const getDisplayName = require('./get-display-name');

export default function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            Program: function Program(path, state) {
                const property = state.opts.property || 'data-hook';

                let displayName = getDisplayName(t)(path, state);

                path.traverse({
                    JSXElement: function JSXElement(path2) {
                        const attributes = path2.node.openingElement.attributes;
                        const existingDataHookIndex = Array.from(attributes).findIndex(attribute => attribute.name.name === property)

                        if (existingDataHookIndex === -1) return;

                        const hookValue = Array.from(attributes)[existingDataHookIndex].value.value;
                        displayName += `-${hookValue}`;

                        path2.node.openingElement.attributes.splice(existingDataHookIndex, 1)

                        path2.node.openingElement.attributes.push(
                            t.jSXAttribute(t.jSXIdentifier(property), t.stringLiteral(`${displayName}`)),
                        );
                    },
                });
            },
        },
    };
}
