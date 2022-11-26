const styles: Record<string, React.CSSProperties> = {
    button: {
        padding: '8px 16px',
        backgroundColor: 'black',
        color: 'white',
        border: '1px solid white',
    },
};

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    children: React.ReactNode;
}

const Button = (props: ButtonProps) => {
    const { children, ...rest } = props;

    return (
        <button
            style={{
                ...styles.button,
                ...rest.style,
            }}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
