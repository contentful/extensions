import { CloudinaryResource } from '../../cloudinaryInterfaces';
import { CloudinaryThumbnailProps } from '../cloudinaryThumbnail/cloudinaryThumbnail';
import { ExtensionParameters } from '../AppConfig/parameters';

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

export interface SortableElementData extends CloudinaryThumbnailProps {
  readonly index: number;
  deleteFnc: (index: number) => void;
}
