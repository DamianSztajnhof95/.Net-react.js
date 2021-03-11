import { computed, makeAutoObservable,  reaction,  runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPhoto, IProfile, IUserActivity } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeAutoObservable(this);
        reaction(
            () => this.activeTab,activeTab=>{
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate)
                } else {
                    this.followings = [];
                }
        }
        )
    }

    profile: IProfile | null = null;
    loadingProfile = true;
    uploadingPhoto = false;
    loading = false
    followings: IProfile[] = [];
    activeTab: number = 0;
    userActivities: IUserActivity[] = []
    loadingActivities = false;
    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username
        } else {
            return false
        }
    }

    loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true
        try {
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            })
        } catch (error) {
            toast.error('Problem loading Activities')
            runInAction(() => {
                this.loadingActivities = false;
            })
        }
    }

    setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction(()=> {
                this.profile = profile;
                this.loadingProfile = false;
            })
            }catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
            })
            console.log(error);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file)
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image=photo.url
                    }
                }
                this.uploadingPhoto=false
            })
        } catch(error) {
            console.log(error)
            toast.error('Problem uploading photo')
            runInAction(() => {
                this.uploadingPhoto=false
            })
        }
    }
    setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem setting photo as main')
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id)
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id)
                this.loading=false
            })
        } catch (error) {
            toast.error('Problem deleting the photo')
            runInAction(() => {
                this.loading=false
            })
        }
    }

    updateProfile = async (profile: Partial<IProfile>) => {
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName !== this.rootStore.userStore.user!.displayName) {
                    this.rootStore.userStore.user!.displayName = profile.displayName!;
                }
                this.profile = { ...this.profile!, ...profile };
            })
        } catch (error) {
            toast.error('Problem updating profile');
        }
    }

    follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followingCount++;
                this.loading = false;
            })
        } catch (error) {
            toast.error('problem following user')
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction(() => {
                this.profile!.following = false;
                this.profile!.followingCount--;
                this.loading = false;
            })
        } catch (error) {
            toast.error('problem unfollowing user')
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem Loading followings');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}