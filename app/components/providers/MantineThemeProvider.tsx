"use client";

import { HEX_OPACITY_POSTFIX } from '@/lib/constants';
import {
    ActionIcon,
    Badge,
    Button,
    createTheme, Divider, FileInput, localStorageColorSchemeManager, MantineProvider, MantineThemeColorsOverride, MantineThemeOverride,
    Menu,
    Modal,
    MultiSelect,
    NumberInput,
    PasswordInput,
    Select,
    Textarea,
    TextInput,
    Tooltip,
} from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode
    fontFamily: string;
}

const COLORS: MantineThemeColorsOverride = {
    red: [
        "#ffcccc",
        "#ffb8b8",
        "#ffadad",
        "#f8a0a0",
        "#f58a8a",
        "#f17474",
        "#ea6262",
        "#e25050",
        "#dd3c3c",
        "#9b2727",
    ],
    primary: [
        "#2a3846",
        "#263340",
        "#222e39",
        "#1f2933",
        "#1b242d",
        "#171f26",
        "#131a20",
        "#0f141a",
        "#0b0f13",
    ],
    secondary: [
        "#41586c",
        "#3d5366",
        "#394e60",
        "#364959",
        "#324353",
        "#2e3e4d",
        "#2a3946",
        "#263440",
        "#222f39",
    ],
    tertiary: [
        "#a57d5f",
        "#a0785a",
        "#997356",
        "#936e53",
        "#8c6a4f",
        "#86654b",
        "#7f6048",
        "#795b44",
        "#725640",
    ],
    accent: [
        "#dceaef",
        "#a7cbd7",
        "#84b7c8",
        "#72acc0",
        "#61a2b8",
        "#4f98b0",
        "#47899e",
        "#448297",
        "#427f94",
    ],
    dark: [
        "#dfe6ec",
        "#a0b3c5",
        "#718ca8",
        "#4e667e",
        "#3a4d5f",
        "#27333f",
        "#131a20",
        "#0c0f13",
        "#080a0d",
        "#000000",
    ],
    black: [
        "#C1C2C5",
        "#A6A7AB",
        "#909296",
        "#5C5F66",
        "#373A40",
        "#2C2E33",
        "#25262B",
        "#1A1B1E",
        "#141517",
        "#101113",
    ],
};

const COMPONENT_OVERRIDES = {
    components: {
        Button: Button.extend({
            styles: (theme, params) => ({
                root: {
                    transition: "all 175ms ease",
                    "&:hover": {
                        backgroundColor: params.variant === "outline" && theme.colors[params.color || "blue"]
                            ? `${theme.colors[params.color || "blue"][7]}${HEX_OPACITY_POSTFIX[15]}`
                            : undefined,
                    },
                },
                leftIcon: {
                    minWidth: 24,
                },
            }),
        }),
        Badge: Badge.extend({
            styles: () => ({
                root: {
                    cursor: "default",
                },
            }),
        }),
        ActionIcon: ActionIcon.extend({
            styles: () => ({
                root: {
                    transition: "all 175ms ease",
                },
            }),
        }),
        TextInput: TextInput.extend({
            styles: (theme) => ({
                input: {
                    borderWidth: 2,
                    "&:focus": {
                        borderColor: theme.colors.accent[1],
                    },
                },
            }),
        }),
        Textarea: Textarea.extend({
            styles: (theme) => ({
                input: {
                    borderWidth: 2,
                    "&:focus": {
                        borderColor: theme.colors.accent[1],
                    },
                },
            }),
        }),
        NumberInput: NumberInput.extend({
            styles: (theme) => ({
                input: {
                    borderWidth: 2,
                    "&:focus": {
                        borderColor: theme.colors.accent[1],
                    },
                },
            }),
        }),
        MultiSelect: MultiSelect.extend({
            styles: (theme) => ({
                input: {
                    borderWidth: 2,
                    "&:focus-within": {
                        borderColor: theme.colors.accent[1],
                    },
                },
            }),
        }),
        FileInput: FileInput.extend({
            styles: (theme) => ({
                input: {
                    borderWidth: 2,
                    "&:focus": {
                        borderColor: theme.colors.accent[1],
                    },
                },
            }),
        }),
        PasswordInput: PasswordInput.extend({
            styles: (theme) => ({
                input: {
                    borderWidth: 2,
                    "&:focus-within": {
                        borderColor: theme.colors.accent[1],
                    },
                },
            }),
        }),
        Tooltip: Tooltip.extend({
            defaultProps: {
                events: {
                    hover: true,
                    touch: true,
                    focus: true,
                },
                openDelay: 500,
                zIndex: 10000000,
            },
        }),
        Divider: Divider.extend({
            styles: () => ({
                root: {
                    userSelect: "none",
                },
            }),
        }),
        Select: Select.extend({
            styles: (theme) => ({
                input: {
                    borderWidth: 2,
                    "&:focus": {
                        borderColor: theme.colors.accent[1],
                    },
                },
            }),
        }),
        Modal: Modal.extend({
            styles: (theme) => ({
                title: {
                    fontSize: theme.fontSizes.xl,
                },
            }),
            defaultProps: {
                overlayProps: {
                    opacity: 0.7,
                },
                transitionProps: {
                    transition: "fade",
                },
                centered: true,
                lockScroll: true,
                withCloseButton: false,
            },
        }),
        Menu: Menu.extend({
            styles: () => ({
                item: {
                    display: "flex",
                    alignItems: "center",
                },
            }),
        }),
    },
    // ColorInput, JsonInput, TimeInput, Input
};

const colorSchemeManager = localStorageColorSchemeManager({
    key: 'color-scheme',
});

const theme = (fontFamily?: string): MantineThemeOverride => createTheme({
    fontFamily,
    colors: COLORS,
    components: COMPONENT_OVERRIDES.components,
    cursorType: "pointer",
    respectReducedMotion: true,
});

export function MantineThemeProvider({ children, fontFamily }: Props) {
    return (
        <MantineProvider
            colorSchemeManager={colorSchemeManager}
            theme={theme(fontFamily)}
            defaultColorScheme="dark"
        >
            {children}
        </MantineProvider>
    );
}
