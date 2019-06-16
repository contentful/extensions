import { CloudinaryResource, ExtensionParameters } from '../../interface';
import { string } from 'prop-types';

export interface SortableElementProperties {
  readonly results: CloudinaryResource[];
  readonly config: ExtensionParameters;
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

export interface AssetData {
  asset: CloudinaryResource;
}
