import { observable, makeAutoObservable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore{
	rootStore: RootStore;
	constructor(rootStore: RootStore) {
		makeAutoObservable(this);
		this.rootStore = rootStore;
	}
	@observable.shallow modal = {
		open: false,
		body: null

	}

	openModal=(content: any)=>{
	this.modal.open = true;
	this.modal.body = content;
}	

	closeModal = () => {
		this.modal.open = false;
		this.modal.body = null;
	}


	
}