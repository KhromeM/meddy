import { AppShell, Box, Button, Container, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import cx from 'clsx';
import { Footer } from '../../components/Footer';
import DoctorImage from '../../img/landingPage/doctor.jpg';
import EngineeringImage from '../../img/landingPage/engineering.jpg';
import LabImage from '../../img/landingPage/laboratory.jpg';
import WorkingEnvironmentImage from '../../img/landingPage/working-environment.jpg';
import { Header } from './Header';
import classes from './index.module.css';

const features = [
  {
    title: 'Multilingual Communication',
    description:
      'Meddy understands and responds in multiple languages, breaking down communication barriers between patients and healthcare providers.',
  },
  {
    title: 'Voice-Activated Assistance',
    description:
      'Interact with Meddy using just your voice, making it easy for elderly patients or those with limited mobility to get the information they need.',
  },
  {
    title: 'Simplified Medical Explanations',
    description:
      'Complex medical terms and instructions are translated into easy-to-understand language, ensuring patients fully comprehend their health information.',
  },
  {
    title: 'Medication Reminders',
    description:
      "Never miss a dose with Meddy's personalized medication reminders, helping patients stick to their prescribed treatment plans.",
  },
  // {
  //   title: 'Appointment Summaries',
  //   description:
  //     'Meddy records and summarizes doctor appointments, helping patients remember important details and instructions from their healthcare visits.',
  // },
  // {
  //   title: '24/7 Health Information Access',
  //   description:
  //     'Get answers to health-related questions anytime, day or night, providing peace of mind and reducing unnecessary doctor visits.',
  // },
  // {
  //   title: 'Emotional Support',
  //   description:
  //     'Meddy offers a compassionate ear, providing emotional support and companionship to patients dealing with health concerns.',
  // },
  // {
  //   title: 'Secure User Profiles',
  //   description:
  //     'Store and manage personal health information securely, ensuring your medical data is always at your fingertips when needed.',
  // },
];

export function LandingPage(): JSX.Element {
  const theme = useMantineTheme();
  return (
    <AppShell className={classes.outer} header={{ height: 100 }}>
      <Header />
      <AppShell.Main className={classes.outer}>
        <img className={classes.heroImage1} src={WorkingEnvironmentImage} alt="Working Environment" />
        <Container>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Your
                <span className={classes.highlight}> Personal </span> Medical Companion
              </Title>
              <Text size="lg" c="dimmed" mt="md">
                Bridging the gap between you and your doctor
              </Text>
              <Group mt={30}>
                <Button radius="xl" size="md" className={classes.control}>
                  Get started
                </Button>
                {/* <Button variant="default" radius="xl" size="md" className={classes.control}>
                  Source code
                </Button> */}
              </Group>
            </div>
            <img className={classes.heroImage2} src={DoctorImage} alt="Doctor" />
          </div>
        </Container>
        <Container>
          <div className={classes.inner}>
            <div style={{ width: 500 }}>
              <Title order={3} fw={500} c={theme.primaryColor} mb="lg">
                Reimagining Healthcare Communication
              </Title>
              <Title order={1} fw={500} mb="md">
                Empowering patients, one conversation at a time
              </Title>
              <Text size="xl" c="gray">
                Meddy uses advanced AI to break down language barriers and medical jargon, ensuring you understand your
                health journey every step of the way.
              </Text>
            </div>
            <img className={classes.heroImage3} src={LabImage} alt="Laboratory" />
          </div>
        </Container>
        <Container>
          <div className={cx(classes.inner, classes.featureSection)}>
            <Stack align="flex-end">
              {features.map((feature, index) => (
                <Box key={`feature-${index}`} className={classes.featureBox}>
                  <Text className={classes.featureTitle}>{feature.title}</Text>
                  <Text className={classes.featureDescription}>{feature.description}</Text>
                </Box>
              ))}
            </Stack>
            <img className={classes.heroImage4} src={EngineeringImage} alt="Laboratory" />
          </div>
        </Container>
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
