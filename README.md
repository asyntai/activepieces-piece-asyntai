# Asyntai piece for Activepieces

Ask an [Asyntai](https://asyntai.com) website assistant from inside an Activepieces flow.

Send a customer message to the assistant, get the answer back, and use it in the
rest of the flow: reply to an email, post to Slack, update a ticket.

## Install

The piece is published to npm as `@asyntai/piece-asyntai`.

1. Open Activepieces.
2. Go to **Settings → My Pieces → Install Piece**.
3. Type `@asyntai/piece-asyntai` and install it.

This needs a self-hosted instance or platform admin rights on Activepieces Cloud.

## Connect

1. Open the Asyntai dashboard, go to **Settings → API**, and create an API key.
2. In Activepieces, add an Asyntai connection and paste the key.

Asyntai API access needs a paid Asyntai plan.

## Actions

| Action | What it does |
| --- | --- |
| Ask Assistant | Sends a customer message to one Asyntai assistant and returns the answer. |
| Custom API Call | Calls any Asyntai API endpoint with the same connection. |

### Ask Assistant

Inputs:

- **Assistant Website** — which Asyntai assistant answers. The list loads from your account.
- **Customer Message** — the text to answer.
- **Conversation ID** — a stable value per customer or thread, such as an email address or a ticket ID. Reuse it to keep the conversation history.
- **Source Channel** — where the message arrived. Email channels add email-specific instructions.

Outputs:

- `answer` — the assistant reply.
- `conversation_id` — the thread the reply belongs to.
- `ai_disclosure` — the AI disclosure text. Show it to the customer.
- `success` — whether the call worked.

The action is not idempotent. Every call adds a message to the Asyntai
conversation history, so a retry can create a duplicate entry.

## Build

The piece uses `@activepieces/pieces-framework`. That package is not published
to npm at a current version, so the build runs inside an Activepieces checkout:

```bash
git clone https://github.com/activepieces/activepieces.git
cp -r src package.json tsconfig*.json .eslintrc.json \
  activepieces/packages/pieces/community/asyntai/
cd activepieces
# add "@asyntai/piece-asyntai" to the paths block in tsconfig.base.json
npm run publish-piece asyntai
```

The published artifact is a self-contained bundle. It carries no
`@activepieces/*` dependency, because the framework is inlined at build time.

## Licence

MIT
