export interface ExtensionParameters {
  readonly cloudName: string;
  readonly apiKey: string;
  readonly apiKeySecret?: string;
  readonly username?: string;
  readonly maxFiles: number;
  readonly resourceType: "auto" | "image" | "raw" | "video";
  readonly folder?: string;
  readonly btnTxt: string;
}

export interface CloudinaryResponse {
  readonly assets: CloudinaryResource[];
  readonly mlId: string;
}

export interface CloudinaryResource {
  readonly public_id: string;
  readonly resource_type: "auto" | "image" | "raw" | "video";
  readonly type: string;
  readonly format: string;
  readonly version: number;
  readonly url: string;
  readonly secure_url: string;
  readonly width: number;
  readonly height: number;
  readonly bytes: number;
  readonly duration: number;
  readonly tags: string[];
  readonly context: {
    readonly custom: {
      readonly alt: string;
      readonly caption: string;
    };
    readonly created_at: string;
  };
}
