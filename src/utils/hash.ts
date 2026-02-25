import crypto from "crypto";

export function hashTranscript(transcript: string) {
  return crypto
    .createHash("sha256")
    .update(transcript)
    .digest("hex");
}