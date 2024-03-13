/**
 *
 * @param {import("zerespluginlibrary").Plugin} Plugin
 * @param {import("zerespluginlibrary").BoundAPI} Library
 * @returns
 */
module.exports = (Plugin, Library) => {
    const { Logger } = Library;
    const { ContextMenu } = window.BdApi;

    return class PasteAndSend extends Plugin {
        onStart() {
            try {
                this.patchContextMenu();
                Logger.info("Plugin enabled, context menu patched!");
            } catch (err) {
                Logger.info("Errored while patching.");
                Logger.info(err);
            }
        }

        onStop() {
            this.contextMenuPatch?.();
            Logger.info("Plugin disabled, context menu unpatched!");
        }

        patchContextMenu() {
            // Extract callback to global scope as it is required for unpatching
            const callback = (tree, props) => {
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

                const copyGroup =
                    tree.props.children[tree.props.children.length - 1];
                copyGroup.props.children.push(
                    ContextMenu.buildItem({
                        id: "pas-button",
                        label: "Paste and Send",
                        action: async () => {
                            // Paste...
                            DiscordNative.clipboard.paste();
                            // ...and send
                            setTimeout(() => {
                                const result = target.dispatchEvent(enterEvent);
                            }, 75);
                        },
                    })
                );
            };

            this.contextMenuPatch = ContextMenu.patch(
                "textarea-context",
                callback
            );
        }
    };
};
