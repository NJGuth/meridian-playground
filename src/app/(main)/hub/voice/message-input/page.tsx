import { VoiceMessageInputDemo } from "./_components/voice-message-input-demo";

export default function VoiceMessageInputPage() {
  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-6">
      <div className="mb-4 shrink-0 space-y-1">
        <h1 className="font-medium text-lg">Voice → Message Input</h1>
        <p className="max-w-2xl text-muted-foreground text-sm/6">
          AI Elements composition: Speech Input fills the composer, Voice
          Selector picks OpenAI TTS, and Transcription syncs to spoken assistant
          replies. See the README in this folder for integration notes.
        </p>
      </div>
      <VoiceMessageInputDemo />
    </div>
  );
}
