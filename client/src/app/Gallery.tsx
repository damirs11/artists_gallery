import {useParams} from "react-router-dom";
import {getGroupPosts} from "../api/api";
import {useEffect, useState} from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

export default function Gallery() {
    const params = useParams();

    const [index, setIndex] = useState(-1);
    const [groupPosts, setGroupPosts] = useState([] as any[]);
    const [photos, setPhotos] = useState([] as any[]);

    useEffect(() => {
        if (!params.group_url) return
        getGroupPosts(params.group_url).then((res) => {
            let posts = res.items
                .map(item => {
                    const picked = (({attachments, text, type}) => ({attachments, text, type}))(item);
                    picked.attachments = picked.attachments.filter((att: any) => att.type === 'photo');
                    picked.attachments = item?.attachments[0]?.photo?.sizes ?? [];
                    return picked;
                })
                .filter(item => item?.attachments.length !== 0);

            setGroupPosts([...posts]);
            console.log(posts);

            const photos = posts
                .filter((post: any) => post.attachments.find((size: any) => size.type === 'w'))
                .map((post: any) => {
                    const size = post.attachments.find((size: any) => size.type === 'w');
                    console.log(size);
                    return {
                        src: size.url,
                        width: size.width,
                        height: size.height
                    }
                });

            setPhotos(photos);
        })
    }, [])

    return (
        <>
            <div style={{height: '100%', overflow: "scroll", padding: 50}}>
                <PhotoAlbum photos={photos} layout="columns" columns={2} onClick={({index}) => setIndex(index)}/>
            </div>

            <Lightbox
                slides={photos}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Counter]}
            />
        </>
    )
}