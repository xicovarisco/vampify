import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import _ from 'lodash';

// Styles
import './view.scss';

const CardComponent = (props) => {
    const { image, name, description } = props;
    return (
        <Card className="cardComponent">
            <CardMedia
                className="cardMedia"
                image={image}
            />
            <CardContent className="cardContent">
                <h2>{name}</h2>
                <p>{description}</p>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => props.onAddToSavedPlaylist({ ..._.omit(props, ['onAddToSavedPlaylist']) })}
                >
                    Add to playlist
                </Button>
            </CardActions>
        </Card>
    );
};

export default CardComponent;
