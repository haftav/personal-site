import styles from './button.module.css';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    children: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
    const { children, ...rest } = props;

    return (
        <button className={styles.button} {...rest}>
            {children}
        </button>
    );
};

interface LinkButtonProps extends React.ComponentPropsWithoutRef<'a'> {
    children: React.ReactNode;
}

export const LinkButton = (props: LinkButtonProps) => {
    const { children, ...rest } = props;

    return (
        <a className={styles.button} {...rest}>
            {children}
        </a>
    );
};
