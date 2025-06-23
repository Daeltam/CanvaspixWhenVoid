# CanvasPix Void Chat Responder

This userscript automatically listens to chat on [canvaspix.fun](https://canvaspix.fun) and, whenever a user posts a message containing `when void` or `!void` (case-insensitive), it fetches the content of the `/void` page and sends it back to the chat.

- Only user messages are detected, not system event messages.
- The script trims the response to 400 characters to avoid spam.
- Designed and maintained by **daeltam** and **GitHub Copilot**.

## How to use

1. Install [Violentmonkey](https://violentmonkey.github.io/) or [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Add this userscript.
3. Visit [canvaspix.fun](https://canvaspix.fun) and join the chat.
4. When someone types `when void` or `!void`, the script will automatically respond with the latest void info.

No configuration is necessary.  
Made by **daeltam** and **Copilot**.
