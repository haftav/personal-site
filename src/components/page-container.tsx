import { router } from '../router';
import { Button } from '../ui';

interface PageContainerProps {
    title: string;
    children: React.ReactNode;
}

interface HeaderProps {
    children: React.ReactNode;
}

const Header = (props: HeaderProps) => {
    const { children } = props;
    return (
        <>
            <div style={{ paddingBottom: 16 }}>
                <Button onClick={() => router.navigate('main')}>
                    {'<<'} Back
                </Button>
            </div>
            <h1 style={{ paddingBottom: 16 }}>{children}</h1>
        </>
    );
};

const Footer = () => {
    return (
        <div>
            <p>---</p>
            <p>type q or enter to exit</p>
        </div>
    );
};

export const PageContainer = (props: PageContainerProps) => {
    const { children, title } = props;

    return (
        <div style={{ padding: 24, height: '100%', overflow: 'scroll' }}>
            <Header>{title}</Header>
            {children}
            <Footer />
        </div>
    );
};
