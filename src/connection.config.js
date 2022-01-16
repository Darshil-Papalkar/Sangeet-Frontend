export const apiLinks = {
    baseURL: "http://localhost:5000/" // local Development
    // baseURL : "http://3.110.55.124:5000/" // testing
    // baseURL: "http://musicBackend.com/" // Production
};

// get Links
apiLinks.status = apiLinks.baseURL+"status";
apiLinks.getAudio = apiLinks.baseURL+"audio/";
apiLinks.getImage = apiLinks.baseURL+"image/";
apiLinks.getAudioKey = apiLinks.baseURL+"audioKey/";
apiLinks.getImageKey = apiLinks.baseURL+"imageKey/";
apiLinks.getArtistImgKey = apiLinks.baseURL+"artistImageKey/";
apiLinks.getAllAudio = apiLinks.baseURL+"getAllMusic";
apiLinks.getAllAudioDetails = apiLinks.baseURL+"getAllMusicDetails";
apiLinks.getAllArtists = apiLinks.baseURL+"getAllArtists";
apiLinks.getAllGenre = apiLinks.baseURL+"getAllGenre";
apiLinks.getAllCategory = apiLinks.baseURL+"getAllCategory";

// post Links
apiLinks.postSong = apiLinks.baseURL+"addNewSong";
apiLinks.addArtists = apiLinks.baseURL+"postNewArtists";
apiLinks.addGenre = apiLinks.baseURL+"postNewGenre";
apiLinks.addCategory = apiLinks.baseURL+"postNewCategory";

// delete Links
apiLinks.deleteMusic = apiLinks.baseURL+"admin/musicDelete/";
apiLinks.deleteArtist = apiLinks.baseURL+"admin/artistDelete/";
apiLinks.deleteGenre = apiLinks.baseURL+"admin/genreDelete/";
apiLinks.deleteCategory = apiLinks.baseURL+"admin/categoryDelete/"

// put Links
apiLinks.updateAdminData = apiLinks.baseURL+"admin/updateData/";
apiLinks.updateAdminArtist = apiLinks.baseURL+"admin/updateArtist/";
apiLinks.updateAdminGenre = apiLinks.baseURL+"admin/updateGenre/";
apiLinks.updateAdminCategory = apiLinks.baseURL+"admin/updateCategory/";
