import { ViewType } from '../gathera-lib/enums/user';
import { UserPreview } from './User';

interface GenericView {
    _id: string;
    user: UserPreview;
    view_type: ViewType;
    updatedAt: Date;
}

export interface ProfileView extends GenericView {
    profile: string;
}

export interface GatheringView extends GenericView {
    gathering: string;
}

export type View = ProfileView | GatheringView;
