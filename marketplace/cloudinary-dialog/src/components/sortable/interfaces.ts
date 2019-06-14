import { CloudinaryResource } from "../../interface";

export interface SortableElementProperties {
  readonly results: CloudinaryResource[];
  onChange?: (data: CloudinaryResource[]) => void;
}

export interface SortableElementState {
  readonly items: CloudinaryResource[];
}

export interface SortableElementData {
  readonly collection?: number;
  readonly index: number;
  readonly value: CloudinaryResource;
}
