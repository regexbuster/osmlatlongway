import PolylineTranscoder from './PolylineTranscoder';

import styles from './polyline.module.css';

export default function PolylinePage() {
    const longlat = '<latitude>, <longitude>';
    return (
        <>
            <div className={styles.gridWrapper}>
                <div className={styles.header}>Waffle</div>
                <div className={styles.leftSidebar}>Waffle</div>
                <div className={styles.center}>
                    <div className={styles.horiz}>
                        <h1>Encoded Polyline Algorithm Format</h1>
                        <a
                            href="https://developers.google.com/maps/documentation/utilities/polylinealgorithm"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn More
                        </a>
                    </div>
                    <p>
                        This is a quick demonstration of the polyline encoding
                        method used on the website. Converting a series or
                        coordinates into this encoded polyline is a lossless
                        transformation and allows data to be sent easier and
                        understood better by tools like MapBox.
                    </p>
                    <p>
                        The encoding side takes a list of coordinate pairs in
                        {longlat} form (where each pair is separated by a new
                        line) and turns it into a string of characters (the
                        encoded polyline). This same string of characters can
                        later be decoded back into the coordinate pairs to be
                        used.
                    </p>
                    <p>
                        To keep space down while encoding a polyline, each point
                        on the line is actually encoded based on its distance
                        from the previous point, safe for the first point. This
                        helps to minimized the length of the encoded string,
                        especially in longer polylines.
                    </p>
                    <PolylineTranscoder />
                </div>
                <div className={styles.rightSidebar}>Waffle</div>
                <div className={styles.footer}>Waffle</div>
            </div>
        </>
    );
}
