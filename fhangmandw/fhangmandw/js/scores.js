var points;
var schoolname;
var highscores = [];

function initStore() {
    if (!store.enabled) {
        alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
        return
    }
}

loadStore();

//createHighscorelist()
