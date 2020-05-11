import _ from 'lodash';

const playlistUtils = {
    getImage(item) {
        return _.get(item, 'image') || _.get(item, 'images[0].url');
    }
};

export { playlistUtils };
