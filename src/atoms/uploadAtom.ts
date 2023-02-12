import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export type Upload = {
    //id: string;
    trackerId: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    body: string;
    ticker: string;
    type: string;
    totalComments: number;
    totalVotes: number;
    imageURL?: string;
    trackerImageURL?: string;
    pdfURL?: string;
    trackerPDFURL?: string;
    uploadTime: Timestamp; 
};

// add bio
// add school


export type UploadVote = {
    id: string;
    uploadId: string;
    trackerId: string;
    voteNumber: number;
};

interface UploadState {
    selectedUpload: Upload | null; // returns single selected upload
    uploads: Upload[]; // returns all uploads in tracker
    uploadVotes: UploadVote[];
};

const startingUploadState: UploadState = {
    selectedUpload: null,
    uploads: [],
    uploadVotes: [],
};

export const uploadState = atom<UploadState>({
    key: 'uploadState',
    default: startingUploadState,
})