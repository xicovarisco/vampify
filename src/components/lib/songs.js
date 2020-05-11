import _ from 'lodash';

const songUtils = {
    getImage(item) {
        return _.get(item, 'image') || _.get(item, 'album.images[0].url');
    }
};

export { songUtils };
