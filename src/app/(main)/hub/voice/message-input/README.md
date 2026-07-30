# Voice → Message Input — Implementation Guide

How to add voice dictation into a chat message composer using AI SDK Elements, with optional spoken assistant replies.

Working reference: `/hub/voice/message-input`  
Demo source: `_components/voice-message-input-demo.tsx`

---

## Goal

1. User toggles the mic on, speaks, toggles off.
2. Transcript is inserted into the message input (editable).
3. User sends when ready — **do not auto-send**.
4. Optionally: speak assistant replies with a selected OpenAI voice and show synced transcription while audio plays.

---

## Install

```bash
npx shadcn@latest add \
  https://elements.ai-sdk.dev/api/registry/speech-input.json \
  https://elements.ai-sdk.dev/api/registry/voice-selector.json \
  https://elements.ai-sdk.dev/api/registry/transcription.json \
  https://elements.ai-sdk.dev/api/registry/audio-player.json
```

Also reuse (already in this repo):

| Piece | Role |
| --- | --- |
| `PromptInput` / `PromptInputTextarea` | Composer where transcript lands |
| `MicSelector` | Mic permission + device picker |
| `/api/voice/transcribe` | Whisper STT for recorded audio |
| `/api/voice/speak` | OpenAI TTS (`provider: "openai"`, optional `voice`) |
| `/api/voice/chat` | Short replies suitable for speech (or your own chat API) |

---

## Styling

Keep Elements / shadcn structure as installed. **Do not invent a parallel visual system for this feature.**

Apply **Meridian classnames** (existing design tokens, utility classes, and shared UI primitives) to:

- `SpeechInput`
- `MicSelector`
- `PromptInput` / actions
- `VoiceSelector` trigger and dialog chrome
- `AudioPlayer` / `Transcription` containers

Prefer `className` on the Element roots and Meridian wrappers (`Button`, `PromptInputAction`, layout containers) over rewriting component internals. Match whatever composer you are integrating into (playground chat, coach UI, etc.).

---

## Recommended capture path: MediaRecorder → Whisper

**Prefer this for product use.** When `onAudioRecorded` is provided, `SpeechInput` should use MediaRecorder and send the blob to your transcription API.

Web Speech API alone is unreliable: many Chromium forks (Brave, Arc, locked-down Chrome) expose `SpeechRecognition` but fail immediately with a `network` error — the mic appears to pulse on then off with no capture.

### Behaviour

| Step | What happens |
| --- | --- |
| Toggle on | Request mic (if needed), start recording, short start beep, stay in listening state |
| While armed | Keep recording until the user toggles off |
| Toggle off | Stop recorder → `onAudioRecorded(blob)` → Whisper → append text to input |

Requires a **secure context** (`https` or `localhost`).

### Wire-up

```tsx
const handleTranscriptionChange = (text: string) => {
  const transcript = text.trim();
  if (!transcript) return;
  setInput((prev) => {
    const base = prev.trim();
    return base ? `${base} ${transcript}` : transcript;
  });
};

const handleAudioRecorded = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");
  formData.append("provider", "openai");

  const response = await fetch("/api/voice/transcribe", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Transcription failed");

  const data = (await response.json()) as { text?: string };
  return data.text?.trim() ?? "";
};

// Composer actions row (styling via Meridian classnames on these nodes)
<>
  <SpeechInput
    className="/* Meridian classnames */"
    audioDeviceId={selectedMicId || undefined}
    onTranscriptionChange={handleTranscriptionChange}
    onAudioRecorded={handleAudioRecorded}
    onCaptureError={setCaptureError}
  />
  <MicSelector
    className="/* Meridian classnames */"
    value={selectedMicId}
    onValueChange={setSelectedMicId}
  />
</>
```

Pass `audioDeviceId` from `MicSelector` so recording uses the chosen input.

---

## Microphone permissions

1. Request on **user intent** (open device picker or press mic) — not on page load.
2. Place `MicSelector` next to `SpeechInput` in the composer actions (typically to the right of the mic).
3. If permission is `denied`, show clear copy pointing to browser site settings, then retry via “Enable microphone”.
4. Handle stuck permission prompts with a timeout (see `MicSelector` / `useAudioDevices` — some browsers never surface the dialog).
5. Surface `onCaptureError` in the UI so failures are not silent.

---

## Optional: voice selection + spoken replies

Only needed if assistant replies should be read aloud.

1. `VoiceSelector` — list OpenAI voices (`alloy`, `ash`, `ballad`, …); preview via `/api/voice/speak`.
2. Gate playback with a **Speak replies** toggle.
3. When an assistant message completes and the toggle is on, call `/api/voice/speak` with `{ provider: "openai", voice, text }`.
4. Play through `AudioPlayer`; feed `Transcription` for highlight-while-speaking.

### Transcription timings

Elements `Transcription` expects `{ text, startSecond, endSecond }[]`. OpenAI TTS does not return word timestamps.

For a demo-quality karaoke effect, synthesize timings by splitting the reply into sentences/clauses and assigning duration proportional to character length (see `synthesizeTranscriptionSegments`). Production can upgrade by re-transcribing the TTS audio with a segment-capable model.

---

## Composer structure (logical)

Layout is product-specific; structure only:

```
[ optional: VoiceSelector | Speak replies ]
[ message list ]
[ optional: AudioPlayer + Transcription while speaking a reply ]
[ PromptInput
    textarea
    actions: SpeechInput | MicSelector | … | Send ]
```

Apply Meridian classnames to each of these regions so the feature matches the host surface.

---

## Implementation gotchas

1. **`PromptInputAction` / Tooltip `asChild`** — the trigger passes its own `onClick`. `SpeechInput` must **compose** that handler with the listen toggle; never let `{...props}` overwrite `onClick` after the toggle handler.
2. **Always provide `onAudioRecorded`** for product capture — do not ship Web Speech–only.
3. **Insert into the input, don’t auto-send** — voice → edit → send is the integration contract.
4. **Secure context required** for mic access.

---

## Checklist

- [ ] Elements installed (`speech-input`, and optionally `voice-selector`, `transcription`, `audio-player`)
- [ ] Meridian classnames applied to Elements + composer chrome (no one-off visual system)
- [ ] `SpeechInput` + `MicSelector` in composer actions
- [ ] `onAudioRecorded` → `/api/voice/transcribe` (or equivalent)
- [ ] `audioDeviceId` wired from `MicSelector`
- [ ] Transcript appends to controlled input state; user edits before send
- [ ] Permission denied / capture error UI
- [ ] Secure context; graceful disable if MediaRecorder unavailable
- [ ] (Optional) Voice selector + speak-replies + AudioPlayer/Transcription

---

## Reference

Hub demo: `/hub/voice/message-input`  
Implementation: `src/app/(main)/hub/voice/message-input/_components/voice-message-input-demo.tsx`
