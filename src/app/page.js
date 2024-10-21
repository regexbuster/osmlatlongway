import styles from './page.module.css';

import MapImage from './MapImage';

export default function Home() {
    return (
        <>
            {/* <MapImage /> */}
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <iframe
                    src="/map/wfleFnz`tQ{rnG_repAzrnG~qepA{o|L_t_zA~}PknA"
                    frameborder="0"
                    style={{ width: '80vw', height: '90vh' }}
                ></iframe>
            </div>
        </>
    );
}
