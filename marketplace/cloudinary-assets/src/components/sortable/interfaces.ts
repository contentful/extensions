import { CloudinaryResource, Config } from '../../interfaces';
import { CloudinaryThumbnailProps } from '../cloudinaryThumbnail/cloudinaryThumbnail';

export interface SortableElementProperties {
  onChange?: (data: CloudinaryResource[]) => void;
  config: Config;
  resources: CloudinaryResource[];
}

export interface SortableContainerData {
  config: Config;
  resources: CloudinaryResource[];
  deleteFnc: (index: number) => void;
}

export interface SortableElementState {
  readonly resources: CloudinaryResource[];
}

export interface SortableElementData extends CloudinaryThumbnailProps {
  readonly index: number;
  deleteFnc: (index: number) => void;
}
