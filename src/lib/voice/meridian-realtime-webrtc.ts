"use client";

import type { RealtimeTransportLayerConnectOptions } from "@openai/agents/realtime";
import { OpenAIRealtimeWebRTC } from "@openai/agents/realtime";

function extractApiError(body: string): string {
  try {
    const parsed = JSON.parse(body) as {
      error?: string | { message?: string };
    };
    if (typeof parsed.error === "string") return parsed.error;
    if (parsed.error?.message) return parsed.error.message;
  } catch {
    // not JSON — fall through
  }
  if (body.trimStart().startsWith("<!DOCTYPE") || body.includes("<html")) {
    return "Received an HTML page instead of a voice session (check you are signed in).";
  }
  return body.slice(0, 240);
}

function isRealtimeCallsRequest(input: RequestInfo | URL): boolean {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  return url.includes("/realtime/calls");
}

/**
 * WebRTC transport that surfaces OpenAI / proxy error bodies instead of the
 * opaque RTCPeerConnection "Expect line: v=" parse failure.
 */
export class MeridianOpenAIRealtimeWebRTC extends OpenAIRealtimeWebRTC {
  async connect(options: RealtimeTransportLayerConnectOptions): Promise<void> {
    const originalFetch = globalThis.fetch.bind(globalThis);

    globalThis.fetch = async (input, init) => {
      const response = await originalFetch(input, init);

      if (!isRealtimeCallsRequest(input)) {
        return response;
      }

      const body = await response.clone().text();

      if (!response.ok) {
        throw new Error(
          `OpenAI realtime call failed (${response.status}): ${extractApiError(body)}`,
        );
      }

      if (!body.trimStart().startsWith("v=")) {
        throw new Error(
          `OpenAI returned a non-SDP answer: ${extractApiError(body)}`,
        );
      }

      return response;
    };

    try {
      await super.connect(options);
    } finally {
      globalThis.fetch = originalFetch;
    }
  }
}
