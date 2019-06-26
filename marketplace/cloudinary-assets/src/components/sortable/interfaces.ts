import { CloudinaryResource, ExtensionParameters } from '../../interface';
import { CloudinaryThumbnailProps } from '../cloudinaryThumbnail/cloudinaryThumbnail';

export interface SortableElementProperties {
  onChange?: (data: CloudinaryResource[]) => void;
  config: ExtensionParameters;
  resources: CloudinaryResource[];
}

export interface SortableContainerData {
  config: ExtensionParameters;
  resources: CloudinaryResource[];
  deleteFnc: (index: number) => void;
}

export interface SortableElementState {
  readonly resources: CloudinaryResource[];
}

export interface SortableElementData extends AssetData {
  readonly index: number;
  deleteFnc: (index: number) => void;
}

export interface AssetData extends CloudinaryThumbnailProps {}
