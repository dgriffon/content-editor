import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Card} from '../Card/';
import {Typography} from '@jahia/design-system-kit';

import {withStyles} from '@material-ui/core';

const styles = () => ({
    container: {
        display: 'flex',
        flex: '1 1 0%',
        overflow: 'auto',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
});

export const ImageListCmp = ({error, images, multipleSelectable, classes, onImageDoubleClick, onImageSelection, initialSelection, labelEmpty}) => {
    const [selectedImages, setSelectedImages] = useState(
        initialSelection
            .map(path => images.find(i => i.path === path))
            .filter(img => Boolean(img))
    );
    const onClickHandler = useCallback(img => {
        const imgSelectedIndex = selectedImages.findIndex(i => i.uuid === img.uuid);
        let newSelectedImg;
        if (imgSelectedIndex === -1) {
            newSelectedImg = multipleSelectable ? [...selectedImages, img] : [img];
        } else if (multipleSelectable) { // If it's an unselect for multipleSelectable
            newSelectedImg = [...selectedImages];
            newSelectedImg.splice(imgSelectedIndex, 1);
        } else { // If it's an unselect for singleSelectable then, set array empty
            newSelectedImg = [];
        }

        setSelectedImages(newSelectedImg);
        onImageSelection(multipleSelectable ? newSelectedImg : (newSelectedImg[0] || null));
    }, [multipleSelectable, onImageSelection, selectedImages]);

    if (error) {
        return <Typography component="section">Erreur : {error.message}</Typography>;
    }

    return (
        <section className={classes.container}>
            {
                images && images.length === 0 ?
                    <Typography variant="p">{labelEmpty}</Typography> :

                    images.map(img => {
                        return (
                            <Card
                                key={img.uuid}
                                image={{src: img.url, alt: img.name}}
                                headerText={img.name}
                                subhead={`${img.type}${img.width && img.height ? ` - ${img.width}x${img.height}px` : ''}`}
                                selected={Boolean(selectedImages.find(i => i.uuid === img.uuid))}
                                onDoubleClick={() => onImageDoubleClick(img)}
                                onClick={() => onClickHandler(img)}
                            />
                        );
                    })
            }
        </section>
    );
};

ImageListCmp.defaultProps = {
    error: null,
    images: [],
    initialSelection: [],
    multipleSelectable: false,
    onImageSelection: () => {},
    onImageDoubleClick: () => {}
};

ImageListCmp.propTypes = {
    error: PropTypes.shape({message: PropTypes.string}),
    images: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string,
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
    })),
    initialSelection: PropTypes.arrayOf(PropTypes.string),
    multipleSelectable: PropTypes.bool,
    labelEmpty: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    onImageDoubleClick: PropTypes.func,
    onImageSelection: PropTypes.func
};

export const ImageList = withStyles(styles)(ImageListCmp);
