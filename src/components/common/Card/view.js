import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

// Styles
import './view.scss';

const CardComponent = () => {
    return (
        <Card className="cardComponent">
            <CardMedia
                className="cardMedia"
                image="https://source.unsplash.com/random"
                title="Image title"
            />
            <CardContent className="cardContent">
                <h2>Heading</h2>
                <p>This is a media card. You can use this section to describe the content.</p>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">
                    Add to playlist
                </Button>
            </CardActions>
        </Card>
    );
};

export default CardComponent;
