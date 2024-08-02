import {
  AppShell,
  Container,
  Box,
  Title,
  Text,
  Grid,
  Card,
  Image,
  Group,
  ActionIcon,
  Center,
  CardSection,
  useMantineTheme,
} from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react';
import { Header } from './Header';
import classes from './AboutUs.module.css';
import { Footer } from '../../components/Footer';
import teamMembersjsn from './membersInfo.json';
import { TagsArray } from '../../components/TagsArray';

const teamMembers = teamMembersjsn;

export function AboutUsPage() {
  const theme = useMantineTheme();
  return (
    <AppShell className={classes.outer} header={{ height: 100 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <Container size="xl" p="0 0 50 0">
        {/* Hero Section */}
        <div className={classes.hero}>
          <Title className={classes.title} order={1}>
            About Meddy
          </Title>
          <Text size="xl" c="secondary.0" mt="md">
            We're on a mission to make healthcare more accessible and understandable for everyone.
          </Text>
        </div>

        {/* Team Section */}
        <Title order={2} mb="xl">
          Our Team
        </Title>
        <Grid>
          {teamMembers.map((member, index) => (
            <Grid.Col key={index} span={3}>
              <Card
                shadow="sm"
                p="lg"
                radius="lg"
                withBorder
                style={{
                  backgroundColor: theme.colors.secondary[6],
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: '6px double',
                  borderColor: theme.colors.secondary[1],
                }}
              >
                <Card.Section m="0">
                  <Box
                    style={{
                      width: '230px',
                      height: '230px',
                      overflow: 'hidden',
                      borderRadius: '50%',
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      width="100%"
                      height="100%"
                      style={{
                        border: '4px solid',
                        borderColor: theme.colors.primary[0],
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  </Box>
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{member.name}</Text>
                </Group>

                {/* <Text size="sm" c="dimmed">
                  {member.role}
                </Text> */}
                <TagsArray values={member.role} />

                <Group mt="md">
                  <ActionIcon component="a" href={member.linkedin} target="_blank">
                    <IconBrandLinkedin size={18} />
                  </ActionIcon>
                  <ActionIcon component="a" href={member.github} target="_blank">
                    <IconBrandGithub size={18} />
                  </ActionIcon>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      <Footer />
    </AppShell>
  );
}
