import { router } from '../router';
import { Button, LinkButton } from '../ui';

interface HeaderProps {
    children: React.ReactNode;
}

export const Header = (props: HeaderProps) => {
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

export const PageHeader = (props: HeaderProps) => {
    const { children } = props;

    return (
        <>
            <div style={{ paddingBottom: 16 }}>
                <LinkButton href="/contents">{'<<'} Back</LinkButton>
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

interface ContainerProps {
    title: string;
    children: React.ReactNode;
}

export const Container = (props: ContainerProps) => {
    const { children, title } = props;

    return (
        <div style={{ padding: 24, height: '100%', overflow: 'scroll' }}>
            <Header>{title}</Header>
            {children}
            <Footer />
        </div>
    );
};
