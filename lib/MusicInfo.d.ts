export default MusicInfo;
declare class MusicInfo {
    static getMusicInfoAsync(fileUri: any, options: any): Promise<MusicInfoResponse>;
}
export declare class MusicInfoResponse {
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    picture?: Picture
}
export declare class Picture {
    description: string;
    pictureData: string;
}