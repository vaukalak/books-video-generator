import { format } from "date-fns";
import { Context, Timing } from "../context";

export function renderVideoBackground(context: Context) {
  return (timing: Timing) => {
    const fps = 30;
    const bgLoopDuration = Math.round(51349.333 * fps);
    const startOffsetMs = (timing.startTimeSec * fps) % bgLoopDuration;
    console.log({ startOffsetMs });
    const startOffset = format((startOffsetMs * 1000) / fps, "00:mm:ss.SSS");
    return `-ss ${startOffset} -i resource/${context.book}/background.mp4`;
  };
}
