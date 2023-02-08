import { Timestamp } from '@google-cloud/firestore';
import { atom } from 'recoil';

export interface Tracker {
    id: string;
    creatorId: string;
    totalMembers: number;
    pageType: 'public' | 'limited' | 'private';
    dateCreated?: Timestamp;
    imageURL?: string;
};

export interface TrackerBits {
    trackerId: string;
    canEdit?: boolean;
    imageURL?: string;
}

interface TrackerCurrent {
    myTrackers: TrackerBits[];
    currentTracker?: Tracker;
    snippetsReturned: boolean,
}

const defTrackerCurrent: TrackerCurrent = {
    myTrackers: [],
    snippetsReturned: false,
}

export const trackerCurrent = atom<TrackerCurrent>({
    key: "trackerCurrent",
    default: defTrackerCurrent,
})