// ==UserScript==
// @name         CanvasPix Void Chat Responder
// @namespace    daeltam.github.io
// @version      1.1
// @description  Auto-respond to "when void" or "!void" in chat with content from /void page
// @author       daeltam
// @match        https://canvaspix.fun/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fetch /void page content and return as plain text (strips HTML tags, keeps <br> as newlines)
    async function getVoidContent() {
        try {
            const resp = await fetch('https://canvaspix.fun/void');
            if (!resp.ok) {
                return "[void fetch error]";
            }
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let contentElem = doc.querySelector('.main-content, #main, body');
            let text = contentElem ? contentElem.innerHTML : doc.body.innerHTML;
            text = text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
            return text.trim();
        } catch (e) {
            return "[void fetch exception]";
        }
    }

    // Selectors
    const chatMessagesSelector = '.chat-container .chatarea .chatmsg';
    const chatInputSelector = '.chat-container form.chatinput input[type="text"]';
    const sendButtonSelector = '#sendbtn';

    let lastMessageId = null;

    function isVoidTrigger(text) {
        return /(^|\s)(when void|!void)(\s|$)/i.test(text);
    }

    function getLatestChatMessage() {
        let messages = document.querySelectorAll(chatMessagesSelector);
        if (!messages.length) {
            return null;
        }
        // Find the last user message (not system event)
        for (let i = messages.length - 1; i >= 0; i--) {
            const msgElem = messages[i];
            const msgSpan = msgElem.querySelector('.msg');
            if (!msgSpan) continue;
            // Skip system event messages
            if (msgSpan.classList.contains('event')) continue;
            const msgText = msgSpan.innerText || msgSpan.textContent;
            const msgId = msgElem.dataset.id || msgElem.getAttribute('id') || msgText + i;
            return { elem: msgElem, text: msgText, id: msgId };
        }
        return null;
    }

    function sendMessageToChat(message) {
        let input = document.querySelector(chatInputSelector);
        let sendBtn = document.querySelector(sendButtonSelector);
        if (!input || !sendBtn) return;
        input.value = message;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        sendBtn.click();
    }

    async function checkChat() {
        try {
            let msg = getLatestChatMessage();
            if (msg && msg.id !== lastMessageId && isVoidTrigger(msg.text)) {
                lastMessageId = msg.id;
                let voidContent = await getVoidContent();
                if (voidContent.length > 400) voidContent = voidContent.substring(0, 400) + '...';
                sendMessageToChat(voidContent);
            } else if (msg) {
                lastMessageId = msg.id;
            }
        } catch (e) {
            // Silently fail
        }
    }

    setInterval(checkChat, 1500);
})();
