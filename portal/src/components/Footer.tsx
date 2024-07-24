import { Anchor, Container, Divider, SimpleGrid, Stack, Text } from '@mantine/core';
import classes from './Footer.module.css';

export function Footer(): JSX.Element {
  return (
    <footer className={classes.footer} style={{backgroundColor:'#FEF9EF'}}>
      <div className={classes.inner}>
        <Container p="xl">
          <Stack gap="xl">
            <SimpleGrid cols={4}>
              <Anchor>Getting started</Anchor>
              {/* <Anchor>Playing with Medplum</Anchor> */}
              <Anchor>Open Source</Anchor>
              <Anchor>Documentation</Anchor>
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
