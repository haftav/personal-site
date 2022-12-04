interface TabsProps {
    children: React.ReactNode;
}
export const Tabs = (props: TabsProps) => {
    const { children } = props;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
                width: 100,
                height: '100%',
                borderLeft: '1px solid white',
            }}
        >
            {children}
        </div>
    );
};

interface TopSectionProps {
    children: React.ReactNode;
}

export const TopSection = (props: TopSectionProps) => {
    const { children } = props;

    return <div>{children}</div>;
};

interface BottomSectionProps {
    children: React.ReactNode;
}

export const BottomSection = (props: BottomSectionProps) => {
    const { children } = props;

    return <div>{children}</div>;
};

interface LinkProps {
    to: string;
    children: React.ReactNode;
}

export const Link = (props: LinkProps) => {
    const { to, children } = props;
    return (
        <a
            style={{
                color: 'white',
                display: 'block',
                padding: '0px 0px 16px',
            }}
            href={to}
            target="_blank"
            rel="noreferrer"
        >
            {children}
        </a>
    );
};

Tabs.TopSection = TopSection;
Tabs.BottomSection = BottomSection;
Tabs.Link = Link;
