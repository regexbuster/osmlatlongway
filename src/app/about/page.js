import styles from './about.module.css';

import { promises as fs } from 'fs';

import Markdown from 'react-markdown';

export default async function AboutPage() {
    const mdfile = await fs.readFile(
        process.cwd() + '/src/app/about/markdown.md',
        'utf8'
    );
    return (
        <>
            {/* page wrapper div (maybe become a layout at some point)*/}
            <div className={styles.gridWrapper}>
                <div className={styles.header}>
                    <p>Waffle</p>
                </div>
                <div className={styles.leftSidebar}>
                    <p>Waffle</p>
                </div>
                <div className={styles.center}>
                    <Markdown>{mdfile}</Markdown>
                </div>
                <div className={styles.rightSidebar}>
                    <p>Waffle</p>
                </div>
                <div className={styles.footer}>
                    <p>Waffle</p>
                </div>
            </div>
        </>
    );
}
