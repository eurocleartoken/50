/* €50 — AI Assistant Widget (Rule-based, No API) */
(function() {
    const knowledgeBase = [
        {
            keywords: ['buy', 'purchase', 'how to buy', 'купить', 'где купить'],
            answer: `You can buy **€50** in 3 ways:<br><br>
            💳 <b>Card / OpenSea:</b> <a href="https://opensea.io/token/solana/3QV2nmst2e9bdr4VLEKgdmwXBsPVCWykYDMBvh9zNAQP" target="_blank">Buy on OpenSea</a><br>
            🔄 <b>Jupiter Swap:</b> <a href="https://jup.ag/swap/SOL-3QV2nmst2e9bdr4VLEKgdmwXBsPVCWykYDMBvh9zNAQP" target="_blank">Swap on Jupiter</a><br>
            🦄 <b>Uniswap:</b> <a href="https://app.uniswap.org/explore/tokens/solana/3QV2nmst2e9bdr4VLEKgdmwXBsPVCWykYDMBvh9zNAQP" target="_blank">Buy on Uniswap</a>`
        },
        {
            keywords: ['price', 'cost', 'цена', 'стоимость', 'how much', 'target'],
            answer: `The launch price is **€0.05**. The target is **×100 to €5.00**.<br><br>Check live data on <a href="https://www.geckoterminal.com/solana/pools/6ts3hhPJmPoSRFKKVGC9SUqe1zqDEfSMsRfoFRupycRz" target="_blank">GeckoTerminal</a>.`
        },
        {
            keywords: ['contract', 'address', 'контракт', 'адрес', 'ca'],
            answer: `The official contract address for €50 is:<br><br><code style="background:#1A1E41; padding:4px 8px; border-radius:4px; font-size:11px; word-break:break-all; color:#FFD700;">3QV2nmst2e9bdr4VLEKgdmwXBsPVCWykYDMBvh9zNAQP</code><br><br><a href="https://solscan.io/token/3QV2nmst2e9bdr4VLEKgdmwXBsPVCWykYDMBvh9zNAQP" target="_blank">🔍 Verify on Solscan</a>`
        },
        {
            keywords: ['pool', 'liquidity', 'meteora', 'uniswap', 'пул', 'ликвидность'],
            answer: `€50 liquidity is available on Meteora DAMM V2.<br><br>Pool address: <code style="font-size:11px; color:#4A8CFF;">6ts3hhPJmPoSRFKKVGC9SUqe1zqDEfSMsRfoFRupycRz</code><br><br>Check all routing options on the <a href="ecosystem.html">Ecosystem Map</a>.`
        },
        {
            keywords: ['ecosystem', 'what is', 'about', 'экосистема', 'что это'],
            answer: `**€50** is the 50-euro token of the One•Two•Three ecosystem on Solana. Built on **Token-2022** for institutional-grade finance, SEPA-ready, with 50B fixed supply.<br><br><a href="index.html">Read more on Home</a>`
        },
        {
            keywords: ['taxi', 'hub'],
            answer: `**$TAXI** is the secondary routing hub in the ecosystem. Routing through $ONE and $TAXI ensures the best liquidity path. See the <a href="ecosystem.html">Ecosystem Map</a>.`
        },
        {
            keywords: ['standard', 'token-2022', '2022'],
            answer: `€50 uses the **Token-2022** standard on Solana. This enables transfer fees, confidential transfers, and compliance hooks for institutional-grade DeFi.`
        }
    ];

    const widgetHTML = `
        <style>
            #ai-agent-btn {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                width: 60px; height: 60px; border-radius: 50%;
                background: #E85D04; color: #fff; border: 2px solid #ff7a29;
                font-size: 28px; cursor: pointer; box-shadow: 0 4px 20px rgba(232, 93, 4, 0.6);
                transition: 0.3s; display: flex; align-items: center; justify-content: center;
            }
            #ai-agent-btn:hover { transform: scale(1.1); background: #ff7a29; color: #0A0E27; }
            
            #ai-agent-window {
                position: fixed; bottom: 90px; right: 20px; z-index: 9999;
                width: 350px; max-width: calc(100vw - 40px);
                background: #0A0E27; border: 1px solid #1E2350; border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                display: none; flex-direction: column; overflow: hidden;
                font-family: 'Segoe UI', system-ui, sans-serif;
            }
            #ai-agent-window.open { display: flex; }
            
            #ai-header {
                background: #1A1E41; padding: 12px 16px; border-bottom: 1px solid #1E2350;
                display: flex; justify-content: space-between; align-items: center;
            }
            #ai-header h3 { margin: 0; font-size: 15px; color: #fff; display: flex; align-items: center; gap: 8px; }
            #ai-header h3 span { color: #E85D04; }
            #ai-close { background: transparent; border: none; color: #8A94C8; font-size: 20px; cursor: pointer; }
            #ai-close:hover { color: #fff; }
            
            #ai-messages {
                padding: 16px; height: 300px; overflow-y: auto;
                display: flex; flex-direction: column; gap: 10px;
            }
            .ai-msg {
                padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5;
                max-width: 90%; word-wrap: break-word;
            }
            .ai-msg.bot { background: #1A1E41; color: #E0E6FF; align-self: flex-start; border-bottom-left-radius: 4px; }
            .ai-msg.user { background: #E85D04; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
            .ai-msg a { color: #E85D04; text-decoration: underline; }
            .ai-msg a:hover { color: #fff; }
            
            #ai-input-area {
                display: flex; padding: 12px; border-top: 1px solid #1E2350; background: #060920;
            }
            #ai-input {
                flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #1E2350;
                background: #0A0E27; color: #fff; outline: none; font-size: 13px;
            }
            #ai-input:focus { border-color: #E85D04; }
            #ai-send {
                margin-left: 8px; padding: 0 16px; background: #E85D04; color: #fff;
                border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
            }
            #ai-send:hover { background: #ff7a29; color: #0A0E27; }

            #ai-suggestions {
                padding: 0 16px 12px; display: flex; gap: 6px; flex-wrap: wrap; background: #060920;
            }
            .ai-chip {
                background: rgba(232, 93, 4, 0.1); color: #E85D04; border: 1px solid rgba(232, 93, 4, 0.3);
                padding: 4px 10px; border-radius: 12px; font-size: 11px; cursor: pointer; transition: 0.2s;
            }
            .ai-chip:hover { background: #E85D04; color: #fff; }

            @media (max-width: 480px) {
                #ai-agent-window { width: calc(100vw - 40px); bottom: 80px; }
                #ai-messages { height: 250px; }
            }
        </style>

        <button id="ai-agent-btn" title="Ask AI about €50">🤖</button>

        <div id="ai-agent-window">
            <div id="ai-header">
                <h3>🤖 <span>€50</span> AI Assistant</h3>
                <button id="ai-close">×</button>
            </div>
            <div id="ai-messages">
                <div class="ai-msg bot">Hello! I'm the <b>€50</b> AI Assistant. Ask me about how to buy, the contract address, or the ecosystem.</div>
            </div>
            <div id="ai-suggestions">
                <span class="ai-chip" data-q="How to buy?">How to buy?</span>
                <span class="ai-chip" data-q="What is the price?">Price</span>
                <span class="ai-chip" data-q="Contract address">Contract</span>
                <span class="ai-chip" data-q="What is €50?">About</span>
            </div>
            <div id="ai-input-area">
                <input type="text" id="ai-input" placeholder="Ask me anything..." autocomplete="off" />
                <button id="ai-send">➤</button>
            </div>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.createElement('div');
        container.innerHTML = widgetHTML;
        document.body.appendChild(container);

        const btn = document.getElementById('ai-agent-btn');
        const win = document.getElementById('ai-agent-window');
        const closeBtn = document.getElementById('ai-close');
        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send');
        const messages = document.getElementById('ai-messages');
        const chips = document.querySelectorAll('.ai-chip');

        btn.addEventListener('click', () => {
            win.classList.toggle('open');
            if (win.classList.contains('open')) input.focus();
        });
        closeBtn.addEventListener('click', () => win.classList.remove('open'));

        function sendMessage(text) {
            if (!text.trim()) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'ai-msg user';
            userMsg.textContent = text;
            messages.appendChild(userMsg);
            messages.scrollTop = messages.scrollHeight;
            input.value = '';

            const typing = document.createElement('div');
            typing.className = 'ai-msg bot';
            typing.textContent = '...';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                typing.remove();
                const query = text.toLowerCase();
                let bestMatch = null;

                for (let item of knowledgeBase) {
                    if (item.keywords.some(k => query.includes(k))) {
                        bestMatch = item.answer;
                        break;
                    }
                }

                const botMsg = document.createElement('div');
                botMsg.className = 'ai-msg bot';
                
                if (bestMatch) {
                    botMsg.innerHTML = bestMatch;
                } else {
                    botMsg.innerHTML = `I'm not sure. Try asking: <br>• "How to buy?"<br>• "Price"<br>• "Contract"<br>• Or check the <a href="ecosystem.html">Ecosystem Map</a>.`;
                }
                
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 500);
        }

        sendBtn.addEventListener('click', () => sendMessage(input.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage(input.value);
        });

        chips.forEach(chip => {
            chip.addEventListener('click', () => sendMessage(chip.dataset.q));
        });
    });
})();
