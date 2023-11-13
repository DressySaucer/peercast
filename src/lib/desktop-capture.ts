interface MandatoryContraints {
    mandatory?: {
        chromeMediaSource?: string;
        chromeMediaSourceId?: number;
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
    };
}

export interface ChromiumMediaStreamConstraints
    extends Omit<MediaStreamConstraints, "audio" | "video"> {
    audio?: boolean | MediaTrackConstraints | MandatoryContraints;
    video?: boolean | MediaTrackConstraints | MandatoryContraints;
}

export type ChromiumGetUserMedia = (
    constraints?: ChromiumMediaStreamConstraints | undefined,
) => Promise<MediaStream>;

export default {};
