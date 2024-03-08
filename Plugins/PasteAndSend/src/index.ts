const { ContextMenu } = BdApi;
const navId = "textarea-context";

type ContextMenuCallbackProps = {
    target: HTMLElement;
};

// Extract callback to global scope as it is required for unpatching
const callback = (
    tree: React.ReactElement,
    props: ContextMenuCallbackProps
) => {
    // Prepare target and keyboard event
    const target = props.target;
    const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true, // Make sure the event bubbles
        cancelable: false,
    });

    const copyGroup = tree.props.children[tree.props.children.length - 1];
    copyGroup.props.children.push(
        BdApi.ContextMenu.buildItem({
            id: "pas-button",
            label: "Paste and Send",
            action: async () => {
                // Paste...
                DiscordNative.clipboard.paste();
                // ...and send
                setTimeout(() => {
                    const result = target.dispatchEvent(enterEvent);
                }, 75)
            },
        })
    );
    return;
};

export default () => {
    return {
        start() {
            ContextMenu.patch(navId, callback);
        },
        stop() {
            ContextMenu.unpatch(navId, callback);
        },
    };
};
