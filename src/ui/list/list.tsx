import styles from './list.module.css';

interface ItemProps {
    children: React.ReactNode;
}

const Item = (props: ItemProps) => {
    const { children } = props;
    return <li className={styles.item}>{children}</li>;
};

interface HeadingProps {
    children: React.ReactNode;
}

const Heading = (props: HeadingProps) => {
    const { children } = props;
    return <span className={styles.heading}>{children}</span>;
};

interface ListProps {
    children: React.ReactNode;
}

export const List = (props: ListProps) => {
    const { children } = props;

    return <ul className={styles.list}>{children}</ul>;
};

List.Item = Item;
List.Heading = Heading;
