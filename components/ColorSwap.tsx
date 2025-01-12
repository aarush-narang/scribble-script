import { Button, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export default function ColorSwap() {
    const scheme = useMantineColorScheme();

    return (
        <Button
            onClick={() => scheme.toggleColorScheme()}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {scheme.colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoonStars size={20} />}
        </Button>
    );
}
