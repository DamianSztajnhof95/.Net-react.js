import { createContext } from "react";
import ActivityStore from "./ActivityStore";
import CommonStore from "./commonStore";
import ModalStore from "./ModalStore";
import ProfileStore from "./profileStore";
import userStore from "./userStore";

export class RootStore {
    activityStore: ActivityStore;
    userStore: userStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    profileStore: ProfileStore
    constructor() {
        this.activityStore = new ActivityStore(this);
        this.userStore = new userStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
        this.profileStore = new ProfileStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());