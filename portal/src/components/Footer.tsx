import { Anchor, Container, Divider, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import classes from './Footer.module.css';

export function Footer(): JSX.Element {
  const theme = useMantineTheme();

  return (
    <footer className={classes.footer} style={{ backgroundColor: theme.colors.secondary[0] }}>
      <div className={classes.inner}>
        <Container p="xl">
          <Stack gap="xl">
            <SimpleGrid cols={3}>
              <Anchor>Getting started</Anchor>
              {/* <Anchor>Playing with Medplum</Anchor> */}
              <Anchor href="https://github.com/KhromeM/meddy" target="_blank">
                Open Source
              </Anchor>
              <Anchor href="https://github.com/KhromeM/meddy/blob/main/README.md" target="_blank">
                Documentation
              </Anchor>
            </SimpleGrid>
            <Divider />
            <Text c="dimmed" size="sm">
              &copy; {new Date().getFullYear()} Meddy, Inc. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </div>
    </footer>
  );
}
