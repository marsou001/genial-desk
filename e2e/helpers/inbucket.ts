import { sleep } from "./utils";

const INBUCKET_URL = "http://127.0.0.1:54324";

type MessagesResponseBody = {
  total: number;
  unread: number;
  count: number;
  messages_count: number;
  start: number;
  tags: string[];
  messages: { ID: string; MessageID: string; }[];
};

type InbucketMessage = {
  ID: string;
  MessageID: string;
  From: { Name: string; Address: string; }[];
  To: string[];
  Subject: string;
  Text: string;
  HTML: string;
};

export async function waitForConfirmationLink(
  email: string,
  maxRetries = 15,
  intervalMs = 1000,
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(
      `${INBUCKET_URL}/api/v1/messages`,
    );

    if (response.ok) {
      const messagesBody: MessagesResponseBody = await response.json();
      const messages = messagesBody.messages;

      if (messages.length > 0) {
        const latest = messages[messages.length - 1];
        const msg = await fetchMessage(latest.ID);
        const link = extractConfirmationLink(msg);

        if (link) {
          return link;
        }
      }
    }

    await sleep(intervalMs);
  }

  throw new Error(
    `Confirmation email not found for ${email} after ${maxRetries} retries`,
  );
}

export async function deleteAllMessages() {
  const response = await fetch(
    `${INBUCKET_URL}/api/v1/messages`, { method: "DELETE" }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch messages: ${response.statusText}`,
    );
  }
}

async function fetchMessage(
  id: string,
): Promise<InbucketMessage> {
  const response = await fetch(
    `${INBUCKET_URL}/api/v1/message/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch message ${id}: ${response.statusText}`,
    );
  }

  return response.json();
}

function extractConfirmationLink(message: InbucketMessage): string | null {
  const match = message.Text.match(
    /http:\/\/127\.0\.0\.1:54321\/auth\/v1\/verify\?token=[^"'\s<>]+/,
  );

  return match ? match[0] : null;
}