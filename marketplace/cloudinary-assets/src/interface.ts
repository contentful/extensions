export interface ExtensionParameters {
  readonly cloudName: string;
  readonly apiKey: string;
  readonly apiKeySecret?: string;
  readonly username?: string;
  readonly maxFiles: number;
  readonly btnTxt: string;
}

export interface CloudinaryResponse {
  readonly assets: CloudinaryResource[];
  readonly mlId: string;
}

export interface CloudinaryResource {
  readonly public_id: string;
  readonly resource_type: 'image' | 'raw' | 'video';
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
}
