import { PageContainer } from './page-container';

export const About = () => {
    return (
        <PageContainer title="About me">
            <p style={{ lineHeight: 1.5, marginBottom: 16 }}>
                Hi! I’m Tav. I love building software of any kind, especially
                web applications. I currently work at Sliderule, where I’m
                helping build a modern rules engine + workflow automation tool
                to simplify the process of creating, approving and deploying
                backend logic.
            </p>
        </PageContainer>
    );
};
