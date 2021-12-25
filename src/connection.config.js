export const apiLinks = {
    baseURL: "http://localhost:5000/"
    // baseURL: "http://musicBackend.com/"
};

// get Links
apiLinks.status = apiLinks.baseURL+"status";
apiLinks.getAudio = apiLinks.baseURL+"audio/";
apiLinks.getImage = apiLinks.baseURL+"image/";
apiLinks.getAudioKey = apiLinks.baseURL+"audioKey/";
apiLinks.getImageKey = apiLinks.baseURL+"imageKey/";
apiLinks.getAllAudio = apiLinks.baseURL+"getAllMusic";

// post Links
apiLinks.postSong = apiLinks.baseURL+"addNewSong";
apiLinks.addArtists = apiLinks.baseURL+"postNewArtists";
apiLinks.addGenre = apiLinks.baseURL+"postNewGenre";
apiLinks.addCategory = apiLinks.baseURL+"postNewCategory";

// delete Links
apiLinks.deleteMusic = apiLinks.baseURL+"admin/musicDelete/";
apiLinks.deleteArtist = apiLinks.baseURL+"admin/artistDelete/";
